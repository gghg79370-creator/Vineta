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
            id: 'account', 
            label: 'حسابي', 
            icon: 'fa-solid fa-user', 
            isActive: activePage === 'account' || activePage === 'login',
            onClick: () => navigateTo(currentUser ? 'account' : 'login')
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
            id: 'cart', 
            label: 'السلة', 
            icon: 'fa-solid fa-cart-shopping', 
            isActive: activePage === 'cart' || isCartOpen,
            onClick: () => setIsCartOpen(true),
            count: cartCount
        },
    ];

    return (
        <footer className="fixed bottom-0 right-0 left-0 bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.08)] lg:hidden z-40 rounded-t-2xl border-t border-brand-border/50 h-16">
            <nav className="flex justify-around items-start pt-2 h-full">
                {navItems.map(item => {
                    const isActive = item.isActive;
                    return (
                        <button 
                            key={item.id} 
                            onClick={item.onClick} 
                            className={`flex flex-col items-center gap-1 transition-all duration-300 ease-out relative w-16
                                ${isActive ? 'text-brand-primary' : 'text-brand-text-light'}
                                active:scale-95 ${item.id === 'cart' && isCartAnimating ? 'animate-cart-add' : ''}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <div className={`relative w-12 h-8 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-brand-primary/10' : ''}`}>
                                <i className={`${item.icon} text-xl w-6 text-center`} aria-hidden="true"></i>
                                {item.count && item.count > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-brand-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                        {item.count}
                                    </span>
                                )}
                            </div>
                            <span className={`text-xs transition-all duration-300 ${isActive ? 'font-extrabold' : 'font-bold'}`}>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </footer>
    );
};