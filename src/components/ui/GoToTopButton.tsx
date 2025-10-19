import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from '../icons';

export const GoToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className={`fixed bottom-20 left-4 md:bottom-8 md:left-8 z-50 bg-surface rounded-lg p-3 shadow-lg hover:shadow-xl border border-brand-border transition-all duration-300 transform hover:scale-105
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
            aria-label="العودة إلى الأعلى"
        >
            <ArrowUpIcon className="text-brand-dark" />
        </button>
    );
};