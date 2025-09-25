
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLongRightIcon } from '../icons';
import { HeroSlide } from '../../types';

interface HeroSectionProps {
    navigateTo: (pageName: string) => void;
    slides: HeroSlide[];
}

export const HeroSection = ({ navigateTo, slides }: HeroSectionProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = useCallback(() => {
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        if (isPaused || slides.length <= 1) return;
        const slideInterval = setInterval(nextSlide, 6000);
        return () => clearInterval(slideInterval);
    }, [nextSlide, isPaused, slides.length]);

    if (!slides || slides.length === 0) {
        return <section className="relative h-screen w-full -mt-20 bg-brand-dark flex items-center justify-center"><p className="text-white">No slides available.</p></section>;
    }
    
    const activeSlide = slides[currentSlide];

    return (
        <section
            className="relative h-[90vh] min-h-[600px] md:h-screen w-full -mt-20 overflow-hidden bg-brand-dark"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background Images */}
            <div className="absolute inset-0 w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    >
                         <div
                            className="w-full h-full bg-cover bg-center animate-ken-burns"
                            style={{ backgroundImage: `url(${slide.bgImage})` }}
                            aria-label={slide.title}
                        />
                    </div>
                ))}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
            
            <div className="relative h-full w-full flex items-center justify-center md:justify-end px-4">
                <div className="container mx-auto">
                    <div className="text-center md:text-right text-white max-w-3xl ml-auto">
                       <div className="overflow-hidden">
                            <h1
                                key={`${currentSlide}-title`}
                                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 tracking-tighter animate-text-reveal-up [text-shadow:_1px_2px_4px_rgb(0_0_0_/_40%)]"
                                style={{ animationDelay: '0.3s' }}
                            >
                                {activeSlide.title}
                            </h1>
                       </div>
                       <div className="overflow-hidden">
                            <p
                                key={`${currentSlide}-subtitle`}
                                className="text-lg md:text-xl mb-8 animate-text-reveal-up [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)] max-w-lg mx-auto md:mx-0"
                                style={{ animationDelay: '0.6s' }}
                            >
                                {activeSlide.subtitle}
                            </p>
                       </div>
                       <div className="overflow-hidden mt-8">
                            <button
                                key={`${currentSlide}-button`}
                                onClick={() => navigateTo(activeSlide.page)}
                                className="bg-brand-primary text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-opacity-90 transition-all hover:scale-105 hover:shadow-xl animate-text-reveal-up"
                                style={{ animationDelay: '0.9s' }}
                            >
                                {activeSlide.buttonText}
                            </button>
                       </div>
                    </div>
                </div>
            </div>
            
            {/* Controls */}
            <button onClick={prevSlide} className="absolute top-1/2 right-4 md:right-10 transform -translate-y-1/2 bg-black/20 text-white rounded-full p-3 shadow-lg hover:bg-black/40 transition-all duration-300 backdrop-blur-sm focus:outline-none" aria-label="السابق">
                <ArrowLongRightIcon size="lg" className="w-6 h-6 md:w-8 md:h-8"/>
            </button>
            <button onClick={nextSlide} className="absolute top-1/2 left-4 md:left-10 transform -translate-y-1/2 bg-black/20 text-white rounded-full p-3 shadow-lg hover:bg-black/40 transition-all duration-300 backdrop-blur-sm rotate-180 focus:outline-none" aria-label="التالي">
                <ArrowLongRightIcon size="lg" className="w-6 h-6 md:w-8 md:h-8"/>
            </button>
            
            {/* Progress Bar Pagination */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex w-1/3 max-w-xs gap-2.5">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        {index === currentSlide && (
                            <div
                                key={currentSlide} // Re-trigger animation on slide change
                                className="h-full bg-white origin-right animate-progress-fill rounded-full"
                                style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
                            />
                        )}
                        {index < currentSlide && (
                             <div className="h-full w-full bg-white rounded-full" />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};