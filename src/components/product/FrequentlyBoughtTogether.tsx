
import React, { useState, useMemo } from 'react';
import { Product, Variant } from '../../types';
import { PlusIcon, CheckIcon } from '../icons';

interface FrequentlyBoughtTogetherProps {
    mainProduct: Product;
    otherProducts: Product[];
    addToCart: (product: Product, options?: { quantity?: number, selectedSize?: string, selectedColor?: string }) => void;
}

const FbtProductCard: React.FC<{
    item: Product;
    isSelected: boolean;
    onToggle: () => void;
    selectedVariant: Variant | null;
    onVariantChange: (variantId: string) => void;
}> = ({ item, isSelected, onToggle, selectedVariant, onVariantChange }) => {
    const displayPrice = selectedVariant?.price || item.price;
    
    return (
        <div 
            className="relative w-40 md:w-48 text-center group cursor-pointer animate-fade-in"
            onClick={onToggle}
            role="checkbox"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}
        >
            <div className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${isSelected ? 'border-brand-primary' : 'border-transparent'} group-hover:border-brand-primary/50`}>
                <div className={`absolute inset-0 bg-brand-primary transition-opacity duration-300 ${isSelected ? 'opacity-10' : 'opacity-0'}`}></div>
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-48 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                <div className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isSelected ? 'bg-brand-primary border-brand-primary' : 'bg-white/50 border-white group-hover:bg-white'}`}>
                    {isSelected && <CheckIcon className="w-5 h-5 text-white" />}
                </div>
            </div>
            <h4 className="font-bold text-sm mt-3 text-brand-dark truncate">{item.name}</h4>
            <p className="font-semibold text-brand-primary text-sm">{displayPrice} ج.م</p>
            {item.variants && item.variants.length > 0 && (
                <select
                    value={selectedVariant?.id}
                    onChange={(e) => { e.stopPropagation(); onVariantChange(e.target.value); }}
                    onClick={(e) => e.stopPropagation()} // Prevent card toggle when clicking select
                    className="mt-2 text-xs bg-gray-100 border-0 rounded-full py-1 px-3 focus:ring-1 focus:ring-brand-primary w-full appearance-none text-center"
                    aria-label={`Select variant for ${item.name}`}
                >
                    {item.variants.map(v => (
                        <option key={v.id} value={v.id}>{v.size} / {v.color}</option>
                    ))}
                </select>
            )}
        </div>
    );
};

export const FrequentlyBoughtTogether = ({ mainProduct, otherProducts, addToCart }: FrequentlyBoughtTogetherProps) => {
    const allItems = useMemo(() => [mainProduct, ...otherProducts.filter(p => p.id !== mainProduct.id).slice(0, 2)], [mainProduct, otherProducts]);
    
    const [selectedIds, setSelectedIds] = useState<number[]>(allItems.map(p => p.id));
    
    const [selectedVariants, setSelectedVariants] = useState<{ [productId: number]: Variant | null }>(() => {
        const initialState: { [productId: number]: Variant | null } = {};
        allItems.forEach(item => {
            initialState[item.id] = item.variants && item.variants.length > 0 ? item.variants[0] : null;
        });
        return initialState;
    });

    const handleToggleItem = (productId: number) => {
        setSelectedIds(prev =>
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    };

    const handleVariantChange = (productId: number, variantId: string) => {
        const product = allItems.find(p => p.id === productId);
        const variant = product?.variants?.find(v => v.id === parseInt(variantId));
        if(variant) {
            setSelectedVariants(prev => ({...prev, [productId]: variant}));
        }
    };
    
    const selectedItems = useMemo(() => allItems.filter(item => selectedIds.includes(item.id)), [allItems, selectedIds]);
    
    const totalPrice = useMemo(() => {
        return selectedItems.reduce((acc, item) => {
            const variant = selectedVariants[item.id];
            const price = variant ? variant.price : item.price;
            return acc + parseFloat(price);
        }, 0);
    }, [selectedItems, selectedVariants]);

    const handleAddAllToCart = () => {
        if (selectedItems.length === 0) return;
        selectedItems.forEach(item => {
            const variant = selectedVariants[item.id];
            addToCart(item, { 
                quantity: 1, 
                selectedSize: variant?.size || item.sizes[0],
                selectedColor: variant?.color || item.colors[0],
            });
        });
    };

    return (
        <div className="py-16 md:py-24 bg-gradient-to-br from-rose-50 to-indigo-50 dark:from-gray-900 dark:to-slate-800">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center text-brand-dark mb-12 animate-fade-in-up">يُشترى معًا بشكل متكرر</h2>
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8">
                        {allItems.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <FbtProductCard
                                    item={item}
                                    isSelected={selectedIds.includes(item.id)}
                                    onToggle={() => handleToggleItem(item.id)}
                                    selectedVariant={selectedVariants[item.id]}
                                    onVariantChange={(variantId) => handleVariantChange(item.id, variantId)}
                                />
                                {index < allItems.length - 1 && <PlusIcon className="w-8 h-8 text-brand-text-light flex-shrink-0 my-4 md:my-0" />}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-700 mt-8 pt-8 text-center">
                        <p className="text-brand-text-light">
                            {selectedItems.length > 0 ? ` سعر ${selectedItems.length} منتجات محددة:` : 'حدد المنتجات لإضافتها إلى السلة'}
                        </p>
                        <p className="font-extrabold text-4xl text-brand-dark my-2 transition-colors duration-300">{totalPrice.toFixed(2)} ج.م</p>
                        <button
                            onClick={handleAddAllToCart}
                            disabled={selectedItems.length === 0}
                            className="w-full max-w-sm mx-auto bg-brand-dark text-white font-bold py-4 rounded-full text-lg mt-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_transparent] hover:shadow-lg hover:shadow-brand-primary/50 active:scale-95"
                        >
                            أضف ({selectedItems.length}) إلى السلة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
