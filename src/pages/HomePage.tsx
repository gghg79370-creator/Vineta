import React from 'react';
import { Product, HeroSlide } from '../types';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedCategories } from '../components/home/FeaturedCategories';
import { TabbedProductSection } from '../components/home/TabbedProductSection';
import { PromoSection } from '../components/home/PromoSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { BrandLogos } from '../components/home/BrandLogos';
import { InstagramSection } from '../components/home/InstagramSection';
import { allProducts } from '../data/products';

interface HomePageProps {
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    compareList: Product[];
    addToCompare: (product: Product) => void;
    heroSlides: HeroSlide[];
    wishlistItems: Product[];
    toggleWishlist: (product: Product) => void;
}

const HomePage = ({ navigateTo, addToCart, openQuickView, compareList, addToCompare, heroSlides, wishlistItems, toggleWishlist }: HomePageProps) => (
    <>
        <HeroSection navigateTo={navigateTo} slides={heroSlides} />

        <FeaturedCategories navigateTo={navigateTo} />
        
        <TabbedProductSection 
            products={allProducts}
            navigateTo={navigateTo}
            addToCart={addToCart}
            openQuickView={openQuickView}
            compareList={compareList}
            addToCompare={addToCompare}
            wishlistItems={wishlistItems}
            toggleWishlist={toggleWishlist}
        />

        <PromoSection 
            image="https://images.unsplash.com/photo-1519235889733-6b74de6cb9e9?q=80&w=1964&auto=format&fit=crop"
            categoryName="مجموعة الأطفال"
            page="shop"
            navigateTo={navigateTo}
        />
        
        <TestimonialsSection 
            addToCart={addToCart} 
            openQuickView={openQuickView} 
            compareList={compareList} 
            addToCompare={addToCompare} 
            wishlistItems={wishlistItems} 
            toggleWishlist={toggleWishlist} 
        />
        
        <InstagramSection />
        
        <BrandLogos />
    </>
);

export default HomePage;