

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRightIcon } from '../icons';

interface AnnouncementBarProps {
    announcements: string[];
}

export const AnnouncementBar = ({ announcements }: AnnouncementBarProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const handleNext = useCallback(() => {
        setCurrentIndex(prev => (prev >= announcements.length - 1 ? 0 : prev + 1));
    }, [announcements.length]);

    const handlePrev = () => {
        setCurrentIndex(prev => (prev <= 0 ? announcements.length - 1 : prev - 1));
    };

    useEffect(() => {
        if (isPaused || announcements.length <= 1) {
            return;
        }
        
        const timer = setInterval(handleNext, 5000); 

        return () => clearInterval(timer);
    }, [isPaused, announcements.length, handleNext]);


    if (!announcements || announcements.length === 0) {
        return null;
    }
    
    const arrowsDisabled = announcements.length <= 1;

    return (
        <div
            className="bg-brand-dark text-white text-xs py-2.5 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="container mx-auto px-4 flex justify-between items-center h-6">
                <div>
                    <button onClick={handlePrev} className="transform rotate-180 p-1 disabled:opacity-50 hover:bg-white/20 rounded-full transition-colors" aria-label="Previous Announcement" disabled={arrowsDisabled}>
                        <ChevronRightIcon size="sm" className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1 overflow-hidden text-center relative h-full">
                   {announcements.map((text, index) => (
                       <div
                           key={index}
                           className={`transition-opacity duration-300 ease-in-out absolute inset-0 flex items-center justify-center ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                           aria-hidden={index !== currentIndex}
                       >
                           {text}
                       </div>
                   ))}
                </div>
                <div>
                    <button onClick={handleNext} className="p-1 disabled:opacity-50 hover:bg-white/20 rounded-full transition-colors" aria-label="Next Announcement" disabled={arrowsDisabled}>
                        <ChevronRightIcon size="sm" className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                {announcements.length > 1 && (
                    <div
                        key={currentIndex}
                        className="h-full bg-white animate-announcement-progress"
                        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
                    ></div>
                )}
            </div>
        </div>
    );
};