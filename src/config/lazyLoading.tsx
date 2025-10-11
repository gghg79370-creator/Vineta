/**
 * Lazy Loading Configuration
 * Route-based code splitting for better performance
 */

import React, { lazy, Suspense } from 'react';
import Spinner from '../components/ui/Spinner';

/**
 * Loading fallback component
 */
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner size="lg" />
  </div>
);

/**
 * Lazy load wrapper with error boundary
 */
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <LoadingFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Lazy loaded page components
 * These will be split into separate chunks for better initial load performance
 */

// Auth Pages - Smaller bundle, loaded on demand
export const LazyLoginPage = lazy(() => import('../pages/LoginPage'));
export const LazyRegisterPage = lazy(() => import('../pages/RegisterPage'));
export const LazyForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
export const LazyResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
export const LazyEmailVerificationPage = lazy(() => import('../pages/EmailVerificationPage'));

// Main Pages - Critical for initial experience
export const LazyHomePage = lazy(() => import('../pages/HomePage'));
export const LazyShopPage = lazy(() => import('../pages/ShopPage'));
export const LazyProductDetailPage = lazy(() => 
  import('../pages/ProductDetailPage').then(module => ({ default: module.ProductDetailPage }))
);

// Account Pages - User specific
export const LazyAccountPage = lazy(() => import('../pages/AccountPage'));
export const LazyWishlistPage = lazy(() => import('../pages/WishlistPage'));
export const LazyCartPage = lazy(() => import('../pages/CartPage'));
export const LazyCheckoutPage = lazy(() => import('../pages/CheckoutPage'));
export const LazyOrderConfirmationPage = lazy(() => import('../pages/OrderConfirmationPage'));

// Utility Pages
export const LazyContactPage = lazy(() => import('../pages/ContactPage'));
export const LazyFaqPage = lazy(() => import('../pages/FaqPage'));
export const LazySearchPage = lazy(() => import('../pages/SearchPage'));
export const LazyComparePage = lazy(() => import('../pages/ComparePage'));

// Blog Pages
export const LazyBlogListPage = lazy(() => import('../pages/BlogListPage'));
export const LazyBlogPostPage = lazy(() => import('../pages/BlogPostPage'));

// Feature Pages
export const LazyStyleMePage = lazy(() => import('../pages/StyleMePage'));

// Admin Dashboard - Large bundle, loaded on demand
export const LazyAdminDashboard = lazy(() => import('../admin/AdminDashboard'));

/**
 * Preload a route component
 * Useful for prefetching routes the user is likely to visit
 */
export const preloadRoute = (routeName: string) => {
  switch (routeName) {
    case 'shop':
      import('../pages/ShopPage');
      break;
    case 'account':
      import('../pages/AccountPage');
      break;
    case 'cart':
      import('../pages/CartPage');
      break;
    case 'checkout':
      import('../pages/CheckoutPage');
      break;
    case 'admin':
      import('../admin/AdminDashboard');
      break;
    // Add more routes as needed
  }
};

/**
 * Route groups for bundle analysis
 */
export const ROUTE_GROUPS = {
  critical: ['home', 'shop', 'product'],
  auth: ['login', 'register', 'forgotPassword', 'resetPassword', 'emailVerification'],
  account: ['account', 'wishlist', 'orderConfirmation'],
  checkout: ['cart', 'checkout'],
  content: ['blog', 'blogPost', 'faq', 'contact'],
  admin: ['admin'],
} as const;

export default {
  lazyLoad,
  preloadRoute,
  ROUTE_GROUPS,
};
