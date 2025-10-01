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
        <div key={product.id} className="flex-shrink-0 w-full snap-start">
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
        </div>
    );

    if (isCarousel) {
        return (
             <section className="container mx-auto px-4 py-20">
                <div className="w-full md:w-3/4 mx-auto">
                    <Carousel
                        title={title}
                        items={products}
                        renderItem={(item, index) => (
                             <div key={index} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 snap-start px-2">
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
                {products.map(product => renderProductCard(product))}
            </div>
        </section>
    );
}