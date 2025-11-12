
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ImageComparatorProps {
  original: string;
  upscaled: string;
}

const CompareArrowsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h18m-7.5-12L21 9m0 0L16.5 12M21 9H3" />
  </svg>
);

export const ImageComparator: React.FC<ImageComparatorProps> = ({ original, upscaled }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        handleMove(event.clientX);
      }
    };
    
    const handleTouchMove = (event: TouchEvent) => {
        if (isDragging && event.touches.length > 0) {
            handleMove(event.touches[0].clientX);
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMove]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full select-none cursor-ew-resize"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      <img 
        src={original} 
        alt="Original" 
        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
        draggable="false"
        aria-hidden="true"
      />
      <div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        aria-hidden="true"
      >
        <img 
          src={upscaled} 
          alt="Upscaled" 
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
          draggable="false"
        />
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-white/75 pointer-events-none cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        aria-hidden="true"
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-lg backdrop-blur-sm border-2 border-white">
          <CompareArrowsIcon className="w-5 h-5 text-gray-800 transform rotate-90" />
        </div>
      </div>
      <label htmlFor="comparison-slider" className="sr-only">Image Comparison Slider</label>
      <input
        id="comparison-slider"
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-ew-resize"
        aria-label="Image comparison slider"
      />
    </div>
  );
};
