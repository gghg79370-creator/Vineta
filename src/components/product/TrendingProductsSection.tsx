import React, { useMemo } from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { useAppState } from '../../state/AppState';
import { Carousel } from '../ui/Carousel';

interface TrendingProductsSectionProps {
    title: string;
    products: Product[];
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    isCarousel?: boolean;
    addToCompare: (product: Product) => void;
    toggleWishlist: (product: Product) => void;
}

export const TrendingProductsSection = ({ title, products, navigateTo, addToCart, openQuickView, isCarousel = false, addToCompare, toggleWishlist }: TrendingProductsSectionProps) => {
    const { state } = useAppState();
    const { compareList: compareIdList, wishlist } = state;
    const wishlistIdList = useMemo(() => wishlist.map(item => item.id), [wishlist]);
    
    const renderProductCard = (product: Product) => (
        <ProductCard 
            product={product} 
            navigateTo={navigateTo} 
            addToCart={addToCart} 
            openQuickView={openQuickView} 
            compareList={compareIdList} 
            addToCompare={addToCompare} 
            wishlistItems={wishlistIdList} 
            toggleWishlist={toggleWishlist} 
        />
    );

    if (isCarousel) { // This is the VIP section
        return (
            <section className="bg-brand-dark dark:bg-gray-100 py-20 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-bg dark:text-gray-900 mb-3 flex items-center justify-center gap-4">
                            <i className="fa-solid fa-crown text-amber-400 text-4xl md:text-5xl"></i>
                            <span>{title}</span>
                        </h2>
                        <p className="text-gray-300 dark:text-gray-600 max-w-2xl mx-auto text-lg">
                            اكتشف الفخامة والأناقة في تشكيلتنا الحصرية لكبار الشخصيات.
                        </p>
                    </div>
                    <Carousel
                        items={products}
                        renderItem={(item) => (
                            <div key={item.id} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 snap-start px-3">
                                {renderProductCard(item)}
                            </div>
                        )}
                    />
                </div>
            </section>
        )
    }

    return (
        <section className="container mx-auto px-4 py-20">
            <h2 className="text-4xl font-extrabold text-center text-brand-dark mb-10">{title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                {products.map(product => (
                    <div key={product.id}>
                        {renderProductCard(product)}
                    </div>
                ))}
            </div>
        </section>
    );
}