
import React from 'react';
import { CameraIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <CameraIcon className="w-8 h-8 mr-3 text-blue-400" />
        <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
          AI Image Upscaler
        </h1>
      </div>
    </header>
  );
};
