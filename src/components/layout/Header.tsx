

import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, UserIcon, HeartIcon, ChevronDownIcon, ShoppingBagIcon, Bars3Icon, CompareIcon, SparklesIcon, MoonIcon, SunIcon, MagicIcon } from '../icons';
import { useAppState } from '../../state/AppState';

interface HeaderProps {
    navigateTo: (pageName: string, data?: any) => void;
    setIsCartOpen: (isOpen: boolean) => void;
    setIsMenuOpen: (isOpen: boolean) => void;
    setIsSearchOpen: (isOpen: boolean) => void;
    setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
    themeMode: 'light' | 'dark' | 'system';
    effectiveThemeMode: 'light' | 'dark';
    activePage: string;
}

export const Header = ({ navigateTo, setIsCartOpen, setIsMenuOpen, setIsSearchOpen, setThemeMode, themeMode, effectiveThemeMode, activePage }: HeaderProps) => {
    const { state, cartCount } = useAppState();
    const { currentUser, wishlist, compareList, theme } = state;
    const [isCartAnimating, setIsCartAnimating] = useState(false);
    const prevCartCountRef = useRef(cartCount);
    
    const [isScrolled, setIsScrolled] = useState(false);
    const isHomePage = activePage === 'home';

    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
    const themeDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
                setIsThemeDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // check on mount
        return () => window.removeEventListener('scroll', handleScroll);
        
    }, [activePage]);

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
    
    const isOpaque = isScrolled || !isHomePage;
    
    const headerClasses = `sticky top-0 z-50 transition-all duration-300 ${isOpaque ? 'header-scrolled shadow-sm' : 'bg-transparent'}`;
    const innerContainerHeight = 'h-20';
    
    const textColorClass = isOpaque ? 'text-brand-dark' : 'text-white';
    const iconColorClass = isOpaque ? 'text-brand-text' : 'text-white';
    const logoColorClass = isOpaque ? 'text-brand-dark' : 'text-white';
    const badgeBorderClass = isOpaque ? 'border-brand-bg' : 'border-white';
    
    const iconButtonClasses = `relative p-2 rounded-full transition-all active:scale-90 ${iconColorClass} hover:bg-black/10`;
    const badgeClasses = `absolute -top-1 -right-1 bg-brand-sale text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 ${badgeBorderClass}`;
    
    const navLinks = [
        { label: 'الرئيسية', page: 'home' },
        {
            label: 'المتجر',
            page: 'shop',
            megaMenu: {
                categories: [
                    {
                        title: 'ملابس نسائية',
                        items: [
                            { label: 'الكل', page: 'shop', data: { categories: 'women' } },
                            { label: 'فساتين', page: 'shop', data: { categories: 'women', tags: 'فستان' } },
                            { label: 'بلوزات', page: 'shop', data: { categories: 'women', tags: 'بلوزة' } },
                            { label: 'بناطيل', page: 'shop', data: { categories: 'women', tags: 'بنطلون' } },
                            { label: 'تنانير', page: 'shop', data: { categories: 'women', tags: 'تنورة' } },
                        ]
                    },
                    {
                        title: 'ملابس رجالية',
                        items: [
                            { label: 'الكل', page: 'shop', data: { categories: 'men' } },
                            { label: 'قمصان', page: 'shop', data: { categories: 'men', tags: 'قميص' } },
                            { label: 'تي شيرتات', page: 'shop', data: { categories: 'men', tags: 'تي شيرت' } },
                            { label: 'بناطيل', page: 'shop', data: { categories: 'men', tags: 'بنطلون' } },
                            { label: 'جواكيت', page: 'shop', data: { categories: 'men', tags: 'جاكيت' } },
                        ]
                    },
                    {
                        title: 'إكسسوارات',
                        items: [
                            { label: 'حقائب', page: 'shop', data: { tags: 'حقيبة' } },
                            { label: 'ساعات', page: 'shop', data: { tags: 'ساعة' } },
                            { label: 'نظارات', page: 'shop', data: { tags: 'نظارة' } },
                            { label: 'قبعات', page: 'shop', data: { tags: 'قبعة' } },
                        ]
                    }
                ],
                promo: {
                    image: 'https://images.unsplash.com/photo-1574281358313-946a3375a5a1?q=80&w=1974&auto.format&fit=crop',
                    title: 'عرض حصري',
                    subtitle: 'خصم 50% لفترة محدودة',
                    buttonText: 'تسوقي العرض',
                    page: 'shop',
                    data: { onSale: 'true' }
                }
            }
        },
        { label: 'المدونة', page: 'blog' },
        { label: 'المصمم الذكي', page: 'style-me', isNew: true },
        { label: 'اتصل بنا', page: 'contact' },
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

                    <nav className="hidden lg:flex justify-center items-center gap-8">
                       {navLinks.map(link => (
                           <div key={link.label} className="relative group flex items-center h-full">
                               <button 
                                   onClick={() => navigateTo(link.page)} 
                                   className={`h-full font-semibold pb-1 flex items-center gap-1.5 nav-link transition-colors ${textColorClass} ${activePage === link.page ? 'active' : ''}`}
                                >
                                   <span>{link.label}</span>
                                   {link.isNew && <SparklesIcon className="w-4 h-4 text-yellow-400 animate-pulse"/>}
                                   {link.megaMenu && <ChevronDownIcon className={`w-4 h-4 mr-1 transition-transform duration-300 group-hover:rotate-180 ${textColorClass}`} />}
                               </button>

                               {link.megaMenu && (
                                   <div className="mega-menu-wrapper">
                                       <div className="container mx-auto px-4">
                                           <div className="bg-brand-bg text-brand-text rounded-lg shadow-2xl border border-brand-border/50 p-10 grid grid-cols-4 gap-10">
                                                {link.megaMenu.categories.map(category => (
                                                    <div key={category.title}>
                                                        <h3 className="font-bold text-brand-dark mb-5 border-r-2 border-brand-primary pr-3">{category.title}</h3>
                                                        <ul className="space-y-3">
                                                            {category.items.map(item => (
                                                                <li key={item.label}>
                                                                    <button onClick={() => navigateTo(item.page, item.data)} className="group/link flex items-center justify-between text-sm hover:text-brand-primary transition-colors w-full">
                                                                        <span>{item.label}</span>
                                                                        <i className="fa-solid fa-arrow-left text-xs opacity-0 group-hover/link:opacity-100 transition-opacity transform group-hover/link:-translate-x-1"></i>
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                                <div className="group/promo relative rounded-lg overflow-hidden cursor-pointer" onClick={() => navigateTo(link.megaMenu.promo.page, link.megaMenu.promo.data)}>
                                                    <img src={link.megaMenu.promo.image} alt={link.megaMenu.promo.title} className="w-full h-full object-cover transition-transform duration-300 group-hover/promo:scale-105"/>
                                                    <div className="absolute inset-0 bg-black/40"></div>
                                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                                         <h4 className="font-bold text-lg text-white text-shadow">{link.megaMenu.promo.title}</h4>
                                                         <p className="text-sm text-gray-200 mb-4">{link.megaMenu.promo.subtitle}</p>
                                                         <div className="text-right">
                                                            <span className="inline-block bg-white text-brand-dark text-xs font-bold py-2 px-4 rounded-full group-hover/promo:scale-105 transition-transform duration-300">
                                                                {link.megaMenu.promo.buttonText}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                           </div>
                                       </div>
                                   </div>
                               )}
                           </div>
                       ))}
                       <button onClick={() => navigateTo('home')} className={`font-bold py-2 px-5 rounded-full text-sm transition-colors duration-300 border ${buyThemeButtonClasses}`}>
                           !شراء الثيم
                       </button>
                    </nav>
                    
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                        <div className="relative" ref={themeDropdownRef}>
                            <button onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)} className={iconButtonClasses} aria-label="Change theme">
                                {effectiveThemeMode === 'light' ? <SunIcon /> : <MoonIcon />}
                            </button>
                            {isThemeDropdownOpen && (
                                <div className={`absolute left-0 mt-2 w-40 rounded-lg shadow-2xl border border-brand-border/50 p-2 z-10 animate-quick-fade-in-up ${isOpaque ? 'bg-brand-bg text-brand-text' : 'bg-brand-dark text-white'}`}>
                                    <button
                                        onClick={() => { setThemeMode('light'); setIsThemeDropdownOpen(false); }}
                                        className={`w-full text-right flex items-center gap-3 p-2 rounded-md text-sm font-semibold transition-colors ${themeMode === 'light' ? 'bg-brand-subtle text-brand-dark' : 'hover:bg-brand-subtle'}`}
                                    >
                                        <SunIcon size="sm" />
                                        <span>فاتح</span>
                                    </button>
                                    <button
                                        onClick={() => { setThemeMode('dark'); setIsThemeDropdownOpen(false); }}
                                        className={`w-full text-right flex items-center gap-3 p-2 rounded-md text-sm font-semibold transition-colors ${themeMode === 'dark' ? 'bg-brand-subtle text-brand-dark' : 'hover:bg-brand-subtle'}`}
                                    >
                                        <MoonIcon size="sm" />
                                        <span>داكن</span>
                                    </button>
                                    <button
                                        onClick={() => { setThemeMode('system'); setIsThemeDropdownOpen(false); }}
                                        className={`w-full text-right flex items-center gap-3 p-2 rounded-md text-sm font-semibold transition-colors ${themeMode === 'system' ? 'bg-brand-subtle text-brand-dark' : 'hover:bg-brand-subtle'}`}
                                    >
                                        <MagicIcon size="sm" />
                                        <span>النظام</span>
                                    </button>
                                </div>
                            )}
                        </div>
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
                        <button onClick={() => navigateTo('compare')} className={`${iconButtonClasses} hidden md:flex`} aria-label="Compare">
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
