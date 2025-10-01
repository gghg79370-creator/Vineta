import React from 'react';
import { Product, HeroSlide, SaleCampaign } from '../types';
import { HeroSection } from '../components/home/HeroSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { BrandLogos } from '../components/home/BrandLogos';
import { InstagramSection } from '../components/home/InstagramSection';
import { allProducts } from '../data/products';
import { CountdownSaleSection } from '../components/home/CountdownSaleSection';
import { useAppState } from '../state/AppState';
import { FeaturesBar } from '../components/home/FeaturesBar';
import { TabbedProductSection } from '../components/home/TabbedProductSection';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { FeaturedProductSection } from '../components/home/FeaturedProductSection';
import { InspiredByYouSection } from '../components/home/InspiredByYouSection';
import { AiRecommendationsSection } from '../components/home/AiRecommendationsSection';


interface HomePageProps {
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    heroSlides: HeroSlide[];
    saleCampaigns: SaleCampaign[];
}

const HomePage = ({ navigateTo, addToCart, openQuickView, heroSlides, saleCampaigns }: HomePageProps) => {
    const { dispatch } = useAppState();

    const commonProductProps = {
        navigateTo,
        addToCart,
        openQuickView,
        products: allProducts,
        toggleWishlist: (product: Product) => dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id }),
        addToCompare: (product: Product) => dispatch({ type: 'TOGGLE_COMPARE', payload: product.id }),
    };

    return (
        <>
            <HeroSection navigateTo={navigateTo} heroSlides={heroSlides} />
            
            <CategoriesSection navigateTo={navigateTo} />
            <TabbedProductSection {...commonProductProps} />
            
            <AiRecommendationsSection {...commonProductProps} />

            {saleCampaigns.filter(c => c.status === 'Active').map(campaign => (
                <CountdownSaleSection key={campaign.id} campaign={campaign} navigateTo={navigateTo} />
            ))}
            
            <FeaturedProductSection navigateTo={navigateTo} />
            <InspiredByYouSection navigateTo={navigateTo} />
            <TestimonialsSection navigateTo={navigateTo} />
            <BrandLogos />
            <InstagramSection />
            <FeaturesBar />
        </>
    );
};

export default HomePage;