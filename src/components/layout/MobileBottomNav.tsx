import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../../state/AppState';

interface MobileBottomNavProps {
    navigateTo: (pageName: string) => void;
    activePage: string;
    setIsCartOpen: (isOpen: boolean) => void;
    isCartOpen: boolean;
}

export const MobileBottomNav = ({ 
    navigateTo, 
    activePage, 
    setIsCartOpen, 
    isCartOpen, 
}: MobileBottomNavProps) => {
    const { state, cartCount } = useAppState();
    const { currentUser, wishlist } = state;
    const [isCartAnimating, setIsCartAnimating] = useState(false);
    const prevCartCountRef = useRef(cartCount);

    useEffect(() => {
        if (cartCount > prevCartCountRef.current) {
            setIsCartAnimating(true);
            const timer = setTimeout(() => setIsCartAnimating(false), 500); // Match animation duration from Header.tsx
            return () => clearTimeout(timer);
        }
        prevCartCountRef.current = cartCount;
    }, [cartCount]);

    const wishlistCount = wishlist.length;

    const navItems = [
        { 
            id: 'home', 
            label: 'الرئيسية', 
            icon: 'fa-solid fa-house', 
            isActive: activePage === 'home',
            onClick: () => navigateTo('home')
        },
        { 
            id: 'shop', 
            label: 'المتجر', 
            icon: 'fa-solid fa-store', 
            isActive: activePage === 'shop',
            onClick: () => navigateTo('shop')
        },
        { 
            id: 'wishlist', 
            label: 'الرغبات', 
            icon: 'fa-solid fa-heart', 
            isActive: activePage === 'wishlist',
            onClick: () => navigateTo('wishlist'),
            count: wishlistCount
        },
        { 
            id: 'account', 
            label: 'حسابي', 
            icon: 'fa-solid fa-user', 
            isActive: activePage === 'account' || activePage === 'login',
            onClick: () => navigateTo(currentUser ? 'account' : 'login')
        },
        { 
            id: 'cart', 
            label: 'السلة', 
            icon: 'fa-solid fa-cart-shopping', 
            isActive: activePage === 'cart' || isCartOpen,
            onClick: () => setIsCartOpen(true),
            count: cartCount
        },
    ];

    return (
        <footer className="fixed bottom-0 right-0 left-0 bg-brand-bg shadow-[0_-4px_15px_rgba(0,0,0,0.08)] lg:hidden z-40 h-20 border-t border-brand-border/50">
            <nav className="flex justify-around items-center h-full">
                {navItems.map(item => {
                    const isActive = item.isActive;
                    return (
                        <button 
                            key={item.id} 
                            onClick={item.onClick} 
                            className={`flex flex-col items-center justify-center gap-1 transition-colors duration-200 relative w-16 h-full
                                ${isActive ? 'text-brand-dark' : 'text-brand-text-light'}
                                active:scale-95 ${item.id === 'cart' && isCartAnimating ? 'animate-cart-add' : ''}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <div className="relative">
                                <i className={`${item.icon} text-2xl w-6 text-center`} aria-hidden="true"></i>
                                {item.count !== undefined && item.count > 0 && (
                                    <span className="absolute -top-1.5 -right-2.5 bg-brand-sale text-brand-bg text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                        {item.count}
                                    </span>
                                )}
                            </div>
                            <span className={`text-xs font-bold`}>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </footer>
    );
};