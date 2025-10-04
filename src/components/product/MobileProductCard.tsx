
import React from 'react';
import { Product } from '../../types';
import { EyeIcon, ShoppingBagIcon } from '../icons';

interface MobileProductCardProps {
    product: Product;
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
}

export const MobileProductCard: React.FC<MobileProductCardProps> = ({ 
    product, 
    navigateTo, 
    addToCart,
    openQuickView
}) => {
    const discountPercent = product.oldPrice ? Math.round(((parseFloat(product.oldPrice) - parseFloat(product.price)) / parseFloat(product.oldPrice)) * 100) : 0;
    const isNew = product.badges?.some(b => b.type === 'new');
    const onSale = !!product.oldPrice;
    
    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product);
    };

    const handleOpenQuickView = (e: React.MouseEvent) => {
        e.stopPropagation();
        openQuickView(product);
    };

    const handleCardClick = () => {
        navigateTo('product', product);
    }
    
    return (
        <div className="group text-center bg-white rounded-xl overflow-hidden h-full flex flex-col cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1" onClick={handleCardClick}>
            <div className="relative overflow-hidden">
                <div className="bg-gray-100 aspect-[3/4]">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 start-3 space-y-2 z-10 text-start">
                    {isNew && <div className="bg-brand-dark text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm animate-fade-in">جديد</div>}
                    {product.tags.includes('trending') && !isNew && <div className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm animate-fade-in">رائج</div>}
                </div>
                <div className="absolute top-3 end-3">
                    {onSale && discountPercent > 0 && <div className="bg-brand-sale text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm animate-fade-in">-{discountPercent}%</div>}
                </div>
                
                {/* Action Icons */}
                 <div className="absolute bottom-3 start-0 end-0 px-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2">
                         <button onClick={handleOpenQuickView} className="bg-white rounded-full p-2.5 shadow-md hover:bg-brand-primary hover:text-white transition-colors" aria-label="Quick view"><EyeIcon size="sm" /></button>
                         <button onClick={handleAddToCart} className="bg-white rounded-full p-2.5 shadow-md hover:bg-brand-primary hover:text-white transition-colors" aria-label="Add to cart"><ShoppingBagIcon size="sm" /></button>
                    </div>
                </div>
            </div>
            <div className="p-3 flex flex-col flex-grow">
                <p className="font-bold text-base text-brand-dark truncate mb-1 flex-grow">{product.name}</p>
                
                <div className="flex justify-center items-baseline gap-2 mb-3">
                    <span className="text-brand-dark font-bold text-lg">{product.price} ج.م</span>
                    {product.oldPrice && <span className="line-through text-brand-text-light text-sm">{product.oldPrice} ج.م</span>}
                </div>
                
                <div className="flex justify-center gap-1.5 h-5 mt-auto">
                    {product.colors.slice(0, 4).map((color) => (
                        <span key={color} className="w-5 h-5 rounded-full border-2 border-white ring-1 ring-gray-200 transition-all group-hover:ring-brand-dark" style={{ backgroundColor: color }}></span>
                    ))}
                </div>
            </div>
        </div>
    );
};
