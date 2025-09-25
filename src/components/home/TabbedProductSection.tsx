import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';

interface TabbedProductSectionProps {
    products: Product[];
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    compareList: Product[];
    addToCompare: (product: Product) => void;
    wishlistItems: Product[];
    toggleWishlist: (product: Product) => void;
}

export const TabbedProductSection: React.FC<TabbedProductSectionProps> = (props) => {
    const { products } = props;
    const [activeTab, setActiveTab] = useState('top-sellers');
    
    const tabs = [
        { id: 'trending', name: 'رائج' },
        { id: 'on-sale', name: 'تخفيضات' },
        { id: 'top-sellers', name: 'الأكثر مبيعاً' }
    ];

    const activeProducts = useMemo(() => {
        switch(activeTab) {
            case 'trending': 
                return products.filter(p => p.isNew || p.tags.includes('trending')).slice(0, 8);
            case 'on-sale': 
                return products.filter(p => p.onSale).slice(0, 8);
            case 'top-sellers': 
                return [...products].sort((a, b) => (b.soldIn24h || 0) - (a.soldIn24h || 0)).slice(0, 8);
            default: 
                return [];
        }
    }, [activeTab, products]);

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-center items-center gap-4 md:gap-12 mb-10 border-b">
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`text-xl md:text-2xl font-bold py-4 relative transition-colors duration-300 ${activeTab === tab.id ? 'text-brand-dark' : 'text-brand-text-light hover:text-brand-dark'}`}
                        >
                            {tab.name}
                            {activeTab === tab.id && <div className="absolute bottom-0 right-0 left-0 h-1 bg-brand-dark rounded-full"></div>}
                        </button>
                    ))}
                </div>
                <div className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4 -mx-4 px-4">
                    {activeProducts.map(product => (
                        <div key={product.id} className="flex-shrink-0 w-3/4 sm:w-1/3 md:w-1/4 lg:w-1/5">
                            <ProductCard {...props} product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};