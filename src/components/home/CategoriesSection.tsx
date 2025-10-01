import React, { useState, useRef, useEffect, useCallback } from 'react';

const categoriesData = [
    { name: 'ملابس رياضية', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop', page: 'shop' },
    { name: 'ملابس', image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=2070&auto=format&fit=crop', page: 'shop' },
    { name: 'إكسسوارات', image: 'https://images.unsplash.com/photo-1526328828352-6715f5c53216?q=80&w=2070&auto=format&fit=crop', page: 'shop' },
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

    return (
        <section className="relative w-full">
            <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
            >
                {categoriesData.map((category, index) => (
                    <div 
                        key={index} 
                        className="relative flex-shrink-0 w-full h-[85vh] snap-center group overflow-hidden"
                    >
                        <img src={category.image} alt={category.name} className={`w-full h-full object-cover transition-transform duration-700 ease-out ${activeIndex === index ? 'scale-110' : 'scale-100'}`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                        <div className={`absolute bottom-16 md:bottom-24 w-full flex justify-center transition-all duration-500 ease-out ${activeIndex === index ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-8'}`}>
                            <button 
                                onClick={() => navigateTo(category.page)}
                                className="bg-white/90 backdrop-blur-sm text-brand-dark font-bold py-4 px-12 text-lg rounded-full shadow-lg hover:bg-brand-dark hover:text-white transition-all duration-300 transform hover:scale-105"
                            >
                                <span>{category.name}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="absolute bottom-6 w-full flex justify-center items-center gap-3">
                {categoriesData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 
                            ${activeIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}
                        `}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};