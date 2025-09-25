import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import { PlusIcon } from '../icons';

interface FrequentlyBoughtTogetherProps {
    mainProduct: Product;
    otherProducts: Product[];
    addToCart: (product: Product, options?: { quantity?: number }) => void;
}

export const FrequentlyBoughtTogether = ({ mainProduct, otherProducts, addToCart }: FrequentlyBoughtTogetherProps) => {
    const allItems = useMemo(() => [mainProduct, ...otherProducts.slice(1, 3)], [mainProduct, otherProducts]);
    const [selectedIds, setSelectedIds] = useState<number[]>(allItems.map(p => p.id));

    const handleToggleItem = (productId: number) => {
        setSelectedIds(prev =>
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    };

    const selectedItems = useMemo(() => allItems.filter(item => selectedIds.includes(item.id)), [allItems, selectedIds]);
    const totalPrice = useMemo(() => selectedItems.reduce((acc, item) => acc + parseFloat(item.price), 0), [selectedItems]);

    const handleAddAllToCart = () => {
        if (selectedItems.length === 0) return;
        selectedItems.forEach(item => {
            addToCart(item, { quantity: 1 });
        });
    };

    return (
        <div className="py-16 bg-brand-subtle">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-2xl font-bold text-center text-brand-dark mb-8">يُشترى معًا بشكل متكرر</h2>
                <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
                    <div className="space-y-4">
                        {allItems.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        id={`item-${item.id}`}
                                        checked={selectedIds.includes(item.id)}
                                        onChange={() => handleToggleItem(item.id)}
                                        className="w-5 h-5 rounded text-brand-dark focus:ring-brand-dark border-brand-border flex-shrink-0"
                                    />
                                    <label htmlFor={`item-${item.id}`} className="flex items-center justify-between gap-4 cursor-pointer flex-1">
                                        <div className="flex items-center gap-4">
                                            <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-md" />
                                            <div>
                                                <p className="font-semibold text-brand-dark">{item.name}</p>
                                                <p className="text-sm text-brand-text-light">{item.brand}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-brand-dark">{item.price} ج.م</p>
                                    </label>
                                </div>
                                {index < allItems.length - 1 && (
                                    <div className="pl-9">
                                        <PlusIcon className="w-5 h-5 text-brand-text-light" />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="border-t mt-6 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-lg">السعر الإجمالي:</span>
                            <span className="font-extrabold text-2xl text-brand-dark">{totalPrice.toFixed(2)} ج.م</span>
                        </div>
                        <button
                            onClick={handleAddAllToCart}
                            disabled={selectedItems.length === 0}
                            className="w-full bg-white border border-brand-border text-brand-dark font-bold py-3 rounded-full hover:bg-brand-subtle disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            أضف المحدد إلى السلة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};