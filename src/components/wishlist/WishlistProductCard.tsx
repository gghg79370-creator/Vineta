import React, { useState } from 'react';
import { Product } from '../../types';
import { PencilIcon, ShoppingBagIcon, TrashIcon } from '../icons';

interface ProductCardProps {
    product: Product & { note: string };
    navigateTo: (pageName: string, data?: Product) => void;
    onUpdateNote: (productId: number, note: string) => void;
    isSelected: boolean;
    onSelect: (productId: number) => void;
    onRemove: (productId: number) => void;
    onAddToCart: (product: Product) => void;
}

export const WishlistProductCard: React.FC<ProductCardProps> = ({ 
    product, 
    navigateTo, 
    onUpdateNote,
    isSelected,
    onSelect,
    onRemove,
    onAddToCart
}) => {
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [noteText, setNoteText] = useState(product.note || '');

    const handleSaveNote = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
        onUpdateNote(product.id, noteText);
        setIsEditingNote(false);
    };

    const handleNoteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditingNote(true);
    };
    
    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent navigation
        onSelect(product.id);
    };

    const handleRemoveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(product.id);
    };

    const handleAddToCartClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddToCart(product);
    };
    
    const isOutOfStock = product.itemsLeft === 0 || product.availability !== 'متوفر';

    return (
        <div 
            onClick={() => onSelect(product.id)}
            className={`group text-center bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 h-full flex flex-col cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 ${isSelected ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200'}`}
        >
            <div className="relative overflow-hidden">
                <div 
                    onClick={(e) => { e.stopPropagation(); navigateTo('product', product)}}
                    className="bg-gray-100 aspect-[3/4]"
                >
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
                </div>
                
                <div 
                    className="absolute top-3 right-3 z-20"
                    onClick={handleCheckboxClick}
                >
                    <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="h-5 w-5 rounded-md border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer shadow-sm"
                    />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 md:flex flex-col items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden">
                    {product.description && (
                        <p className="text-white text-xs mb-3 text-center line-clamp-3">{product.description}</p>
                    )}
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={handleAddToCartClick} disabled={isOutOfStock} className="bg-white/90 text-brand-dark rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:bg-brand-primary hover:text-white transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Add to Cart">
                            <ShoppingBagIcon />
                        </button>
                        <button onClick={handleRemoveClick} className="bg-white/90 text-brand-dark rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:bg-brand-sale hover:text-white transition-all transform hover:scale-110" aria-label="Remove from Wishlist">
                            <TrashIcon />
                        </button>
                    </div>
                </div>

                {isOutOfStock && (
                    <div className="absolute top-3 left-3 bg-brand-text text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        نفد المخزون
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div onClick={(e) => { e.stopPropagation(); navigateTo('product', product)}}>
                    <p className="font-semibold md:font-bold text-sm md:text-base text-brand-dark truncate mb-1 md:mb-2">{product.name}</p>
                    <div className="flex justify-center items-baseline gap-2">
                        <span className="font-bold text-base text-brand-primary">{product.price} ج.م</span>
                        {product.oldPrice && <span className="line-through text-gray-400 text-xs">{product.oldPrice} ج.م</span>}
                    </div>
                </div>

                <div className="mt-4 flex md:hidden items-center gap-2">
                    <button onClick={handleAddToCartClick} disabled={isOutOfStock} className="flex-1 bg-brand-dark text-white font-bold py-2 rounded-full text-sm flex items-center justify-center gap-1.5 hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:bg-gray-400">
                        <ShoppingBagIcon size="sm" />
                        <span>أضف للسلة</span>
                    </button>
                    <button onClick={handleRemoveClick} className="bg-gray-200 text-gray-600 p-2.5 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors">
                        <TrashIcon size="sm" />
                    </button>
                </div>
            </div>

            <div className="px-4 pb-4 mt-auto border-t pt-3 mx-4">
                {isEditingNote ? (
                    <div className="text-left" onClick={e => e.stopPropagation()}>
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
                                    handleSaveNote(e);
                                }
                            }}
                        />
                        <div className="flex gap-2 mt-2">
                             <button onClick={handleSaveNote} className="flex-1 text-xs bg-brand-dark text-white rounded-full py-1.5 font-semibold transition-transform active:scale-95">حفظ</button>
                             <button onClick={(e) => { e.stopPropagation(); setIsEditingNote(false); }} className="flex-1 text-xs bg-gray-200 text-gray-700 rounded-full py-1.5 font-semibold transition-transform active:scale-95">إلغاء</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={handleNoteClick} className="w-full text-sm p-2 rounded-lg hover:bg-gray-50 text-right">
                        {product.note ? (
                             <div className="flex justify-between items-center gap-2">
                                <p className="text-gray-600 italic text-xs line-clamp-2" title={product.note}>"{product.note}"</p>
                                <PencilIcon size="sm" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </div>
                        ) : (
                            <div className="flex justify-between items-center text-gray-400">
                                <span className="text-xs">أضف ملاحظة</span>
                                <PencilIcon size="sm" className="w-4 h-4" />
                            </div>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};