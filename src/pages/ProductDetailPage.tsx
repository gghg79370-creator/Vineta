import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, Review, Variant } from '../types';
import { StarIcon, MinusIcon, PlusIcon, HeartIcon, CompareIcon, QuestionIcon, ShareIcon, ChevronDownIcon, FireIcon, LockClosedIcon, TruckIcon, PackageIcon, CloseIcon, ChevronLeftIcon } from '../components/icons';
import { TrendingProductsSection } from '../components/product/TrendingProductsSection';
import { allProducts } from '../data/products';
import { SizeGuideModal } from '../components/modals/SizeGuideModal';
import { useAppState } from '../state/AppState';
import { useToast } from '../hooks/useToast';
import { RecentlyViewedSection } from '../components/product/RecentlyViewedSection';
import { WriteReviewModal } from '../components/modals/WriteReviewModal';
import { useCountdown } from '../hooks/useCountdown';
import { FrequentlyBoughtTogether } from '../components/product/FrequentlyBoughtTogether';
import { ReviewsSection } from '../components/product/ReviewsSection';
import { ImageGallery } from '../components/product/ImageGallery';

interface ProductDetailPageProps {
    product: Product;
    navigateTo: (pageName: string, data?: any) => void;
    addToCart: (product: Product, options?: { quantity?: number; selectedSize?: string; selectedColor?: string }) => void;
    openQuickView: (product: Product) => void;
    setIsAskQuestionOpen: (isOpen: boolean) => void;
    onProductView: () => void;
}


// Accordion Component
const AccordionItem: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean, isReview?: boolean, reviewCount?: number }> = ({ title, children, defaultOpen = false, isReview = false, reviewCount = 0 }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-brand-border">
            <button
                className="w-full flex justify-between items-center text-right py-5 font-bold text-lg text-brand-dark"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{title} {isReview && `(${reviewCount})`}</span>
                <ChevronDownIcon className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="pb-5 text-brand-text leading-relaxed">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};


