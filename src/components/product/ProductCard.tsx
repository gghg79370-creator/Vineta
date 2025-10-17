import React, { useMemo } from 'react';
import { Product } from '../../types';
import { EyeIcon, ShoppingBagIcon, FireIcon, SparklesIcon } from '../icons';
import { useCountdown } from '../../hooks/useCountdown';

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

export const ProductCard: React.FC<ProductCardProps> = ({ 
    product, 
    navigateTo, 
    addToCart, 
    openQuickView
}) => {
    
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

    const saleEndDate = product.saleEndDate ? new Date(product.saleEndDate) : null;
    const isSaleActive = saleEndDate && saleEndDate > new Date();
    const timeLeft = useCountdown(saleEndDate);
    const isNew = useMemo(() => product.badges?.some(b => b.type === 'new'), [product.badges]);

    const PromoDisplay = () => {
        if (isSaleActive) {
            const format = (num: number) => String(num).padStart(2, '0');
            
            return (
                <div className="h-6 flex items-center justify-center text-xs font-bold text-red-600 gap-1 animate-fade-in">
                    <FireIcon size="sm" />
                    <span>
                        ينتهي العرض خلال: {timeLeft.days > 0 && `${timeLeft.days}ي `}{format(timeLeft.hours)}:{format(timeLeft.minutes)}:{format(timeLeft.seconds)}
                    </span>
                </div>
            );
        } else if (isNew) {
            const newBadge = product.badges?.find(b => b.type === 'new');
            return (
                <div className="h-6 flex items-center justify-center text-xs font-bold text-blue-600 gap-1 animate-fade-in">
                    <SparklesIcon size="sm" />
                    <span>{newBadge?.text || 'وصل حديثاً'}</span>
                </div>
            );
        }

        return <div className="h-6" />; // Placeholder for layout stability
    };

    const badgeStyles: { [key: string]: string } = {
        sale: 'bg-brand-sale text-white',
        new: 'bg-brand-dark text-white',
        trending: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
        custom: 'bg-blue-100 text-blue-800',
    };

    return (
        <div className="group text-center bg-brand-bg rounded-2xl overflow-hidden border border-brand-border/10 h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1" onClick={() => navigateTo('product', product)}>
            <div className="relative overflow-hidden">
                <div className="bg-gray-100 aspect-[3/4]">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                </div>
                
                {/* Dynamic Badges */}
                <div className="absolute top-3 right-0 left-0 px-3 flex justify-between z-10">
                    <div className="flex flex-col items-start gap-y-2">
                        {product.badges?.filter(b => b.type === 'sale').map((badge, index) => (
                             <div key={index} className={`text-xs font-bold px-3 py-1 rounded-full shadow-md ${badgeStyles[badge.type] || badgeStyles.custom}`}>
                                {badge.text}
                            </div>
                        ))}
                    </div>
                     <div className="flex flex-col items-end gap-y-2">
                        {product.badges?.filter(b => b.type !== 'sale' && b.type !== 'new').map((badge, index) => (
                             <div key={index} className={`text-xs font-bold px-3 py-1 rounded-full shadow-md ${badgeStyles[badge.type] || badgeStyles.custom}`}>
                                {badge.text}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Hover Actions */}
                <div className="absolute bottom-3 right-3 left-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <div className="flex items-center justify-center gap-3">
                         <button onClick={handleAddToCart} className="bg-white rounded-full p-3 shadow-md hover:bg-brand-dark hover:text-white transition-all transform hover:scale-110" aria-label="Add to cart"><ShoppingBagIcon size="sm" /></button>
                         <button onClick={handleOpenQuickView} className="bg-white rounded-full p-3 shadow-md hover:bg-brand-dark hover:text-white transition-all transform hover:scale-110" aria-label="Quick view"><EyeIcon size="sm" /></button>
                    </div>
                </div>
            </div>

            {/* Common Product Info */}
            <div className="p-4 flex flex-col flex-grow">
                <p className="font-semibold text-sm text-brand-dark truncate mb-2 flex-grow">{product.name}</p>
                
                <div className="flex justify-center items-baseline gap-2 mb-1">
                    <span className="font-bold text-base text-brand-primary">{product.price} ج.م</span>
                    {product.oldPrice && <span className="line-through text-gray-400 text-sm">{product.oldPrice} ج.م</span>}
                </div>
                
                <PromoDisplay />
                
                <div className="flex justify-center gap-1.5 h-5 mt-auto">
                    {product.colors.slice(0, 5).map(color => (
                        <span key={color} className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: color }}></span>
                    ))}
                </div>
            </div>
        </div>
    );
};