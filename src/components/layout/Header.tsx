import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, UserIcon, HeartIcon, ChevronDownIcon, ShoppingBagIcon, Bars3Icon, CompareIcon, SparklesIcon } from '../icons';
import { useAppState } from '../../state/AppState';

interface HeaderProps {
    navigateTo: (pageName: string, data?: any) => void;
    setIsCartOpen: (isOpen: boolean) => void;
    setIsMenuOpen: (isOpen: boolean) => void;
    setIsSearchOpen: (isOpen: boolean) => void;
    setIsCompareOpen: (isOpen: boolean) => void;
}

export const Header = ({ navigateTo, setIsCartOpen, setIsMenuOpen, setIsSearchOpen, setIsCompareOpen }: HeaderProps) => {
    const { state, cartCount } = useAppState();
    const { currentUser, wishlist, compareList } = state;
    const [isCartAnimating, setIsCartAnimating] = useState(false);
    const prevCartCountRef = useRef(cartCount);

    const wishlistCount = wishlist.length;
    const compareCount = compareList.length;

    useEffect(() => {
        if (cartCount > prevCartCountRef.current) {
            setIsCartAnimating(true);
            const timer = setTimeout(() => setIsCartAnimating(false), 500); // Match animation duration
            return () => clearTimeout(timer);
        }
        prevCartCountRef.current = cartCount;
    }, [cartCount]);

    // Static classes for a white, sticky header that matches the screenshot
    const headerClasses = `sticky top-0 z-50 bg-white border-b border-gray-200`;
    const innerContainerHeight = 'h-20';
    const textColorClass = 'text-brand-dark';
    const iconButtonClasses = `relative p-2 rounded-full transition-all hover:bg-gray-100 active:scale-90 ${textColorClass}`;
    const badgeClasses = "absolute -top-1 -right-1 bg-brand-sale text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold";
    
    const navLinks = [
        { label: 'الرئيسية', page: 'home', hasDropdown: true },
        { label: 'المتجر', page: 'shop', hasDropdown: true },
        { label: 'المنتجات', page: 'shop', hasDropdown: true },
        { label: 'المدونة', page: 'blog', hasDropdown: true },
        { label: 'المصمم الذكي', page: 'style-me', isNew: true },
        { label: 'الصفحات', page: 'faq', hasDropdown: true },
    ];
    
    const buyThemeButtonClasses = 'bg-transparent border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white transition-all active:scale-95';


    return (
        <header className={headerClasses}>
            <div className="container mx-auto px-4">
                <div className={`flex justify-between items-center ${innerContainerHeight}`}>
                   
                    {/* --- Mobile Header --- */}
                    <div className="lg:hidden grid grid-cols-3 items-center w-full">
                        {/* Right Side: Hamburger Menu */}
                        <div className="flex items-center justify-start">
                             <button onClick={() => setIsMenuOpen(true)} className={iconButtonClasses} aria-label="Menu">
                                <Bars3Icon size="md" />
                            </button>
                        </div>
                        
                        {/* Center: Logo */}
                        <div className="text-center">
                            <button onClick={() => navigateTo('home')} className={`font-sans font-bold ${textColorClass} text-4xl tracking-wider`}>
                                Vineta
                            </button>
                        </div>

                        {/* Left Side: Cart & Search */}
                        <div className="flex items-center justify-end gap-1">
                             <button onClick={() => setIsCartOpen(true)} className={`${iconButtonClasses} ${isCartAnimating ? 'animate-cart-add' : ''}`} aria-label="Cart">
                                <ShoppingBagIcon size="md" />
                                {cartCount > 0 && <span className={badgeClasses}>{cartCount}</span>}
                            </button>
                            <button onClick={() => setIsSearchOpen(true)} className={iconButtonClasses} aria-label="Search">
                               <SearchIcon size="md" />
                            </button>
                        </div>
                    </div>

                    {/* --- Desktop Header --- */}
                     <div className="hidden lg:flex justify-between items-center w-full">
                        <div>
                             <button onClick={() => navigateTo('home')} className={`font-sans font-bold ${textColorClass} text-4xl tracking-wider`}>
                                Vineta
                            </button>
                        </div>

                        <nav className="flex justify-center items-center gap-6">
                           {navLinks.map(link => (
                               <button 
                                   key={link.label} 
                                   onClick={() => navigateTo(link.page)} 
                                   className={`font-semibold pb-1 flex items-center gap-1.5 nav-link transition-colors ${textColorClass}`}
                                >
                                   <span>{link.label}</span>
                                   {link.isNew && <SparklesIcon className="w-4 h-4 text-yellow-400 animate-pulse"/>}
                                   {link.hasDropdown && <ChevronDownIcon size="sm" />}
                               </button>
                           ))}
                           <button onClick={() => navigateTo('home')} className={`font-bold py-2 px-5 rounded-full text-sm duration-300 ${buyThemeButtonClasses}`}>
                               !شراء الثيم
                           </button>
                        </nav>
                        
                        <div className="flex items-center justify-end gap-2">
                             <button onClick={() => navigateTo('wishlist')} className={iconButtonClasses} aria-label="Wishlist">
                                <HeartIcon />
                                {wishlistCount > 0 && <span className={badgeClasses}>{wishlistCount}</span>}
                            </button>
                            <button onClick={() => setIsCompareOpen(true)} className={iconButtonClasses} aria-label="Compare">
                                <CompareIcon />
                                {compareCount > 0 && <span className={badgeClasses}>{compareCount}</span>}
                            </button>
                            <button onClick={() => setIsCartOpen(true)} className={`${iconButtonClasses} ${isCartAnimating ? 'animate-cart-add' : ''}`} aria-label="Cart">
                                <ShoppingBagIcon />
                                {cartCount > 0 && <span className={badgeClasses}>{cartCount}</span>}
                            </button>
                             <button onClick={() => navigateTo(currentUser ? 'account' : 'login')} className={iconButtonClasses} aria-label="Account">
                                <UserIcon />
                            </button>
                             <button onClick={() => setIsSearchOpen(true)} className={iconButtonClasses} aria-label="Search">
                               <SearchIcon />
                            </button>
                        </div>
                     </div>

                </div>
            </div>
        </header>
    );
};
