


import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, CartItem, Review, Variant } from '../types';
import { StarIcon, MinusIcon, PlusIcon, HeartIcon, CompareIcon, QuestionIcon, ShareIcon, ChevronDownIcon, ArrowUpTrayIcon, ChevronRightIcon, CheckIcon, MagicIcon } from '../components/icons';
import { TrendingProductsSection } from '../components/product/TrendingProductsSection';
import { ReviewsSection } from '../components/product/ReviewsSection';
import { allProducts } from '../data/products';
import { useCountdown } from '../hooks/useCountdown';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SizeGuideModal } from '../components/modals/SizeGuideModal';
import { useAppState } from '../state/AppState';
import { useToast } from '../hooks/useToast';
import { RecentlyViewedSection } from '../components/product/RecentlyViewedSection';
import { WriteReviewModal } from '../components/modals/WriteReviewModal';
import { AiRecommendationsSection } from '../components/home/AiRecommendationsSection';

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
            {isOpen && <div className="pb-5 text-brand-text-light animate-fade-in text-base leading-relaxed">{children}</div>}
        </div>
    )
}

export const ProductDetailPage = ({ product: initialProduct, navigateTo, addToCart, openQuickView, setIsAskQuestionOpen }: ProductDetailPageProps) => {
    const product = initialProduct || allProducts[0];
    const { state, dispatch } = useAppState();
    const { compareList, wishlist } = state;
    const addToast = useToast();

    const [mainImage, setMainImage] = useState(product.images ? product.images[1] : product.image);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity, setQuantity] = useState(1);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const saleEndDate = product.saleEndDate ? new Date(product.saleEndDate) : new Date();
    const timeLeft = useCountdown(saleEndDate);
    const [showStickyAdd, setShowStickyAdd] = useState(false);
    
    // Image Zoom State
    const [showZoom, setShowZoom] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const ZOOM_LEVEL = 2.5;


    const isInCompare = compareList.includes(product.id);
    const isInWishlist = wishlist.some(item => item.id === product.id);
    const approvedReviews = product.reviews?.filter(r => r.status === 'Approved') || [];

    const selectedVariant = useMemo(() => {
        if (!product.variants || product.variants.length === 0) return null;
        return product.variants.find(v => v.size === selectedSize && v.color === selectedColor) || null;
    }, [product.variants, selectedSize, selectedColor]);

    useEffect(() => {
        dispatch({ type: 'ADD_TO_RECENTLY_VIEWED', payload: product.id });
        
        setMainImage(product.images ? product.images[1] : product.image);
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
        return () => window.removeEventListener('scroll', handleScroll);

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
    const stockCount = selectedVariant?.stock ?? product.itemsLeft;
    const isOutOfStock = stockCount !== undefined && stockCount === 0;
    const sku = selectedVariant?.sku || product.sku;

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        const productForCart = { ...product, price: displayPrice, oldPrice: displayOldPrice, sku: sku };
        addToCart(productForCart, { quantity, selectedSize, selectedColor });
    };

    const handleBuyNow = () => {
        if (isOutOfStock) return;
        const productForCart = { ...product, price: displayPrice, oldPrice: displayOldPrice, sku: sku };
        addToCart(productForCart, { quantity, selectedSize, selectedColor });
        navigateTo('checkout');
    };

    const handleToggleWishlist = () => {
        dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });
        addToast(
            isInWishlist ? 'تمت الإزالة من قائمة الرغبات' : 'تمت الإضافة إلى قائمة الرغبات',
            'success'
        );
    };
    const handleAddToCompare = () => dispatch({ type: 'TOGGLE_COMPARE', payload: product.id });
    
    const toggleWishlistForRecommended = (recommendedProduct: Product) => {
        dispatch({ type: 'TOGGLE_WISHLIST', payload: recommendedProduct.id });
        addToast(
            wishlist.some(i => i.id === recommendedProduct.id) ? 'تمت الإزالة من قائمة الرغبات' : 'تمت الإضافة إلى قائمة الرغبات',
            'success'
        );
    };

    const addToCompareForRecommended = (recommendedProduct: Product) => {
        dispatch({ type: 'TOGGLE_COMPARE', payload: recommendedProduct.id });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        addToast('تم نسخ الرابط!', 'success');
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

    const scrollImage = (direction: 'next' | 'prev') => {
        if (!product.images) return;
        const currentIndex = product.images.indexOf(mainImage);
        let nextIndex;
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % product.images.length;
        } else {
            nextIndex = (currentIndex - 1 + product.images.length) % product.images.length;
        }
        setMainImage(product.images[nextIndex]);
    }

    const colorName = (hex: string) => {
        const map: {[key: string]: string} = {'#232429': 'أسود', '#F3A83B': 'أصفر', '#5A7247': 'أخضر'};
        return map[hex] || 'Color';
    }

    const actionButtonClasses = "flex items-center gap-2 transform transition-all duration-300 ease-in-out hover:bg-brand-primary/10 hover:text-brand-primary hover:scale-105 rounded-full px-4 py-2";
    
    const getAvailabilityClasses = () => {
        if (isOutOfStock) return 'bg-red-100 text-red-800';
        return 'bg-green-100 text-green-800';
    };

    const categoryMap: { [key: string]: { name: string, page: string } } = {
        women: { name: 'ملابس نسائية', page: 'shop' },
        men: { name: 'ملابس رجالية', page: 'shop' },
    };
    const categoryInfo = product.category ? categoryMap[product.category] : null;
    const categoryName = product.category === 'women' ? 'ملابس نسائية' : (product.category === 'men' ? 'ملابس رجالية' : product.category);


    const breadcrumbItems: { label: string; page?: string; }[] = [ { label: 'الرئيسية', page: 'home' } ];
    if (categoryInfo) breadcrumbItems.push({ label: categoryInfo.name, page: categoryInfo.page });
    breadcrumbItems.push({ label: product.name });

     // Image zoom handlers
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (imageContainerRef.current) {
            const rect = imageContainerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setMousePosition({ x, y });
        }
    };
    
    const getZoomBackgroundPosition = () => {
        if (!imageContainerRef.current) return '0% 0%';
        const { width, height } = imageContainerRef.current.getBoundingClientRect();
        const x = (mousePosition.x / width) * 100;
        const y = (mousePosition.y / height) * 100;
        return `${x}% ${y}%`;
    };

    const badgeStyles: { [key: string]: string } = {
        sale: 'bg-brand-sale text-white',
        new: 'bg-brand-dark text-white',
        trending: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
        custom: 'bg-blue-100 text-blue-800',
    };

    const DynamicBadges = () => (
        <div className="absolute top-4 end-4 flex flex-col items-end gap-y-2 z-10">
            {product.badges?.map((badge, index) => (
                <div key={index} className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${badgeStyles[badge.type] || badgeStyles.custom}`}>
                    {badge.text}
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-white">
            <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title={product.name} />
            <div className="container mx-auto px-4 pt-6 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="relative">
                         {/* Mobile Gallery */}
                        <div className="lg:hidden">
                            <div className="relative mb-3 rounded-lg overflow-hidden group aspect-[4/5]">
                                <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                                <DynamicBadges />
                                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2">
                                    <button onClick={() => scrollImage('prev')} className="bg-white/60 rounded-full p-2 shadow-md hover:bg-white transition-colors" aria-label="الصورة السابقة">
                                        <ChevronRightIcon className="transform rotate-180 w-5 h-5"/>
                                    </button>
                                    <button onClick={() => scrollImage('next')} className="bg-white/60 rounded-full p-2 shadow-md hover:bg-white transition-colors" aria-label="الصورة التالية">
                                        <ChevronRightIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                                {(product.images || []).map((img, index) => (
                                    <button key={index} onClick={() => setMainImage(img)} className={`w-20 h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${mainImage === img ? 'border-brand-dark' : 'border-transparent hover:border-brand-border'}`}>
                                        <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Desktop Gallery */}
                        <div className="hidden lg:flex flex-col-reverse lg:flex-row-reverse gap-4">
                            <div className="flex lg:flex-col gap-3 justify-center">
                                {(product.images || []).map((img, index) => (
                                    <button key={index} onClick={() => setMainImage(img)} className={`w-20 h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${mainImage === img ? 'border-brand-dark' : 'border-transparent hover:border-brand-border'}`}>
                                        <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                            <div 
                                ref={imageContainerRef}
                                onMouseEnter={() => setShowZoom(true)}
                                onMouseLeave={() => setShowZoom(false)}
                                onMouseMove={handleMouseMove}
                                className="relative flex-1 rounded-lg overflow-hidden group aspect-[4/5] cursor-crosshair">
                                <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                                <DynamicBadges />
                                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
                                    <button onClick={() => scrollImage('prev')} className="bg-white/70 rounded-full p-3 shadow-md opacity-50 group-hover:opacity-100 transition-all" aria-label="الصورة السابقة"><ChevronRightIcon className="transform rotate-180"/></button>
                                    <button onClick={() => scrollImage('next')} className="bg-white/70 rounded-full p-3 shadow-md opacity-50 group-hover:opacity-100 transition-all" aria-label="الصورة التالية"><ChevronRightIcon/></button>
                                </div>
                            </div>
                        </div>

                         {/* Zoom Preview Pane */}
                        <div className={`hidden lg:block absolute top-0 -left-4 w-[calc(100%+1rem)] h-full bg-no-repeat pointer-events-none rounded-lg shadow-2xl border transition-opacity duration-200
                            ${showZoom ? 'opacity-100 z-20' : 'opacity-0 -z-10'}`}
                            style={{
                                backgroundImage: `url(${mainImage})`,
                                backgroundPosition: getZoomBackgroundPosition(),
                                backgroundSize: `${ZOOM_LEVEL * 100}%`
                            }}
                        ></div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="mt-6 lg:mt-0">
                        <p className="font-bold text-brand-text-light text-sm">{product.brand}</p>
                        <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark my-2">{product.name}</h2>
                        <div className="flex items-center gap-2 mb-4">
                            {renderStars(product.rating || 0)}
                            <span className="text-sm text-brand-text-light">({approvedReviews.length} تقييمًا)</span>
                        </div>
                        <div className="flex items-baseline gap-3 mb-4">
                            <span className="text-3xl font-extrabold text-brand-primary">{displayPrice} ج.م</span>
                            {displayOldPrice && <span className="text-xl text-brand-text-light line-through">{displayOldPrice} ج.م</span>}
                        </div>

                        <div className="flex gap-4 items-center mb-4 text-sm">
                            <span className={`${getAvailabilityClasses()} font-bold py-1 px-3 rounded-md`}>
                                {isOutOfStock ? 'نفد المخزون' : 'متوفر'}
                            </span>
                            {product.soldIn24h && <span className="text-brand-text-light">🔥 {product.soldIn24h} بيعت في آخر 24 ساعة</span>}
                        </div>
                        
                        {product.saleEndDate && new Date(product.saleEndDate) > new Date() ? (
                             <div className="my-5 p-4 border border-red-200 rounded-lg bg-red-50">
                                <p className="text-sm font-bold text-red-600 mb-2">اسرع! ينتهي العرض في:</p>
                                <div className="flex justify-start gap-4 text-center">
                                    <div className="bg-white rounded-md p-2 border border-red-100 w-16"><span className="text-xl font-bold text-brand-dark block">{timeLeft.days}</span> <span className="text-xs text-brand-text-light">أيام</span></div>
                                    <div className="bg-white rounded-md p-2 border border-red-100 w-16"><span className="text-xl font-bold text-brand-dark block">{timeLeft.hours}</span> <span className="text-xs text-brand-text-light">ساعات</span></div>
                                    <div className="bg-white rounded-md p-2 border border-red-100 w-16"><span className="text-xl font-bold text-brand-dark block">{timeLeft.minutes}</span> <span className="text-xs text-brand-text-light">دقائق</span></div>
                                    <div className="bg-white rounded-md p-2 border border-red-100 w-16"><span className="text-xl font-bold text-brand-dark block">{timeLeft.seconds}</span> <span className="text-xs text-brand-text-light">ثواني</span></div>
                                </div>
                            </div>
                        ) : stockCount !== undefined && stockCount > 0 && stockCount < 10 && (
                             <div className="my-5">
                                <p className="text-sm font-bold text-red-600 mb-2">اسرع! تبقى {stockCount} قطع فقط!</p>
                                <div className="w-full bg-red-200 rounded-full h-1.5"><div className="bg-gradient-to-r from-red-400 to-brand-primary h-1.5 rounded-full" style={{width: `${(stockCount/10)*100}%`}}></div></div>
                            </div>
                        )}


                        <div className="mb-5">
                            <label className="font-bold text-brand-dark mb-2 block">الألوان:</label>
                            <div className="relative">
                                <button 
                                    type="button"
                                    onClick={() => setIsColorPickerOpen(!isColorPickerOpen)} 
                                    className="w-full flex items-center justify-between text-right p-3 border border-brand-border rounded-lg bg-white"
                                    aria-haspopup="listbox"
                                    aria-expanded={isColorPickerOpen}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full border" style={{ backgroundColor: selectedColor }}></span>
                                        <span className="font-semibold">{colorName(selectedColor)}</span>
                                    </div>
                                    <ChevronDownIcon size="sm" className={`transform transition-transform text-gray-400 ${isColorPickerOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isColorPickerOpen && (
                                    <ul 
                                        className="absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                                        role="listbox"
                                    >
                                        {product.colors.map(color => {
                                            const isAvailable = product.variants?.some(v => v.color === color) ?? true;
                                            return (
                                                <li key={color}>
                                                    <button 
                                                        onClick={() => { handleSelectColor(color); setIsColorPickerOpen(false); }}
                                                        disabled={!isAvailable}
                                                        className="w-full text-right p-3 hover:bg-brand-subtle flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        role="option"
                                                        aria-selected={selectedColor === color}
                                                    >
                                                        <span className="w-6 h-6 rounded-full border" style={{ backgroundColor: color }}></span>
                                                        <span>{colorName(color)}</span>
                                                        {selectedColor === color && <CheckIcon size="sm" className="mr-auto text-brand-primary" />}
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-bold text-brand-dark">المقاس:</p>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setIsSizeGuideOpen(true)} className="text-sm text-brand-text-light underline hover:text-brand-dark transition-colors flex items-center gap-1">
                                        <MagicIcon size="sm"/>
                                        <span>اعثر على مقاسي</span>
                                    </button>
                                    <a href="#" className="text-sm text-brand-text-light underline">دليل المقاسات</a>
                                </div>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                {product.sizes.map(size => {
                                    const isAvailable = product.variants?.some(v => v.size === size && v.color === selectedColor && v.stock > 0) ?? true;
                                    return (
                                        <button key={size} onClick={() => handleSelectSize(size)} disabled={!isAvailable} className={`w-14 h-14 flex items-center justify-center rounded-full border text-lg font-bold transition-all transform hover:scale-105 ${selectedSize === size ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white border-brand-border text-brand-dark hover:border-brand-dark'} ${!isAvailable ? 'opacity-25 cursor-not-allowed line-through' : ''}`}>{size}</button>
                                )})}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                             <div className="flex items-center border border-brand-border rounded-full bg-white justify-between w-32">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-brand-text-light hover:text-brand-dark"><MinusIcon size="sm"/></button>
                                <span className="text-center font-bold text-base">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="p-3 text-brand-text-light hover:text-brand-dark"><PlusIcon size="sm"/></button>
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-3 mb-4">
                            <button onClick={handleAddToCart} disabled={isOutOfStock} className="w-full bg-brand-dark text-white font-bold py-3.5 px-8 rounded-full hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">{isOutOfStock ? 'نفد المخزون' : 'أضف إلى السلة'}</button>
                            <button onClick={handleBuyNow} disabled={isOutOfStock} className="w-full bg-brand-primary text-white font-bold py-3.5 px-8 rounded-full hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">اشترِ الآن</button>
                        </div>
                         <div className="text-center mb-6"><a href="#" className="text-sm font-semibold underline hover:text-brand-primary">المزيد من خيارات الدفع</a></div>

                         <div className="flex items-center justify-around text-sm text-brand-dark font-semibold border-t border-b border-brand-border py-2">
                             <button onClick={handleToggleWishlist} className={`${actionButtonClasses} ${isInWishlist ? 'text-brand-primary' : ''}`}>
                                <HeartIcon size="sm" filled={isInWishlist} /> {isInWishlist ? 'إزالة من قائمة الرغبات' : 'أضف إلى قائمة الرغبات'}
                            </button>
                            <button onClick={handleAddToCompare} className={`${actionButtonClasses} ${isInCompare ? 'text-brand-primary' : ''}`}>
                                {isInCompare ? <CheckIcon size="sm"/> : <CompareIcon size="sm"/>}
                                {isInCompare ? 'مضاف للمقارنة' : 'مقارنة'}
                            </button>
                            <button onClick={() => setIsAskQuestionOpen(true)} className={actionButtonClasses}><QuestionIcon size="sm"/> اسأل سؤالاً</button>
                            <button onClick={handleShare} className={actionButtonClasses}><ShareIcon size="sm"/> مشاركة</button>
                         </div>

                         <div className="mt-6">
                            <h3 className="font-bold text-brand-dark mb-3">شارك هذا المنتج:</h3>
                            <div className="flex items-center gap-3">
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-[#1877F2] text-white rounded-full hover:opacity-90 transition-opacity" aria-label="Share on Facebook">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </a>
                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-brand-dark text-white rounded-full hover:opacity-90 transition-opacity p-2" aria-label="Share on X">
                                    <i className="fa-brands fa-x-twitter"></i>
                                </a>
                                <a href={`http://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-[#E60023] text-white rounded-full hover:opacity-90 transition-opacity" aria-label="Pin on Pinterest">
                                    <i className="fa-brands fa-pinterest"></i>
                                </a>
                            </div>
                        </div>
                         
                         <div className="text-sm text-brand-text-light space-y-2 mt-6">
                            <p><span className="font-semibold text-brand-dark w-20 inline-block">SKU:</span> {sku}</p>
                            <p><span className="font-semibold text-brand-dark w-20 inline-block">الفئة:</span> <button onClick={() => navigateTo('shop')} className="hover:text-brand-primary">{categoryName}</button></p>
                         </div>
                         <div className="mt-4">
                            <span className="font-semibold text-brand-dark text-sm">الوسوم:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {product.tags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => navigateTo('search', { q: tag })}
                                        className="bg-brand-subtle text-brand-text-light text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-brand-border hover:text-brand-dark transition-colors"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </div>


                         <div className="mt-6">
                            <h3 className="font-bold text-brand-dark mb-3">الدفع الآمن المضمون:</h3>
                            <div className="flex gap-1.5 items-center">
                               <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/visa.svg?v=1650634288" alt="Visa" className="h-6"/>
                               <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/discover.svg?v=1650634288" alt="Discover" className="h-6"/>
                               <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/master.svg?v=1650634288" alt="Mastercard" className="h-6"/>
                               <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/stripe.svg?v=1650634288" alt="Stripe" className="h-6"/>
                               <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/paypal.svg?v=1650634288" alt="Paypal" className="h-6"/>
                               <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/gpay.svg?v=1650634288" alt="Google Pay" className="h-6"/>
                               <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/apple-pay.svg?v=1650634288" alt="Apple Pay" className="h-6"/>
                            </div>
                         </div>
                    </div>
                </div>

                {/* Mobile Add to Cart Sticky Footer */}
                <div className={`lg:hidden fixed bottom-[80px] left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-3 z-40 rounded-t-2xl transition-transform duration-300 ${showStickyAdd ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-3">
                             <div>
                                <p className="font-bold text-sm">{`${colorName(selectedColor)} / ${selectedSize} - ${displayPrice} ج.م`}</p>
                            </div>
                         </div>
                         <button><ChevronDownIcon className="transform -rotate-180" /></button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-full bg-white justify-between w-32">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3"><MinusIcon size="sm" /></button>
                            <span className="w-6 text-center font-bold">{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)} className="p-3"><PlusIcon size="sm" /></button>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                             <button onClick={handleAddToCart} disabled={isOutOfStock} className="w-full bg-brand-dark text-white font-bold py-3 px-4 rounded-full hover:bg-opacity-90 transition disabled:opacity-50">{isOutOfStock ? 'نفد المخزون' : 'أضف إلى السلة'}</button>
                             <button onClick={handleBuyNow} disabled={isOutOfStock} className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-full hover:bg-opacity-90 transition disabled:opacity-50">اشترِ الآن</button>
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
                <AccordionItem title="معلومات إضافية">
                  <p>تفاصيل إضافية حول المنتج...</p>
                </AccordionItem>
                <AccordionItem title="التقييمات">
                   <a href="#reviews" className="text-brand-primary underline" onClick={(e) => { e.preventDefault(); document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }); }}>انتقل إلى قسم التقييمات</a>
                </AccordionItem>
            </div>

            <ReviewsSection reviews={approvedReviews} onWriteReviewClick={() => setIsReviewModalOpen(true)} />
            <TrendingProductsSection title="الناس اشتروا أيضا" products={allProducts.slice(4, 8)} navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} isCarousel addToCompare={handleAddToCompare} toggleWishlist={handleToggleWishlist} />
            
            <RecentlyViewedSection
                title="المنتجات التي تمت مشاهدتها مؤخرًا"
                navigateTo={navigateTo}
                addToCart={addToCart}
                openQuickView={openQuickView}
                addToCompare={handleAddToCompare}
                toggleWishlist={handleToggleWishlist}
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