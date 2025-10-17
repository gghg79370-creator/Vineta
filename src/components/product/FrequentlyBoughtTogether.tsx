import React, { useState, useMemo } from 'react';
import { Product, Variant } from '../../types';

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
    isMain: boolean;
}> = ({ item, isSelected, onToggle, selectedVariant, onVariantChange, isMain }) => {
    const displayPrice = selectedVariant?.price || item.price;
    
    return (
        <div className="flex items-center gap-4">
             <input type="checkbox" checked={isSelected} onChange={onToggle} className="w-5 h-5 rounded border-gray-400 text-brand-primary focus:ring-brand-primary" />
             <div className="flex items-center gap-4 flex-1">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                    <p className="font-semibold text-brand-dark">{isMain && <span className="text-sm font-normal text-brand-text-light">This item: </span>}{item.name}</p>
                    <p className="font-bold text-brand-dark">{displayPrice} ج.م</p>
                    {item.variants && item.variants.length > 0 && (
                        <div className="relative mt-2 max-w-[150px]">
                            <select
                                value={selectedVariant?.id}
                                onChange={(e) => onVariantChange(e.target.value)}
                                className="w-full appearance-none bg-gray-100 border border-gray-300 rounded-md py-1 px-3 text-sm focus:ring-1 focus:ring-brand-primary"
                                aria-label={`Select variant for ${item.name}`}
                            >
                                {item.variants.map(v => (
                                    <option key={v.id} value={v.id}>{v.color} / {v.size}</option>
                                ))}
                            </select>
                            <svg className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-2 pointer-events-none text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    )}
                </div>
             </div>
        </div>
    );
};

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({ mainProduct, otherProducts, addToCart }) => {
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
        const variant = product?.variants?.find(v => String(v.id) === variantId);
        if(variant) {
            setSelectedVariants(prev => ({...prev, [productId]: variant}));
        }
    };
    
    const selectedItems = useMemo(() => allItems.filter(item => selectedIds.includes(item.id)), [allItems, selectedIds]);
    
    const { totalPrice, totalOldPrice } = useMemo(() => {
        return selectedItems.reduce((acc, item) => {
            const variant = selectedVariants[item.id];
            const price = parseFloat(variant ? variant.price : item.price);
            const oldPrice = parseFloat(variant ? (variant.oldPrice || variant.price) : (item.oldPrice || item.price));
            acc.totalPrice += price;
            acc.totalOldPrice += oldPrice;
            return acc;
        }, { totalPrice: 0, totalOldPrice: 0 });
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
        <div className="py-12 md:py-16">
            <div className="container mx-auto px-4">
                 <div className="max-w-4xl mx-auto bg-brand-subtle p-6 rounded-2xl shadow-sm">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-center text-brand-dark mb-8">يُشترى معًا بشكل متكرر</h2>
                    <div className="space-y-6">
                        {allItems.map((item, index) => (
                           <FbtProductCard
                                key={item.id}
                                item={item}
                                isSelected={selectedIds.includes(item.id)}
                                onToggle={() => handleToggleItem(item.id)}
                                selectedVariant={selectedVariants[item.id]}
                                onVariantChange={(variantId) => handleVariantChange(item.id, variantId)}
                                isMain={index === 0}
                            />
                        ))}
                    </div>
                    <div className="border-t-2 border-dashed border-gray-400/50 mt-8 pt-6 text-center">
                        <p className="text-brand-text-light">
                            {selectedItems.length > 0 ? ` سعر ${selectedItems.length} منتجات محددة:` : 'حدد المنتجات لإضافتها إلى السلة'}
                        </p>
                        <div className="flex justify-center items-baseline gap-3 my-2">
                           <p className="font-extrabold text-3xl text-brand-primary">{totalPrice.toFixed(2)} ج.م</p>
                           {totalOldPrice > totalPrice && <p className="text-xl text-brand-text-light line-through">{totalOldPrice.toFixed(2)} ج.م</p>}
                        </div>
                        <button
                            onClick={handleAddAllToCart}
                            disabled={selectedItems.length === 0}
                            className="w-full max-w-sm mx-auto bg-brand-dark text-white font-bold py-3 rounded-full text-lg mt-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-95"
                        >
                            أضف المحدد إلى السلة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};