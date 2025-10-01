import React from 'react';
import { Product } from '../types';
import { WishlistGrid } from '../components/wishlist/WishlistGrid';

interface WishlistPageProps {
    navigateTo: (pageName: string, data?: Product) => void;
}

const WishlistPage = ({ navigateTo }: WishlistPageProps) => {
    return (
        <div className="bg-brand-bg py-12 min-h-[calc(100vh-150px)]">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-2 text-center text-brand-dark">قائمة رغباتي</h1>
                <nav className="text-sm text-brand-text-light mb-10 flex justify-center" aria-label="Breadcrumb">
                    <ol className="list-none p-0 inline-flex">
                        <li className="flex items-center">
                            <button onClick={() => navigateTo('home')} className="hover:text-brand-primary">الرئيسية</button>
                            <span className="mx-2">/</span>
                            <span>قائمة الرغبات</span>
                        </li>
                    </ol>
                </nav>
                <WishlistGrid navigateTo={navigateTo} />
            </div>
        </div>
    );
};

export default WishlistPage;
