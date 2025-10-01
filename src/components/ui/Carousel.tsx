import React, { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { ChevronRightIcon } from '../icons';

interface CarouselProps {
    items: any[];
    renderItem: (item: any, index: number) => ReactNode;
    title?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ items, renderItem, title }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const checkScrollButtons = useCallback(() => {
        const el = scrollContainerRef.current;
        if (el) {
            const isAtEnd = el.scrollWidth - el.scrollLeft - el.clientWidth < 1;
            const isAtStart = el.scrollLeft < 1;
            setCanScrollLeft(!isAtStart);
            setCanScrollRight(!isAtEnd);
        }
    }, []);
    
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const observer = new ResizeObserver(() => {
            const pages = Math.ceil(el.scrollWidth / el.clientWidth);
            setTotalPages(pages);
            checkScrollButtons();
        });

        observer.observe(el);
        
        // Initial check
        const pages = Math.ceil(el.scrollWidth / el.clientWidth);
        setTotalPages(pages);
        checkScrollButtons();


        return () => observer.disconnect();
    }, [items, checkScrollButtons]);

    const handleScroll = () => {
        checkScrollButtons();
         if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const newPage = Math.round(scrollLeft / clientWidth);
            if (newPage !== currentPage) {
                setCurrentPage(newPage);
            }
        }
    };
    
    const scrollByPage = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const newScrollLeft = direction === 'right' 
                ? scrollLeft + clientWidth
                : scrollLeft - clientWidth;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const goToPage = (pageIndex: number) => {
        if (scrollContainerRef.current) {
            const { clientWidth } = scrollContainerRef.current;
            scrollContainerRef.current.scrollTo({
                left: pageIndex * clientWidth,
                behavior: 'smooth'
            });
        }
    }


    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-6">
                {title && <h3 className="font-bold text-lg">{title}</h3>}
                <div className="flex gap-2" style={{ marginLeft: title ? 'auto' : '0' }}>
                    <button onClick={() => scrollByPage('left')} disabled={!canScrollLeft} className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rotate-180">
                        <ChevronRightIcon size="sm" />
                    </button>
                    <button onClick={() => scrollByPage('right')} disabled={!canScrollRight} className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronRightIcon size="sm" />
                    </button>
                </div>
            </div>

            <div 
                ref={scrollContainerRef} 
                onScroll={handleScroll}
                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-2 -mx-5 px-5"
            >
                {items.map((item, index) => renderItem(item, index))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${currentPage === index ? 'bg-brand-dark w-6' : 'bg-brand-border w-2 hover:bg-brand-text-light'}`}
                            aria-label={`Go to page ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
