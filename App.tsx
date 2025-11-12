
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { upscaleImage } from './services/geminiService';
import { ScaleLoader } from './components/Loader';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [upscaledImageUrl, setUpscaledImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [qualityLevel, setQualityLevel] = useState<number>(3);

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setUpscaledImageUrl(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpscale = useCallback(async () => {
    if (!originalImageUrl) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setUpscaledImageUrl(null);
    setError(null);

    try {
      // Extract base64 data and mimeType from the data URL
      const mimeType = originalImageUrl.substring(originalImageUrl.indexOf(':') + 1, originalImageUrl.indexOf(';'));
      const base64Data = originalImageUrl.split(',')[1];
      
      if(!base64Data || !mimeType) {
        throw new Error('Invalid image format.');
      }

      const upscaledBase64 = await upscaleImage(base64Data, mimeType, qualityLevel);
      setUpscaledImageUrl(`data:${mimeType};base64,${upscaledBase64}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageUrl, qualityLevel]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploader 
            onImageUpload={handleImageUpload} 
            originalImageUrl={originalImageUrl} 
          />
          <ImageDisplay 
            isLoading={isLoading} 
            originalImageUrl={originalImageUrl}
            upscaledImageUrl={upscaledImageUrl} 
            error={error} 
          />
        </div>

        <div className="mt-8 w-full max-w-md">
            <label htmlFor="quality-slider" className="block mb-2 text-sm font-medium text-gray-300 text-center">
                Upscale Quality
            </label>
            <input
                id="quality-slider"
                type="range"
                min="1"
                max="5"
                value={qualityLevel}
                onChange={(e) => setQualityLevel(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
                disabled={isLoading}
                aria-label="Upscale quality level"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                <span>Subtle</span>
                <span>Balanced</span>
                <span>High</span>
                <span>Max</span>
                <span>Artistic</span>
            </div>
        </div>

        <div className="mt-6 w-full max-w-md">
            <button
                onClick={handleUpscale}
                disabled={!originalImage || isLoading}
                className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
                <span className="w-full relative px-5 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 flex items-center justify-center">
                    {isLoading ? <ScaleLoader /> : 'Upscale Image'}
                </span>
            </button>
        </div>
      </main>
      <style>{`
        .range-thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #60a5fa;
            cursor: pointer;
            border-radius: 50%;
            border: 2px solid #1f2937;
            transition: background-color 0.2s ease-in-out;
        }

        .range-thumb:hover::-webkit-slider-thumb {
            background: #93c5fd;
        }

        .range-thumb::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #60a5fa;
            cursor: pointer;
            border-radius: 50%;
            border: 2px solid #1f2937;
            transition: background-color 0.2s ease-in-out;
        }

        .range-thumb:hover::-moz-range-thumb {
            background: #93c5fd;
        }
      `}</style>
    </div>
  );
};

export default App;
