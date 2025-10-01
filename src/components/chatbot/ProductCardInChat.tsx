import React from 'react';
import { Product } from '../../types';

interface ProductCardInChatProps {
    product: Product;
    onNavigate: () => void;
}

export const ProductCardInChat: React.FC<ProductCardInChatProps> = ({ product, onNavigate }) => {
    return (
        <div className="bg-brand-subtle/50 rounded-lg overflow-hidden flex items-center gap-3 mt-2.5 border border-gray-200/80">
            <img src={product.image} alt={product.name} className="w-16 h-20 object-cover flex-shrink-0" />
            <div className="flex-1 p-1 min-w-0">
                <p className="font-bold text-sm text-brand-dark line-clamp-2">{product.name}</p>
                <p className="text-brand-primary font-semibold text-sm mt-1">{product.price} ج.م</p>
            </div>
            <button
                onClick={onNavigate}
                className="self-stretch bg-gray-100/50 text-brand-dark font-bold px-4 hover:bg-gray-200/70 transition-colors text-sm flex-shrink-0 border-r border-gray-200/80"
            >
                عرض
            </button>
        </div>
    );
};