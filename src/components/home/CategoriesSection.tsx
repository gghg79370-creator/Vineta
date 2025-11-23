import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';

const categoriesData = [
    { name: 'ملابس', icon: 'fa-solid fa-shirt', image: 'https://images.unsplash.com/photo-1617114912953-e718525b3433?q=80&w=1964&auto=format&fit=crop', page: 'shop', style: 'dark', data: { categories: 'women' } },
    { name: 'وصل حديثاً', icon: 'fa-solid fa-star', image: 'https://images.unsplash.com/photo-1574281358313-946a3375a5a1?q=80&w=1974&auto=format&fit=crop', page: 'shop', style: 'light', data: { tags: 'جديد' } },
    { name: 'إكسسوارات', icon: 'fa-solid fa-gem', image: 'https://images.unsplash.com/photo-1591561938959-1e39b9b0f6a4?q=80&w=1974&auto=format&fit=crop', page: 'shop', style: 'light', data: { categories: 'accessories' } },
    { name: 'ملابس رياضية', icon: 'fa-solid fa-person-running', image: 'https://images.unsplash.com/photo-1548690312-e3b511d5b111?q=80&w=1974&auto=format&fit=crop', page: 'shop', style: 'light', data: { tags: 'ملابس رياضية' } },
];

export const CategoriesSection = ({ navigateTo }: { navigateTo: (pageName: string, data?: any) => void }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollLeft = container.scrollLeft;
            const cardWidth = container.offsetWidth;
            const newIndex = Math.round(scrollLeft / cardWidth);
            if (newIndex !== activeIndex) {
                setActiveIndex(newIndex);
            }
        }
    }, [activeIndex]);
    
    useEffect(() => {
        const container = scrollContainerRef.current;
        container?.addEventListener('scroll', handleScroll, { passive: true });
        return () => container?.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const goToSlide = (index: number) => {
        const container = scrollContainerRef.current;
        if (container) {
            container.scrollTo({
                left: index * container.offsetWidth,
                behavior: 'smooth',
            });
        }
    };

    const getButtonClasses = (style: 'dark' | 'light') => {
        const baseClasses = "font-bold py-4 px-10 text-lg rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105";
        if (style === 'dark') {
            return `${baseClasses} bg-brand-dark text-brand-bg hover:bg-opacity-90`;
        }
        return `${baseClasses} bg-surface text-brand-dark hover:bg-brand-subtle`;
    };

    return (
        <section className="relative w-full group">
            <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide md:grid md:grid-cols-4"
            >
                {categoriesData.map((category, index) => (
                    <div 
                        key={index} 
                        className="relative flex-shrink-0 w-full md:w-auto h-[70vh] md:h-[85vh] snap-center group/card overflow-hidden"
                    >
                        <img src={category.image} alt={category.name} className={`w-full h-full object-cover object-center transition-transform duration-500 ease-out ${activeIndex === index ? 'scale-110' : 'scale-100'} md:scale-100 md:group-hover/card:scale-110`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        <div className={`absolute bottom-12 w-full flex justify-center transition-all duration-500 ease-out ${activeIndex === index ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-8'} md:opacity-100 md:translate-y-0`}>
                            <button 
                                onClick={() => navigateTo(category.page, category.data)}
                                className={getButtonClasses(category.style as 'dark' | 'light')}
                            >
                                <span className="flex items-center gap-3">
                                    {category.icon && <i className={category.icon}></i>}
                                    {category.name}
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <button 
                onClick={() => goToSlide(activeIndex === 0 ? categoriesData.length - 1 : activeIndex - 1)} 
                aria-label="Previous slide" 
                className="absolute top-1/2 -translate-y-1/2 right-4 z-10 w-12 h-12 bg-surface/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-surface md:hidden"
            >
                <ChevronRightIcon className="w-6 h-6 text-brand-dark"/>
            </button>
             <button 
                onClick={() => goToSlide(activeIndex === categoriesData.length - 1 ? 0 : activeIndex + 1)} 
                aria-label="Next slide" 
                className="absolute top-1/2 -translate-y-1/2 left-4 z-10 w-12 h-12 bg-surface/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-surface md:hidden"
            >
                <ChevronLeftIcon className="w-6 h-6 text-brand-dark"/>
            </button>
            
            <div className="absolute bottom-6 w-full flex justify-center items-center gap-3 md:hidden">
                {categoriesData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 
                            ${activeIndex === index ? 'bg-brand-bg scale-125' : 'bg-brand-bg/50 hover:bg-brand-bg/80'}
                        `}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};