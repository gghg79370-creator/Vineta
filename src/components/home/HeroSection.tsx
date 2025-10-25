

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '../../types';

interface HeroSectionProps {
    navigateTo: (pageName: string, data?: any) => void;
    products: Product[];
    addToCart: (product: Product, options?: { quantity?: number; selectedSize?: string; selectedColor?: string }) => void;
    toggleWishlist: (product: Product) => void;
    wishlistItems: number[];
}

export const HeroSection = ({ navigateTo, products, addToCart, toggleWishlist, wishlistItems }: HeroSectionProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const AUTOPLAY_DELAY = 7000;

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    const goToNext = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, [products.length]);
    
    const goToPrevious = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
    }, [products.length]);

    useEffect(() => {
        resetTimeout();
        if (products.length > 1 && !isPaused) {
            timeoutRef.current = setTimeout(goToNext, AUTOPLAY_DELAY);
        }
        return () => resetTimeout();
    }, [currentIndex, goToNext, resetTimeout, products.length, isPaused]);
    
    useEffect(() => {
        // When the slide changes, briefly un-pause to allow the progress bar to restart
        setIsPaused(false);
    }, [currentIndex]);

    const handleProductClick = (product: Product) => {
        navigateTo('product', product);
    }

    const handleAddToCart = (product: Product) => {
        if (isAddingToCart !== null) return;
        if (product) {
            addToCart(product, { selectedColor: product.colors[0], selectedSize: product.sizes[0] });
            setIsAddingToCart(product.id);
            setTimeout(() => setIsAddingToCart(null), 2000);
        }
    };
    
    const handleLikeClick = (product: Product) => {
        if (product) {
            toggleWishlist(product);
        }
    };
    
    const handleShareClick = async (product: Product) => {
        const shareData = {
            title: `Check out ${product.name} from Vineta`,
            text: product.description,
            url: window.location.href,
        };
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error('Error sharing:', err);
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => { setTouchEndX(0); setTouchStartX(e.targetTouches[0].clientX); };
    const handleTouchMove = (e: React.TouchEvent) => { setTouchEndX(e.targetTouches[0].clientX); };
    const handleTouchEnd = () => {
        if (touchStartX === 0 || touchEndX === 0) return;
        const threshold = 50;
        if (touchStartX - touchEndX > threshold) goToNext();
        else if (touchEndX - touchStartX > threshold) goToPrevious();
    };

    if (!products || products.length === 0) {
        return <section className="w-full h-screen bg-brand-subtle flex items-center justify-center"><p>لا توجد منتجات للعرض.</p></section>;
    }

    const currentProduct = products[currentIndex];
    const isLiked = wishlistItems.includes(currentProduct.id);
    
    const badgeStyles: { [key: string]: string } = {
        sale: 'bg-brand-sale text-white',
        new: 'bg-blue-500 text-white',
        trending: 'bg-orange-500 text-white',
        vip: 'bg-purple-600 text-white',
        custom: 'bg-brand-dark text-white',
    };
    
    const Backgrounds = () => (
      <>
        {products.map((product, productIndex) => (
          <div key={product.id} className={`absolute inset-0 w-full h-full transition-opacity duration-[1500ms] ease-in-out ${productIndex === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
            <img src={product.image} alt="" className="w-full h-full object-cover animate-ken-burns" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-black/60 lg:to-transparent"></div>
          </div>
        ))}
      </>
    );

    return (
        <section className="relative w-full h-screen bg-brand-dark text-brand-bg overflow-hidden" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            <Backgrounds />
            
            <div className="relative h-full z-10">
                
                {/* ========================== */}
                {/* == MOBILE REEL LAYOUT == */}
                {/* ========================== */}
                <div className="lg:hidden h-full flex flex-col items-center justify-center">
                    <div className="absolute top-0 left-0 right-0 p-4">
                        <div className="flex gap-1.5">
                            {products.map((_, index) => (
                                <div key={index} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                                    {index === currentIndex && (
                                        <div 
                                            key={currentIndex} 
                                            className="h-full bg-white animate-reel-progress transform-origin-left"
                                            style={{ animationPlayState: isPaused ? 'paused' : 'running', animationDuration: `${AUTOPLAY_DELAY}ms` }}
                                        ></div>
                                    )}
                                    {index < currentIndex && <div className="h-full bg-white"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div 
                        className="relative w-full max-w-sm aspect-[9/16] group" 
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                         <div className="absolute inset-0" onClick={() => setIsPaused(p => !p)}></div>
                         <div className="absolute inset-0">
                            <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10 flex flex-col gap-5 pointer-events-auto">
                               <button onClick={() => handleLikeClick(currentProduct)} className="flex flex-col items-center text-white text-shadow transition-transform hover:scale-110 active:scale-95">
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                        <i className={`${isLiked ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart text-2xl transition-all`}></i>
                                    </div>
                                </button>
                                <button onClick={() => handleAddToCart(currentProduct)} className="flex flex-col items-center text-white text-shadow transition-transform hover:scale-110 active:scale-95">
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                        {isAddingToCart === currentProduct.id ? <i className="fa-solid fa-check text-2xl text-green-400"></i> : <i className="fa-solid fa-cart-shopping text-2xl"></i>}
                                    </div>
                                </button>
                                <button onClick={() => handleShareClick(currentProduct)} className="flex flex-col items-center text-white text-shadow transition-transform hover:scale-110 active:scale-95">
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                        <i className="fa-solid fa-share-nodes text-2xl"></i>
                                    </div>
                                </button>
                            </div>
                            <div className="absolute bottom-24 left-6 right-6 z-10 pointer-events-auto">
                                <div key={currentIndex} className="animate-hero-text-reveal">
                                    <div className="mb-4 flex flex-wrap items-center gap-2">
                                        {currentProduct.badges?.map((badge, index) => (
                                            <span key={index} className={`text-xs font-bold px-3 py-1 rounded-full shadow-md ${badgeStyles[badge.type] || badgeStyles.custom}`}>
                                                {badge.text}
                                            </span>
                                        ))}
                                    </div>
                                    <h2 className="text-4xl font-serif font-bold text-white text-shadow">{currentProduct.name}</h2>
                                    <div className="mt-4 flex items-center gap-4">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-white text-shadow">{currentProduct.price} ج.م</span>
                                            {currentProduct.oldPrice && <span className="text-lg text-gray-300 line-through text-shadow">{currentProduct.oldPrice} ج.م</span>}
                                        </div>
                                        <button onClick={() => handleProductClick(currentProduct)} className="bg-white/90 text-brand-dark text-sm font-bold py-2.5 px-6 rounded-full hover:bg-white transition-transform hover:scale-105">
                                            تسوق الآن
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="absolute bottom-6 flex-shrink-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        <button onClick={() => navigateTo('shop')} className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-3 px-10 rounded-full text-base hover:bg-white/20 transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-lg">
                            اكتشف المجموعة الكاملة
                        </button>
                    </div>
                </div>

                {/* ========================== */}
                {/* == DESKTOP FULL LAYOUT === */}
                {/* ========================== */}
                <div className="hidden lg:flex h-full flex-col container mx-auto px-4">
                    <div className="flex-grow flex items-center">
                        <div key={currentIndex} className="w-full grid grid-cols-12 items-center gap-16">
                            
                            <div className="col-span-6 text-right animate-fade-in-up">
                                <div className="flex flex-wrap items-center gap-2 justify-end mb-4" style={{ animationDelay: '200ms' }}>
                                    {currentProduct.badges?.map((badge, index) => (
                                        <span key={index} className={`text-xs font-bold px-3 py-1 rounded-full shadow-md ${badgeStyles[badge.type] || badgeStyles.custom}`}>
                                            {badge.text}
                                        </span>
                                    ))}
                                </div>
                                <h2 className="text-6xl font-serif font-bold text-white text-shadow" style={{ animationDelay: '300ms' }}>{currentProduct.name}</h2>
                                <p className="text-gray-300 leading-relaxed line-clamp-3 my-6 max-w-lg ml-auto" style={{ animationDelay: '400ms' }}>{currentProduct.description}</p>
                                <div className="flex items-baseline gap-3 my-6 justify-end" style={{ animationDelay: '500ms' }}>
                                    <span className="text-4xl font-bold text-white text-shadow">{currentProduct.price} ج.م</span>
                                    {currentProduct.oldPrice && <span className="text-2xl text-gray-300 line-through text-shadow">{currentProduct.oldPrice} ج.م</span>}
                                </div>
                                <div className="flex items-center gap-4 justify-end" style={{ animationDelay: '600ms' }}>
                                     <button onClick={() => handleProductClick(currentProduct)} className="bg-white text-brand-dark font-bold py-3 px-8 rounded-full text-base hover:bg-opacity-90 transition-transform hover:scale-105">
                                        تسوق الآن
                                    </button>
                                     <button onClick={() => handleAddToCart(currentProduct)} className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 text-white hover:bg-white/20 transition-colors">
                                        {isAddingToCart === currentProduct.id ? <i className="fa-solid fa-check text-xl text-green-400"></i> : <i className="fa-solid fa-cart-shopping text-xl"></i>}
                                    </button>
                                    <button onClick={() => handleLikeClick(currentProduct)} className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 text-white hover:bg-white/20 transition-colors">
                                        <i className={`${isLiked ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart text-xl transition-all`}></i>
                                    </button>
                                    <button onClick={() => handleShareClick(currentProduct)} className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 text-white hover:bg-white/20 transition-colors">
                                        <i className="fa-solid fa-share-nodes text-xl"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="col-span-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                                <div className="relative group cursor-pointer" onClick={() => handleProductClick(currentProduct)}>
                                    <img src={currentProduct.image} alt={currentProduct.name} className="w-full aspect-[4/5] object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0 pb-8 flex justify-between items-center">
                        <div className="flex gap-2">
                            {products.map((_, index) => (
                                <button key={index} onClick={() => setCurrentIndex(index)} className={`h-1 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-8' : 'bg-white/30 w-4 hover:bg-white/50'}`}></button>
                            ))}
                        </div>
                        <button onClick={() => navigateTo('shop')} className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-2 px-6 rounded-full text-sm hover:bg-white/20 transition-colors">
                            اكتشف المجموعة الكاملة
                        </button>
                    </div>
                </div>
                
                <button onClick={goToPrevious} className="hidden lg:flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors absolute top-1/2 -translate-y-1/2 right-8">
                    <i className="fa-solid fa-chevron-right text-2xl"></i>
                </button>
                <button onClick={goToNext} className="hidden lg:flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors absolute top-1/2 -translate-y-1/2 left-8">
                    <i className="fa-solid fa-chevron-left text-2xl"></i>
                </button>
            </div>
        </section>
    );
};