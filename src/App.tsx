import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Product, Filters, User, Review, HeroSlide, SaleCampaign, AdminAnnouncement } from './types';
import { allProducts } from './data/products';
import { saleCampaignsData } from './data/sales';
import { heroSlidesData } from './data/homepage';
import { useAppState } from './state/AppState';
import { allAdminAnnouncements } from './admin/data/adminData';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CartDrawer } from './components/cart/CartDrawer';
import { QuickViewModal } from './components/modals/QuickViewModal';
import { SearchOverlay } from './components/search/SearchOverlay';
import { MobileMenu } from './components/layout/MobileMenu';
import { FilterDrawer } from './components/collection/FilterDrawer';
import { AskQuestionModal } from './components/modals/AskQuestionModal';
import { CompareModal } from './components/modals/CompareModal';
import ToastContainer from './components/ui/ToastContainer';
import AdminDashboard from './admin/AdminDashboard';
import { Router } from './Router';
import { GoToTopButton } from './components/ui/GoToTopButton';
import { FloatingCartBubble } from './components/cart/FloatingCartBubble';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import Chatbot from './components/chatbot/Chatbot';
import { SearchDrawer } from './components/search/SearchDrawer';
import { WriteReviewModal } from './components/modals/WriteReviewModal';
import { SizeGuideModal } from './components/modals/SizeGuideModal';

const serializeUrlParams = (filters: Filters, page: number) => {
    const params = new URLSearchParams();
    if (filters.brands.length > 0) params.set('brands', filters.brands.join(','));
    if (filters.colors.length > 0) params.set('colors', filters.colors.join(','));
    if (filters.sizes.length > 0) params.set('sizes', filters.sizes.join(','));
    if (filters.priceRange.max < 1000) params.set('maxPrice', filters.priceRange.max.toString());
    if (filters.rating > 0) params.set('rating', filters.rating.toString());
    if (filters.onSale) params.set('onSale', 'true');
    if (filters.materials.length > 0) params.set('materials', filters.materials.join(','));
    if (page > 1) params.set('page', page.toString());
    return params.toString();
};

const parseFilters = (queryString: string): Filters => {
    const params = new URLSearchParams(queryString);
    return {
        brands: params.get('brands')?.split(',').filter(Boolean) || [],
        colors: params.get('colors')?.split(',').filter(Boolean) || [],
        sizes: params.get('sizes')?.split(',').filter(Boolean) || [],
        priceRange: { 
            min: 0,
            max: params.has('maxPrice') ? parseInt(params.get('maxPrice')!, 10) : 1000 
        },
        rating: params.has('rating') ? parseInt(params.get('rating')!, 10) : 0,
        onSale: params.get('onSale') === 'true',
        materials: params.get('materials')?.split(',').filter(Boolean) || [],
    };
};

const getInitialStateFromUrl = () => {
    const hash = window.location.hash.slice(1);
    const [path, queryString] = hash.split('?');
    const page = path.startsWith('/') ? path.substring(1) : (path || 'home');
    const filters = page === 'shop' ? parseFilters(queryString || '') : { brands: [], colors: [], sizes: [], priceRange: { min: 0, max: 1000 }, rating: 0, onSale: false, materials: [] };
    const params = new URLSearchParams(queryString || '');
    const pageData: any = {};
    for (const [key, value] of params.entries()) {
        pageData[key] = value;
    }
    const shopPage = params.get('page') ? parseInt(params.get('page')!, 10) : 1;
    return { page, filters, pageData, shopPage };
};

