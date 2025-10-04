import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBagIcon } from '../icons';
import { useAppState } from '../../state/AppState';

interface FloatingCartBubbleProps {
    isVisible: boolean;
    onBubbleClick: () => void;
}

export const FloatingCartBubble: React.FC<FloatingCartBubbleProps> = ({ isVisible, onBubbleClick }) => {
    const { cartCount } = useAppState();
    const [isCartAnimating, setIsCartAnimating] = useState(false);
    const prevCartCountRef = useRef(cartCount);

    useEffect(() => {
        if (cartCount > prevCartCountRef.current) {
            setIsCartAnimating(true);
            const timer = setTimeout(() => setIsCartAnimating(false), 500); // Match animation duration
            return () => clearTimeout(timer);
        }
        prevCartCountRef.current = cartCount;
    }, [cartCount]);

    if (!isVisible) {
        return null;
    }

    return (
        <button
            onClick={onBubbleClick}
            className={`fixed top-5 right-5 z-[60] bg-brand-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg animate-fade-in transform transition-transform hover:scale-110 ${isCartAnimating ? 'animate-cart-add' : ''}`}
            aria-label="عرض السلة"
        >
            <ShoppingBagIcon />
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-dark text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-brand-primary">
                    {cartCount}
                </span>
            )}
        </button>
    );
};
