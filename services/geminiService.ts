
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getQualityPrompt = (level: number): string => {
    switch (level) {
        case 1:
            return 'Slightly enhance the details and sharpness for a subtle improvement.';
        case 2:
            return 'Improve the details and clarity for a balanced, natural look.';
        case 3:
            return 'Significantly enhance the details, sharpness, and clarity. Make it look like a high-quality photograph.';
        case 4:
            return 'Maximise the details and sharpness for a very high-resolution look. Focus on intricate textures and fine lines.';
        case 5:
            return 'Artistically enhance the image, boosting colors and contrast for a dramatic, vibrant, and high-quality effect.';
        default:
            return 'Enhance the details, sharpness, and clarity. Make it look like a high-quality photograph.';
    }
};


export const upscaleImage = async (base64ImageData: string, mimeType: string, qualityLevel: number): Promise<string> => {
    try {
        const qualityDescription = getQualityPrompt(qualityLevel);
        const textPrompt = `Upscale this image to a higher resolution. ${qualityDescription} Preserve the original style and composition.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: textPrompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const firstPart = response?.candidates?.[0]?.content?.parts?.[0];
        if (firstPart && firstPart.inlineData) {
            return firstPart.inlineData.data;
        } else {
            const textPart = response?.candidates?.[0]?.content?.parts?.find(p => p.text);
            if (textPart?.text) {
                throw new Error(`Model returned an error: ${textPart.text}`);
            }
            if (response?.candidates?.[0]?.finishReason && response.candidates[0].finishReason !== 'STOP') {
                 throw new Error(`Upscaling failed. Reason: ${response.candidates[0].finishReason}`);
            }
            throw new Error("No image data found in the API response.");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error && error.message.includes('Model returned an error')) {
            throw error;
        }
        throw new Error("Failed to upscale image. Please try again.");
    }
};