const AppContent = () => {
    const { state, dispatch } = useAppState();
    const { currentUser, cart, wishlist, compareList, theme, themeMode } = state;

    const [activePage, setActivePage] = useState(getInitialStateFromUrl().page);
    const [pageData, setPageData] = useState<any>(getInitialStateFromUrl().pageData);
    
    // Dynamic Homepage Content State
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(heroSlidesData);
    const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>(allAdminAnnouncements);
    const [saleCampaigns, setSaleCampaigns] = useState<SaleCampaign[]>(saleCampaignsData);
    
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCartMinimized, setIsCartMinimized] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [modalProductContext, setModalProductContext] = useState<Product | null>(null);

    
    const [isCompareOpen, setIsCompareOpen] = useState(false);

    const [filters, setFilters] = useState<Filters>(getInitialStateFromUrl().filters);
    const [shopPage, setShopPage] = useState<number>(getInitialStateFromUrl().shopPage);
    const isInitialMount = useRef(true);

    const navigateTo = useCallback((pageName: string, data?: any) => {
        let newHash = `/${pageName}`;
        if (data) {
            if (pageName === 'product') {
                setPageData(data); // Pass complex object via state
            } else {
                 const params = new URLSearchParams(data);
                 newHash += `?${params.toString()}`;
            }
        }
        
        try {
            history.pushState(null, '', `#${newHash.substring(1)}`);
        } catch (e) {
            if (!(e instanceof DOMException && e.name === 'SecurityError')) {
                console.error("Failed to push state:", e);
            }
        }
        setActivePage(pageName);
        if(pageName !== 'product') {
            setPageData(data || {});
        }
        window.scrollTo(0, 0);
    }, []);

    // Apply body class for admin dashboard
    useEffect(() => {
        if (activePage.startsWith('admin')) {
            document.body.classList.add('admin-body');
        } else {
            document.body.classList.remove('admin-body');
        }
    }, [activePage]);

    // Update document title dynamically
    useEffect(() => {
        document.title = `${theme.siteName} - متجر أزياء عصري`;
    }, [theme.siteName]);

    // Apply dark/light theme
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', themeMode);
    }, [themeMode]);

    // Apply theme styles dynamically
    useEffect(() => {
        const styleId = 'dynamic-theme-styles';
        let styleTag = document.getElementById(styleId) as HTMLStyleElement | null;
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }

        const { primaryColor, fontFamily } = theme;

        styleTag.innerHTML = `
            :root {
                --primary: ${primaryColor};
                --brand-primary: ${primaryColor};
            }
            body {
                font-family: ${fontFamily};
            }
            .font-sans {
                font-family: ${fontFamily};
            }
        `;
    }, [theme]);
    
    useEffect(() => {
        const handleScroll = () => {
            if (isCartOpen) {
                if (window.scrollY > 150) {
                    setIsCartMinimized(true);
                } else {
                    setIsCartMinimized(false);
                }
            } else if (isCartMinimized) {
                setIsCartMinimized(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isCartOpen, isCartMinimized]);

    // Sync state to URL when filters or shop page change
    useEffect(() => {
        if (activePage === 'shop') {
            const queryString = serializeUrlParams(filters, shopPage);
            const path = `/${activePage}`;
            const newHash = `${path}${queryString ? `?${queryString}` : ''}`;
            try {
                history.replaceState(null, '', `#${newHash.substring(1)}`);
            } catch (e) {
                 if (!(e instanceof DOMException && e.name === 'SecurityError')) {
                    console.error("Failed to replace state:", e);
                 }
            }
        }
    }, [filters, shopPage, activePage]);

    // Reset page to 1 when filters change (but not on initial load)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (activePage === 'shop') {
                setShopPage(1);
            }
        }
    }, [filters]);


    // Sync URL to state on browser navigation (back/forward)
    useEffect(() => {
        const handlePopState = () => {
            const { page, filters: urlFilters, pageData: urlPageData, shopPage: urlShopPage } = getInitialStateFromUrl();
            setActivePage(page);
            setFilters(urlFilters);
            setPageData(urlPageData);
            setShopPage(urlShopPage);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);


    useEffect(() => {
        // Sanitize cart and wishlist on initial load
        const sanitizedCart = cart.filter(cartItem => allProducts.some(p => p.id === cartItem.id));
        if (sanitizedCart.length !== cart.length) {
            dispatch({ type: 'SET_CART', payload: sanitizedCart });
        }
    
        const sanitizedWishlist = wishlist.filter(wishlistItem => allProducts.some(p => p.id === wishlistItem.id));
        if (sanitizedWishlist.length !== wishlist.length) {
            dispatch({ type: 'SET_WISHLIST', payload: sanitizedWishlist });
        }
    }, []); // Run only on mount

    
     const handleLogin = (user: User) => {
        dispatch({ type: 'LOGIN', payload: user });
        navigateTo('account');
    };

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigateTo('home');
    };

    const addToCart = (product: Product, options: { quantity?: number; selectedSize?: string; selectedColor?: string } = {}) => {
        const { 
            quantity = 1, 
            selectedSize = product.sizes[0], 
            selectedColor = product.colors[0] 
        } = options;

        dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, selectedSize, selectedColor } });
        setIsCartOpen(true);
    };
    
    const openQuickView = (product: Product) => {
        setQuickViewProduct(product);
    }
    
    const closeQuickView = () => {
        setQuickViewProduct(null);
    }

    const setThemeMode = (mode: 'light' | 'dark') => {
        dispatch({ type: 'SET_THEME_MODE', payload: mode });
    };

    if (activePage.startsWith('admin')) {
        return <AdminDashboard 
            currentUser={currentUser}
            heroSlides={heroSlides}
            setHeroSlides={setHeroSlides}
            announcements={announcements}
            setAnnouncements={setAnnouncements}
            saleCampaigns={saleCampaigns}
            setSaleCampaigns={setSaleCampaigns}
        />;
    }

    return (
        <div dir="rtl" className="font-sans">
            <ToastContainer />
            <AnnouncementBar announcements={announcements} />
            <Header 
                navigateTo={navigateTo} 
                setIsCartOpen={setIsCartOpen}
                setIsMenuOpen={setIsMenuOpen}
                setIsSearchOpen={setIsSearchOpen}
                setIsCompareOpen={setIsCompareOpen}
                setThemeMode={setThemeMode}
                themeMode={themeMode}
                activePage={activePage}
            />
            <FloatingCartBubble 
                isVisible={isCartOpen && isCartMinimized}
                onBubbleClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
            <main>
                <Router
                    activePage={activePage}
                    pageData={pageData}
                    currentUser={currentUser}
                    navigateTo={navigateTo}
                    addToCart={addToCart}
                    openQuickView={openQuickView}
                    heroSlides={heroSlides}
                    saleCampaigns={saleCampaigns}
                    setIsFilterOpen={setIsFilterOpen}
                    filters={filters}
                    setFilters={setFilters}
                    shopPage={shopPage}
                    setShopPage={setShopPage}
                    setIsAskQuestionOpen={setIsAskQuestionOpen}
                    setIsCompareOpen={setIsCompareOpen}
                    onLogout={handleLogout}
                    onLogin={handleLogin}
                />
            </main>
            <Footer navigateTo={navigateTo} />
            <MobileBottomNav 
                navigateTo={navigateTo} 
                activePage={activePage} 
                setIsCartOpen={setIsCartOpen}
                isCartOpen={isCartOpen}
            />
            <CartDrawer 
                isOpen={isCartOpen}
                setIsOpen={setIsCartOpen}
                navigateTo={navigateTo}
                isMinimized={isCartMinimized}
            />
            <QuickViewModal 
                isOpen={!!quickViewProduct}
                product={quickViewProduct}
                onClose={closeQuickView}
                addToCart={addToCart}
                navigateTo={navigateTo}
            />
            {/* FIX: Pass missing 'filters' and 'setFilters' props to SearchOverlay */}
             <SearchOverlay
                isOpen={isSearchOpen}
                setIsOpen={setIsSearchOpen}
                navigateTo={navigateTo}
                setIsChatbotOpen={setIsChatbotOpen}
                filters={filters}
                setFilters={setFilters}
            />
            {/* FIX: Pass missing 'filters' and 'setFilters' props to SearchDrawer */}
            <SearchDrawer
                isOpen={isSearchOpen}
                setIsOpen={setIsSearchOpen}
                navigateTo={navigateTo}
                setIsChatbotOpen={setIsChatbotOpen}
                filters={filters}
                setFilters={setFilters}
            />
            <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} navigateTo={navigateTo} currentUser={currentUser} />
            <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} filters={filters} setFilters={setFilters} />
            <AskQuestionModal isOpen={isAskQuestionOpen} onClose={() => setIsAskQuestionOpen(false)} />
            <CompareModal 
                isOpen={isCompareOpen} 
                onClose={() => setIsCompareOpen(false)} 
                navigateTo={navigateTo}
            />
            <GoToTopButton />
            <Chatbot 
                navigateTo={navigateTo} 
                isOpen={isChatbotOpen} 
                setIsOpen={setIsChatbotOpen}
                activePage={activePage}
                productContext={activePage === 'product' ? pageData : null}
            />
        </div>
    );
};

const App = () => {
    return <AppContent />;
}

export default App;
