import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../../types';
import { allProducts } from '../../data/products';
import { useAppState } from '../../state/AppState';
import { HeartIcon, ShoppingBagIcon, ShareIcon } from '../icons';
import { useToast } from '../../hooks/useToast';

interface FashionReelsSectionProps {
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product, options?: { quantity?: number; selectedSize?: string; selectedColor?: string }) => void;
    toggleWishlist: (product: Product) => void;
}

const ReelCard: React.FC<{
    product: Product;
    navigateTo: (pageName: string, data?: Product) => void;
    addToCart: (product: Product, options?: { quantity?: number; selectedSize?: string; selectedColor?: string }) => void;
    toggleWishlist: (product: Product) => void;
    isLiked: boolean;
}> = ({ product, navigateTo, addToCart, toggleWishlist, isLiked }) => {
    
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const addToast = useToast();
    const images = useMemo(() => product.images?.length ? product.images : [product.image], [product]);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const progressAnimationDuration = 4000; // 4 seconds per image

    useEffect(() => {
        if (isPaused || images.length <= 1) return;

        const timer = setTimeout(() => {
            setActiveImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, progressAnimationDuration);

        return () => clearTimeout(timer);
    }, [activeImageIndex, isPaused, images.length]);


    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAddingToCart) return;
        addToCart(product, { selectedColor: product.colors[0], selectedSize: product.sizes[0] });
        setIsAddingToCart(true);
        addToast(`${product.name} أضيف إلى السلة!`, 'success');
        setTimeout(() => setIsAddingToCart(false), 2000);
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleWishlist(product);
    };
    
    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const shareData = {
            title: `شاهدي ${product.name} من فينيتا`,
            text: product.description,
            url: window.location.href,
        };
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error('Error sharing:', err);
            navigator.clipboard.writeText(window.location.href);
            addToast('تم نسخ الرابط!', 'info');
        }
    };

    const badgeStyles: { [key: string]: string } = {
        sale: 'bg-brand-sale text-white',
        new: 'bg-blue-500 text-white',
        trending: 'bg-orange-500 text-white',
        vip: 'bg-purple-600 text-white',
        custom: 'bg-brand-dark text-white',
    };

    return (
        <div 
            className="relative w-72 aspect-[9/16] flex-shrink-0 snap-center rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
            onClick={() => navigateTo('product', product)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Image Slideshow */}
            <div className="absolute inset-0 w-full h-full">
                {images.map((src, index) => (
                    <img
                        key={src + index}
                        src={src}
                        alt={`${product.name} view ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${activeImageIndex === index ? 'opacity-100' : 'opacity-0'}`}
                    />
                ))}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            {/* Progress Bars */}
            {images.length > 1 && (
                <div className="absolute top-0 left-0 right-0 p-2 z-10">
                    <div className="flex gap-1">
                        {images.map((_, index) => (
                            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                                {index < activeImageIndex && <div className="h-full bg-white"></div>}
                                {index === activeImageIndex && (
                                    <div
                                        key={activeImageIndex}
                                        className="h-full bg-white origin-left animate-reel-progress"
                                        style={{
                                            animationDuration: `${progressAnimationDuration}ms`,
                                            animationPlayState: isPaused ? 'paused' : 'running'
                                        }}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="relative w-full h-full p-5 flex flex-col justify-end text-white text-shadow pointer-events-none">
                <div className="flex justify-between items-end">
                    <div className="max-w-[calc(100%-4rem)]">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            {product.badges?.map((badge, index) => (
                                <span key={index} className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow ${badgeStyles[badge.type] || badgeStyles.custom}`}>
                                    {badge.text}
                                </span>
                            ))}
                        </div>
                        <h3 className="font-bold text-2xl line-clamp-2">{product.name}</h3>
                        <div className="flex items-baseline gap-2 mt-3">
                            <span className="text-xl font-bold">{product.price} ج.م</span>
                            {product.oldPrice && <span className="text-base line-through opacity-70">{product.oldPrice} ج.م</span>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 pointer-events-auto">
                        <button onClick={handleToggleWishlist} className="flex flex-col items-center text-white transition-transform hover:scale-110 active:scale-95">
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                 <HeartIcon filled={isLiked} className={`${isLiked ? 'text-red-500' : 'text-white'}`} />
                            </div>
                        </button>
                        <button onClick={handleAddToCart} className="flex flex-col items-center text-white transition-transform hover:scale-110 active:scale-95">
                             <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                {isAddingToCart ? <i className="fa-solid fa-check text-2xl text-green-400"></i> : <ShoppingBagIcon />}
                            </div>
                        </button>
                        <button onClick={handleShare} className="flex flex-col items-center text-white transition-transform hover:scale-110 active:scale-95">
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                <ShareIcon />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const FashionReelsSection: React.FC<FashionReelsSectionProps> = ({ navigateTo, addToCart, toggleWishlist }) => {
    const { state } = useAppState();
    const { wishlist } = state;
    const wishlistIds = useMemo(() => wishlist.map(item => item.id), [wishlist]);

    // Now using all products for the reels section
    const featuredProducts = allProducts;

    return (
        <section className="py-16 bg-brand-bg overflow-hidden">
            <div className="container mx-auto">
                <div className="text-center mb-10 px-4">
                    <h2 className="text-4xl font-extrabold text-brand-dark">اكتشفي فيديوهات أزيائنا</h2>
                    <p className="text-brand-text-light mt-2 max-w-2xl mx-auto">استلهمي إطلالاتك من أحدث صيحاتنا وتسوقي قطعك المفضلة مباشرة.</p>
                </div>
                <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth py-4 -mx-4 px-4">
                    {featuredProducts.map((product) => (
                        <ReelCard 
                            key={product.id}
                            product={product}
                            navigateTo={navigateTo}
                            addToCart={addToCart}
                            toggleWishlist={toggleWishlist}
                            isLiked={wishlistIds.includes(product.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
