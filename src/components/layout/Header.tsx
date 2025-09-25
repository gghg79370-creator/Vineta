import React from 'react';
import { SearchIcon, UserIcon, HeartIcon, ChevronDownIcon, ShoppingBagIcon, CompareIcon } from '../icons';
import { allProducts } from '../../data/products';
import { User } from '../../types';

interface HeaderProps {
    navigateTo: (pageName: string, data?: any) => void;
    cartCount: number;
    wishlistCount: number;
    compareCount: number;
    setIsCartOpen: (isOpen: boolean) => void;
    setIsMenuOpen: (isOpen: boolean) => void;
    setIsSearchOpen: (isOpen: boolean) => void;
    setIsCompareOpen: (isOpen: boolean) => void;
    currentUser: User | null;
}

export const Header = ({ navigateTo, cartCount, wishlistCount, compareCount, setIsCartOpen, setIsMenuOpen, setIsSearchOpen, setIsCompareOpen, currentUser }: HeaderProps) => {

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-brand-border">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Hamburger Menu (Mobile) */}
                    <div className="lg:hidden">
                        <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2 rounded-full text-brand-dark" aria-label="Open menu">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        </button>
                    </div>

                    {/* Logo */}
                     <div className="lg:hidden absolute left-1/2 -translate-x-1/2">
                         <button onClick={() => navigateTo('home')} className="text-3xl font-bold text-brand-dark">Vineta</button>
                    </div>

                    <div className="hidden lg:flex items-center gap-10">
                        <button onClick={() => navigateTo('home')} className="text-3xl font-bold text-brand-dark">Vineta</button>
                        <nav className="hidden lg:flex gap-8 font-semibold text-brand-dark text-base">
                            <button onClick={() => navigateTo('home')} className="hover:text-brand-primary transition-colors">الرئيسية</button>
                            <button onClick={() => navigateTo('shop')} className="hover:text-brand-primary transition-colors">المتجر</button>
                            <button onClick={() => navigateTo('product', allProducts[0])} className="hover:text-brand-primary transition-colors">المنتجات</button>
                            <button onClick={() => navigateTo('faq')} className="hover:text-brand-primary transition-colors">صفحات</button>
                            <button onClick={() => navigateTo('home')} className="hover:text-brand-primary transition-colors">المدونة</button>
                            <button onClick={() => navigateTo('home')} className="font-extrabold text-brand-primary hover:text-opacity-80 transition-colors">اشترِ السمة!</button>
                        </nav>
                    </div>
                   

                    {/* Action Icons */}
                    <div className="flex items-center gap-3 sm:gap-6">
                        <div className="flex items-center gap-3 sm:gap-4 text-brand-dark">
                            {currentUser?.isAdmin && <button onClick={() => navigateTo('admin')} className="hidden sm:block font-bold text-sm bg-brand-subtle px-3 py-1.5 rounded-md hover:bg-brand-border">Admin</button>}
                            <button onClick={() => setIsSearchOpen(true)} aria-label="Search"><SearchIcon/></button>
                            <button onClick={() => navigateTo(currentUser ? 'account' : 'login')} className="hidden sm:block" aria-label="Account"><UserIcon/></button>
                            <button onClick={() => setIsCompareOpen(true)} className="relative hidden sm:block" aria-label="Compare Products">
                                <CompareIcon />
                                {compareCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{compareCount}</span>}
                            </button>
                            <button onClick={() => navigateTo('wishlist')} className="relative" aria-label="Wishlist">
                                <HeartIcon/>
                                {wishlistCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{wishlistCount}</span>}
                            </button>
                            <button onClick={() => setIsCartOpen(true)} className="relative" aria-label="Cart">
                                <ShoppingBagIcon/>
                                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cartCount}</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};