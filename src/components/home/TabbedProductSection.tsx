import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../../types';
import { CollectionProductCard } from '../product/CollectionProductCard';
import { ProductCardSkeleton } from '../ui/ProductCardSkeleton';
import { useAppState } from '../../state/AppState';

interface TabbedProductSectionProps {
    products: Product[];
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    addToCompare: (product: Product) => void;
    toggleWishlist: (product: Product) => void;
}

export const TabbedProductSection: React.FC<TabbedProductSectionProps> = (props) => {
    const { products } = props;
    const { state } = useAppState();
    const { wishlist, compareList } = state;
    const wishlistIds = useMemo(() => wishlist.map(item => item.id), [wishlist]);

    const [activeTab, setActiveTab] = useState('trending');
    const [isLoading, setIsLoading] = useState(false);
    
    const tabs = [
        { id: 'trending', name: 'رائج' },
        { id: 'on-sale', name: 'تخفيضات' },
        { id: 'top-sellers', name: 'الأكثر مبيعاً' },
    ];

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const activeProducts = useMemo(() => {
        switch(activeTab) {
            case 'trending': 
                return products.filter(p => p.badges?.some(b => b.type === 'trending')).slice(0, 8);
            case 'on-sale': 
                return products.filter(p => !!p.oldPrice).slice(0, 8);
            case 'top-sellers': 
                return [...products].sort((a, b) => (b.soldIn24h || 0) - (a.soldIn24h || 0)).slice(0, 8);
            default: 
                return [];
        }
    }, [activeTab, products]);

    return (
        <section id="shop-preview" className="py-16 bg-brand-bg">
            <div className="container mx-auto px-4">
                <div className="flex justify-center items-center mb-10">
                    <div className="flex justify-center items-center gap-4 md:gap-8">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative text-lg md:text-xl font-bold py-2 px-2 transition-colors duration-300 focus:outline-none
                                    ${activeTab === tab.id 
                                        ? 'text-brand-dark' 
                                        : 'text-brand-text-light hover:text-brand-dark'}`
                                }
                            >
                                <span>{tab.name}</span>
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-sale"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                
                 <div key={activeTab} className="animate-quick-fade-in">
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                            {activeProducts.map(product => (
                                <CollectionProductCard
                                    key={product.id}
                                    product={product}
                                    {...props}
                                    wishlistItems={wishlistIds}
                                    compareList={compareList}
                                />
                            ))}
                        </div>
                    )}
                </div>
                 <div className="text-center mt-12 hidden md:block">
                    <button onClick={() => props.navigateTo('shop')} className="bg-surface border border-brand-border text-brand-dark font-bold py-3 px-8 rounded-full hover:bg-brand-subtle transition-colors">
                        عرض الكل
                    </button>
                </div>
            </div>
        </section>
    );
};