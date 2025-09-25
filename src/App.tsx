import React, { useState, useEffect } from 'react';
import { CartItem, Product, Filters, User, Review, HeroSlide } from './types';
import { allProducts } from './data/products';
import { cartItemsData } from './data/cart';
import { heroSlidesData } from './data/homepage';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CartDrawer } from './components/cart/CartDrawer';
import { QuickViewModal } from './components/modals/QuickViewModal';
import { OrderDetailModal } from './components/modals/OrderDetailModal';
import { SearchOverlay } from './components/search/SearchOverlay';
import { MobileMenu } from './components/layout/MobileMenu';
import { FilterDrawer } from './components/collection/FilterDrawer';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { AskQuestionModal } from './components/modals/AskQuestionModal';
import { CompareModal } from './components/modals/CompareModal';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import AccountPage from './pages/AccountPage';
import FaqPage from './pages/FaqPage';
import CheckoutPage from './pages/CheckoutPage';
import ComparePage from './pages/ComparePage';
import ContactPage from './pages/ContactPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import AdminDashboard from './admin/AdminDashboard';


const App = () => {
    const [activePage, setActivePage] = useState('home');
    const [pageData, setPageData] = useState<any>(allProducts[0]);
    const [currentUser, setCurrentUser] = useState<User | null>({ id: '1', name: 'فينيتا فام', email: 'admin@example.com', phone: '01234567890', isAdmin: true });
    
    // Dynamic Homepage Content State
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(heroSlidesData);
    const [announcements, setAnnouncements] = useState<string[]>(["شحن مجاني للطلبات فوق 500 جنيه", "ضمان مدى الحياة", "عرض لفترة محدودة", "تمديد فترة الإرجاع إلى 60 يومًا"]);

    const [cartItems, setCartItems] = useState<CartItem[]>(cartItemsData);
    const [wishlistItems, setWishlistItems] = useState<Product[]>([allProducts[2], allProducts[5]]);
    
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
    
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [compareList, setCompareList] = useState<Product[]>([]);

    const [filters, setFilters] = useState<Filters>({
        brands: [],
        colors: [],
        sizes: [],
        priceRange: { min: 0, max: 1000 },
    });


    const navigateTo = (pageName: string, data?: any) => {
        setActivePage(pageName);
        setPageData(data);
        window.scrollTo(0, 0);
    };
    
     const handleLogin = (user: User) => {
        setCurrentUser(user);
        navigateTo('account');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        navigateTo('home');
    };

    const toggleWishlist = (product: Product) => {
        setWishlistItems(prev => {
            const isInWishlist = prev.some(item => item.id === product.id);
            if (isInWishlist) {
                return prev.filter(item => item.id !== product.id);
            } else {
                return [...prev, product];
            }
        });
    };


    const addToCart = (product: Product, options: { quantity?: number; selectedSize?: string; selectedColor?: string } = {}) => {
        const { 
            quantity = 1, 
            selectedSize = product.sizes[0], 
            selectedColor = product.colors[0] 
        } = options;

        setCartItems(prevItems => {
            const itemInCart = prevItems.find(item => 
                item.id === product.id && 
                item.selectedSize === selectedSize && 
                item.selectedColor === selectedColor
            );

            if (itemInCart) {
                return prevItems.map(item =>
                    item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            
            return [...prevItems, { 
                ...product, 
                quantity: quantity, 
                selectedSize: selectedSize, 
                selectedColor: selectedColor,
            }];
        });
        
        setIsCartOpen(true);
    };
    
    const openQuickView = (product: Product) => {
        setQuickViewProduct(product);
    }
    
    const closeQuickView = () => {
        setQuickViewProduct(null);
    }

    const addToCompare = (product: Product) => {
        setCompareList(prev => {
            if (prev.some(p => p.id === product.id)) {
                return prev.filter(p => p.id !== product.id);
            }
            if (prev.length >= 4) {
                return prev;
            }
            return [...prev, product];
        });
    };

    const removeFromCompare = (productId: number) => {
        setCompareList(prev => prev.filter(p => p.id !== productId));
    };


    const renderPage = () => {
        const commonProps = {
            navigateTo,
            addToCart,
            openQuickView,
            compareList,
            addToCompare,
            wishlistItems,
            toggleWishlist,
        };

        switch (activePage) {
            case 'home':
                return <HomePage {...commonProps} heroSlides={heroSlides} />;
            case 'shop':
                return <ShopPage {...commonProps} setIsFilterOpen={setIsFilterOpen} filters={filters} setFilters={setFilters} />;
            case 'product':
                return <ProductDetailPage {...commonProps} product={pageData} setIsAskQuestionOpen={setIsAskQuestionOpen} setIsCompareOpen={setIsCompareOpen} />;
            case 'cart':
                return <CartPage 
                    cartItems={cartItems} 
                    setCartItems={setCartItems} 
                    navigateTo={navigateTo} 
                    compareList={compareList} 
                    addToCompare={addToCompare} 
                    addToCart={addToCart}
                    openQuickView={openQuickView}
                    wishlistItems={wishlistItems}
                    toggleWishlist={toggleWishlist}
                />;
            case 'wishlist':
                return <WishlistPage navigateTo={navigateTo} addToCart={addToCart} wishlistItems={wishlistItems} toggleWishlist={toggleWishlist} />;
            case 'account':
                 if (!currentUser) {
                    navigateTo('login');
                    return <LoginPage navigateTo={navigateTo} onLogin={handleLogin} />;
                }
                return <AccountPage navigateTo={navigateTo} currentUser={currentUser} onLogout={handleLogout} />;
            case 'faq':
                return <FaqPage navigateTo={navigateTo} />;
            case 'checkout':
                return <CheckoutPage navigateTo={navigateTo} cartItems={cartItems}/>;
            case 'compare':
                 return <ComparePage navigateTo={navigateTo} />;
            case 'contact':
                return <ContactPage navigateTo={navigateTo} />;
            case 'orderConfirmation':
                return <OrderConfirmationPage navigateTo={navigateTo} />;
            case 'login':
                return <LoginPage navigateTo={navigateTo} onLogin={handleLogin} />;
            case 'register':
                return <RegisterPage navigateTo={navigateTo} />;
            case 'forgotPassword':
                return <ForgotPasswordPage navigateTo={navigateTo} />;
            case 'resetPassword':
                return <ResetPasswordPage navigateTo={navigateTo} />;
            case 'emailVerification':
                return <EmailVerificationPage navigateTo={navigateTo} />;
            case 'admin':
                return <AdminDashboard 
                    currentUser={currentUser}
                    heroSlides={heroSlides}
                    setHeroSlides={setHeroSlides}
                    announcements={announcements}
                    setAnnouncements={setAnnouncements}
                />;
            default:
                return <HomePage {...commonProps} heroSlides={heroSlides} />;
        }
    };

    if (activePage.startsWith('admin')) {
        return <AdminDashboard 
            currentUser={currentUser}
            heroSlides={heroSlides}
            setHeroSlides={setHeroSlides}
            announcements={announcements}
            setAnnouncements={setAnnouncements}
        />;
    }

    return (
        <div dir="rtl" className="font-sans">
            <AnnouncementBar announcements={announcements} />
            <Header 
                navigateTo={navigateTo} 
                cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                wishlistCount={wishlistItems.length}
                compareCount={compareList.length}
                setIsCartOpen={setIsCartOpen}
                setIsMenuOpen={setIsMenuOpen}
                setIsSearchOpen={setIsSearchOpen}
                setIsCompareOpen={setIsCompareOpen}
                currentUser={currentUser}
            />
            <main>
                {renderPage()}
            </main>
            <Footer navigateTo={navigateTo} />
            <MobileBottomNav 
                navigateTo={navigateTo} 
                activePage={activePage} 
                cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                wishlistCount={wishlistItems.length}
                setIsCartOpen={setIsCartOpen}
                isCartOpen={isCartOpen}
                currentUser={currentUser}
            />
            <CartDrawer 
                isOpen={isCartOpen}
                setIsOpen={setIsCartOpen}
                navigateTo={navigateTo}
                cartItems={cartItems}
                setCartItems={setCartItems}
                addToCart={addToCart}
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
                addToCart={addToCart}
                openQuickView={openQuickView}
                compareList={compareList}
                addToCompare={addToCompare}
                wishlistItems={wishlistItems}
                toggleWishlist={toggleWishlist}
            />
            <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} navigateTo={navigateTo} currentUser={currentUser} />
            <FilterDrawer isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} filters={filters} setFilters={setFilters} />
            <AskQuestionModal isOpen={isAskQuestionOpen} onClose={() => setIsAskQuestionOpen(false)} />
            <CompareModal 
                isOpen={isCompareOpen} 
                onClose={() => setIsCompareOpen(false)} 
                compareList={compareList}
                removeFromCompare={removeFromCompare}
                addToCart={addToCart}
                navigateTo={navigateTo}
            />
        </div>
    );
};

export default App;