
import React from 'react';
import { DownloadIcon } from './icons';
import { SkeletonLoader } from './Loader';
import { ImageComparator } from './ImageComparator';

interface ImageDisplayProps {
  isLoading: boolean;
  originalImageUrl: string | null;
  upscaledImageUrl: string | null;
  error: string | null;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ isLoading, originalImageUrl, upscaledImageUrl, error }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-semibold mb-4 text-center">Upscaled Image</h2>
      <div className="w-full h-96 bg-gray-900/50 rounded-lg flex items-center justify-center relative overflow-hidden">
        {isLoading && <SkeletonLoader />}
        {error && !isLoading && <div className="text-red-400 text-center p-4">{error}</div>}
        
        {!isLoading && !error && upscaledImageUrl && originalImageUrl ? (
          <ImageComparator original={originalImageUrl} upscaled={upscaledImageUrl} />
        ) : !isLoading && !error && !upscaledImageUrl ? (
          <div className="text-gray-500">Your upscaled image will appear here</div>
        ) : null}
      </div>
      {upscaledImageUrl && !isLoading && (
        <a
          href={upscaledImageUrl}
          download="upscaled-image.png"
          className="mt-6 inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition-all duration-300"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Download Image
        </a>
      )}
    </div>
  );
};
