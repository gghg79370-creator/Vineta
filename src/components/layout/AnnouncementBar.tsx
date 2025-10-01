

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '../icons';
import { AdminAnnouncement } from '../../types';

interface AnnouncementBarProps {
    announcements: AdminAnnouncement[];
}

export const AnnouncementBar = ({ announcements }: AnnouncementBarProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [dismissedIds, setDismissedIds] = useState<number[]>(() => {
        try {
            const item = window.localStorage.getItem('dismissedAnnouncements');
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return [];
        }
    });

    const activeAnnouncements = announcements.filter(
        a => a.status === 'Active' && !dismissedIds.includes(a.id)
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
        const newDismissedIds = [...dismissedIds, idToDismiss];
        setDismissedIds(newDismissedIds);
        try {
            window.localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissedIds));
        } catch (error) {
            console.error("Error writing to localStorage", error);
        }
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
            <div className="container mx-auto px-4 h-10 flex items-center justify-center lg:justify-between">
                {/* Language/Currency Selector & Dismiss button on left */}
                <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                     <button 
                        onClick={() => handleDismiss(activeAnnouncements[currentIndex].id)} 
                        className="text-white/50 hover:text-white transition-colors"
                        aria-label="Dismiss this announcement"
                    >
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                    <div className="w-px h-4 bg-white/20"></div>
                    <img src="https://flagcdn.com/eg.svg" width="20" alt="علم مصر" />
                    <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                        <span>مصر (ج.م) / العربية</span>
                        <ChevronDownIcon size="sm" />
                    </button>
                </div>

                {/* Announcement Display with Controls */}
                <div className="flex-1 overflow-hidden relative h-full flex items-center justify-center">
                    <AnnouncementContent />
                    
                    {hasMultipleAnnouncements && (
                        <div className="absolute right-0 flex items-center gap-4 hidden lg:flex">
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
                            <button onClick={() => setIsPaused(!isPaused)} className="text-white/70 hover:text-white" aria-label="Toggle autoplay settings">
                                <i className="fa-solid fa-gear text-sm"></i>
                            </button>
                        </div>
                    )}
                </div>
                 {/* Dismiss button on right for mobile */}
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