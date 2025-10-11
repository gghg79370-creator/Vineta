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

    const [activeTab, setActiveTab] = useState('new-arrivals');
    const [isLoading, setIsLoading] = useState(false);
    
    const tabs = [
        { id: 'new-arrivals', name: 'وصل حديثاً' },
        { id: 'best-sellers', name: 'الأكثر مبيعاً' },
        { id: 'on-sale', name: 'تخفيضات' },
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
            case 'new-arrivals': 
                return products.filter(p => p.badges?.some(b => b.type === 'new')).slice(0, 8);
            case 'on-sale': 
                return products.filter(p => !!p.oldPrice).slice(0, 8);
            case 'best-sellers': 
                return [...products].sort((a, b) => (b.soldIn24h || 0) - (a.soldIn24h || 0)).slice(0, 8);
            default: 
                return [];
        }
    }, [activeTab, products]);

    return (
        <section id="shop-preview" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-center items-center mb-10">
                    <div className="flex justify-center items-center gap-6 md:gap-8">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-xl md:text-3xl font-bold pb-2 relative transition-all duration-300 focus:outline-none active:scale-95
                                    ${activeTab === tab.id 
                                        ? 'text-brand-primary' 
                                        : 'text-brand-text-light hover:text-brand-dark'}`
                                }
                            >
                                {tab.name}
                                <span className={`absolute bottom-[-2px] right-0 h-1 bg-brand-primary transition-all duration-300 ${activeTab === tab.id ? 'w-full' : 'w-0'}`}></span>
                            </button>
                        ))}
                    </div>
                </div>
                
                 <div key={activeTab} className="motion-safe:animate-fade-in">
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
                    <button onClick={() => props.navigateTo('shop')} className="bg-white border border-brand-border text-brand-dark font-bold py-3 px-8 rounded-full hover:bg-brand-subtle transition-colors">
                        عرض الكل
                    </button>
                </div>
            </div>
        </section>
    );
};
