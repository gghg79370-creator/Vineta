
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
import { useToast } from '../hooks/useToast';
import { RecentlyViewedSection } from '../components/product/RecentlyViewedSection';
import { TrendingProductsSection } from '../components/product/TrendingProductsSection';
import { BrandPromiseSection } from '../components/home/BrandPromiseSection';
import { FashionReelsSection } from '../components/home/FashionReelsSection';


interface HomePageProps {
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product, options?: { quantity?: number; selectedSize?: string; selectedColor?: string }) => void;
    openQuickView: (product: Product) => void;
    heroSlides: HeroSlide[];
    saleCampaigns: SaleCampaign[];
}

const HomePage = ({ navigateTo, addToCart, openQuickView, heroSlides, saleCampaigns }: HomePageProps) => {
    const { state, dispatch } = useAppState();
    const { currentUser, compareList, wishlist } = state;
    const addToast = useToast();

    const toggleWishlist = (product: Product) => {
        if (!currentUser) {
            addToast('الرجاء تسجيل الدخول لحفظ المنتجات في قائمة رغباتك.', 'info');
            navigateTo('login');
            return;
        }
        dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });
        const isInWishlist = state.wishlist.some(item => item.id === product.id);
        addToast(
            !isInWishlist ? `تمت إضافة ${product.name} إلى قائمة الرغبات!` : `تمت إزالة ${product.name} من قائمة الرغبات.`,
            'success'
        );
    };

    const addToCompare = (product: Product) => {
        const isInCompare = compareList.includes(product.id);
        if (!isInCompare && compareList.length >= 4) {
            addToast('يمكنك مقارنة 4 منتجات كحد أقصى.', 'info');
            return;
        }
        dispatch({ type: 'TOGGLE_COMPARE', payload: product.id });
        addToast(isInCompare ? 'تمت الإزالة من المقارنة.' : 'تمت الإضافة إلى المقارنة!', 'success');
    };

    const commonProductProps = {
        navigateTo,
        addToCart,
        openQuickView,
        products: allProducts,
        toggleWishlist: toggleWishlist,
        addToCompare: addToCompare,
    };
    
    const vipPicks = allProducts.filter(p => [5, 9, 8].includes(p.id));
    const trendingProducts = allProducts.filter(p => 
        p.badges?.some(b => b.type === 'trending') || p.tags.includes('رائج')
    ).slice(0, 4);

    return (
        <>
            {/* 1. Hero Section */}
            <div className="-mt-20">
                <HeroSection 
                    navigateTo={navigateTo} 
                    products={allProducts}
                    addToCart={addToCart}
                    toggleWishlist={toggleWishlist}
                    wishlistItems={wishlist.map(item => item.id)}
                />
            </div>
            
            {/* 2. Categories Section */}
            <CategoriesSection navigateTo={navigateTo} />

            {/* 3. Tabbed Product Section */}
            <TabbedProductSection {...commonProductProps} />

            {/* 4. Fashion Reels Section */}
            <FashionReelsSection
                navigateTo={navigateTo}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
            />
            
            {/* 5. AI Recommendations Section */}
            <AiRecommendationsSection {...commonProductProps} />

            {/* 6. Countdown Sale Section */}
            {saleCampaigns.filter(c => c.status === 'Active').map(campaign => (
                <CountdownSaleSection key={campaign.id} campaign={campaign} navigateTo={navigateTo} />
            ))}
            
            {/* 7. VIP Picks Section */}
            <TrendingProductsSection
                title="اختيارات VIP"
                products={vipPicks}
                navigateTo={navigateTo}
                addToCart={addToCart}
                openQuickView={openQuickView}
                addToCompare={addToCompare}
                toggleWishlist={toggleWishlist}
                isCarousel
            />

            {/* 8. Featured Product Section */}
            <FeaturedProductSection navigateTo={navigateTo} />

            {/* 9. Trending Products Section */}
            <div className="bg-white">
                <TrendingProductsSection
                    title="المنتجات الرائجة"
                    products={trendingProducts}
                    navigateTo={navigateTo}
                    addToCart={addToCart}
                    openQuickView={openQuickView}
                    addToCompare={addToCompare}
                    toggleWishlist={toggleWishlist}
                />
                 <div className="text-center pb-16">
                    <button onClick={() => navigateTo('shop')} className="bg-white border border-brand-border text-brand-dark font-bold py-3 px-8 rounded-full hover:bg-brand-subtle transition-colors">
                        عرض كل المنتجات الرائجة
                    </button>
                </div>
            </div>

            {/* 10. Inspired By You Section */}
            <InspiredByYouSection navigateTo={navigateTo} />

            {/* 11. Testimonials Section */}
            <TestimonialsSection navigateTo={navigateTo} />

            {/* 12. Brand Promise Section */}
            <BrandPromiseSection />

            {/* 13. Recently Viewed Section */}
            <RecentlyViewedSection
                title="المنتجات التي تمت مشاهدتها مؤخرًا"
                navigateTo={navigateTo}
                addToCart={addToCart}
                openQuickView={openQuickView}
                addToCompare={commonProductProps.addToCompare}
                toggleWishlist={toggleWishlist}
            />

            {/* 14. Brand Logos */}
            <BrandLogos />

            {/* 15. Instagram Section */}
            <InstagramSection />

            {/* 16. Features Bar */}
            <FeaturesBar />
        </>
    );
};

export default HomePage;