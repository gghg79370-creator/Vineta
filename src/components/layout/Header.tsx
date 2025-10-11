import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, UserIcon, HeartIcon, ChevronDownIcon, ShoppingBagIcon, Bars3Icon, CompareIcon, SparklesIcon, MoonIcon, SunIcon } from '../icons';
import { useAppState } from '../../state/AppState';

interface HeaderProps {
    navigateTo: (pageName: string, data?: any) => void;
    setIsCartOpen: (isOpen: boolean) => void;
    setIsMenuOpen: (isOpen: boolean) => void;
    setIsSearchOpen: (isOpen: boolean) => void;
    setIsCompareOpen: (isOpen: boolean) => void;
    setThemeMode: (mode: 'light' | 'dark') => void;
    themeMode: 'light' | 'dark';
    activePage: string;
}

export const Header = ({ navigateTo, setIsCartOpen, setIsMenuOpen, setIsSearchOpen, setIsCompareOpen, setThemeMode, themeMode, activePage }: HeaderProps) => {
    const { state, cartCount } = useAppState();
    const { currentUser, wishlist, compareList, theme } = state;
    const [isCartAnimating, setIsCartAnimating] = useState(false);
    const prevCartCountRef = useRef(cartCount);
    
    const [isScrolled, setIsScrolled] = useState(false);
    const isHomePage = activePage === 'home';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        if (isHomePage) {
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll(); // check on mount
            return () => window.removeEventListener('scroll', handleScroll);
        } else {
            setIsScrolled(true);
        }
    }, [isHomePage]);

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

    const toggleTheme = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    };
    
    const isOpaque = !isHomePage || isScrolled;
    
    const headerClasses = `sticky top-0 z-50 transition-all duration-300 ${isOpaque ? 'bg-brand-bg shadow-md' : 'bg-transparent'}`;
    const innerContainerHeight = 'h-20';
    
    const textColorClass = isOpaque ? 'text-brand-dark' : 'text-white';
    const iconColorClass = isOpaque ? 'text-brand-text' : 'text-white';
    const logoColorClass = isOpaque ? 'text-brand-dark' : 'text-white';
    const badgeBorderClass = isOpaque ? 'border-brand-bg' : 'border-transparent';
    
    const iconButtonClasses = `relative p-2 rounded-full transition-all active:scale-90 ${iconColorClass} hover:bg-black/10`;
    const badgeClasses = `absolute -top-1 -right-1 bg-brand-sale text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 ${badgeBorderClass}`;
    
    const navLinks = [
        { label: 'الرئيسية', page: 'home', hasDropdown: true },
        { label: 'المتجر', page: 'shop', hasDropdown: true },
        { label: 'المنتجات', page: 'shop', hasDropdown: true },
        { label: 'المدونة', page: 'blog', hasDropdown: true },
        { label: 'المصمم الذكي', page: 'style-me', isNew: true },
        { label: 'الصفحات', page: 'faq', hasDropdown: true },
    ];
    
    const buyThemeButtonClasses = isOpaque
        ? 'bg-transparent border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white'
        : 'bg-white/20 border border-white/50 text-white hover:bg-white hover:text-brand-dark';

    return (
        <header className={headerClasses}>
            <div className="container mx-auto px-4">
                <div className={`flex justify-between items-center ${innerContainerHeight}`}>
                   
                    <div className="flex items-center gap-2 lg:gap-4">
                        <button onClick={() => setIsMenuOpen(true)} className={`${iconButtonClasses} lg:hidden`} aria-label="Menu">
                            <Bars3Icon size="md" />
                        </button>
                        <button onClick={() => navigateTo('home')} className="flex-shrink-0">
                             <span className={`font-serif text-3xl md:text-4xl font-bold logo-glow ${logoColorClass}`}>
                                {theme.siteName}
                            </span>
                        </button>
                    </div>

                    <nav className="hidden lg:flex justify-center items-center gap-6">
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
                       <button onClick={() => navigateTo('home')} className={`font-bold py-2 px-5 rounded-full text-sm transition-colors duration-300 border ${buyThemeButtonClasses}`}>
                           !شراء الثيم
                       </button>
                    </nav>
                    
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                        <button onClick={toggleTheme} className={iconButtonClasses} aria-label="Toggle theme">
                            {themeMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                         <button onClick={() => setIsSearchOpen(true)} className={iconButtonClasses} aria-label="Search">
                           <SearchIcon />
                        </button>
                         <button onClick={() => navigateTo(currentUser ? 'account' : 'login')} className={iconButtonClasses} aria-label="Account">
                            <UserIcon />
                        </button>
                         <button onClick={() => navigateTo('wishlist')} className={`${iconButtonClasses} hidden md:flex`} aria-label="Wishlist">
                            <HeartIcon />
                            {wishlistCount > 0 && <span className={badgeClasses}>{wishlistCount}</span>}
                        </button>
                        <button onClick={() => setIsCompareOpen(true)} className={`${iconButtonClasses} hidden md:flex`} aria-label="Compare">
                            <CompareIcon />
                            {compareCount > 0 && <span className={badgeClasses}>{compareCount}</span>}
                        </button>
                        <button onClick={() => setIsCartOpen(true)} className={`${iconButtonClasses} ${isCartAnimating ? 'animate-cart-add' : ''}`} aria-label="Cart">
                            <ShoppingBagIcon />
                            {cartCount > 0 && <span className={badgeClasses}>{cartCount}</span>}
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
};