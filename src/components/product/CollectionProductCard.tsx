

import React from 'react';
import { Product } from '../../types';
import { EyeIcon, HeartIcon, ShoppingBagIcon, StarIcon, CompareIcon, FireIcon } from '../icons';

interface ProductCardProps {
    product: Product;
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    wishlistItems: number[];
    toggleWishlist: (product: Product) => void;
    compareList: number[];
    addToCompare: (product: Product) => void;
}

export const CollectionProductCard: React.FC<ProductCardProps> = ({ 
    product, 
    navigateTo, 
    addToCart, 
    openQuickView, 
}) => {
    const alternativeImage = product.images?.[1];

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (product.variants && product.variants.length > 0) {
            openQuickView(product);
        } else {
            addToCart(product);
        }
    };

    const handleOpenQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        openQuickView(product);
    };

    const badgeStyles: { [key: string]: string } = {
        sale: 'bg-brand-sale text-white',
        new: 'bg-blue-500 text-white',
        trending: 'bg-orange-500 text-white',
        vip: 'bg-purple-600 text-white',
        custom: 'bg-brand-dark text-white',
    };


    return (
        <div className="group relative text-right bg-brand-surface rounded-2xl h-full flex flex-col cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1" onClick={() => navigateTo('product', product)}>
            <div className="relative overflow-hidden">
                <div className="bg-brand-subtle aspect-[3/4]">
                    <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-all duration-300 ${alternativeImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`} />
                    {alternativeImage && (
                        <img src={alternativeImage} alt={`${product.name} alternate view`} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                    )}
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col items-end gap-y-2 z-10">
                    {product.badges?.map((badge, index) => (
                         <div key={index} className={`text-xs font-bold px-3 py-1 rounded-full shadow-md ${badgeStyles[badge.type] || badgeStyles.custom}`}>
                            {badge.text}
                        </div>
                    ))}
                </div>
                
                {/* Hover Actions */}
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 product-actions-container">
                    <button onClick={handleAddToCart} className="bg-brand-dark text-brand-bg rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-80 transition-all duration-300 shadow-md" aria-label="Add to cart">
                        <ShoppingBagIcon size="sm" />
                    </button>
                    <button onClick={handleOpenQuickView} className="bg-brand-dark text-brand-bg rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-80 transition-all duration-300 shadow-md" aria-label="Quick View">
                        <EyeIcon size="sm" />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-grow">
                <p className="font-semibold text-base text-brand-text truncate mb-2 flex-grow">{product.name}</p>
                
                <div className="flex justify-end items-baseline gap-2 mb-3">
                    <span className="font-bold text-base text-brand-primary">{product.price} ج.م</span>
                    {product.oldPrice && <span className="line-through text-brand-text-light text-sm">{product.oldPrice} ج.م</span>}
                </div>
                
                <div className="flex justify-end gap-1.5 h-5">
                    {product.colors.slice(0, 5).map(color => (
                        <span key={color} className="w-5 h-5 rounded-full border border-brand-border/50" style={{ backgroundColor: color }}></span>
                    ))}
                </div>
            </div>
        </div>
    );
};