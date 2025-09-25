import React, { useRef } from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { ArrowLongRightIcon } from '../icons';

interface TrendingProductsSectionProps {
    title: string;
    products: Product[];
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    isCarousel?: boolean;
    compareList: Product[];
    addToCompare: (product: Product) => void;
    wishlistItems: Product[];
    toggleWishlist: (product: Product) => void;
}

export const TrendingProductsSection = ({ title, products, navigateTo, addToCart, openQuickView, isCarousel = false, compareList, addToCompare, wishlistItems, toggleWishlist }: TrendingProductsSectionProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: 'right' | 'left') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            const newScrollLeft = direction === 'right' 
                ? scrollContainerRef.current.scrollLeft + scrollAmount 
                : scrollContainerRef.current.scrollLeft - scrollAmount;
            
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };
    
    if (isCarousel) {
        return (
             <section className="container mx-auto px-4 py-20">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-4xl font-extrabold text-brand-dark">{title}</h2>
                    <div className="hidden sm:flex items-center gap-3">
                        <button onClick={() => handleScroll('right')} className="bg-white border border-brand-border rounded-full p-3 hover:bg-brand-subtle transition-colors disabled:opacity-50" aria-label="Previous product"><ArrowLongRightIcon/></button>
                        <button onClick={() => handleScroll('left')} className="bg-white border border-brand-border rounded-full p-3 hover:bg-brand-subtle transition-colors disabled:opacity-50 transform rotate-180" aria-label="Next product"><ArrowLongRightIcon/></button>
                    </div>
                </div>
                <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide -m-2 p-2">
                    {products.map(product => (
                        <div key={product.id} className="flex-shrink-0 w-3/4 sm:w-1/3 md:w-1/4">
                            <ProductCard product={product} navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} compareList={compareList} addToCompare={addToCompare} wishlistItems={wishlistItems} toggleWishlist={toggleWishlist} />
                        </div>
                    ))}
                </div>
            </section>
        )
    }

    return (
        <section className="container mx-auto px-4 py-20">
            <h2 className="text-4xl font-extrabold text-center text-brand-dark mb-10">{title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                {products.map(product => <ProductCard key={product.id} product={product} navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} compareList={compareList} addToCompare={addToCompare} wishlistItems={wishlistItems} toggleWishlist={toggleWishlist} />)}
            </div>
        </section>
    );
}