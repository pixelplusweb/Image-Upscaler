
import React, { useCallback, useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  originalImageUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, originalImageUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-semibold mb-4 text-center">Original Image</h2>
      <div
        className="w-full h-96 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-400 cursor-pointer hover:border-blue-500 hover:bg-gray-700/50 transition-all duration-300 relative overflow-hidden"
        onClick={openFileDialog}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        {originalImageUrl ? (
          <img src={originalImageUrl} alt="Original" className="w-full h-full object-contain" />
        ) : (
          <div className="text-center">
            <UploadIcon className="w-12 h-12 mx-auto mb-2" />
            <p>Click or drag & drop an image here</p>
          </div>
        )}
      </div>
    </div>
  );
};
