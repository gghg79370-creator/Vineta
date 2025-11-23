import React from 'react';
import { Product } from '../../types';

interface ProductSelectorProps {
    selectableProducts: Product[];
    selectedProduct: Product | null;
    onSelect: (product: Product) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({ selectableProducts, selectedProduct, onSelect }) => {
    return (
        <div>
            <h3 className="font-bold text-xl text-brand-dark">1. اختر منتجاً</h3>
            <p className="text-sm text-brand-text-light mt-1 mb-4">اختر من قائمة مشترياتك، قائمة الرغبات، أو المنتجات الرائجة.</p>
            <div className="flex overflow-x-auto gap-3 scrollbar-hide pb-2 -mx-4 px-4">
                {selectableProducts.map(p => (
                    <div 
                        key={p.id} 
                        onClick={() => onSelect(p)} 
                        className={`flex-shrink-0 w-28 aspect-[4/5] rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 relative group
                            ${selectedProduct?.id === p.id ? 'border-brand-primary shadow-lg scale-105' : 'border-transparent hover:border-brand-border'}`}
                    >
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <p className="absolute bottom-1 left-1 right-1 text-white text-[10px] font-bold text-center text-shadow-on-hero p-1 bg-black/30 rounded-b-md line-clamp-2">
                            {p.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
