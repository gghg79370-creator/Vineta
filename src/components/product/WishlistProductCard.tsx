import React from 'react';
import { Product } from '../../types';
import { CloseIcon, CheckIcon } from '../icons';

interface WishlistProductCardProps {
    product: Product;
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    toggleWishlist: (product: Product) => void;
}

export const WishlistProductCard: React.FC<WishlistProductCardProps> = ({ product, navigateTo, addToCart, toggleWishlist }) => {
    return (
        <div className="group">
            <div className="relative overflow-hidden rounded-lg mb-4">
                <button onClick={() => navigateTo('product', product)}><img src={product.image} alt={product.name} className="w-full h-auto transition-transform duration-300 group-hover:scale-105"/></button>
                <button onClick={() => toggleWishlist(product)} className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-brand-subtle"><CloseIcon size="sm"/></button>
            </div>
            <p className="font-bold mb-1 hover:text-brand-primary cursor-pointer" onClick={() => navigateTo('product', product)}>{product.name}</p>
            <p className="text-brand-text font-bold text-brand-dark">{product.price} ج.م</p>
            <button 
                onClick={() => addToCart(product)}
                className="w-full mt-2 font-bold py-2 rounded-full transition-colors duration-200 bg-brand-subtle text-brand-dark hover:bg-brand-dark hover:text-white"
            >
                أضف إلى السلة
            </button>
        </div>
    );
};