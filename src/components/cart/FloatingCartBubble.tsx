import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBagIcon } from '../icons';
import { useAppState } from '../../state/AppState';

interface FloatingCartBubbleProps {
    onClick: () => void;
}

export const FloatingCartBubble: React.FC<FloatingCartBubbleProps> = ({ onClick }) => {
    const { cartCount } = useAppState();
    const [isCartAnimating, setIsCartAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const prevCartCountRef = useRef(cartCount);

    useEffect(() => {
        const handleScroll = () => {
            // Show bubble if scrolled down and there are items in the cart.
            setIsVisible(window.scrollY > 200 && cartCount > 0);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [cartCount]); // Re-evaluate when cart count changes (e.g., from 0 to 1)

    useEffect(() => {
        if (cartCount > prevCartCountRef.current) {
            // Animate if an item is added
            setIsCartAnimating(true);
            const timer = setTimeout(() => setIsCartAnimating(false), 500); // duration of 'cart-add' animation
            return () => clearTimeout(timer);
        }
        prevCartCountRef.current = cartCount;
    }, [cartCount]);

    if (!isVisible) {
        return null;
    }

    return (
        <button
            onClick={onClick}
            className={`fixed bottom-8 right-8 z-[60] bg-brand-primary text-brand-bg w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110
                animate-fade-in
                ${isCartAnimating ? 'animate-cart-add' : ''}`}
            aria-label={`View cart (${cartCount} items)`}
        >
            <ShoppingBagIcon size="lg" />
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-dark text-brand-bg text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold border-2 border-brand-bg">
                    {cartCount}
                </span>
            )}
        </button>
    );
};