// Sticky Add to Cart for Mobile
const StickyActions = ({ product, selectedVariant, quantity, onAddToCart, onQuantityChange, onVariantChange, isVisible, disabled }: { product: Product, selectedVariant: Variant | null, quantity: number, onAddToCart: () => void, onQuantityChange: (newQuantity: number) => void, onVariantChange: (variantId: number) => void, isVisible: boolean, disabled: boolean }) => {
    if (!isVisible) return null;
    
    const allVariants = useMemo(() => product.variants || [], [product.variants]);
    
    return (
        <div className="fixed bottom-0 right-0 left-0 bg-surface/90 backdrop-blur-sm shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40 p-3 border-t border-brand-border animate-slide-in-up lg:hidden">
            <div className="flex items-center gap-3">
                 <div className="relative flex-1">
                    <select
                        value={selectedVariant?.id || ''}
                        onChange={(e) => onVariantChange(Number(e.target.value))}
                        className="w-full appearance-none bg-brand-subtle border border-brand-border rounded-full py-3 px-4 font-semibold text-sm focus:ring-1 focus:ring-brand-primary"
                    >
                        {allVariants.map(v => (
                            <option key={v.id} value={v.id} disabled={v.stock === 0}>
                                {v.color} / {v.size} - {v.price} ج.م {v.stock === 0 ? '(نفد)' : ''}
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light pointer-events-none"/>
                </div>

                <div className="flex items-center border border-brand-border rounded-full justify-between bg-surface">
                    <button onClick={() => onQuantityChange(quantity - 1)} className="p-3 text-brand-text-light"><MinusIcon size="sm"/></button>
                    <span className="font-bold px-1 text-sm">{quantity}</span>
                    <button onClick={() => onQuantityChange(quantity + 1)} className="p-3 text-brand-text-light"><PlusIcon size="sm"/></button>
                </div>
                <button onClick={onAddToCart} disabled={disabled} className="flex-1 bg-gray-900 text-white font-bold py-3 px-4 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    أضف للسلة
                </button>
            </div>
        </div>
    );
};


const SafeCheckout = () => {
  const payments = [
    'https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/visa-319d545c6b250c543969556ab2033c43.svg',
    'https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/diners_club-164c7626747651859c2f513d78943f27.svg',
    'https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/master-173035bc8124581983d42d8f16406132.svg',
    'https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/paypal-49e4c1e03244b6d2de0d270ca0d22dd1.svg',
    'https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/google_pay-c66a29c63facf2053bf69352982c958e.svg',
    'https://cdn.shopify.com/shopifycloud/shopify/assets/payment_icons/apple_pay-f6db0077dc7c325b4f46244f5d6b0f06.svg',
  ];
  return (
    <div className="mt-8 border border-brand-border rounded-lg p-4">
      <h3 className="text-center font-semibold text-brand-dark mb-3 text-sm">دفع آمن ومضمون:</h3>
      <div className="flex justify-center items-center gap-2 flex-wrap">
        {payments.map((p, i) => <div key={i} className="border rounded-md p-1.5 h-8 flex items-center bg-white"><img src={p} alt="payment method" className="h-4"/></div>)}
      </div>
    </div>
  );
};


export const ProductDetailPage = ({ product: initialProduct, navigateTo, addToCart, openQuickView, setIsAskQuestionOpen, onProductView }: ProductDetailPageProps) => {
    const product = initialProduct || allProducts[0];
    const { state, dispatch } = useAppState();
    const { compareList, wishlist, currentUser } = state;
    const addToast = useToast();

    const isInWishlist = useMemo(() => wishlist.some(item => item.id === product.id), [wishlist, product.id]);
    const isInCompare = useMemo(() => compareList.includes(product.id), [compareList, product.id]);

    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity, setQuantity] = useState(1);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const viewedProductIdRef = useRef<number | null>(null);

    const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);
    const productInfoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsStickyBarVisible(!entry.isIntersecting);
            },
            { rootMargin: "0px", threshold: 0 }
        );

        const currentRef = productInfoRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const selectedVariant = useMemo(() => {
        if (!product.variants || product.variants.length === 0) return null;
        return product.variants.find(v => v.size === selectedSize && v.color === selectedColor) || null;
    }, [product.variants, selectedSize, selectedColor]);
    
    const stockCount = selectedVariant?.stock ?? product.itemsLeft;
    const displayPrice = selectedVariant?.price || product.price;
    const displayOldPrice = selectedVariant?.oldPrice || product.oldPrice;

    const stockProgress = stockCount !== undefined && stockCount < 10
        ? (stockCount / 10) * 100
        : 100;

    useEffect(() => {
        if (product && product.id !== viewedProductIdRef.current) {
            viewedProductIdRef.current = product.id;
            dispatch({ type: 'ADD_TO_RECENTLY_VIEWED', payload: product.id });
            onProductView();
        }
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
    }, [product, dispatch, onProductView]);
    
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

    const discountPercent = displayOldPrice ? Math.round(((parseFloat(displayOldPrice) - parseFloat(displayPrice)) / parseFloat(displayOldPrice)) * 100) : 0;

    const handleAddToCart = () => {
        if (stockCount === 0) {
            addToast('هذا الخيار غير متوفر في المخزون حاليًا.', 'error');
            return false;
        }
        const productForCart = { ...product, price: displayPrice, oldPrice: displayOldPrice };
        addToCart(productForCart, { quantity, selectedSize, selectedColor });
        return true;
    };
    
    const handleBuyNow = () => {
        const success = handleAddToCart();
        if (success) {
            navigateTo('checkout');
        }
    };
    
    const handleToggleWishlist = () => {
        if(!currentUser) { addToast('الرجاء تسجيل الدخول.', 'info'); navigateTo('login'); return; }
        dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });
    }
    
    const handleToggleCompare = () => dispatch({ type: 'TOGGLE_COMPARE', payload: product.id });

    const toggleWishlist = (p: Product) => {
        if (!currentUser) { addToast('الرجاء تسجيل الدخول.', 'info'); navigateTo('login'); return; }
        dispatch({ type: 'TOGGLE_WISHLIST', payload: p.id });
    };
    
    const addToCompare = (p: Product) => dispatch({ type: 'TOGGLE_COMPARE', payload: p.id });
    
    const handleStickyVariantChange = (variantId: number) => {
        const variant = product.variants?.find(v => v.id === variantId);
        if (variant) {
            setSelectedColor(variant.color);
            setSelectedSize(variant.size);
        }
    };


    // Prepare images for the new gallery component
    const galleryImages = useMemo(() => {
        const imageSources = product.images ?? [product.image];
        return imageSources.map((src, index) => ({
            src,
            alt: `${product.name} - view ${index + 1}`
        }));
    }, [product.images, product.image, product.name]);


    return (
        <div className="bg-brand-bg text-brand-text">
            <div className="container mx-auto px-4 pt-6 pb-12">
                <nav aria-label="Breadcrumb" className="mb-6 text-sm text-brand-text-light flex items-center gap-2">
                    <button onClick={() => navigateTo('home')} className="hover:text-brand-primary">الرئيسية</button>
                    <ChevronLeftIcon size="sm" />
                    <button onClick={() => navigateTo('shop')} className="hover:text-brand-primary">{product.category === 'men' ? 'رجال' : 'نساء'}</button>
                    <ChevronLeftIcon size="sm" />
                    <span>{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="w-full">
                        <ImageGallery images={galleryImages} />
                    </div>

                    <div ref={productInfoRef} className="lg:pt-4">
                        {product.brand && <p className="text-sm font-semibold text-brand-text-light uppercase tracking-wider">{product.brand}</p>}
                        <h1 className="text-3xl lg:text-4xl font-bold text-brand-dark my-2">{product.name}</h1>
                        <div className="flex items-center gap-3 mb-4"><StarIcon className="text-yellow-400"/><span className="font-bold">{product.rating || 0}</span><a href="#reviews" className="text-sm text-brand-text-light hover:underline">({product.reviewCount || 0} تقييمًا)</a></div>
                        <div className="flex items-center gap-4 mb-5"><span className="text-4xl font-extrabold text-brand-primary">{displayPrice} ج.م</span>{displayOldPrice && <><span className="text-2xl text-brand-text-light line-through">{displayOldPrice} ج.م</span><span className="text-sm font-bold bg-brand-sale text-white px-3 py-1 rounded-md">{discountPercent}% OFF</span></>}</div>
                        
                        <div className="my-6 space-y-2 border-t pt-6">
                            <div className="flex items-center gap-3 text-sm">
                                <span className={`px-2.5 py-1 rounded-md font-bold text-sm ${stockCount && stockCount > 0 ? 'bg-brand-instock/10 text-brand-instock' : 'bg-brand-sale/10 text-brand-sale'}`}>{stockCount && stockCount > 0 ? 'متوفر' : 'نفد المخزون'}</span>
                                {product.soldIn24h && <span className="flex items-center gap-1.5 text-brand-text-light font-semibold"><FireIcon size="sm" className="text-orange-500"/> {product.soldIn24h} بيعت في آخر 24 ساعة</span>}
                            </div>
                            {stockCount !== undefined && stockCount > 0 && stockCount <= 10 && <>
                                <p className="text-sm font-bold text-brand-primary pt-2">سارع! تبقى فقط {stockCount} قطع!</p>
                                <div className="w-full bg-brand-subtle rounded-full h-2"><div className="bg-brand-primary h-2 rounded-full" style={{width: `${stockProgress}%`}}></div></div>
                            </>}
                        </div>

                        <div className="mb-5"><label className="font-bold text-brand-dark mb-3 block">اللون: <span className="font-normal text-brand-text-light">{selectedColor}</span></label><div className="flex items-center gap-3">{product.colors.map(color => (<button key={color} onClick={() => handleSelectColor(color)} className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color ? 'border-brand-dark' : 'border-transparent hover:border-gray-300'}`}><span className="w-8 h-8 rounded-full border border-black/10" style={{backgroundColor: color}}></span></button>))}</div></div>
                        <div className="mb-6"><div className="flex justify-between items-center mb-3"><p className="font-bold text-brand-dark">المقاس:</p><button onClick={() => setIsSizeGuideOpen(true)} className="text-sm text-brand-text-light underline hover:text-brand-dark">دليل المقاسات</button></div><div className="flex gap-3 flex-wrap">{product.sizes.map(size => {const isSelected = selectedSize === size; const isAvailableForColor = product.variants?.some(v => v.color === selectedColor && v.size === size && v.stock > 0) ?? (stockCount !== undefined && stockCount > 0); return (<button key={size} onClick={() => setSelectedSize(size)} disabled={!isAvailableForColor} className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 text-base font-bold transition-all relative ${isSelected ? 'bg-brand-dark text-white border-brand-dark' : isAvailableForColor ? 'bg-surface border-brand-border hover:border-brand-dark' : 'bg-brand-subtle border-brand-border text-brand-text-light cursor-not-allowed'}`}>{size}{!isAvailableForColor && <span className="absolute w-12 h-px bg-brand-text-light transform rotate-[-20deg]"></span>}</button>);})}</div></div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3 mb-3"><div className="flex items-center border-2 border-brand-border rounded-full justify-between bg-surface"><button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-4 text-brand-text-light hover:text-brand-dark"><MinusIcon/></button><span className="text-center font-bold text-lg">{quantity}</span><button onClick={() => setQuantity(q => q + 1)} className="p-4 text-brand-text-light hover:text-brand-dark"><PlusIcon/></button></div><button onClick={handleAddToCart} disabled={stockCount === 0} className="w-full bg-gray-900 text-white font-bold py-3.5 px-8 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90">أضف إلى السلة</button></div>
                        <button onClick={handleBuyNow} disabled={stockCount === 0} className="w-full bg-brand-primary text-white font-bold py-3.5 px-8 rounded-full transition-transform transform disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-98">اشترِ الآن</button>
                        <div className="text-center mt-2"><button className="text-sm font-semibold underline text-brand-text-light hover:text-brand-dark">خيارات دفع أخرى</button></div>

                        <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-3 text-sm font-semibold text-brand-text-light mt-6 border-t pt-6"><button onClick={handleToggleWishlist} className="flex items-center gap-2 hover:text-brand-primary"><HeartIcon filled={!!isInWishlist} /> {isInWishlist ? 'في قائمة الرغبات' : 'أضف للرغبات'}</button><button onClick={handleToggleCompare} className="flex items-center gap-2 hover:text-brand-primary"><CompareIcon /> {isInCompare ? 'في المقارنة' : 'أضف للمقارنة'}</button><button onClick={() => setIsAskQuestionOpen(true)} className="flex items-center gap-2 hover:text-brand-primary"><QuestionIcon /> اسأل سؤالاً</button><button className="flex items-center gap-2 hover:text-brand-primary"><ShareIcon /> مشاركة</button></div>
                        
                        <div className="mt-8 border border-brand-border rounded-lg p-4 space-y-4 text-sm bg-brand-subtle/50">
                            <div className="flex items-center gap-3"><TruckIcon size="sm" className="text-brand-dark flex-shrink-0" /><p>وقت التسليم المقدر: 3-5 أيام عمل</p></div>
                            <div className="flex items-center gap-3"><PackageIcon size="sm" className="text-brand-dark flex-shrink-0" /><p>شحن مجاني للطلبات فوق 500 ج.م</p></div>
                        </div>
                        
                        <SafeCheckout />
                        
                        <div className="mt-8 border-t pt-4 text-sm text-brand-text-light"><p><strong className="w-20 inline-block">SKU:</strong> {product.sku}</p><p><strong className="w-20 inline-block">الفئات:</strong> {product.tags.slice(0, 2).join(', ')}</p></div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white"><div className="container mx-auto px-4"><div className="max-w-4xl mx-auto"><AccordionItem title="الوصف" defaultOpen>{product.description}</AccordionItem><AccordionItem title="الخامات">{product.materialComposition}</AccordionItem><AccordionItem title="سياسات الإرجاع">نحن نقدم سياسة إرجاع لمدة 30 يومًا على جميع المنتجات غير المستخدمة.</AccordionItem><AccordionItem title="معلومات إضافية">{product.specifications?.join('. ')}</AccordionItem><AccordionItem title="التقييمات" isReview reviewCount={product.reviews?.length}><ReviewsSection reviews={product.reviews || []} onWriteReviewClick={() => setIsReviewModalOpen(true)} /></AccordionItem></div></div></div>
            
            <FrequentlyBoughtTogether mainProduct={product} otherProducts={allProducts} addToCart={addToCart} />
            <TrendingProductsSection title="الناس اشتروا أيضا" products={allProducts.slice(4, 8)} navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} isCarousel addToCompare={addToCompare} toggleWishlist={toggleWishlist} />
            <RecentlyViewedSection title="المنتجات التي تمت مشاهدتها مؤخرًا" navigateTo={navigateTo} addToCart={addToCart} openQuickView={openQuickView} addToCompare={addToCompare} toggleWishlist={toggleWishlist} />
            
            <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} product={product} />
            <WriteReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} productName={product.name} />
            <StickyActions isVisible={isStickyBarVisible} product={product} selectedVariant={selectedVariant} quantity={quantity} onAddToCart={handleAddToCart} onQuantityChange={(q) => setQuantity(Math.max(1, q))} onVariantChange={handleStickyVariantChange} disabled={stockCount === 0} />
        </div>
    );
};