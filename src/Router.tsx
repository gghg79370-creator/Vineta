

import React from 'react';
import { Product, Filters, User, HeroSlide, SaleCampaign } from './types';
import { allProducts } from './data/products';

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
import SearchPage from './pages/SearchPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import StyleMePage from './pages/StyleMePage';


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
    setIsCompareOpen: (isOpen: boolean) => void;
    onLogout: () => void;
    onLogin: (user: User) => void;
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
    setIsCompareOpen,
    onLogout,
    onLogin,
}) => {
    const commonProps = { navigateTo, addToCart, openQuickView };

    const pageComponents: { [key: string]: React.ReactNode } = {
        home: <HomePage {...commonProps} heroSlides={heroSlides} saleCampaigns={saleCampaigns} />,
        shop: <ShopPage {...commonProps} setIsFilterOpen={setIsFilterOpen} filters={filters} setFilters={setFilters} currentPage={shopPage} setCurrentPage={setShopPage} />,
        product: <ProductDetailPage {...commonProps} product={pageData || allProducts[0]} setIsAskQuestionOpen={setIsAskQuestionOpen} setIsCompareOpen={setIsCompareOpen} />,
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
        search: <SearchPage {...commonProps} setIsFilterOpen={setIsFilterOpen} />,
        blog: <BlogListPage navigateTo={navigateTo} />,
        blogPost: <BlogPostPage navigateTo={navigateTo} />,
        'style-me': <StyleMePage navigateTo={navigateTo} addToCart={(product) => addToCart(product)} />,
    };

    const protectedPages = ['account', 'wishlist'];
    if (protectedPages.includes(activePage) && !currentUser) {
        // Use a side effect to navigate, but return the login page immediately.
        React.useEffect(() => {
            navigateTo('login');
        }, [activePage, currentUser, navigateTo]);
        return <>{pageComponents.login}</>;
    }
    
    const pageToRender = pageComponents[activePage] || pageComponents.home;

    return <>{pageToRender}</>;
};
