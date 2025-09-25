import React from 'react';
import { Product } from '../../types';
import { EyeIcon, HeartIcon, ShoppingBagIcon, StarIcon } from '../icons';

interface ProductCardProps {
    product: Product;
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    compareList: Product[];
    addToCompare: (product: Product) => void;
    wishlistItems: Product[];
    toggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, navigateTo, addToCart, openQuickView, compareList, addToCompare, wishlistItems, toggleWishlist }) => {
    const discountPercent = product.oldPrice ? Math.round(((parseFloat(product.oldPrice) - parseFloat(product.price)) / parseFloat(product.oldPrice)) * 100) : 0;

    return (
        <div className="group text-center bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
            <div className="relative">
                <button onClick={() => navigateTo('product', product)} className="w-full bg-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-auto aspect-[3/4] object-cover" />
                </button>
                
                <div className="absolute top-4 right-4 space-y-2 z-10">
                     {(product.isNew || product.tags.includes('trending')) && <div className="bg-[#EFEFFD] text-[#6366F1] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">رائج</div>}
                </div>
                <div className="absolute top-4 left-4 space-y-2 z-10">
                     {product.onSale && discountPercent > 0 && <div className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">{discountPercent}% خصم</div>}
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3">
                    <button onClick={() => openQuickView(product)} className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-md hover:bg-white transition-colors" aria-label="Quick view"><EyeIcon size="sm" /></button>
                    <button onClick={() => addToCart(product)} className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-md hover:bg-white transition-colors" aria-label="Add to cart"><ShoppingBagIcon size="sm" /></button>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                    <div className="flex justify-center items-center gap-1.5 mb-2 h-6">
                        <p className="font-bold text-base text-brand-dark truncate cursor-pointer" onClick={() => navigateTo('product', product)}>{product.name}</p>
                        {product.tags.includes('trending') && <i className="fa-solid fa-fire text-orange-500" title="رائج"></i>}
                        {product.isNew && <i className="fa-solid fa-star text-amber-400" title="جديد"></i>}
                        {product.onSale && <i className="fa-solid fa-tag text-brand-sale" title="تخفيض"></i>}
                    </div>
                    <div className="flex justify-center items-baseline gap-2">
                        <span className={`${product.onSale ? 'text-brand-sale' : 'text-brand-dark'} font-bold`}>{product.price} ج.م</span>
                        {product.oldPrice && <span className="line-through text-brand-text-light text-sm">{product.oldPrice} ج.م</span>}
                    </div>
                </div>
                <div className="flex justify-center gap-1.5 mt-3 h-5">
                    {product.colors.slice(0, 4).map(color => (
                        <span key={color} className="w-5 h-5 rounded-full border-2 border-white ring-1 ring-gray-200" style={{ backgroundColor: color }}></span>
                    ))}
                </div>
            </div>
        </div>
    );
};