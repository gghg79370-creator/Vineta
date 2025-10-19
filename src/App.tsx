import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Product, Filters, User, Review, HeroSlide, SaleCampaign, AdminAnnouncement, CartItem } from './types';
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
import { WriteReviewModal } from './components/modals/WriteReviewModal';
import { AddToCartConfirmation } from './components/cart/AddToCartConfirmation';

const serializeUrlParams = (filters: Filters, page: number) => {
    const params = new URLSearchParams();
    if (filters.brands.length > 0) params.set('brands', filters.brands.join(','));
    if (filters.colors.length > 0) params.set('colors', filters.colors.join(','));
    if (filters.sizes.length > 0) params.set('sizes', filters.sizes.join(','));
    if (filters.priceRange.max < 1000) params.set('maxPrice', filters.priceRange.max.toString());
    if (filters.rating > 0) params.set('rating', filters.rating.toString());
    if (filters.onSale) params.set('onSale', 'true');
    if (filters.materials.length > 0) params.set('materials', filters.materials.join(','));
    if (filters.categories.length > 0) params.set('categories', filters.categories.join(','));
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
        categories: params.get('categories')?.split(',').filter(Boolean) || [],
    };
};

const getInitialStateFromUrl = () => {
    const hash = window.location.hash.slice(1);
    const [path, queryString] = hash.split('?');
    const page = path.startsWith('/') ? path.substring(1) : (path || 'home');
    const initialFilters = { brands: [], colors: [], sizes: [], priceRange: { min: 0, max: 1000 }, rating: 0, onSale: false, materials: [], categories: [] };
    const filters = page === 'shop' || page === 'search' ? parseFilters(queryString || '') : initialFilters;
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

    const [activePage, setActivePage] = useState('home');
    const [pageData, setPageData] = useState<any>({});
    const [filters, setFilters] = useState<Filters>({ brands: [], colors: [], sizes: [], priceRange: { min: 0, max: 1000 }, rating: 0, onSale: false, materials: [], categories: [] });
    const [shopPage, setShopPage] = useState<number>(1);
    
    // Dynamic Homepage Content State
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(heroSlidesData);
    const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>(allAdminAnnouncements);
    const [saleCampaigns, setSaleCampaigns] = useState<SaleCampaign[]>(saleCampaignsData);
    
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [modalProductContext, setModalProductContext] = useState<Product | null>(null);

    const [confirmationItem, setConfirmationItem] = useState<CartItem | null>(null);
    
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    
    const isInitialMount = useRef(true);
    // Ref to store complex product data that doesn't fit in the URL
    const productDataRef = useRef<any>(null);

    const [_, setForceUpdate] = useState(0);
    const handleProductView = () => setForceUpdate(c => c + 1);

    const handleUrlChange = useCallback(() => {
        const { page, filters, pageData: urlPageData, shopPage } = getInitialStateFromUrl();

        if (page === 'product') {
            let productData = null;
            // Check if ref is valid for the current URL
            if (productDataRef.current && productDataRef.current.id == urlPageData.id) {
                productData = productDataRef.current;
            } 
            // If not, try to load from allProducts using URL id
            else if (urlPageData.id) {
                const productId = parseInt(urlPageData.id, 10);
                productData = allProducts.find(p => p.id === productId) || null;
            }
            
            if (productData) {
                productDataRef.current = productData; // update ref if loaded from URL
                setPageData(productData);
                setActivePage(page);
                setFilters(filters);
                setShopPage(shopPage);
            } else {
                // Product not found, navigate to home.
                // This will trigger another hashchange, which is fine.
                window.location.hash = 'home';
            }
        } else {
            productDataRef.current = null; // Clear product ref
            setActivePage(page);
            setFilters(filters);
            setShopPage(shopPage);
            setPageData(urlPageData);
        }
    }, []);

    const navigateTo = useCallback((pageName: string, data?: any) => {
        let newHash = `/${pageName}`;
        
        if (pageName === 'product') {
            // Store complex product object in ref, and use ID in URL for bookmarking
            productDataRef.current = data;
            if (data && data.id) {
                newHash += `?id=${data.id}`;
            }
        } else if (data) {
            const params = new URLSearchParams(data);
            newHash += `?${params.toString()}`;
        }
        
        // Setting hash will trigger the 'hashchange' event listener
        window.location.hash = newHash.substring(1);

        window.scrollTo(0, 0);
    }, []);
    
    // Sync URL to state on initial load and browser navigation (back/forward)
    useEffect(() => {
        handleUrlChange(); // Initial load
        window.addEventListener('hashchange', handleUrlChange);
        return () => window.removeEventListener('hashchange', handleUrlChange);
    }, [handleUrlChange]);


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

    const [effectiveThemeMode, setEffectiveThemeMode] = useState<'light' | 'dark'>('light');

    // Apply dark/light theme and listen for system changes
    useEffect(() => {
        const applyTheme = (mode: 'light' | 'dark') => {
            document.documentElement.setAttribute('data-theme', mode);
            setEffectiveThemeMode(mode);
        };

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (themeMode === 'system') {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        };

        if (themeMode === 'system') {
            applyTheme(mediaQuery.matches ? 'dark' : 'light');
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        } else {
            applyTheme(themeMode);
        }

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
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
    
    // Sync state to URL when filters or shop page change
    useEffect(() => {
        if (activePage === 'shop' || activePage === 'search') {
            const queryString = serializeUrlParams(filters, shopPage);
            const currentHash = window.location.hash.slice(1);
            const currentPath = currentHash.split('?')[0];

            let newHash = currentPath;
            if (queryString) {
                newHash += `?${queryString}`;
            }

            // Only update history if the query string part has changed
            if (currentHash !== newHash) {
                try {
                    history.replaceState(null, '', `#${newHash}`);
                } catch (e) {
                     if (!(e instanceof DOMException && e.name === 'SecurityError')) {
                        console.error("Failed to replace state:", e);
                     }
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
    }, [filters, activePage]);


    useEffect(() => {
        // Sanitize cart and wishlist on initial load
        const sanitizedCart = cart.filter(cartItem => allProducts.some(p => p.id === cartItem.id));
        if (sanitizedCart.length !== cart.length) {
            dispatch({ type: 'SET_CART', payload: sanitizedCart });
        }
    
        const sanitizedWishlist = wishlist.filter(wishlistItem => allProducts.some(p => p.id === wishlistItem.id));
        if (sanitizedWishlist.length !== wishlist.length) {
            dispatch({ type: 'SET_WISHLIST', payload: sanitizedWishlist.map(p => ({ id: p.id, note: '' })) });
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
        
        const productDetails = allProducts.find(p => p.id === product.id);
        if (!productDetails) return;

        let price = productDetails.price;
        let oldPrice = productDetails.oldPrice;

        if (productDetails.variants && productDetails.variants.length > 0) {
            const variant = productDetails.variants.find(v => v.size === selectedSize && v.color === selectedColor);
            if (variant) {
                price = variant.price;
                oldPrice = variant.oldPrice;
            }
        }
        
        const cartItemForPopup: CartItem = {
            ...productDetails,
            price,
            oldPrice,
            quantity,
            selectedSize,
            selectedColor,
        };

        setConfirmationItem(cartItemForPopup);
    };
    
    const openQuickView = (product: Product) => {
        setQuickViewProduct(product);
    }
    
    const closeQuickView = () => {
        setQuickViewProduct(null);
    }

    const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
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
            {confirmationItem && (
                <AddToCartConfirmation 
                    item={confirmationItem}
                    onClose={() => setConfirmationItem(null)}
                    onViewCart={() => {
                        setConfirmationItem(null);
                        setIsCartOpen(true);
                    }}
                />
            )}
            <AnnouncementBar announcements={announcements} />
            <Header 
                navigateTo={navigateTo} 
                setIsCartOpen={setIsCartOpen}
                setIsMenuOpen={setIsMenuOpen}
                setIsSearchOpen={setIsSearchOpen}
                setThemeMode={setThemeMode}
                themeMode={themeMode}
                effectiveThemeMode={effectiveThemeMode}
                activePage={activePage}
            />
            <main className="animate-fade-in">
                <Router
                    key={activePage}
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
                    onLogout={handleLogout}
                    onLogin={handleLogin}
                    onProductView={handleProductView}
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
            />
            <QuickViewModal 
                isOpen={!!quickViewProduct}
                product={quickViewProduct}
                onClose={closeQuickView}
                addToCart={addToCart}
                navigateTo={navigateTo}
            />
            <SearchOverlay
                isOpen={isSearchOpen}
                setIsOpen={setIsSearchOpen}
                navigateTo={navigateTo}
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
            <FloatingCartBubble onClick={() => setIsCartOpen(true)} />
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
