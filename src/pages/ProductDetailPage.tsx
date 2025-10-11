import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, Review } from '../types';
import { StarIcon, MinusIcon, PlusIcon, HeartIcon, CompareIcon, QuestionIcon, ShareIcon, ChevronDownIcon, ChevronRightIcon, CheckIcon, FireIcon, ChevronLeftIcon, CategoryIcon, LockClosedIcon, EyeIcon } from '../components/icons';
import { TrendingProductsSection } from '../components/product/TrendingProductsSection';
import { ReviewsSection } from '../components/product/ReviewsSection';
import { allProducts } from '../data/products';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SizeGuideModal } from '../components/modals/SizeGuideModal';
import { useAppState } from '../state/AppState';
import { useToast } from '../hooks/useToast';
import { RecentlyViewedSection } from '../components/product/RecentlyViewedSection';
import { WriteReviewModal } from '../components/modals/WriteReviewModal';
import { useCountdown } from '../hooks/useCountdown';

interface ProductDetailPageProps {
    product: Product;
    navigateTo: (pageName: string, data?: any) => void;
    addToCart: (product: Product, options?: { quantity?: number; selectedSize?: string; selectedColor?: string }) => void;
    openQuickView: (product: Product) => void;
    setIsAskQuestionOpen: (isOpen: boolean) => void;
    setIsCompareOpen: (isOpen: boolean) => void;
}

const AccordionItem = ({ title, children, defaultOpen = false }: { title: string, children?: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-brand-border">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-right py-5 font-bold text-xl">
                <span>{title}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><ChevronDownIcon size="sm" /></span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="pb-5 pt-2 text-brand-text-light text-base leading-relaxed">{children}</div>
                </div>
            </div>
        </div>
    )
}

