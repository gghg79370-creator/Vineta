import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CloseIcon } from '../icons';

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
        className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Function to scroll to a specific image index, used by dots and keyboard navigation.
  const scrollToIndex = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * index;
      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);
  
  // Update the active dot indicator on scroll.
  // This function is throttled to prevent performance issues from frequent scroll events.
  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      const container = scrollContainerRef.current;
      if (container) {
        // Calculate the current index based on scroll position
        const newIndex = Math.round(container.scrollLeft / container.clientWidth);
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
        }
      }
    }, 100);
  };

  // Keyboard navigation (left/right arrows) for improved accessibility.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = Math.min(images.length - 1, activeIndex + 1);
      scrollToIndex(nextIndex);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = Math.max(0, activeIndex - 1);
      scrollToIndex(prevIndex);
    }
  };

  // Opens the lightbox, setting the correct starting image.
  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div
      className="relative group focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded-xl"
      role="region"
      aria-label="Product image gallery"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* 
        Image container with horizontal scroll and snapping.
        - `overflow-x-auto`: enables horizontal scrolling via swipe/drag.
        - `scroll-snap-type: x mandatory`: ensures scrolling always snaps crisply to an item.
        - `scroll-smooth`: provides smooth scrolling when using arrow keys or dot clicks.
        - `scrollbar-hide`: a utility class to hide the browser's default scrollbar for a cleaner UI.
      */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide rounded-xl"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 snap-center aspect-[4/5] cursor-pointer"
            onDoubleClick={() => openLightbox(index)} // For desktop zoom
            onClick={() => openLightbox(index)} // For mobile/tap zoom
            role="button"
            aria-label={`View image ${index + 1} of ${images.length} in a larger view`}
          >
            {/* 
              Image with lazy loading and hover effect.
              - `loading="lazy"`: Native browser lazy-loading for off-screen images, improving performance.
              - `srcset`: In a real-world application, this would be used for responsive images if multiple sizes were available in the data, e.g.,
                 `srcSet="image-sm.jpg 500w, image-md.jpg 1000w, image-lg.jpg 1500w"`
            */}
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 md:group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/30 backdrop-blur-sm p-1.5 rounded-full">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-300
                ${activeIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white'}
              `}
              aria-label={`Go to image ${index + 1}`}
              aria-current={activeIndex === index}
            />
          ))}
        </div>
      )}
      
      {/* Lightbox Modal for Zoom */}
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
