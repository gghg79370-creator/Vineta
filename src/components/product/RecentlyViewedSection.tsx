import React, { useMemo } from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { useAppState } from '../../state/AppState';
import { allProducts } from '../../data/products';
import { Carousel } from '../ui/Carousel';

interface RecentlyViewedSectionProps {
    title: string;
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    addToCompare: (product: Product) => void;
    toggleWishlist: (product: Product) => void;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = (props) => {
    const { title } = props;
    const { state } = useAppState();
    const { recentlyViewed, compareList, wishlist } = state;
    // FIX: The 'wishlistItems' prop expects an array of numbers (product IDs), not an array of WishlistItem objects.
    // We map the wishlist state to an array of IDs.
    const wishlistIds = useMemo(() => wishlist.map(item => item.id), [wishlist]);

    const recentlyViewedProducts = useMemo(() => {
        if (!recentlyViewed || recentlyViewed.length === 0) {
            return [];
        }
        return recentlyViewed.map(id => allProducts.find(p => p.id === id)).filter((p): p is Product => Boolean(p));
    }, [recentlyViewed]);
    
    if (recentlyViewedProducts.length === 0) {
        return null;
    }

    return (
         <section className="container mx-auto px-4 py-10 bg-brand-subtle rounded-2xl">
             <Carousel
                title={title}
                items={recentlyViewedProducts}
                renderItem={(product, index) => (
                     <div key={index} className="flex-shrink-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 snap-start">
                        <ProductCard 
                            {...props}
                            product={product}
                            compareList={compareList} 
                            wishlistItems={wishlistIds}
                        />
                    </div>
                )}
            />
        </section>
    );
};