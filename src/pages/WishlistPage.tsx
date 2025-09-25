import React from 'react';
import { Product } from '../types';
import { WishlistProductCard } from '../components/product/WishlistProductCard';

interface WishlistPageProps {
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    wishlistItems: Product[];
    toggleWishlist: (product: Product) => void;
}

const WishlistPage = ({ navigateTo, addToCart, wishlistItems, toggleWishlist }: WishlistPageProps) => (
    <div className="bg-brand-bg py-12">
        <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2 text-center text-brand-dark">قائمة رغباتي</h1>
             <nav className="text-sm text-brand-text-light mb-10 flex justify-center" aria-label="Breadcrumb">
                <ol className="list-none p-0 inline-flex">
                    <li className="flex items-center">
                        <button onClick={() => navigateTo('home')} className="hover:text-brand-primary">الرئيسية</button><span className="mx-2">/</span><span>قائمة الرغبات</span>
                    </li>
                </ol>
            </nav>
            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8">
                    {wishlistItems.map(product => <WishlistProductCard key={product.id} product={product} navigateTo={navigateTo} addToCart={addToCart} toggleWishlist={toggleWishlist} />)}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-lg font-semibold mb-4">قائمة رغباتك فارغة.</p>
                    <button onClick={() => navigateTo('shop')} className="bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90">
                        العودة للتسوق
                    </button>
                </div>
            )}
        </div>
    </div>
);

export default WishlistPage;