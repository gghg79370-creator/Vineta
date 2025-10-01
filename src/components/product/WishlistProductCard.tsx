import React, { useState } from 'react';
import { Product } from '../../types';
import { PencilIcon, ShoppingBagIcon } from '../icons';

interface ProductCardProps {
    product: Product & { note: string };
    navigateTo: (pageName: string, data?: Product) => void;
    onUpdateNote: (productId: number, note: string) => void;
    isSelected: boolean;
    onSelect: (productId: number) => void;
}

export const WishlistProductCard: React.FC<ProductCardProps> = ({ 
    product, 
    navigateTo, 
    onUpdateNote,
    isSelected,
    onSelect
}) => {
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [noteText, setNoteText] = useState(product.note || '');

    const handleSaveNote = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdateNote(product.id, noteText);
        setIsEditingNote(false);
    };

    const handleNoteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditingNote(true);
        setNoteText(product.note || '');
    };
    
    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent navigation
        onSelect(product.id);
    };
    
    const moveToCart = (product: Product) => {
        // This is a placeholder as the bulk action is primary.
        // However, a single "move to cart" is still a useful shortcut.
        // This functionality needs to be passed down or handled differently if we want it.
        // For now, we will rely on the bulk action bar.
    };

    const handleMoveToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Since moveToCart is not passed, this button will be removed or disabled.
        // Let's implement this as a quick-add, which doesn't remove from wishlist,
        // to keep it simple and aligned with removing page-level actions from the card.
    };

    return (
        <div 
            onClick={() => onSelect(product.id)}
            className={`group text-center bg-white rounded-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-lg h-full flex flex-col transform hover:-translate-y-1 relative cursor-pointer ${isSelected ? 'border-brand-primary' : 'border-white'}`}
        >
            <div 
                className="absolute top-3 right-3 z-10 w-5 h-5"
                onClick={handleCheckboxClick}
            >
                <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                />
            </div>
            
            <div className="relative overflow-hidden" onClick={(e) => { e.stopPropagation(); navigateTo('product', product)}}>
                <div className="bg-gray-100 aspect-[3/4]">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow" onClick={(e) => { e.stopPropagation(); navigateTo('product', product)}}>
                <p className="font-semibold md:font-bold text-sm md:text-base text-brand-dark truncate mb-1 md:mb-2 flex-grow">{product.name}</p>
                <div className="flex justify-center items-baseline gap-2">
                    <span className="font-bold text-base text-brand-primary">{product.price} ج.م</span>
                    {product.oldPrice && <span className="line-through text-gray-400 text-xs">{product.oldPrice} ج.م</span>}
                </div>
            </div>

            <div className="px-4 pb-4 mt-auto">
                {isEditingNote ? (
                    <div className="space-y-2 text-left" onClick={e => e.stopPropagation()}>
                        <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="أضف ملاحظة..."
                            className="w-full text-sm border-gray-200 rounded-md p-2 focus:ring-brand-primary focus:border-brand-primary resize-none"
                            rows={2}
                            autoFocus
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSaveNote(e as any);
                                }
                            }}
                        />
                        <div className="flex gap-2">
                             <button onClick={handleSaveNote} className="flex-1 text-xs bg-brand-dark text-white rounded-full py-1.5 font-semibold transition-transform active:scale-95">حفظ</button>
                             <button onClick={(e) => { e.stopPropagation(); setIsEditingNote(false); }} className="flex-1 text-xs bg-gray-200 text-gray-700 rounded-full py-1.5 font-semibold transition-transform active:scale-95">إلغاء</button>
                        </div>
                    </div>
                ) : (
                    <div onClick={handleNoteClick} className="text-sm p-2 rounded-lg hover:bg-gray-50 cursor-pointer text-right">
                        {product.note ? (
                             <div className="flex justify-between items-center">
                                <p className="text-gray-500 italic truncate pr-2" title={product.note}>"{product.note}"</p>
                                <PencilIcon size="sm" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </div>
                        ) : (
                            <div className="flex justify-between items-center text-gray-400">
                                <span>أضف ملاحظة</span>
                                <PencilIcon size="sm" className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};