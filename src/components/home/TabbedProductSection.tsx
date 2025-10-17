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
        <section id="shop-preview" className="py-16 bg-brand-subtle">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-brand-dark">أحدث مجموعاتنا</h2>
                    <p className="text-brand-text-light mt-2 max-w-2xl mx-auto">تحقق مما هو جديد، وما هو رائج، وما هو معروض للبيع.</p>
                </div>
                <div className="flex justify-center items-center mb-10">
                    <div className="bg-white p-2 rounded-full flex justify-center items-center gap-2 shadow-sm">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-base md:text-lg font-bold py-2.5 px-4 md:px-6 rounded-full transition-all duration-300 focus:outline-none
                                    ${activeTab === tab.id 
                                        ? 'bg-brand-primary/10 text-brand-primary' 
                                        : 'text-brand-text-light hover:text-brand-dark'}`
                                }
                            >
                                {tab.name}
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
                    <button onClick={() => props.navigateTo('shop')} className="bg-white border border-brand-border text-brand-dark font-bold py-3 px-8 rounded-full hover:bg-brand-subtle transition-colors">
                        عرض الكل
                    </button>
                </div>
            </div>
        </section>
    );
};