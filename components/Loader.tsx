
import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full h-full bg-gray-700 animate-pulse rounded-lg"></div>
  );
};

export const ScaleLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
    </div>
  );
};
