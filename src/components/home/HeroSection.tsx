import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HeroSlide } from '../../types';
import { ChevronRightIcon, ChevronLeftIcon } from '../icons';

interface HeroSectionProps {
    navigateTo: (pageName: string) => void;
    heroSlides: HeroSlide[];
}

export const HeroSection = ({ navigateTo, heroSlides }: HeroSectionProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const AUTOPLAY_DELAY = 6000;

    const goToNext = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === heroSlides.length - 1 ? 0 : prevIndex + 1
        );
    }, [heroSlides.length]);

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    useEffect(() => {
        resetTimeout();
        if (heroSlides.length > 1) {
            timeoutRef.current = setTimeout(goToNext, AUTOPLAY_DELAY);
        }
        return () => resetTimeout();
    }, [currentIndex, goToNext, resetTimeout, heroSlides.length]);

    const goToPrevious = () => {
        const newIndex = currentIndex === 0 ? heroSlides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    if (!heroSlides || heroSlides.length === 0) {
        return <section className="w-full h-screen bg-gray-200 flex items-center justify-center"><p>لا توجد شرائح للعرض.</p></section>;
    }
    
    return (
        <section 
            className="relative w-full h-screen bg-black text-white overflow-hidden"
            onMouseEnter={resetTimeout}
            onMouseLeave={() => {
                resetTimeout();
                if (heroSlides.length > 1) {
                    timeoutRef.current = setTimeout(goToNext, AUTOPLAY_DELAY);
                }
            }}
        >
            {/* Slides container */}
            {heroSlides.map((slide, slideIndex) => (
                <div key={slide.id || slideIndex} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${slideIndex === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {slide.bgVideo ? (
                        <video
                            key={slide.id} // Force re-render for video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover opacity-50"
                        >
                            <source src={slide.bgVideo} type={slide.bgVideoType || 'video/mp4'} />
                        </video>
                    ) : (
                        <img
                            src={slide.bgImage}
                            alt={slide.title}
                            className={`w-full h-full object-cover opacity-50 ${slideIndex === currentIndex ? 'animate-ken-burns' : ''}`}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                </div>
            ))}
           
            {/* Slide Content */}
            <div className="relative h-full flex items-center justify-start">
                <div className="container mx-auto px-4">
                    {/* Keyed div to re-trigger animations */}
                    <div key={currentIndex} className="max-w-2xl text-right">
                        <div className="overflow-hidden">
                            <p className="text-lg md:text-xl text-gray-300 font-semibold mb-4 animate-text-reveal-up [animation-delay:0.2s]">
                                {heroSlides[currentIndex].subtitle}
                            </p>
                        </div>
                        <div className="overflow-hidden">
                            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6 animate-text-reveal-up [animation-delay:0.4s]">
                                {heroSlides[currentIndex].title}
                            </h1>
                        </div>
                        {heroSlides[currentIndex].description && (
                             <div className="overflow-hidden">
                                <p className="text-base md:text-lg text-gray-300 mb-10 max-w-lg ml-auto animate-text-reveal-up [animation-delay:0.8s]">
                                    {heroSlides[currentIndex].description}
                                </p>
                            </div>
                        )}
                        <div className="overflow-hidden">
                             <button
                                onClick={() => navigateTo(heroSlides[currentIndex].page)}
                                className="bg-white text-black font-bold py-3 px-10 rounded-full text-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 active:scale-100 animate-text-reveal-up [animation-delay:1.2s]"
                            >
                                {heroSlides[currentIndex].buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button onClick={goToPrevious} aria-label="Previous slide" className="absolute top-1/2 -translate-y-1/2 left-4 z-10 p-3 bg-white/20 rounded-full hover:bg-white/40 transition-colors">
                <ChevronLeftIcon className="w-6 h-6 text-white"/>
            </button>
             <button onClick={goToNext} aria-label="Next slide" className="absolute top-1/2 -translate-y-1/2 right-4 z-10 p-3 bg-white/20 rounded-full hover:bg-white/40 transition-colors">
                <ChevronRightIcon className="w-6 h-6 text-white"/>
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {heroSlides.map((_, slideIndex) => (
                    <button 
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                        aria-label={`Go to slide ${slideIndex + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};