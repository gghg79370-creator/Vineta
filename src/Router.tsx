import React from 'react';
import { Product, Filters, User, HeroSlide, SaleCampaign, Variant } from './types';
import { allProducts } from './data/products';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
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
import SearchPage from './pages/SearchPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import AiTryOnPage from './pages/AiTryOnPage';
import SettingsPage from './pages/SettingsPage';


interface RouterProps {
    activePage: string;
    pageData: any;
    currentUser: User | null;
    navigateTo: (pageName: string, data?: any) => void;
    addToCart: (product: Product, options?: { quantity?: number; selectedSize?: string; selectedColor?: string }) => void;
    openQuickView: (product: Product) => void;
    heroSlides: HeroSlide[];
    saleCampaigns: SaleCampaign[];
    setIsFilterOpen: (isOpen: boolean) => void;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    shopPage: number;
    setShopPage: React.Dispatch<React.SetStateAction<number>>;
    setIsAskQuestionOpen: (isOpen: boolean) => void;
    onLogout: () => void;
    onLogin: (user: User) => void;
    onProductView: () => void;
    openNotifyMeModal: (product: Product, variant: Variant | null) => void;
}

export const Router: React.FC<RouterProps> = ({
    activePage,
    pageData,
    currentUser,
    navigateTo,
    addToCart,
    openQuickView,
    heroSlides,
    saleCampaigns,
    setIsFilterOpen,
    filters,
    setFilters,
    shopPage,
    setShopPage,
    setIsAskQuestionOpen,
    onLogout,
    onLogin,
    onProductView,
    openNotifyMeModal,
}) => {
    const commonProps = { navigateTo, addToCart, openQuickView };

    const pageComponents: { [key: string]: React.ReactNode } = {
        home: <HomePage {...commonProps} heroSlides={heroSlides} saleCampaigns={saleCampaigns} />,
        // FIX: The `ShopPage` component expects `shopPage` and `setShopPage` props, but was being passed `currentPage` and `setCurrentPage`.
        shop: <ShopPage {...commonProps} setIsFilterOpen={setIsFilterOpen} filters={filters} setFilters={setFilters} shopPage={shopPage} setShopPage={setShopPage} />,
        about: <AboutPage navigateTo={navigateTo} />,
        product: <ProductDetailPage {...commonProps} product={pageData || allProducts[0]} setIsAskQuestionOpen={setIsAskQuestionOpen} onProductView={onProductView} openNotifyMeModal={openNotifyMeModal} />,
        cart: <CartPage navigateTo={navigateTo} />,
        wishlist: <WishlistPage navigateTo={navigateTo} />,
        account: <AccountPage navigateTo={navigateTo} onLogout={onLogout} />,
        faq: <FaqPage navigateTo={navigateTo} />,
        checkout: <CheckoutPage navigateTo={navigateTo} />,
        compare: <ComparePage navigateTo={navigateTo} />,
        contact: <ContactPage navigateTo={navigateTo} />,
        orderConfirmation: <OrderConfirmationPage navigateTo={navigateTo} />,
        login: <LoginPage navigateTo={navigateTo} onLogin={onLogin} />,
        register: <RegisterPage navigateTo={navigateTo} />,
        forgotPassword: <ForgotPasswordPage navigateTo={navigateTo} />,
        resetPassword: <ResetPasswordPage navigateTo={navigateTo} />,
        emailVerification: <EmailVerificationPage navigateTo={navigateTo} />,
        search: <SearchPage {...commonProps} setIsFilterOpen={setIsFilterOpen} filters={filters} setFilters={setFilters} />,
        blog: <BlogListPage navigateTo={navigateTo} />,
        blogPost: <BlogPostPage navigateTo={navigateTo} />,
        'ai-try-on': <AiTryOnPage navigateTo={navigateTo} addToCart={addToCart} />,
        settings: <SettingsPage navigateTo={navigateTo} />,
    };

    const protectedPages = ['account', 'wishlist', 'settings'];
    const isProtectedRoute = protectedPages.includes(activePage) && !currentUser;

    React.useEffect(() => {
        if (isProtectedRoute) {
            navigateTo('login');
        }
    }, [isProtectedRoute, navigateTo]);

    if (isProtectedRoute) {
        return <>{pageComponents.login}</>;
    }
    
    const pageToRender = pageComponents[activePage] || pageComponents.home;

    return <>{pageToRender}</>;
};