
import React, { useMemo, useState } from 'react';
import { Product } from '../../types';
import { WishlistProductCard } from '../product/WishlistProductCard';
import { useAppState } from '../../state/AppState';
import { allProducts } from '../../data/products';
import { useToast } from '../../hooks/useToast';
import { ShoppingBagIcon, TrashIcon, CompareIcon, HeartIcon } from '../icons';

interface WishlistGridProps {
    navigateTo: (pageName: string, data?: Product) => void;
}

export const WishlistGrid: React.FC<WishlistGridProps> = ({ navigateTo }) => {
    const { state, dispatch } = useAppState();
    const { compareList, wishlist } = state;
    const addToast = useToast();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const wishlistItems: (Product & { note: string })[] = useMemo(() => {
        return state.wishlist.map(item => {
            const product = allProducts.find(p => p.id === item.id);
            return product ? { ...product, note: item.note } : null;
        }).filter((p): p is Product & { note: string } => p !== null);
    }, [state.wishlist]);


    const handleSelect = (productId: number) => {
        setSelectedIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === wishlistItems.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(wishlistItems.map(item => item.id));
        }
    };

    const handleBulkRemove = () => {
        selectedIds.forEach(id => {
            dispatch({ type: 'TOGGLE_WISHLIST', payload: id });
        });
        addToast(`${selectedIds.length} ${selectedIds.length > 1 ? 'منتجات' : 'منتج'} تمت إزالتها من قائمة الرغبات.`, 'success');
        setSelectedIds([]);
    };
    
    const handleBulkAddToCart = () => {
        selectedIds.forEach(id => {
            const product = wishlistItems.find(p => p.id === id);
            if (product) {
                dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1, selectedSize: product.sizes[0], selectedColor: product.colors[0] } });
                dispatch({ type: 'TOGGLE_WISHLIST', payload: id });
            }
        });
        addToast(`${selectedIds.length} ${selectedIds.length > 1 ? 'منتجات' : 'منتج'} تم نقلها إلى السلة.`, 'success');
        setSelectedIds([]);
    };
    
    const handleBulkAddToCompare = () => {
        const currentCompareCount = compareList.length;
        const availableSlots = 4 - currentCompareCount;
        const itemsToAdd = selectedIds.filter(id => !compareList.includes(id)).slice(0, availableSlots);
        
        if(itemsToAdd.length === 0) {
            addToast('العناصر المحددة موجودة بالفعل في المقارنة أو القائمة ممتلئة.', 'info');
            return;
        }

        itemsToAdd.forEach(id => {
            dispatch({ type: 'TOGGLE_COMPARE', payload: id });
        });

        addToast(`${itemsToAdd.length} ${itemsToAdd.length > 1 ? 'منتجات' : 'منتج'} أضيفت للمقارنة.`, 'success');
        setSelectedIds([]);
    };

    const handleUpdateNote = (productId: number, note: string) => {
        dispatch({ type: 'UPDATE_WISHLIST_NOTE', payload: { productId, note } });
        addToast('تم حفظ الملاحظة!', 'success');
    };

    const handleRemoveItem = (productId: number) => {
        dispatch({ type: 'TOGGLE_WISHLIST', payload: productId });
        addToast('تمت الإزالة من قائمة الرغبات.', 'success');
    };

    const handleAddToCart = (product: Product) => {
        dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1, selectedSize: product.sizes[0], selectedColor: product.colors[0] } });
        addToast(`${product.name} أضيف إلى السلة!`, 'success');
    };

    return (
        <>
            {wishlistItems.length > 0 ? (
                <>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="font-bold text-lg text-brand-dark">{wishlistItems.length} منتجات في قائمة رغباتك</h2>
                        <label className="flex items-center gap-2 font-semibold cursor-pointer p-2 rounded-md hover:bg-gray-100">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-brand-border text-brand-dark focus:ring-brand-dark"
                                checked={selectedIds.length === wishlistItems.length && wishlistItems.length > 0}
                                onChange={handleSelectAll}
                            />
                            <span>{selectedIds.length === wishlistItems.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}</span>
                        </label>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-24">
                        {wishlistItems.map(product => (
                            <WishlistProductCard 
                                key={product.id} 
                                product={product} 
                                navigateTo={navigateTo} 
                                onUpdateNote={handleUpdateNote}
                                isSelected={selectedIds.includes(product.id)}
                                onSelect={handleSelect}
                                onRemove={handleRemoveItem}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-brand-dark mb-2">قائمة رغباتك فارغة.</h2>
                    <p className="text-brand-text-light mb-6 max-w-xs mx-auto">أضف بعض المنتجات التي تعجبك هنا لتتبعها وشرائها لاحقًا.</p>
                    <button onClick={() => navigateTo('shop')} className="bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all active:scale-95">
                        اكتشف المنتجات
                    </button>
                </div>
            )}
            
            {selectedIds.length > 0 && (
                 <div className="fixed bottom-0 right-0 left-0 bg-white/90 backdrop-blur-sm shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40 animate-slide-in-up">
                    <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
                         <p className="font-bold text-brand-dark">{selectedIds.length} عنصر محدد</p>
                         <div className="flex items-center gap-3">
                             <button onClick={handleBulkRemove} className="flex items-center gap-2 font-semibold text-brand-sale hover:bg-brand-sale/10 py-2 px-4 rounded-full transition-colors"><TrashIcon size="sm"/> <span>إزالة</span></button>
                             <button onClick={handleBulkAddToCompare} className="flex items-center gap-2 font-semibold text-brand-dark hover:bg-brand-subtle py-2 px-4 rounded-full transition-colors"><CompareIcon size="sm"/> <span>مقارنة</span></button>
                             <button onClick={handleBulkAddToCart} className="flex items-center gap-2 font-bold text-white bg-brand-dark py-2 px-5 rounded-full hover:bg-opacity-90 transition-colors"><ShoppingBagIcon size="sm"/> <span>نقل إلى السلة</span></button>
                         </div>
                    </div>
                 </div>
            )}
        </>
    );
};
