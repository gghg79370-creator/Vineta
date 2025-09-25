import React from 'react';
import { HomeIcon, UserIcon, ShopIcon, HeartIcon, ShoppingBagIcon } from '../icons';
import { User } from '../../types';

interface MobileBottomNavProps {
    navigateTo: (pageName: string) => void;
    activePage: string;
    cartCount: number;
    wishlistCount: number;
    setIsCartOpen: (isOpen: boolean) => void;
    isCartOpen: boolean;
    currentUser: User | null;
}

export const MobileBottomNav = ({ navigateTo, activePage, cartCount, wishlistCount, setIsCartOpen, isCartOpen, currentUser }: MobileBottomNavProps) => (
    <footer className="fixed bottom-0 right-0 left-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:hidden z-40 rounded-t-2xl border-t">
        <nav className="flex justify-around items-center h-20">
            <button onClick={() => navigateTo('home')} className={`flex flex-col items-center gap-1 transition-colors ${activePage === 'home' ? 'text-brand-primary' : 'text-brand-text-light'}`}>
                <HomeIcon/> <span className="text-xs font-bold">الرئيسية</span>
            </button>
            <button onClick={() => navigateTo(currentUser ? 'account' : 'login')} className={`flex flex-col items-center gap-1 transition-colors ${activePage === 'account' || activePage === 'login' ? 'text-brand-primary' : 'text-brand-text-light'}`}>
                <UserIcon/> <span className="text-xs font-bold">حسابي</span>
            </button>
            <button onClick={() => navigateTo('shop')} className={`flex flex-col items-center gap-1 transition-colors ${activePage === 'shop' ? 'text-brand-primary' : 'text-brand-text-light'}`}>
                <ShopIcon/> <span className="text-xs font-bold">المتجر</span>
            </button>
            <button onClick={() => navigateTo('wishlist')} className={`flex flex-col items-center gap-1 relative transition-colors ${activePage === 'wishlist' ? 'text-brand-primary' : 'text-brand-text-light'}`}>
                <HeartIcon/> <span className="text-xs font-bold">الرغبات</span>
                {wishlistCount > 0 && <span className="absolute -top-1 right-1 bg-brand-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{wishlistCount}</span>}
            </button>
            <button onClick={() => setIsCartOpen(true)} className={`flex flex-col items-center gap-1 relative transition-colors ${(activePage === 'cart' || isCartOpen) ? 'text-brand-primary' : 'text-brand-text-light'}`}>
                <ShoppingBagIcon/> <span className="text-xs font-bold">السلة</span>
                 {cartCount > 0 && <span className="absolute -top-1 right-1 bg-brand-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{cartCount}</span>}
            </button>
        </nav>
    </footer>
);
