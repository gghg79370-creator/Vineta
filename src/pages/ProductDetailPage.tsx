import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, Review } from '../types';
import { StarIcon, MinusIcon, PlusIcon, HeartIcon, CompareIcon, QuestionIcon, ShareIcon, ChevronDownIcon, CheckIcon, FireIcon, ChevronLeftIcon, LockClosedIcon, EyeIcon, ShoppingBagIcon, TruckIcon, SearchIcon, ArrowUpIcon, ChevronRightIcon, CloseIcon, PackageIcon } from '../components/icons';
import { TrendingProductsSection } from '../components/product/TrendingProductsSection';
import { ReviewsSection } from '../components/product/ReviewsSection';
import { allProducts } from '../data/products';
import { SizeGuideModal } from '../components/modals/SizeGuideModal';
import { useAppState } from '../state/AppState';
import { useToast } from '../hooks/useToast';
import { RecentlyViewedSection } from '../components/product/RecentlyViewedSection';
import { WriteReviewModal } from '../components/modals/WriteReviewModal';
import { useCountdown } from '../hooks/useCountdown';
import { FrequentlyBoughtTogether } from '../components/product/FrequentlyBoughtTogether';

interface ProductDetailPageProps {
    product: Product;
    navigateTo: (pageName: string, data?: any) => void;
    addToCart: (product: Product, options?: { quantity?: number; selectedSize?: string; selectedColor?: string }) => void;
    openQuickView: (product: Product) => void;
    setIsAskQuestionOpen: (isOpen: boolean) => void;
    setIsCompareOpen: (isOpen: boolean) => void;
}

