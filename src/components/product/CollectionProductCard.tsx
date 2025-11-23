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
        <div className="group relative break-inside-avoid mb-6 cursor-pointer" onClick={() => navigateTo('product', product)}>
            <div className="relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-[3/4] bg-brand-subtle">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    {alternativeImage && (
                        <img src={alternativeImage} alt={`${product.name} alternate view`} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
                    )}
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <div className="absolute bottom-0 right-0 left-0 p-4 text-white">
                    <p className="font-semibold text-base text-shadow-on-hero truncate text-right">{product.name}</p>
                    <div className="flex justify-between items-center mt-1">
                        <div className="flex gap-1.5 h-5">
                            {product.colors.slice(0, 5).map(color => (
                                <span key={color} className="w-4 h-4 rounded-full border border-white/50" style={{ backgroundColor: color }}></span>
                            ))}
                        </div>
                        <div className="flex items-baseline gap-2">
                            {product.oldPrice ? (
                                <>
                                    <span className="font-extrabold text-xl text-shadow-on-hero">{product.price} ج.م</span>
                                    <span className="line-through text-base opacity-80 text-shadow-on-hero">{product.oldPrice} ج.م</span>
                                </>
                            ) : (
                                <span className="font-bold text-lg text-shadow-on-hero">{product.price} ج.م</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={handleAddToCart} className="bg-white/90 text-brand-dark rounded-full w-12 h-12 flex items-center justify-center hover:bg-white transition-all duration-300 shadow-md transform hover:scale-110" aria-label="Add to cart">
                        <ShoppingBagIcon />
                    </button>
                    <button onClick={handleOpenQuickView} className="bg-white/90 text-brand-dark rounded-full w-12 h-12 flex items-center justify-center hover:bg-white transition-all duration-300 shadow-md transform hover:scale-110" aria-label="Quick View">
                        <EyeIcon />
                    </button>
                </div>
            </div>
            
            <div className="absolute top-3 right-3 flex flex-col items-end gap-y-2 z-10">
                {product.badges?.map((badge, index) => (
                     <div key={index} className={`text-xs font-bold px-3 py-1 rounded-full shadow-md ${badgeStyles[badge.type] || badgeStyles.custom}`}>
                        {badge.text}
                    </div>
                ))}
            </div>
        </div>
    );
};