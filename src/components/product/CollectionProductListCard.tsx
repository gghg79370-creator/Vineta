import React from 'react';
import { Product } from '../../types';
import { StarIcon, CartIcon, CompareIcon } from '../icons';

interface CollectionProductListCardProps {
    product: Product;
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    compareList: Product[];
    addToCompare: (product: Product) => void;
}

export const CollectionProductListCard: React.FC<CollectionProductListCardProps> = ({ product, navigateTo, addToCart, compareList, addToCompare }) => {
    
    const isInCompare = compareList.some(p => p.id === product.id);

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        return (
            <div className="flex">
                {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} className="w-4 h-4 text-yellow-400"/>)}
                {[...Array(5 - fullStars)].map((_, i) => <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300"/>)}
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-lg border border-brand-border group w-full">
            <div className="md:w-1/4 relative overflow-hidden rounded-lg">
                <button onClick={() => navigateTo('product', product)}>
                    <img src={product.image} alt={product.name} className="w-full h-full aspect-[3/4] md:aspect-square object-cover transition-transform duration-300 group-hover:scale-105" />
                </button>
            </div>
            <div className="md:w-3/4 flex flex-col">
                <p className="text-sm text-brand-text-light">{product.brand}</p>
                <h3 className="font-bold text-lg text-brand-dark mb-2 hover:text-brand-primary cursor-pointer" onClick={() => navigateTo('product', product)}>{product.name}</h3>
                {product.rating && (
                    <div className="flex items-center gap-1.5 mb-2">
                        {renderStars(product.rating)}
                        <span className="text-xs text-brand-text-light">({product.reviewCount} تقييمًا)</span>
                    </div>
                )}
                <p className="text-sm text-brand-text-light leading-relaxed mb-4 line-clamp-2">{product.description}</p>
                <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-brand-dark font-bold text-xl">{product.price} ج.م</span>
                        {product.oldPrice && <span className="line-through text-brand-text-light">{product.oldPrice} ج.م</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => addToCompare(product)} className={`border rounded-full p-2.5 transition-colors ${isInCompare ? 'text-brand-primary border-brand-primary/50 bg-brand-primary/10' : 'border-brand-border hover:bg-brand-subtle'}`} aria-label="Add to compare">
                            <CompareIcon size="sm" />
                        </button>
                        <button onClick={() => addToCart(product)} className="bg-brand-dark text-white font-bold py-2.5 px-6 rounded-full hover:bg-opacity-90 flex items-center justify-center gap-2 transition-colors">
                            <CartIcon size="sm" />
                            <span>أضف إلى السلة</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
