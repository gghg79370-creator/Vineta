import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, ChevronRightIcon, ChevronLeftIcon } from '../icons';

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
}

const Lightbox = ({ src, alt, onClose, onNext, onPrev, hasMultiple }: { src: string; alt: string; onClose: () => void; onNext: () => void; onPrev: () => void; hasMultiple: boolean; }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (hasMultiple && e.key === 'ArrowRight') onNext();
      if (hasMultiple && e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, hasMultiple]);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Zoomed product image view"
    >
      <div className="relative max-w-4xl max-h-full flex items-center" onClick={(e) => e.stopPropagation()}>
        {hasMultiple && (
             <button onClick={onPrev} className="absolute -left-12 text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors hidden md:block" aria-label="Previous image">
                <ChevronLeftIcon size="lg" />
            </button>
        )}
        <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
         {hasMultiple && (
             <button onClick={onNext} className="absolute -right-12 text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors hidden md:block" aria-label="Next image">
                <ChevronRightIcon size="lg" />
            </button>
        )}
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
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  };
  
  const handleNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    }
  };
  
  const hasMultipleImages = images.length > 1;

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_4fr] lg:gap-x-4">

        {/* Thumbnails */}
        {hasMultipleImages && (
          <div className="order-last lg:order-first grid grid-cols-5 gap-3 lg:flex lg:flex-col lg:space-y-3 lg:gap-0 lg:max-h-[600px] lg:overflow-y-auto custom-scrollbar">
              {images.map((image, index) => (
                <button 
                    key={index} 
                    onClick={() => setActiveIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all w-full ${activeIndex === index ? 'border-brand-dark shadow-md' : 'border-transparent hover:border-brand-border'}`}
                    aria-label={`View image ${index + 1}`}
                >
                    <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                </button>
              ))}
          </div>
        )}
        
        {/* Main Image */}
        <div className="relative group rounded-xl overflow-hidden mb-4 lg:mb-0 order-first lg:order-last">
          <div 
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              className="aspect-[4/5] bg-brand-subtle cursor-zoom-in overflow-hidden" 
              onClick={() => openLightbox(activeIndex)}
              aria-label="View larger image"
          >
            <img
              key={images[activeIndex].src}
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              className="w-full h-full object-cover animate-quick-fade-in transition-transform duration-200 ease-out group-hover:scale-[2.5]"
              style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }}
            />
          </div>

          {hasMultipleImages && (
              <>
                  <button onClick={handlePrev} className="absolute top-1/2 -translate-y-1/2 left-4 bg-white/80 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all duration-300 hover:bg-white active:scale-95" aria-label="Previous Image">
                      <ChevronLeftIcon />
                  </button>
                  <button onClick={handleNext} className="absolute top-1/2 -translate-y-1/2 right-4 bg-white/80 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all duration-300 hover:bg-white active:scale-95" aria-label="Next Image">
                      <ChevronRightIcon />
                  </button>
              </>
          )}
        </div>
        
      </div>
      
      {isLightboxOpen && (
        <Lightbox
          src={images[activeIndex].src}
          alt={images[activeIndex].alt}
          onClose={() => setIsLightboxOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
          hasMultiple={hasMultipleImages}
        />
      )}
    </div>
  );
};