const AccordionItem = ({ title, icon, children, defaultOpen = false }: { title: string, icon: React.ReactNode, children?: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-brand-border/30 last:border-b-0 transition-colors duration-300 hover:bg-brand-subtle/30">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center text-right p-6 font-bold text-lg md:text-xl text-brand-dark"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-4">
                    <span className="text-brand-primary text-xl w-6 text-center">{icon}</span>
                    <span className="font-serif">{title}</span>
                </div>
                <span className={`transform transition-transform duration-500 ease-out ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDownIcon />
                </span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-0 text-brand-text-light text-base leading-relaxed prose max-w-none">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};


const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
    const timeLeft = useCountdown(targetDate);
    const timeParts = [
        { label: 'أيام', value: timeLeft.days },
        { label: 'ساعات', value: timeLeft.hours },
        { label: 'دقائق', value: timeLeft.minutes },
        { label: 'ثواني', value: timeLeft.seconds },
    ];
    return (
        <div className="p-4 bg-rose-50 border-2 border-dashed border-rose-200 rounded-lg my-6">
            <h4 className="font-bold text-center text-rose-700 mb-2">عرض محدود! ينتهي في:</h4>
            <div className="flex justify-center gap-3 text-center">
                {timeParts.map(part => (
                    <div key={part.label} className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-brand-dark bg-white py-1 px-2 rounded-md shadow-sm w-12 tabular-nums">{String(part.value).padStart(2, '0')}</span>
                        <span className="text-xs text-brand-text-light mt-1">{part.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const useCountUp = (endValue: number, duration: number) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      const newCount = Math.floor(endValue * percentage);
      setCount(newCount);

      if (progress < duration) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
        if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  }, [endValue, duration]);

  return count;
};


export const ProductDetailPage = ({ product: initialProduct, navigateTo, addToCart, openQuickView, setIsAskQuestionOpen }: ProductDetailPageProps) => {
    const product = initialProduct || allProducts[0];
    const { state, dispatch } = useAppState();
    const { compareList, wishlist, currentUser, cart } = state;
    const addToast = useToast();

    const [mainImage, setMainImage] = useState(product.image);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity, setQuantity] = useState(1);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const colorContainerRef = useRef<HTMLDivElement>(null);

    const soldCount = useCountUp(product.soldIn24h || 0, 1500);
    
    const saleEndDate = product.saleEndDate ? new Date(product.saleEndDate) : null;
    const isSaleActive = saleEndDate && saleEndDate > new Date();

    const isInCompare = compareList.includes(product.id);
    const isInWishlist = wishlist.some(item => item.id === product.id);
    const approvedReviews = product.reviews?.filter(r => r.status === 'Approved') || [];

    const ratingSummary: {[key: string]: number} = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
    approvedReviews.forEach(review => {
        if (ratingSummary[review.rating.toString()] !== undefined) {
            ratingSummary[review.rating.toString()]++;
        }
    });
    const totalReviews = approvedReviews.length;
    const averageRating = totalReviews > 0 ? approvedReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews : 0;

    const selectedVariant = useMemo(() => {
        if (!product.variants || product.variants.length === 0) return null;
        return product.variants.find(v => v.size === selectedSize && v.color === selectedColor) || null;
    }, [product.variants, selectedSize, selectedColor]);
    
    const stockCount = selectedVariant?.stock ?? product.itemsLeft;
    const displayPrice = selectedVariant?.price || product.price;
    const displayOldPrice = selectedVariant?.oldPrice || product.oldPrice;
    const isOutOfStock = stockCount !== undefined && stockCount === 0;

    const itemInCart = useMemo(() => {
        return cart.find(item => item.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize);
    }, [cart, product.id, selectedColor, selectedSize]);

    useEffect(() => {
        dispatch({ type: 'ADD_TO_RECENTLY_VIEWED', payload: product.id });
        setMainImage(product.image);
        
        const defaultVariant = product.variants?.find(v => v.stock > 0) || product.variants?.[0];
        if (defaultVariant) {
            setSelectedColor(defaultVariant.color);
            setSelectedSize(defaultVariant.size);
        } else {
            setSelectedColor(product.colors[0]);
            setSelectedSize(product.sizes[0]);
        }
        setQuantity(1);
        window.scrollTo(0, 0);
    }, [product, dispatch]);

    const handleSelectColor = (color: string) => {
        setSelectedColor(color);
        const isCurrentSizeAvailable = product.variants?.some(v => v.color === color && v.size === selectedSize && v.stock > 0);
        if (!isCurrentSizeAvailable) {
            const firstAvailableSizeForColor = product.variants?.find(v => v.color === color && v.stock > 0)?.size;
            if (firstAvailableSizeForColor) {
                setSelectedSize(firstAvailableSizeForColor);
            }
        }
    };

    const handleSelectSize = (size: string) => {
        setSelectedSize(size);
    };

    const discountPercent = displayOldPrice ? Math.round(((parseFloat(displayOldPrice) - parseFloat(displayPrice)) / parseFloat(displayOldPrice)) * 100) : 0;

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        const productForCart = { ...product, price: displayPrice, oldPrice: displayOldPrice };
        addToCart(productForCart, { quantity, selectedSize, selectedColor });
    };

    const handleBuyNow = () => {
        if (isOutOfStock) return;
        handleAddToCart();
        navigateTo('checkout');
    };

    const renderStars = (currentRating: number) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <button 
                        key={i} 
                        disabled
                        aria-label={`Rated ${i + 1} stars`}
                    >
                        <StarIcon className={`w-5 h-5 ${i < Math.round(currentRating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                ))}
            </div>
        );
    };

    const images = product.images ?? [product.image];

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setIsLightboxOpen(true);
    };
    
    const handleToggleWishlist = () => {
        if(!currentUser) {
            addToast('الرجاء تسجيل الدخول لحفظ المنتجات في قائمة رغباتك.', 'info');
            navigateTo('login');
            return;
        }
        dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });
    }
    
    const handleToggleCompare = () => {
        dispatch({ type: 'TOGGLE_COMPARE', payload: product.id });
    }

    const handleNextImage = () => {
        const currentIndex = images.indexOf(mainImage);
        const nextIndex = (currentIndex + 1) % images.length;
        setMainImage(images[nextIndex]);
    };

    const handlePrevImage = () => {
        const currentIndex = images.indexOf(mainImage);
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setMainImage(images[prevIndex]);
    };
    
    const lowStockThreshold = 13;
    const stockProgress = stockCount !== undefined && stockCount < lowStockThreshold
        ? Math.max(0, (lowStockThreshold - stockCount) / lowStockThreshold) * 100
        : 0;

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 pt-6 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="order-1 lg:order-2">
                        <div className="flex flex-row-reverse gap-4 h-[500px] md:h-[600px] lg:h-[700px]">
                            <div className="relative w-24 flex-shrink-0">
                                <div className="h-full overflow-y-auto scrollbar-hide space-y-3 scroll-smooth">
                                    {images.map((img, index) => (<button key={index} onMouseEnter={() => setMainImage(img)} onClick={() => setMainImage(img)} className={`w-24 h-28 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${mainImage === img ? 'border-brand-dark' : 'border-transparent opacity-60 hover:opacity-100'}`}><img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" /></button>))}
                                </div>
                            </div>
                            <div className="relative flex-1 rounded-lg overflow-hidden group">
                                <img src={mainImage} alt={product.name} className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105" onClick={() => openLightbox(images.indexOf(mainImage))} />
                                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2">
                                    <button onClick={handlePrevImage} className="bg-white/50 rounded-full p-2 shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"><ChevronLeftIcon /></button>
                                    <button onClick={handleNextImage} className="bg-white/50 rounded-full p-2 shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"><ChevronRightIcon /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                     {/* Product Details */}
                    <div className="mt-6 lg:mt-0 order-2 lg:order-1">
                         <nav aria-label="Breadcrumb" className="mb-4 text-sm text-brand-text-light">
                            <ol className="list-none p-0 inline-flex items-center">
                                <li className="flex items-center">
                                    <button onClick={() => navigateTo('home')} className="hover:text-brand-primary">الرئيسية</button>
                                </li>
                                <li className="flex items-center">
                                    <span className="mx-2 text-brand-border">•</span>
                                    <span>{product.name}</span>
                                </li>
                            </ol>
                        </nav>
                        
                        <div className="tf-product-heading space-y-4">
                            {product.brand && <span className="brand-product text-sm font-semibold text-brand-text-light uppercase tracking-wider">{product.brand}</span>}
                            <h1 className="product-name text-4xl font-bold text-brand-dark">{product.name}</h1>
                            <div className="product-rate flex items-center gap-2">
                                <div className="list-star flex">
                                    {renderStars(product.rating || 0)}
                                </div>
                                <a href="#reviews" className="count-review text-sm text-brand-text-light hover:underline">({approvedReviews.length} تقييمًا)</a>
                            </div>

                            <div className="product-price flex items-baseline gap-3">
                                <div className="price-new price-on-sale text-4xl font-bold text-brand-primary">{displayPrice} ج.م</div>
                                {displayOldPrice && <div className="price-old text-2xl text-brand-text-light line-through">{displayOldPrice} ج.م</div>}
                                {discountPercent > 0 && <span className="badge-sale bg-brand-sale text-white text-sm font-bold px-4 py-1.5 rounded-full">خصم {discountPercent}%</span>}
                            </div>

                             <div className="product-stock flex items-center gap-4 py-3">
                               {isOutOfStock ? (
                                    <span className="stock out-of-stock bg-gray-100 text-gray-500 text-sm font-bold px-3 py-1.5 rounded-md">نفد المخزون</span>
                                ) : (
                                    <span className="stock in-stock bg-green-100 text-green-800 text-sm font-bold px-3 py-1.5 rounded-md">متوفر</span>
                                )}
                               {product.soldIn24h && (
                                    <div className="flex items-center gap-1.5 text-brand-dark font-semibold text-sm">
                                        <svg className="icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.2759 10.9242C15.2556 10.6149 14.9236 10.4281 14.6488 10.5714C14.4098 10.6961 13.6603 11.0196 13.0698 11.0196C12.6156 11.0196 12.3132 10.8694 12.3132 10.1362C12.3132 8.12636 15.0124 6.52078 12.6056 3.51218C12.3295 3.16719 11.773 3.41746 11.8469 3.85238C11.8484 3.86145 11.9887 4.77182 11.5632 5.27582C11.3635 5.51218 11.061 5.62711 10.6384 5.62711C9.17454 5.62711 9.27646 1.94027 11.1223 0.795793C11.5328 0.541367 11.2702 -0.0948905 10.8012 0.0119845C10.683 0.0387033 7.88684 0.701328 6.39105 3.62798C5.28035 5.80099 5.88191 7.29977 6.32116 8.39418C6.71371 9.3722 6.89283 9.81857 6.01364 10.4273C5.68251 10.6566 5.42618 10.6328 5.42618 10.6328C4.60384 10.6328 3.82489 9.42402 3.59437 8.95879C3.40712 8.57837 2.83721 8.67311 2.78314 9.09372C2.75993 9.27457 2.24057 13.5513 4.51026 16.1312C5.76076 17.5525 7.50054 18.0581 9.40742 17.9948C11.1702 17.9357 12.5768 17.3395 13.5883 16.2228C15.4639 14.152 15.2844 11.0549 15.2759 10.9242Z" fill="#F2721C"></path><path d="M4.44845 10.1357C4.04521 9.74669 3.72761 9.22817 3.59412 8.95877C3.40688 8.57834 2.83696 8.67309 2.78289 9.0937C2.75969 9.27454 2.24032 13.5513 4.51001 16.1312C5.2812 17.0077 6.27795 17.5784 7.48458 17.8379C4.95987 16.3506 4.24181 13.0162 4.44845 10.1357Z" fill="#EA5513"></path><path d="M3.73448 4.51577C3.70506 4.49735 3.66772 4.49735 3.6383 4.51577C2.64745 5.13712 2.64446 6.58633 3.6383 7.20955C3.66723 7.22769 3.70471 7.22825 3.73448 7.20955C4.72533 6.58816 4.72821 5.13898 3.73448 4.51577Z" fill="#F2721C"></path><path d="M4.12025 4.85809C4.01204 4.72502 3.88239 4.60855 3.73448 4.51577C3.70506 4.49735 3.66772 4.49735 3.6383 4.51577C2.64745 5.13712 2.64446 6.58633 3.6383 7.20955C3.66723 7.22769 3.70471 7.22825 3.73448 7.20955C3.88242 7.11677 4.01208 7.00026 4.12029 6.8672C3.64157 6.28237 3.64072 5.44386 4.12025 4.85809Z" fill="#EA5513"></path><path d="M10.8011 0.0119845C10.6829 0.0387033 7.88676 0.701328 6.39096 3.62798C4.90723 6.53083 6.48163 8.24741 6.63386 9.34639L6.63403 9.34629C6.69 9.74974 6.54569 10.0588 6.01356 10.4272C5.69392 10.6486 5.40494 10.6816 5.10034 10.5723V10.5727C5.10034 10.5727 6.17507 11.6058 7.26087 10.8972C8.33686 10.1951 8.02601 9.11809 7.85986 8.63131L7.86025 8.63103C7.46365 7.57951 7.11673 6.19027 8.09319 4.27988C8.67292 3.14557 9.44797 2.35153 10.1868 1.80263C10.426 1.38835 10.7395 1.0331 11.1223 0.795758C11.5326 0.541367 11.2701 -0.0948905 10.8011 0.0119845Z" fill="#EA5513"></path></svg>
                                        <span className="text-dark">تم بيع {soldCount} في آخر 24 ساعة</span>
                                    </div>
                               )}
                            </div>

                             {stockCount !== undefined && stockCount > 0 && stockCount < lowStockThreshold && (
                                <div className="product-progress-sale pt-2">
                                    <div className="title-hurry-up text-sm mb-2">
                                        <span className="text-brand-primary font-bold">اسرع! </span> 
                                        <span>تبقى فقط </span>
                                        <span className="count font-bold text-brand-dark">{stockCount}</span>
                                        <span> قطع!</span>
                                    </div>
                                    <div className="progress-sold bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                        <div 
                                            className="value bg-brand-primary h-full rounded-full transition-all duration-1000 ease-out" 
                                            style={{ width: `${stockProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {isSaleActive && saleEndDate && <CountdownTimer targetDate={saleEndDate} />}
                        
                        <hr className="my-6"/>

                        <div className="mb-5">
                            <label className="font-bold text-brand-dark mb-3 block">اللون: <span className="font-normal text-brand-text-light">{selectedColor}</span></label>
                            <div className="flex items-center gap-3">
                                {product.colors.map(color => (
                                    <button key={color} onClick={() => handleSelectColor(color)} className={`w-9 h-9 flex-shrink-0 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color ? 'border-brand-dark ring-2 ring-brand-dark/30' : 'border-transparent'}`}><span className="w-7 h-7 rounded-full border border-black/10" style={{backgroundColor: color}}></span></button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-bold text-brand-dark">المقاس: <span className="font-normal text-brand-text-light">{selectedSize}</span></p>
                                <button onClick={() => setIsSizeGuideOpen(true)} className="text-sm text-brand-text-light underline hover:text-brand-dark">دليل المقاسات</button>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                {product.sizes.map(size => {
                                    const isSelected = selectedSize === size;
                                    const isAvailableForColor = product.variants?.some(v => v.color === selectedColor && v.size === size && v.stock > 0) ?? true;

                                    const buttonClasses = [
                                        'w-12 h-12 flex items-center justify-center rounded-lg border text-base font-bold transition-all relative',
                                        isSelected 
                                            ? 'bg-brand-dark text-white border-brand-dark ring-2 ring-brand-dark/30' 
                                            : isAvailableForColor 
                                                ? 'bg-white border-brand-border hover:border-brand-dark'
                                                : 'bg-gray-50 border-brand-border text-gray-300 cursor-not-allowed opacity-70'
                                    ].join(' ');

                                    return (
                                        <button 
                                            key={size} 
                                            onClick={() => handleSelectSize(size)}
                                            disabled={!isAvailableForColor}
                                            className={buttonClasses}
                                            aria-label={`Select size ${size}${!isAvailableForColor ? ' (Out of stock)' : ''}`}
                                        >
                                            {size}
                                            {!isAvailableForColor && (
                                                <span 
                                                    aria-hidden="true" 
                                                    className="absolute w-10 h-px bg-gray-400 transform rotate-[-15deg]"
                                                ></span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        
                         <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3 mb-3">
                            <div className="flex items-center border border-brand-border rounded-full justify-between">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-brand-text-light hover:text-brand-dark"><MinusIcon/></button>
                                <span className="text-center font-bold text-lg">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-brand-text-light hover:text-brand-dark"><PlusIcon/></button>
                            </div>
                             <button onClick={handleAddToCart} disabled={isOutOfStock} className="w-full bg-brand-dark text-white font-bold py-3.5 px-8 rounded-full transition-colors disabled:opacity-50">{isOutOfStock ? 'نفد المخزون' : 'أضف إلى السلة'}</button>
                        </div>
                        <button onClick={handleBuyNow} disabled={isOutOfStock} className="w-full bg-brand-primary text-white font-bold py-3.5 px-8 rounded-full transition-transform transform hover:scale-105 active:scale-98 disabled:opacity-50">اشترِ الآن</button>
                        
                        <div className="flex items-center justify-center gap-6 text-sm font-semibold text-brand-text-light mt-6 border-t pt-6">
                            <button onClick={handleToggleWishlist} className="flex items-center gap-2 hover:text-brand-primary"><HeartIcon filled={isInWishlist} /> {isInWishlist ? 'في قائمة الرغبات' : 'أضف للرغبات'}</button>
                            <button onClick={() => setIsAskQuestionOpen(true)} className="flex items-center gap-2 hover:text-brand-primary"><QuestionIcon /> اسأل سؤالاً</button>
                            <button onClick={handleToggleCompare} className="flex items-center gap-2 hover:text-brand-primary"><CompareIcon /> {isInCompare ? 'إزالة من المقارنة' : 'أضف للمقارنة'}</button>
                            <button className="flex items-center gap-2 hover:text-brand-primary"><ShareIcon /> مشاركة</button>
                        </div>

                        <div className="mt-6 text-sm">
                            <p><span className="font-bold">SKU:</span> {product.sku}</p>
                            <p><span className="font-bold">Categories:</span> {product.tags.slice(0, 2).join(', ')}</p>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="font-semibold mb-3">Guarantee Safe Checkout:</p>
                            <div className="flex justify-center items-center gap-2 flex-wrap">
                                <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/visa-319d545c6b250c543969556ab2033c43.svg" alt="Visa" className="h-6"/>
                                <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/master-173035bc8124581983d42d8f16406132.svg" alt="Mastercard" className="h-6"/>
                                <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/american_express-2264c9b8b57b23b0b0f712387d5ee552.svg" alt="Amex" className="h-6"/>
                                <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/paypal-49e4c1e03244b6d2de0d270ca0d22dd1.svg" alt="Paypal" className="h-6"/>
                                <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/google_pay-c66a29c63facf2053bf69352982c958e.svg" alt="Google Pay" className="h-6"/>
                                <img src="https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/apple_pay-f6db0077dc7c325b4f46244f5d6b0f06.svg" alt="Apple Pay" className="h-6"/>
                            </div>
                        </div>
                        <div className="mt-8 p-6 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
                            <div className="grid grid-cols-2 divide-x divide-gray-200/80 text-center">
                                <div className="px-4 flex flex-col items-center justify-start">
                                    <div className="flex justify-center mb-3 text-gray-500">
                                        <TruckIcon size="lg" className="w-10 h-10" />
                                    </div>
                                    <h4 className="font-semibold text-brand-dark text-sm leading-snug">Estimated delivery time:<br/>3-5 days international</h4>
                                </div>
                                <div className="px-4 flex flex-col items-center justify-start">
                                    <div className="flex justify-center mb-3 text-gray-500">
                                        <PackageIcon size="lg" className="w-10 h-10" />
                                    </div>
                                    <h4 className="font-semibold text-brand-dark text-sm leading-snug">Free shipping on all orders<br/>over $150</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isLightboxOpen && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center animate-fade-in" onClick={() => setIsLightboxOpen(false)}>
                    <button className="absolute top-4 right-4 text-white z-10 p-2 bg-black/20 rounded-full hover:bg-black/50"><CloseIcon size="lg"/></button>
                    <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(p => (p - 1 + images.length) % images.length)}} className="absolute left-4 text-white p-2 bg-black/20 rounded-full hover:bg-black/50"><ChevronLeftIcon size="lg"/></button>
                    <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(p => (p + 1) % images.length)}} className="absolute right-4 text-white p-2 bg-black/20 rounded-full hover:bg-black/50"><ChevronRightIcon size="lg"/></button>
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white font-mono">{lightboxIndex+1} / {images.length}</div>
                    <img src={images[lightboxIndex]} alt="Lightbox view" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={e => e.stopPropagation()}/>
                </div>
            )}
            
            <FrequentlyBoughtTogether mainProduct={product} otherProducts={allProducts} addToCart={addToCart} />
            
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-brand-border/20 overflow-hidden">
                    <AccordionItem title="الوصف" icon={<i className="fa-solid fa-file-lines fa-fw"></i>} defaultOpen>
                        <p>{product.description}</p>
                    </AccordionItem>
                    <AccordionItem title="الخامات وتعليمات العناية" icon={<i className="fa-solid fa-shirt fa-fw"></i>}>
                        <p>{product.materialComposition}</p>
                        <ul className="list-disc pr-5 mt-2 space-y-1">
                            {product.careInstructions?.map((inst, i) => <li key={i}>{inst}</li>)}
                        </ul>
                    </AccordionItem>
                     <AccordionItem title="سياسات الإرجاع" icon={<i className="fa-solid fa-rotate-left fa-fw"></i>}>
                        <p>نقبل المرتجعات في غضون 14 يومًا من التسليم. يجب أن تكون المنتجات غير ملبوسة وغير مغسولة، وفي حالتها الأصلية مع جميع البطاقات المرفقة. يتحمل العملاء تكاليف شحن الإرجاع ما لم يكن المنتج معيبًا.</p>
                    </AccordionItem>
                    <AccordionItem title="معلومات إضافية" icon={<i className="fa-solid fa-circle-info fa-fw"></i>}>
                        <ul className="list-disc pr-5 space-y-2">
                            {product.specifications?.map((spec, i) => <li key={i}>{spec}</li>)}
                        </ul>
                    </AccordionItem>
                    <AccordionItem title="التقييمات" icon={<i className="fa-solid fa-star fa-fw"></i>}>
                       <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
                            <div className="w-full md:w-1/3">
                                <h3 className="text-2xl font-bold mb-2">تقييم العملاء</h3>
                                {totalReviews > 0 ? (
                                    <>
                                        <div className="flex items-center gap-2 mb-2">
                                            {renderStars(averageRating)}
                                            <span className="font-bold text-brand-dark text-lg">{averageRating.toFixed(1)}/5.0</span>
                                        </div>
                                        <p className="text-brand-text-light mb-4 text-sm">بناءً على {totalReviews} تقييمًا</p>
                                        <div className="space-y-1.5">
                                            {Object.entries(ratingSummary).reverse().map(([star, count]) => (
                                                <div key={star} className="flex items-center gap-2 text-sm">
                                                    <span className="font-semibold flex items-center">{star} <StarIcon className="w-4 h-4 text-yellow-400 mr-1" /></span>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5 flex-1">
                                                        <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${totalReviews > 0 ? (count / totalReviews) * 100 : 0}%` }}></div>
                                                    </div>
                                                    <span className="w-6 text-right text-brand-text-light">{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-brand-text-light mb-4 text-sm">لا توجد تقييمات بعد.</p>
                                )}
                                <button onClick={() => setIsReviewModalOpen(true)} className="mt-6 bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 w-full md:w-auto">اكتب تقييمًا</button>
                            </div>
                            <div className="w-full md:w-2/3">
                                <h3 className="text-xl font-bold mb-4">أحدث التقييمات ({approvedReviews.length})</h3>
                                <div className="space-y-8">
                                    {approvedReviews.length > 0 ? approvedReviews.map(review => (
                                        <div key={review.id} className="border-b pb-8 last:border-b-0 last:pb-0">
                                            <div className="flex items-start gap-4 mb-3">
                                                <img src={review.image} alt={review.author} className="w-12 h-12 rounded-full" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-brand-dark">{review.author}</p>
                                                        <p className="text-sm text-brand-text-light">{review.date}</p>
                                                    </div>
                                                    <div className="flex-shrink-0">{renderStars(review.rating)}</div>
                                                    </div>
                                                    <p className="text-brand-text leading-relaxed mt-2">{review.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : <p className="text-gray-500">كن أول من يكتب تقييماً لهذا المنتج.</p>}
                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                </div>
            </div>
            
            <TrendingProductsSection title="الناس اشتروا أيضا" products={allProducts.slice(4, 8)} navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} isCarousel addToCompare={handleToggleCompare} toggleWishlist={handleToggleWishlist} />
            <RecentlyViewedSection title="المنتجات التي تمت مشاهدتها مؤخرًا" navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} addToCompare={handleToggleCompare} toggleWishlist={handleToggleWishlist} />
            
            <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} product={product} />
            <WriteReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} productName={product.name} />
        </div>
    );
};