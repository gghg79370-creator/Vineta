import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CloseIcon, ChevronRightIcon, ChevronLeftIcon } from '../icons';

// Props definition for the component
interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
}

// A simple lightbox component for zoomed-in view, which is more accessible and robust than in-place zooming.
const Lightbox = ({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => {
  // Add an event listener to close the lightbox with the Escape key for accessibility.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Zoomed product image view"
    >
      <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
      </div>
      <button
        onClick={onClose}
        className="absolute top-4 end-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
        aria-label="Close zoomed image view"
      >
        <CloseIcon size="md" />
      </button>
    </div>
  );
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Opens the lightbox, setting the correct starting image.
  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  };
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }
  
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  return (
    <div className="relative">
      <div className="relative group rounded-xl overflow-hidden">
        <div className="aspect-[4/5] bg-gray-100" onClick={() => openLightbox(activeIndex)}>
            <img
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              className="w-full h-full object-cover transition-transform duration-300 md:group-hover:scale-105 cursor-pointer"
            />
        </div>

        {images.length > 1 && (
            <>
                <button onClick={handlePrev} className="absolute top-1/2 -translate-y-1/2 end-3 bg-white/50 backdrop-blur-sm rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeftIcon />
                </button>
                <button onClick={handleNext} className="absolute top-1/2 -translate-y-1/2 start-3 bg-white/50 backdrop-blur-sm rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRightIcon />
                </button>
            </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-2">
            {images.map((image, index) => (
                <button 
                    key={index} 
                    onClick={() => setActiveIndex(index)}
                    className={`w-1/5 aspect-square rounded-md overflow-hidden border-2 transition-all ${activeIndex === index ? 'border-brand-dark' : 'border-transparent hover:border-brand-border'}`}
                >
                    <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                </button>
            ))}
        </div>
      )}
      
      {isLightboxOpen && (
        <Lightbox
          src={images[activeIndex].src}
          alt={images[activeIndex].alt}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
};
