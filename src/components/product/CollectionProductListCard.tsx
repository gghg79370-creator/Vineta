import React from 'react';
import { Product } from '../../types';
import { StarIcon, ShoppingBagIcon, CompareIcon, HeartIcon, EyeIcon } from '../icons';

interface CollectionProductListCardProps {
    product: Product;
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    compareList: number[];
    addToCompare: (product: Product) => void;
    wishlistItems: number[];
    toggleWishlist: (product: Product) => void;
}

export const CollectionProductListCard: React.FC<CollectionProductListCardProps> = ({ product, navigateTo, addToCart, openQuickView, compareList, addToCompare, wishlistItems, toggleWishlist }) => {
    
    const isInCompare = compareList.includes(product.id);
    const isInWishlist = wishlistItems.includes(product.id);

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        return (
            <div className="flex">
                {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} className="w-4 h-4 text-yellow-400"/>)}
                {[...Array(5 - fullStars)].map((_, i) => <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300"/>)}
            </div>
        );
    };

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

    return (
        <div className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-xl border border-transparent group w-full hover:shadow-lg hover:border-brand-border transition-all duration-300">
            <div className="md:w-1/4 relative overflow-hidden rounded-lg flex-shrink-0">
                <button onClick={() => navigateTo('product', product)} className="block w-full h-full">
                    <img src={product.image} alt={product.name} className="w-full h-full aspect-[3/4] md:aspect-auto object-cover transition-transform duration-300 group-hover:scale-105" />
                </button>
            </div>
            <div className="md:w-3/4 flex flex-col">
                {product.brand && <p className="text-sm text-brand-text-light">{product.brand}</p>}
                <h3 className="font-bold text-lg text-brand-dark mb-2 hover:text-brand-primary cursor-pointer transition-colors" onClick={() => navigateTo('product', product)}>{product.name}</h3>
                <div className="flex items-center gap-4 mb-2">
                    {product.rating && (
                        <div className="flex items-center gap-1.5">
                            {renderStars(product.rating)}
                            <span className="text-xs text-brand-text-light">({product.reviewCount} تقييمًا)</span>
                        </div>
                    )}
                    {product.viewCount && product.viewCount > 100 && (
                        <div className="text-xs text-brand-text-light flex items-center gap-1">
                            <EyeIcon size="sm" />
                            <span>{product.viewCount} مشاهدة</span>
                        </div>
                    )}
                </div>
                <p className="text-sm text-brand-text-light leading-relaxed mb-4 line-clamp-3">{product.description}</p>
                <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-baseline gap-2">
                        {product.oldPrice ? (
                            <>
                                <span className="text-brand-sale font-extrabold text-2xl">{product.price} ج.م</span>
                                <span className="line-through text-brand-text-light text-base">{product.oldPrice} ج.م</span>
                            </>
                        ) : (
                            <span className="text-brand-dark font-bold text-xl">{product.price} ج.م</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => toggleWishlist(product)} className={`border rounded-full p-2.5 transition-colors ${isInWishlist ? 'text-red-500 border-red-500/50 bg-red-500/10' : 'border-brand-border hover:bg-brand-subtle'}`} aria-label="Toggle Wishlist">
                            <HeartIcon filled={isInWishlist} size="sm" />
                        </button>
                         <button onClick={handleOpenQuickView} className="border rounded-full p-2.5 transition-colors border-brand-border hover:bg-brand-subtle" aria-label="Quick View">
                            <EyeIcon size="sm" />
                        </button>
                        <button onClick={() => addToCompare(product)} className={`border rounded-full p-2.5 transition-colors ${isInCompare ? 'text-brand-primary border-brand-primary/50 bg-brand-primary/10' : 'border-brand-border hover:bg-brand-subtle'}`} aria-label="Add to compare">
                            <CompareIcon size="sm" />
                        </button>
                        <button onClick={handleAddToCart} className="bg-brand-dark text-white font-bold py-2.5 px-6 rounded-full hover:bg-opacity-90 flex items-center justify-center gap-2 transition-colors">
                            <ShoppingBagIcon size="sm" />
                            <span>أضف إلى السلة</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};