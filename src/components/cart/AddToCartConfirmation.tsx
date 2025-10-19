import React, { useEffect } from 'react';
import { CartItem } from '../../types';
import { CloseIcon, CheckCircleIcon } from '../icons';

interface AddToCartConfirmationProps {
    item: CartItem;
    onClose: () => void;
    onViewCart: () => void;
}

export const AddToCartConfirmation: React.FC<AddToCartConfirmationProps> = ({ item, onClose, onViewCart }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-24 right-4 md:right-8 z-[90] w-full max-w-sm animate-slide-in-right">
            <div className="bg-surface rounded-lg shadow-2xl border border-brand-border/50">
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 text-brand-instock pt-0.5">
                            <CheckCircleIcon />
                        </div>
                        <div className="mr-3 w-0 flex-1">
                            <p className="text-sm font-bold text-brand-dark">تمت الإضافة إلى السلة!</p>
                            <div className="mt-2 flex items-center gap-3">
                                <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-md"/>
                                <div>
                                    <p className="text-sm font-semibold text-brand-dark line-clamp-1">{item.name}</p>
                                    <p className="text-xs text-brand-text-light">{item.selectedSize} / {item.selectedColor}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mr-auto flex-shrink-0 flex">
                            <button
                                onClick={onClose}
                                className="bg-transparent rounded-md inline-flex text-brand-text-light hover:text-brand-text"
                            >
                                <span className="sr-only">Close</span>
                                <CloseIcon size="sm" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-brand-subtle rounded-b-lg grid grid-cols-2 gap-3">
                    <button
                        onClick={onViewCart}
                        className="w-full bg-surface border border-brand-border text-brand-dark font-bold py-2 px-4 rounded-full text-sm hover:bg-brand-subtle transition-colors"
                    >
                        عرض السلة
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-brand-dark text-white font-bold py-2 px-4 rounded-full text-sm hover:bg-opacity-90 transition-colors"
                    >
                        متابعة التسوق
                    </button>
                </div>
            </div>
        </div>
    );
};
