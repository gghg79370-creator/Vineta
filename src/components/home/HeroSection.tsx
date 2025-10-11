


import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { HeroSlide } from '../../types';
import { ChevronRightIcon, ChevronLeftIcon } from '../icons';

interface HeroSectionProps {
    navigateTo: (pageName: string) => void;
    heroSlides: HeroSlide[];
}

export const HeroSection = ({ navigateTo, heroSlides }: HeroSectionProps) => {
    const visibleSlides = useMemo(() => heroSlides.filter(slide => slide.status === 'Visible'), [heroSlides]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const AUTOPLAY_DELAY = 6000;

    const goToNext = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === visibleSlides.length - 1 ? 0 : prevIndex + 1
        );
    }, [visibleSlides.length]);

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    useEffect(() => {
        resetTimeout();
        if (visibleSlides.length > 1) {
            timeoutRef.current = setTimeout(goToNext, AUTOPLAY_DELAY);
        }
        return () => resetTimeout();
    }, [currentIndex, goToNext, resetTimeout, visibleSlides.length]);

    const goToPrevious = () => {
        const newIndex = currentIndex === 0 ? visibleSlides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    if (!visibleSlides || visibleSlides.length === 0) {
        return <section className="w-full h-screen bg-gray-200 flex items-center justify-center"><p>لا توجد شرائح للعرض.</p></section>;
    }
    
    return (
        <section 
            className="relative w-full h-[65vh] lg:h-screen bg-brand-dark text-white overflow-hidden group"
            onMouseEnter={resetTimeout}
            onMouseLeave={() => {
                resetTimeout();
                if (visibleSlides.length > 1) {
                    timeoutRef.current = setTimeout(goToNext, AUTOPLAY_DELAY);
                }
            }}
        >
            {/* Slides container */}
            {visibleSlides.map((slide, slideIndex) => (
                <div key={slide.id || slideIndex} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${slideIndex === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {slide.bgVideo ? (
                        <video
                            key={slide.id} // Force re-render for video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            poster={slide.bgImage}
                            className="w-full h-full object-cover"
                        >
                            <source src={slide.bgVideo} type={slide.bgVideoType || 'video/mp4'} />
                        </video>
                    ) : (
                        <img
                            src={slide.bgImage}
                            alt={slide.title}
                            className={`w-full h-full object-cover ${slideIndex === currentIndex ? 'animate-ken-burns' : ''}`}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 lg:bg-gradient-to-r lg:from-black/70 lg:via-black/40 lg:to-transparent"></div>
                </div>
            ))}
           
            {/* Slide Content */}
            <div className="relative h-full flex items-center justify-center lg:justify-start">
                <div className="container mx-auto px-8 lg:px-4">
                    {/* Keyed div to re-trigger animations */}
                    <div key={currentIndex} className="max-w-2xl text-center lg:text-right">
                        <div className="overflow-hidden">
                            <p className="text-lg md:text-xl text-gray-300 font-semibold mb-4 animate-hero-text-reveal [animation-delay:0.2s]">
                                {visibleSlides[currentIndex].subtitle}
                            </p>
                        </div>
                        <div className="overflow-hidden">
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6 animate-hero-text-reveal [animation-delay:0.4s]">
                                {visibleSlides[currentIndex].title}
                            </h1>
                        </div>
                        {visibleSlides[currentIndex].description && (
                             <div className="overflow-hidden">
                                <p className="text-base md:text-lg text-gray-300 mb-10 max-w-lg mx-auto lg:ml-auto animate-hero-text-reveal [animation-delay:0.6s]">
                                    {visibleSlides[currentIndex].description}
                                </p>
                            </div>
                        )}
                        <div className="overflow-hidden">
                             <button
                                onClick={() => navigateTo(visibleSlides[currentIndex].page)}
                                className="bg-white text-black font-bold py-3 px-10 rounded-full text-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 active:scale-100 animate-hero-text-reveal [animation-delay:0.8s]"
                            >
                                {visibleSlides[currentIndex].buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            {visibleSlides.length > 1 && (
                <>
                    <button onClick={goToPrevious} aria-label="Previous slide" className="absolute top-1/2 -translate-y-1/2 right-6 lg:right-8 z-10 w-12 h-12 lg:w-14 lg:h-14 bg-white/10 backdrop-blur-sm rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-105 disabled:opacity-50 hidden lg:flex">
                        <ChevronRightIcon className="w-6 h-6 lg:w-8 lg:h-8 text-white"/>
                    </button>
                     <button onClick={goToNext} aria-label="Next slide" className="absolute top-1/2 -translate-y-1/2 left-6 lg:left-8 z-10 w-12 h-12 lg:w-14 lg:h-14 bg-white/10 backdrop-blur-sm rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-105 disabled:opacity-50 hidden lg:flex">
                        <ChevronLeftIcon className="w-6 h-6 lg:w-8 lg:h-8 text-white"/>
                    </button>
                </>
            )}

            {/* Progress Bar Indicators */}
            {visibleSlides.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-sm lg:max-w-md flex gap-2 z-10">
                    {visibleSlides.map((_, slideIndex) => (
                        <button 
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className="flex-1 group h-1 rounded-full bg-white/20 hover:bg-white/40 transition-colors duration-300"
                            aria-label={`Go to slide ${slideIndex + 1}`}
                        >
                             <div 
                                // key is important to restart animation on slide change
                                key={currentIndex === slideIndex ? currentIndex : `not-active-${slideIndex}`}
                                className={`h-full rounded-full ${currentIndex > slideIndex ? 'bg-white w-full' : 'bg-white/50'} ${currentIndex === slideIndex ? 'animate-progress-fill-width' : 'w-0'}`}
                                style={{ animationDuration: `${AUTOPLAY_DELAY}ms` }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
};