const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
    const timeLeft = useCountdown(targetDate);
    const timeParts = [
        { label: 'ثواني', value: timeLeft.seconds },
        { label: 'دقائق', value: timeLeft.minutes },
        { label: 'ساعات', value: timeLeft.hours },
        { label: 'أيام', value: timeLeft.days },
    ];
    return (
        <div className="p-4 bg-rose-50 border-2 border-dashed border-rose-200 rounded-lg my-6">
            <h4 className="font-bold text-center text-rose-700 mb-2">عرض محدود! ينتهي في:</h4>
            <div className="flex justify-center gap-3 text-center flex-row-reverse">
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
    const { compareList, wishlist, currentUser } = state;
    const addToast = useToast();

    const [mainImage, setMainImage] = useState(product.image);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity, setQuantity] = useState(1);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [showStickyAdd, setShowStickyAdd] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    
    const [thumbnailScroll, setThumbnailScroll] = useState(0);
    const [mobileImageIndex, setMobileImageIndex] = useState(0);
    const mobileScrollRef = useRef<HTMLDivElement>(null);

    const soldCount = useCountUp(product.soldIn24h || 0, 1500);
    const [stockBarWidth, setStockBarWidth] = useState(0);
    const [viewCount, setViewCount] = useState(product.viewingNow || 0);
    
    const saleEndDate = product.saleEndDate ? new Date(product.saleEndDate) : null;
    const isSaleActive = saleEndDate && saleEndDate > new Date();

    const isInCompare = compareList.includes(product.id);
    const isInWishlist = wishlist.some(item => item.id === product.id);
    const approvedReviews = product.reviews?.filter(r => r.status === 'Approved') || [];

    const selectedVariant = useMemo(() => {
        if (!product.variants || product.variants.length === 0) return null;
        return product.variants.find(v => v.size === selectedSize && v.color === selectedColor) || null;
    }, [product.variants, selectedSize, selectedColor]);
    
    const stockCount = selectedVariant?.stock ?? product.itemsLeft;
    
    useEffect(() => {
        setIsAdded(false);
    }, [selectedColor, selectedSize, quantity, product]);

    useEffect(() => {
        dispatch({ type: 'ADD_TO_RECENTLY_VIEWED', payload: product.id });
        
        setMainImage(product.image);
        setMobileImageIndex(0);
        if (mobileScrollRef.current) mobileScrollRef.current.scrollLeft = 0;

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

        const handleScroll = () => {
             if (window.scrollY > 600) {
                setShowStickyAdd(true);
            } else {
                setShowStickyAdd(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        const stockThreshold = 10;
        const totalStock = stockCount !== undefined ? stockCount : product.itemsLeft ?? stockThreshold + 1;
        if (!isSaleActive && totalStock > 0 && totalStock <= stockThreshold) {
            const percentage = (totalStock / stockThreshold) * 100;
            const timer = setTimeout(() => setStockBarWidth(percentage), 100);
            return () => clearTimeout(timer);
        } else {
            setStockBarWidth(0);
        }

        let viewCountInterval: number;
        if (product.viewingNow) {
            setViewCount(product.viewingNow); // Reset on product change
            viewCountInterval = setInterval(() => {
                setViewCount(current => {
                    const fluctuation = Math.floor(Math.random() * 5) - 2; // Fluctuate by -2 to 2
                    return Math.max(3, current + fluctuation); // Ensure it doesn't go too low
                });
            }, 2500);
        }


        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (viewCountInterval) clearInterval(viewCountInterval);
        }
    }, [product, dispatch, stockCount, isSaleActive]);

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
        const isCurrentColorAvailable = product.variants?.some(v => v.size === size && v.color === selectedColor && v.stock > 0);
        if (!isCurrentColorAvailable) {
            const firstAvailableColorForSize = product.variants?.find(v => v.size === size && v.stock > 0)?.color;
            if (firstAvailableColorForSize) {
                setSelectedColor(firstAvailableColorForSize);
            }
        }
    };

    const displayPrice = selectedVariant?.price || product.price;
    const displayOldPrice = selectedVariant?.oldPrice || product.oldPrice;
    
    const isOutOfStock = stockCount !== undefined && stockCount === 0;
    const sku = selectedVariant?.sku || product.sku;
    const discountPercent = displayOldPrice ? Math.round(((parseFloat(displayOldPrice) - parseFloat(displayPrice)) / parseFloat(displayOldPrice)) * 100) : 0;

    const handleAddToCart = () => {
        if (isOutOfStock || isAdded) return;
        const productForCart = { ...product, price: displayPrice, oldPrice: displayOldPrice, sku: sku };
        addToCart(productForCart, { quantity, selectedSize, selectedColor });
        setIsAdded(true);
    };

    const handleBuyNow = () => {
        if (isOutOfStock) return;
        const productForCart = { ...product, price: displayPrice, oldPrice: displayOldPrice, sku: sku };
        addToCart(productForCart, { quantity, selectedSize, selectedColor });
        navigateTo('checkout');
    };
    
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        return (
            <div className="flex text-yellow-400">
                {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`}/>)}
                {[...Array(5-fullStars)].map((_, i) => <StarIcon key={`empty-${i}`} className="text-gray-300"/>)}
            </div>
        );
    };

    const colorName = (hex: string) => {
        const map: {[key: string]: string} = {'#232429': 'أسود', '#F3A83B': 'أصفر', '#5A7247': 'أخضر', '#ffffff': 'أبيض', '#e2e2e2': 'رمادي فاتح', '#e07a5f': 'مرجاني', '#656d4a': 'زيتي', '#a4ac86': 'أخضر باهت', '#d8c3a5': 'بيج', '#8e8d8a': 'رمادي', '#262626': 'فحمي'};
        return map[hex] || 'Color';
    }
    
    const categoryMap: { [key: string]: { name: string, page: string } } = {
        women: { name: 'ملابس نسائية', page: 'shop' },
        men: { name: 'ملابس رجالية', page: 'shop' },
    };
    const categoryInfo = product.category ? categoryMap[product.category] : null;

    const breadcrumbItems: { label: string; page?: string; }[] = [ { label: 'الرئيسية', page: 'home' } ];
    if (categoryInfo) breadcrumbItems.push({ label: categoryInfo.name, page: categoryInfo.page });
    breadcrumbItems.push({ label: product.name });
    
    const images = product.images ?? [product.image];
    const THUMBNAIL_HEIGHT_WITH_GAP = 96 + 12; // h-24 + gap-3
    const VISIBLE_THUMBNAILS = 5;
    const maxScroll = Math.max(0, (images.length - VISIBLE_THUMBNAILS) * THUMBNAIL_HEIGHT_WITH_GAP);

    const scrollThumbnails = (direction: 'up' | 'down') => {
        if (direction === 'up') {
            setThumbnailScroll(current => Math.max(0, current - THUMBNAIL_HEIGHT_WITH_GAP));
        } else {
            setThumbnailScroll(current => Math.min(maxScroll, current + THUMBNAIL_HEIGHT_WITH_GAP));
        }
    };
    
    const handleMobileScroll = () => {
        if(mobileScrollRef.current) {
            const { scrollLeft, clientWidth } = mobileScrollRef.current;
            const newIndex = Math.round(scrollLeft / clientWidth);
            if (newIndex !== mobileImageIndex) setMobileImageIndex(newIndex);
        }
    }

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 pt-6 pb-12">
                 <div className="hidden md:block mb-6">
                    <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="relative">
                         {/* Mobile Gallery */}
                        <div className="lg:hidden relative group">
                            <div ref={mobileScrollRef} onScroll={handleMobileScroll} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide rounded-lg">
                                {images.map((img, index) => (
                                    <div key={index} className="w-full flex-shrink-0 snap-center">
                                        <img src={img} alt={`${product.name} image ${index + 1}`} className="w-full h-full object-cover aspect-[3/4]" />
                                    </div>
                                ))}
                            </div>
                            {images.length > 1 && (
                                <div className="absolute bottom-4 w-full flex justify-center items-center gap-2">
                                    {images.map((_, index) => (
                                        <button key={index} className={`w-2 h-2 rounded-full transition-all ${mobileImageIndex === index ? 'bg-white scale-125' : 'bg-white/50'}`} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Desktop Gallery */}
                        <div className="hidden lg:flex flex-row gap-4 h-[600px]">
                            <div className="relative w-24 flex-shrink-0">
                                {images.length > VISIBLE_THUMBNAILS && (
                                    <>
                                        <button onClick={() => scrollThumbnails('up')} disabled={thumbnailScroll === 0} className="absolute -top-5 right-1/2 translate-x-1/2 z-10 p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"><ChevronDownIcon size="sm" className="rotate-180" /></button>
                                        <button onClick={() => scrollThumbnails('down')} disabled={thumbnailScroll >= maxScroll} className="absolute -bottom-5 right-1/2 translate-x-1/2 z-10 p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"><ChevronDownIcon size="sm" /></button>
                                    </>
                                )}
                                <div className="h-full overflow-hidden">
                                    <div className="flex flex-col gap-3 transition-transform duration-300" style={{ transform: `translateY(-${thumbnailScroll}px)` }}>
                                        {images.map((img, index) => (
                                            <button key={index} onClick={() => setMainImage(img)} className={`w-24 h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${mainImage === img ? 'border-brand-dark' : 'border-transparent'}`}><img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" /></button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                             <div className="relative flex-1 rounded-lg overflow-hidden group">
                                <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="mt-6 lg:mt-0">
                        <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark my-2">{product.name}</h2>
                        <div className="flex items-center gap-2 mb-4">
                            {renderStars(product.rating || 0)}
                            <a href="#reviews" className="text-sm text-brand-text-light hover:underline">({approvedReviews.length} تقييمًا)</a>
                        </div>
                        <div className="flex items-center gap-3 mb-4 bg-gray-50 p-4 rounded-lg">
                            {discountPercent > 0 && <span className="bg-brand-sale text-white text-sm font-bold px-3 py-1 rounded-md">خصم {discountPercent}%</span>}
                            {displayOldPrice && <span className="text-2xl text-brand-text-light line-through">{displayOldPrice} ج.م</span>}
                            <span className="text-3xl font-extrabold text-brand-primary">{displayPrice} ج.م</span>
                        </div>

                        {isSaleActive && saleEndDate ? (
                           <CountdownTimer targetDate={saleEndDate} />
                        ) : stockCount !== undefined && stockCount > 0 && stockCount <= 10 ? (
                             <div className="my-6">
                                <p className="text-sm font-bold text-red-600 mb-2 text-center">اسرع! تبقى {stockCount} قطع فقط!</p>
                                <div className="w-full bg-red-100 rounded-full h-2.5 relative overflow-hidden">
                                    <div className="bg-gradient-to-r from-red-400 to-brand-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${stockBarWidth}%` }}></div>
                                </div>
                            </div>
                        ) : null}

                        <div className="my-6 space-y-2 animate-fade-in">
                            <div className="flex items-center gap-x-6 gap-y-2 flex-wrap text-sm">
                                {product.soldIn24h && product.soldIn24h > 20 && (
                                    <div className="flex items-center gap-1.5 text-brand-text">
                                        <FireIcon className="text-orange-500" />
                                        <span>بيع</span>
                                        <span className="font-bold text-brand-dark">{soldCount}</span>
                                        <span>في آخر 24 ساعة</span>
                                    </div>
                                )}
                                {viewCount > 0 && (
                                    <div className="flex items-center gap-1.5 text-brand-text">
                                        <EyeIcon className="text-blue-500"/>
                                        <span className="font-bold text-brand-dark">{viewCount}</span>
                                        <span>يشاهدون الآن</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="my-6"/>

                        <div className="mb-5">
                            <label className="font-bold text-brand-dark mb-2 block">الألوان: <span className="font-normal text-brand-text-light">{colorName(selectedColor)}</span></label>
                            <div className="flex gap-3">
                                {product.colors.map(color => {
                                    const isAvailable = product.variants?.some(v => v.color === color && v.stock > 0) ?? true;
                                    return (
                                        <button key={color} onClick={() => handleSelectColor(color)} disabled={!isAvailable} className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color ? 'border-brand-dark' : 'border-transparent'} ${!isAvailable ? 'opacity-25 cursor-not-allowed' : ''}`} aria-label={`Select color ${colorName(color)}`}>
                                            <span className="w-7 h-7 rounded-full border border-black/10" style={{backgroundColor: color}}></span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-bold text-brand-dark">المقاس:</p>
                                <button onClick={() => setIsSizeGuideOpen(true)} className="text-sm text-brand-text-light underline hover:text-brand-dark transition-colors">
                                    دليل المقاسات
                                </button>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                {product.sizes.map(size => {
                                    const isAvailable = product.variants?.some(v => v.size === size && v.color === selectedColor && v.stock > 0) ?? true;
                                    return (
                                        <button key={size} onClick={() => handleSelectSize(size)} disabled={!isAvailable} className={`w-12 h-12 flex items-center justify-center rounded-lg border text-base font-bold transition-all ${selectedSize === size ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white border-brand-border text-brand-dark hover:border-brand-dark'} ${!isAvailable ? 'opacity-25 cursor-not-allowed line-through' : ''}`}>{size}</button>
                                )})}
                            </div>
                        </div>

                        <div className="space-y-3">
                             <div className="flex items-center gap-3">
                                <div className="flex items-center border border-brand-border rounded-full bg-gray-100 justify-between w-32">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-brand-text-light hover:text-brand-dark transition-transform active:scale-90"><MinusIcon size="sm"/></button>
                                    <span className="text-center font-bold text-base">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-brand-text-light hover:text-brand-dark transition-transform active:scale-90"><PlusIcon size="sm"/></button>
                                </div>
                                <button onClick={handleAddToCart} disabled={isOutOfStock || isAdded} className="flex-1 bg-brand-dark text-white font-bold py-3.5 px-8 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98">
                                    {isAdded ? 'تمت الإضافة' : isOutOfStock ? 'نفد المخزون' : 'أضف إلى السلة'}
                                </button>
                            </div>
                            <button onClick={handleBuyNow} disabled={isOutOfStock} className="w-full bg-brand-primary text-white font-bold py-3.5 px-8 rounded-full transition-transform duration-200 transform hover:scale-105 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed">
                                اشترِ الآن
                            </button>
                        </div>
                        
                        <div className="mt-6 border-t pt-6">
                            <h3 className="font-bold text-center text-sm mb-3 text-brand-dark flex items-center justify-center gap-2">
                                <LockClosedIcon size="sm" />
                                الدفع الآمن المضمون
                            </h3>
                            <div className="flex gap-2 justify-center flex-wrap opacity-70">
                                <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/visa.svg?v=1650634288" alt="Visa" className="h-6"/>
                                <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/master.svg?v=1650634288" alt="Mastercard" className="h-6"/>
                                <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/paypal.svg?v=1650634288" alt="Paypal" className="h-6"/>
                                <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/gpay.svg?v=1650634288" alt="Google Pay" className="h-6"/>
                                <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/apple-pay.svg?v=1650634288" alt="Apple Pay" className="h-6"/>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            
            <div className="container mx-auto px-4 py-12">
                <AccordionItem title="الوصف" defaultOpen>
                   <p>{product.description}</p>
                </AccordionItem>
                {product.specifications && product.specifications.length > 0 && (
                    <AccordionItem title="المواصفات">
                        <ul className="list-disc pr-5 space-y-2">
                            {product.specifications.map((spec, index) => (
                                <li key={index}>{spec}</li>
                            ))}
                        </ul>
                    </AccordionItem>
                )}
                {(product.materialComposition || (product.careInstructions && product.careInstructions.length > 0)) && (
                    <AccordionItem title="الخامات والعناية">
                        {product.materialComposition && (
                            <div className="mb-4">
                                <h4 className="font-bold mb-2">التركيب:</h4>
                                <p>{product.materialComposition}</p>
                            </div>
                        )}
                        {product.careInstructions && product.careInstructions.length > 0 && (
                            <div>
                                <h4 className="font-bold mb-2">تعليمات العناية:</h4>
                                <ul className="list-disc pr-5 space-y-2">
                                    {product.careInstructions.map((instruction, index) => (
                                        <li key={index}>{instruction}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </AccordionItem>
                )}
                <AccordionItem title="التقييمات">
                   <a href="#reviews" className="text-brand-primary underline" onClick={(e) => { e.preventDefault(); document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }); }}>انتقل إلى قسم التقييمات</a>
                </AccordionItem>
            </div>

            <ReviewsSection reviews={approvedReviews} onWriteReviewClick={() => setIsReviewModalOpen(true)} />
            <TrendingProductsSection title="الناس اشتروا أيضا" products={allProducts.slice(4, 8)} navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} isCarousel addToCompare={()=>{}} toggleWishlist={()=>{}} />
            
            <RecentlyViewedSection
                title="المنتجات التي تمت مشاهدتها مؤخرًا"
                navigateTo={navigateTo}
                addToCart={addToCart}
                openQuickView={openQuickView}
                addToCompare={()=>{}}
                toggleWishlist={()=>{}}
            />
            
            <SizeGuideModal 
                isOpen={isSizeGuideOpen}
                onClose={() => setIsSizeGuideOpen(false)}
                product={product}
            />

            <WriteReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                productName={product.name}
            />

        </div>
    );
};