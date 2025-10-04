

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '../icons';
import { AdminAnnouncement } from '../../types';

interface AnnouncementBarProps {
    announcements: AdminAnnouncement[];
    setAnnouncements: React.Dispatch<React.SetStateAction<AdminAnnouncement[]>>;
}

export const AnnouncementBar = ({ announcements, setAnnouncements }: AnnouncementBarProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const activeAnnouncements = announcements.filter(
        a => a.status === 'Active'
    );
    const hasMultipleAnnouncements = activeAnnouncements.length > 1;
    const TIMER_DURATION = 5000;

    const goToNext = () => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % activeAnnouncements.length);
    };
    
    useEffect(() => {
        if (currentIndex >= activeAnnouncements.length && activeAnnouncements.length > 0) {
            setCurrentIndex(0);
        }
    }, [activeAnnouncements.length, currentIndex]);

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (hasMultipleAnnouncements && !isPaused) {
            timerRef.current = setTimeout(goToNext, TIMER_DURATION);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [currentIndex, isPaused, hasMultipleAnnouncements, activeAnnouncements.length]);

    const handleDismiss = (idToDismiss: number) => {
        setAnnouncements(prev => prev.filter(a => a.id !== idToDismiss));
    };

    const containerClasses = `
        bg-announcement-gradient bg-200% animate-animated-gradient text-white
        overflow-hidden relative
    `;

    if (activeAnnouncements.length === 0) {
        return null;
    }

    const AnnouncementContent = () => {
        const currentAnnouncement = activeAnnouncements[currentIndex] || activeAnnouncements[0];
        if (!currentAnnouncement) return null;
        
        return (
            <div key={currentIndex} className="animate-fade-in text-sm whitespace-nowrap">
                {currentAnnouncement.content}
            </div>
        );
    };

    return (
        <div 
            className={containerClasses}
            onMouseEnter={hasMultipleAnnouncements ? () => setIsPaused(true) : undefined}
            onMouseLeave={hasMultipleAnnouncements ? () => setIsPaused(false) : undefined}
        >
            <div className="container mx-auto px-4 h-10 flex items-center justify-center relative lg:justify-between">
                
                {/* Desktop Left: Language/Currency */}
                <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                    <img src="https://flagcdn.com/eg.svg" width="20" alt="علم مصر" />
                    <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                        <span>مصر (ج.م) / العربية</span>
                        <ChevronDownIcon size="sm" />
                    </button>
                </div>

                {/* Center: Announcement Text */}
                <div className="flex-1 overflow-hidden relative h-full flex items-center justify-center">
                    <AnnouncementContent />
                </div>

                {/* Desktop Right: Controls & Dismiss */}
                <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                    {hasMultipleAnnouncements && (
                        <>
                            <div className="flex items-center gap-1.5">
                                {activeAnnouncements.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${currentIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white'}`}
                                        aria-label={`Go to announcement ${index + 1}`}
                                    />
                                ))}
                            </div>
                            <button onClick={() => setIsPaused(!isPaused)} className="text-white/70 hover:text-white w-6 h-6 flex items-center justify-center" aria-label={isPaused ? "Play announcements" : "Pause announcements"}>
                                <i className={`fa-solid ${isPaused ? 'fa-play' : 'fa-pause'} text-sm`}></i>
                            </button>
                            <div className="w-px h-4 bg-white/20"></div>
                        </>
                    )}
                    <button 
                        onClick={() => handleDismiss(activeAnnouncements[currentIndex].id)} 
                        className="text-white/50 hover:text-white transition-colors"
                        aria-label="Dismiss this announcement"
                    >
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                 {/* Mobile Dismiss */}
                <div className="lg:hidden flex-shrink-0 absolute right-4">
                     <button 
                        onClick={() => handleDismiss(activeAnnouncements[currentIndex].id)} 
                        className="text-white/50 hover:text-white transition-colors"
                        aria-label="Dismiss this announcement"
                    >
                        <i className="fa-solid fa-xmark text-base"></i>
                    </button>
                </div>
            </div>
             {hasMultipleAnnouncements && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                    <div
                        key={currentIndex}
                        className="h-full bg-white animate-announcement-progress"
                        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
                    ></div>
                </div>
            )}
        </div>
    );
};