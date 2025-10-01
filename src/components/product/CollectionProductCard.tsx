import React from 'react';
import { Product } from '../../types';
import { EyeIcon, HeartIcon, ShoppingBagIcon, StarIcon, CompareIcon } from '../icons';

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
    wishlistItems, 
    toggleWishlist, 
    compareList, 
    addToCompare 
}) => {
    const isInWishlist = wishlistItems.includes(product.id);
    const isInCompare = compareList.includes(product.id);
    const alternativeImage = product.images?.find(img => img !== product.image);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product);
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleWishlist(product);
    };
    
    const handleAddToCompare = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCompare(product);
    };

    const handleOpenQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        openQuickView(product);
    };

    const badgeStyles: { [key: string]: string } = {
        sale: 'bg-brand-sale text-white',
        new: 'bg-brand-dark text-white',
        trending: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
        custom: 'bg-blue-100 text-blue-800',
    };

    return (
        <div className="group text-center bg-white rounded-xl overflow-hidden border border-transparent md:border-gray-100 hover:border-brand-border transition-all duration-300 hover:shadow-lg h-full flex flex-col cursor-pointer transform hover:-translate-y-1" onClick={() => navigateTo('product', product)}>
            <div className="relative overflow-hidden">
                <div className="bg-gray-100 aspect-[3/4]">
                    <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-all duration-500 md:group-hover:scale-105 ${alternativeImage ? 'md:group-hover:opacity-0' : ''}`} />
                    {alternativeImage && (
                        <img src={alternativeImage} alt={`${product.name} alternate view`} className="absolute inset-0 w-full h-full object-cover opacity-0 md:group-hover:opacity-100 transition-all duration-500 md:group-hover:scale-105" />
                    )}
                </div>
                
                {/* Dynamic Badges */}
                <div className="absolute top-3 end-3 flex flex-col items-end gap-y-2 z-10">
                    {product.badges?.map((badge, index) => (
                        <div key={index} className={`text-[10px] md:text-xs font-bold px-3 md:px-2.5 py-1 rounded-full shadow-sm ${badgeStyles[badge.type] || badgeStyles.custom}`}>
                            {badge.text}
                        </div>
                    ))}
                </div>
                
                {/* Mobile Hover Actions */}
                <div className="md:hidden absolute bottom-0 right-0 left-0">
                    <div className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 p-4 pt-12 bg-gradient-to-t from-black/10 to-transparent">
                        <div className="flex items-center justify-around gap-0 bg-white/95 backdrop-blur-sm rounded-full shadow-lg p-1">
                            <div className="group/tooltip flex-1 relative">
                                <button onClick={handleAddToCompare} className="p-2.5 w-full hover:bg-brand-subtle rounded-full text-brand-dark transition-transform active:scale-90" aria-label="قارن"><CompareIcon size="sm" /></button>
                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-brand-dark text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">قارن</span>
                            </div>
                             <div className="group/tooltip flex-1 relative border-x border-gray-200">
                                <button onClick={handleOpenQuickView} className="p-2.5 w-full hover:bg-brand-subtle rounded-full text-brand-dark transition-transform active:scale-90" aria-label="نظرة سريعة"><EyeIcon size="sm" /></button>
                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-brand-dark text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">نظرة سريعة</span>
                            </div>
                            <div className="group/tooltip flex-1 relative">
                                <button onClick={handleToggleWishlist} className={`p-2.5 w-full hover:bg-brand-subtle rounded-full transition-all active:scale-90 ${isInWishlist ? 'text-brand-primary' : 'text-brand-dark'}`} aria-label="أضف إلى قائمة الرغبات"><HeartIcon filled={isInWishlist} size="sm" /></button>
                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-brand-dark text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">قائمة الرغبات</span>
                            </div>
                            <div className="group/tooltip flex-1 relative border-l border-gray-200">
                                <button onClick={handleAddToCart} className="p-2.5 w-full hover:bg-brand-subtle rounded-full text-brand-dark transition-transform active:scale-90" aria-label="أضف إلى السلة"><ShoppingBagIcon size="sm" /></button>
                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-brand-dark text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">أضف للسلة</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Hover Actions */}
                <div className="hidden md:block absolute bottom-3 right-0 left-0 px-3 product-actions-container">
                    <div className="flex items-center justify-center gap-1 bg-white rounded-full shadow-lg p-1.5">
                         <button onClick={handleAddToCompare} className="flex-1 p-2 hover:bg-brand-subtle rounded-full text-brand-dark hover:text-brand-primary transition-transform active:scale-90" aria-label="Compare"><CompareIcon size="sm" /></button>
                         <button onClick={handleOpenQuickView} className="flex-1 p-2 hover:bg-brand-subtle rounded-full border-x text-brand-dark hover:text-brand-primary transition-transform active:scale-90" aria-label="Quick view"><EyeIcon size="sm" /></button>
                         <button onClick={handleToggleWishlist} className={`flex-1 p-2 hover:bg-brand-subtle rounded-full transition-all active:scale-90 ${isInWishlist ? 'text-brand-primary' : 'text-brand-dark hover:text-brand-primary'}`} aria-label="Add to wishlist"><HeartIcon filled={isInWishlist} size="sm" /></button>
                         <button onClick={handleAddToCart} className="flex-1 p-2 hover:bg-brand-subtle rounded-full border-l text-brand-dark hover:text-brand-primary transition-transform active:scale-90" aria-label="Add to cart"><ShoppingBagIcon size="sm" /></button>
                    </div>
                </div>
            </div>

            {/* Common Product Info */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="text-xs text-brand-text-light mb-1 truncate">
                    {product.tags.slice(0, 2).map((tag, index) => (
                        <span key={tag}>
                            {tag}
                            {index < 1 && product.tags.length > 1 && ', '}
                        </span>
                    ))}
                </div>
                <p className="font-semibold md:font-bold text-sm md:text-base text-brand-dark truncate mb-1 md:mb-2 flex-grow">{product.name}</p>
                
                <div className="flex justify-center items-baseline gap-2 mb-3">
                    <span className="font-bold text-base text-brand-primary">{product.price} ج.م</span>
                    {product.oldPrice && <span className="line-through text-gray-400 text-xs">{product.oldPrice} ج.م</span>}
                </div>
                
                <div className="flex justify-center gap-1.5 h-5 mt-auto">
                    {product.colors.slice(0, 5).map(color => (
                        <span key={color} className="w-5 h-5 rounded-full border" style={{ backgroundColor: color }}></span>
                    ))}
                </div>
            </div>
        </div>
    );
};