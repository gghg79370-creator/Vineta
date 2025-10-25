import React, { useState, useRef, useMemo, useEffect } from 'react';
import { CartItem, Product } from '../../types';
import { CloseIcon, MinusIcon, PlusIcon, GiftIcon, NoteIcon, TruckIcon as ShippingIcon, ArrowLongRightIcon, ChevronDownIcon, SparklesIcon, CheckIcon, CouponIcon, ShoppingBagIcon, HeartIcon } from '../icons';
import { allProducts } from '../../data/products';
import { useAppState } from '../../state/AppState';
import { GoogleGenAI, Type } from "@google/genai";
import { Carousel } from '../ui/Carousel';
import { useToast } from '../../hooks/useToast';
import { validCoupons } from '../../data/coupons';


interface CartDrawerProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    navigateTo: (pageName: string, data?: any) => void;
}

interface BottomModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const BottomModal: React.FC<BottomModalProps> = ({ isOpen, onClose, title, children }) => {
    const titleId = `bottom-modal-title-${title.replace(/\s+/g, '-')}`;
    return (
        <div className={`fixed inset-0 z-[70] transition-opacity duration-300 ${isOpen ? 'bg-[var(--backdrop)]' : 'bg-transparent pointer-events-none'}`} onClick={onClose}>
            <div 
                className={`fixed bottom-0 right-0 left-0 bg-brand-bg rounded-t-2xl shadow-2xl p-6 transform transition-transform duration-400 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} 
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
            >
                <h3 id={titleId} className="text-xl font-bold text-brand-dark mb-4">{title}</h3>
                {children}
            </div>
        </div>
    );
};

const ConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 bg-black/60 z-[71] flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            aria-describedby="confirmation-message"
        >
            <div className="bg-brand-bg w-full max-w-sm rounded-2xl shadow-lg p-6 text-center animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <h3 id="confirmation-title" className="text-xl font-bold text-brand-dark mb-2">{title}</h3>
                <p id="confirmation-message" className="text-brand-text-light mb-6">{message}</p>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={onClose} className="bg-brand-subtle text-brand-dark font-bold py-3 rounded-full hover:bg-brand-border">إلغاء</button>
                    <button onClick={onConfirm} className="bg-brand-sale text-white font-bold py-3 rounded-full hover:bg-opacity-90">تأكيد</button>
                </div>
            </div>
        </div>
    );
};


const RecommendationSkeleton = () => (
    <div className="flex-shrink-0 w-44 animate-skeleton-pulse snap-start">
        <div className="bg-brand-subtle rounded-xl h-full w-full">
            <div className="w-full h-40 bg-brand-border/50 rounded-t-xl"></div>
            <div className="p-3">
                <div className="h-4 bg-brand-border/50 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-brand-border/50 rounded w-1/2 mx-auto mb-3"></div>
                <div className="h-8 bg-brand-border rounded-full w-full"></div>
            </div>
        </div>
    </div>
);


export const CartDrawer = ({ isOpen, setIsOpen, navigateTo }: CartDrawerProps) => {
    const { state, dispatch, cartSubtotal, discountAmount, finalTotal, cartCount } = useAppState();
    const { currentUser, theme } = state;
    const addToast = useToast();
    
    const [activeModal, setActiveModal] = useState<null | 'gift' | 'note' | 'shipping'>(null);
    const [noteText, setNoteText] = useState(state.orderNote || '');
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [shippingEstimateAddress, setShippingEstimateAddress] = useState<string>(currentUser?.addresses.find(a => a.isDefault)?.id.toString() || '');


    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [hasBeenOpened, setHasBeenOpened] = useState(false);
    const shouldBeVisible = isOpen;
    const [isSubtotalAnimating, setIsSubtotalAnimating] = useState(false);
    const prevSubtotalRef = useRef(cartSubtotal);
    const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

    // AI Recommendations State
    const [aiRecommendations, setAiRecommendations] = useState<{ product: Product, reason: string }[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [recommendationsFetched, setRecommendationsFetched] = useState(false);

    const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

     useEffect(() => {
        if (cartSubtotal > prevSubtotalRef.current) {
            setIsSubtotalAnimating(true);
            const timer = setTimeout(() => setIsSubtotalAnimating(false), 300);
            return () => clearTimeout(timer);
        }
        prevSubtotalRef.current = cartSubtotal;
    }, [cartSubtotal]);
    
    useEffect(() => {
        if (!isOpen) {
            setCouponError('');
        }
    }, [isOpen]);

    const cartItems = useMemo((): CartItem[] => {
        return state.cart.map(cartDetail => {
            const product = allProducts.find(p => p.id === cartDetail.id);
            if (!product) return null;

            let price = product.price;
            let oldPrice = product.oldPrice;

            if (product.variants && product.variants.length > 0) {
                const variant = product.variants.find(v => v.size === cartDetail.selectedSize && v.color === cartDetail.selectedColor);
                if (variant) {
                    price = variant.price;
                    oldPrice = variant.oldPrice;
                }
            }

            return {
                ...product,
                price,
                oldPrice,
                quantity: cartDetail.quantity,
                selectedSize: cartDetail.selectedSize,
                selectedColor: cartDetail.selectedColor,
            };
        }).filter((item): item is CartItem => item !== null);
    }, [state.cart]);

    // Reset AI recommendations if cart items change
    useEffect(() => {
        setRecommendationsFetched(false);
        setAiRecommendations([]);
    }, [cartItems.length]);


    useEffect(() => {
        if (shouldBeVisible) {
            setHasBeenOpened(true);
        }
    }, [shouldBeVisible]);

    useEffect(() => {
        if (activeModal === 'note') {
            setNoteText(state.orderNote || '');
        }
    }, [activeModal, state.orderNote]);

    const getAnimationClass = () => {
        if (!hasBeenOpened && !shouldBeVisible) {
            return '-translate-x-full';
        }
        return shouldBeVisible ? 'animate-slide-in-left' : 'animate-slide-out-left';
    };

    const shippingThreshold = 230;
    const amountToFreeShipping = Math.max(0, shippingThreshold - cartSubtotal);
    const shippingProgress = Math.min((cartSubtotal / shippingThreshold) * 100, 100);

    const handleQuantityChange = (id: number, size: string, color: string, newQuantity: number) => {
        dispatch({ type: 'UPDATE_CART_ITEM_QUANTITY', payload: { id, selectedSize: size, selectedColor: color, quantity: newQuantity } });
    };

    const handleRemoveItemClick = (item: CartItem) => {
        setItemToRemove(item);
    };

    const confirmRemoveItem = () => {
        if (itemToRemove) {
            dispatch({ type: 'REMOVE_FROM_CART', payload: { id: itemToRemove.id, selectedSize: itemToRemove.selectedSize, selectedColor: itemToRemove.selectedColor } });
            addToast(`تمت إزالة "${itemToRemove.name}" من السلة.`, 'success');
            setItemToRemove(null);
        }
    };

    const handleMoveToWishlist = (item: CartItem) => {
        if (!currentUser) {
            addToast('الرجاء تسجيل الدخول لاستخدام قائمة الرغبات.', 'info');
            navigateTo('login');
            setIsOpen(false);
            return;
        }
        const isInWishlist = state.wishlist.some(wishlistItem => wishlistItem.id === item.id);
        if (!isInWishlist) {
            dispatch({ type: 'TOGGLE_WISHLIST', payload: item.id });
        }
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id: item.id, selectedSize: item.selectedSize, selectedColor: item.selectedColor } });
        addToast(`${item.name} تم نقله إلى قائمة الرغبات.`, 'success');
    };
    
    const defaultRecommendations = useMemo(() => {
        const cartItemIds = new Set(cartItems.map(item => item.id));
        return allProducts
            .filter(p => !cartItemIds.has(p.id))
            .sort((a,b) => (b.soldIn24h || 0) - (a.soldIn24h || 0))
            .slice(0, 4);
    }, [cartItems]);

    const addToCartHandler = (product: Product) => {
        // For products with variants, navigate to the product page for option selection
        if (product.variants && product.variants.length > 0) {
            navigateTo('product', product);
            setIsOpen(false); // Close the cart drawer
        } else {
            dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1, selectedColor: product.colors[0], selectedSize: product.sizes[0] } });
        }
    };

    const getAiRecommendations = async () => {
        setIsGenerating(true);
        setRecommendationsFetched(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const cartContent = cartItems.map(item => `${item.name} (الفئة: ${item.category})`).join(', ');
            const cartItemIds = cartItems.map(item => item.id);
            const availableProductsString = allProducts
                .filter(p => !cartItemIds.includes(p.id))
                .map(p => p.name)
                .join(', ');

            const prompt = `أنت خبير تسويق إلكتروني لمتجر أزياء يسمى ${theme.siteName}. لدى المستخدم هذه المنتجات في سلته: ${cartContent}. من قائمة المنتجات المتاحة التالية، أوصِ بـ 3 منتجات محددة تُشترى غالبًا مع المنتجات الموجودة في السلة. قدم سببًا قصيرًا وأنيقًا باللغة العربية لكل توصية. لا توصِ بمنتجات موجودة بالفعل في السلة. المنتجات المتاحة: ${availableProductsString}. قم بالرد فقط بكائن JSON.`;
    
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            recommendations: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        productName: {
                                            type: Type.STRING,
                                            description: 'الاسم الدقيق للمنتج الموصى به من قائمة المنتجات المتاحة.',
                                        },
                                        reason: {
                                            type: Type.STRING,
                                            description: 'سبب قصير وأنيق باللغة العربية يوضح لماذا هذا المنتج توصية جيدة.'
                                        }
                                    },
                                    required: ['productName', 'reason']
                                }
                            }
                        },
                        required: ['recommendations']
                    }
                }
            });
            
            const jsonResponse = JSON.parse(response.text);
            const recommendations: { productName: string, reason: string }[] = jsonResponse.recommendations || [];
    
            const foundProducts = recommendations.map(rec => {
                const found = allProducts.find(p => p.name.toLowerCase() === rec.productName.toLowerCase() && !cartItemIds.includes(p.id));
                return found ? { product: found, reason: rec.reason } : null;
            }).filter((item): item is { product: Product, reason: string } => item !== null);
            
            setAiRecommendations(foundProducts);
        } catch (error) {
            console.error("Error fetching AI recommendations:", error);
            // Fallback or error message could be set here
        } finally {
            setIsGenerating(false);
        }
    };
    
    const renderRecommendationItem = (item: any, isAi: boolean = false) => (
         <div key={isAi ? item.product.id : item.id} className="flex-shrink-0 w-44 snap-start">
            <div 
                className="group bg-surface rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col cursor-pointer" 
                onClick={() => { navigateTo('product', isAi ? item.product : item); setIsOpen(false); }}>
                <div className="relative overflow-hidden">
                    <img src={isAi ? item.product.image : item.image} alt={isAi ? item.product.name : item.name} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
                     {isAi && (
                        <>
                        <div className="absolute top-2 left-2 bg-brand-primary text-brand-bg text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <SparklesIcon size="sm" className="w-3 h-3"/>
                            اختيار AI
                        </div>
                        <div className="absolute top-2 right-2 group/tooltip">
                            <div className="w-5 h-5 flex items-center justify-center text-brand-bg/80 bg-brand-dark/40 rounded-full">
                              <i className="fa-solid fa-circle-info text-xs"></i>
                            </div>
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-brand-dark text-brand-bg text-xs rounded-lg p-2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-20 pointer-events-none">
                                {item.reason}
                            </div>
                        </div>
                        </>
                    )}
                </div>
                <div className="p-3 text-center flex-grow flex flex-col">
                    <p className="font-bold text-sm text-brand-dark truncate mb-1 flex-grow">{isAi ? item.product.name : item.name}</p>
                    <div className="flex justify-center items-baseline gap-1">
                      <p className="text-brand-primary font-bold text-sm">{isAi ? item.product.price : item.price} ج.م</p>
                      {(isAi ? item.product.oldPrice : item.oldPrice) && <p className="text-brand-text-light line-through text-xs">{isAi ? item.product.oldPrice : item.oldPrice} ج.م</p>}
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); addToCartHandler(isAi ? item.product : item); }} 
                        className="w-full mt-2 bg-brand-dark text-brand-bg text-xs font-bold py-2 rounded-full hover:bg-opacity-90 transition-all active:scale-95"
                    >
                        أضف للسلة
                    </button>
                </div>
            </div>
        </div>
    );

    const exampleCoupons = ['SAVE10', 'FREESHIP'];

    const handleApplyCoupon = (e?: React.FormEvent) => {
        e?.preventDefault();
        setCouponError('');
        const codeToApply = couponCode.trim().toUpperCase();
        if (!codeToApply) return;
        
        const foundCoupon = validCoupons.find(c => c.code === codeToApply);
        if (foundCoupon) {
            dispatch({ type: 'APPLY_COUPON', payload: foundCoupon });
            addToast(`تم تطبيق الكوبون "${codeToApply}"!`, 'success');
        } else {
            dispatch({ type: 'REMOVE_COUPON' });
            setCouponError('كود الكوبون غير صالح.');
        }
        setCouponCode('');
    };

    const handleApplyExampleCoupon = (code: string) => {
        const foundCoupon = validCoupons.find(c => c.code === code);
        if (foundCoupon) {
            dispatch({ type: 'APPLY_COUPON', payload: foundCoupon });
            addToast(`تم تطبيق الكوبون "${code}"!`, 'success');
            setCopiedCoupon(code);
            setTimeout(() => setCopiedCoupon(null), 2000);
        }
    };

    const handleAddGiftWrap = () => {
        dispatch({ type: 'SET_GIFT_WRAP', payload: !state.giftWrap });
        addToast(state.giftWrap ? 'تمت إزالة تغليف الهدية.' : 'تمت إضافة تغليف الهدية!', state.giftWrap ? 'info' : 'success');
        setActiveModal(null);
    };

    const handleSaveNote = () => {
        dispatch({ type: 'SET_ORDER_NOTE', payload: noteText });
        addToast('تم حفظ رسالة الهدية.', 'success');
        setActiveModal(null);
    };

    return (
        <>
            <ConfirmationModal
                isOpen={!!itemToRemove}
                onClose={() => setItemToRemove(null)}
                onConfirm={confirmRemoveItem}
                title="إزالة المنتج"
                message={`هل أنت متأكد أنك تريد إزالة "${itemToRemove?.name}" من سلة التسوق؟`}
            />
            <div className={`fixed inset-0 bg-[var(--backdrop)] z-[60] transition-opacity duration-300 ${shouldBeVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <div 
                className={`fixed top-0 left-0 h-full w-[90vw] max-w-md bg-brand-bg shadow-lg z-[60] ${getAnimationClass()}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-drawer-title"
            >
                 <div className="grid grid-rows-[auto_1fr_auto] h-full">
                     <div className="p-5 flex justify-between items-center border-b border-brand-border bg-brand-subtle">
                        <h2 id="cart-drawer-title" className="font-bold text-xl text-brand-dark">عربة التسوق ({cartCount})</h2>
                        <button onClick={() => setIsOpen(false)} aria-label="إغلاق السلة" className="p-1 hover:bg-brand-subtle rounded-full"><CloseIcon /></button>
                    </div>
                    
                    <div className="overflow-y-auto">
                        <div className="p-5 border-b border-brand-border">
                            <p className="font-semibold text-center mb-4 text-sm text-brand-text">
                                {amountToFreeShipping > 0 ? (
                                    <span>أنفق <span className="text-brand-primary font-bold">{amountToFreeShipping.toFixed(2)} ج.م</span> إضافية للشحن المجاني</span>
                                ) : (
                                    <span className="text-brand-instock font-bold">لقد حصلت على شحن مجاني!</span>
                                )}
                            </p>
                            <div
                                className="w-full bg-brand-border/50 rounded-full h-2 relative"
                                role="progressbar"
                                aria-valuenow={cartSubtotal}
                                aria-valuemin="0"
                                aria-valuemax={shippingThreshold}
                                aria-label="التقدم نحو الشحن المجاني"
                            >
                                <div className="bg-brand-primary h-full rounded-full transition-all duration-500" style={{width: `${shippingProgress}%`}}></div>
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-brand-primary border-4 border-brand-bg shadow-md flex items-center justify-center transition-all duration-500"
                                    style={{ right: `calc(${shippingProgress}% - 16px)` }}
                                    aria-hidden="true"
                                >
                                    <ShippingIcon size="sm" className="text-brand-bg"/>
                                </div>
                            </div>
                        </div>

                        {cartItems.length > 0 ? (
                            <div className="divide-y divide-brand-border">
                                {cartItems.map((item, index) => (
                                     <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-start gap-4 p-5 animate-quick-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                        <img src={item.image} alt={item.name} className="w-20 h-24 flex-shrink-0 rounded-lg object-cover border border-brand-border"/>
                                        <div className="flex flex-1 flex-col self-stretch">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <p className="font-bold text-brand-dark text-sm leading-tight pr-2">{item.name}</p>
                                                    <button onClick={() => handleRemoveItemClick(item)} className="text-brand-text-light hover:text-brand-sale flex-shrink-0 p-1 -mr-1"><CloseIcon size="sm"/></button>
                                                </div>
                                                <p className="text-xs text-brand-text-light mt-1">{`اللون: ${item.selectedColor}, المقاس: ${item.selectedSize}`}</p>
                                                {!state.wishlist.some(wishlistItem => wishlistItem.id === item.id) && (
                                                    <button onClick={() => handleMoveToWishlist(item)} className="flex items-center gap-1 text-xs mt-1 text-brand-text-light hover:text-brand-primary">
                                                        <HeartIcon size="sm" /> <span>انقل إلى قائمة الرغبات</span>
                                                    </button>
                                                )}
                                            </div>
                                            
                                            <div className="flex justify-between items-center mt-auto pt-2">
                                                <div className="flex items-center border border-brand-border rounded-full bg-surface">
                                                    <button onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="p-1.5 text-brand-text-light active:scale-90 disabled:opacity-50 hover:bg-brand-subtle rounded-full" disabled={item.quantity <= 1} aria-label="تقليل الكمية"><MinusIcon size="sm"/></button>
                                                    <span className="px-2 font-bold text-sm w-8 text-center tabular-nums">{item.quantity}</span>
                                                    <button onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="p-1.5 text-brand-text-light active:scale-90 hover:bg-brand-subtle rounded-full" aria-label="زيادة الكمية"><PlusIcon size="sm"/></button>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-brand-dark font-bold text-base">{(parseFloat(item.price) * item.quantity).toFixed(2)} ج.م</span>
                                                    {item.oldPrice && <span className="text-brand-text-light line-through text-xs">{item.oldPrice} ج.م</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center flex flex-col items-center justify-center h-full">
                                <ShoppingBagIcon size="lg" className="text-brand-text-light w-20 h-20 mb-4" />
                                <h3 className="text-xl font-bold text-brand-dark mb-2">سلة التسوق الخاصة بك فارغة</h3>
                                <p className="text-brand-text-light mb-6 max-w-xs mx-auto">يبدو أنك لم تقم بإضافة أي شيء إلى سلتك بعد. ابدأ التسوق الآن!</p>
                                <button
                                    onClick={() => { setIsOpen(false); navigateTo('shop'); }}
                                    className="bg-brand-dark text-brand-bg font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all active:scale-95"
                                >
                                    متابعة التسوق
                                </button>
                            </div>
                        )}
                        
                        <div className="p-5 mt-4 bg-brand-subtle overflow-hidden">
                            {cartItems.length < 3 ? (
                                <Carousel
                                    title={cartItems.length > 0 ? "أكمل إطلالتك" : "ربما يعجبك ايضا"}
                                    items={defaultRecommendations}
                                    renderItem={(item) => renderRecommendationItem(item)}
                                />
                            ) : isGenerating ? (
                                <>
                                    <h3 className="font-bold text-lg mb-4">جارٍ البحث عن توصيات...</h3>
                                    <div className="flex gap-4 -mx-5 px-5">
                                        {[...Array(3)].map((_, i) => <RecommendationSkeleton key={i} />)}
                                    </div>
                                </>
                            ) : !recommendationsFetched ? (
                                <div className="text-center p-4 border-2 border-dashed rounded-lg bg-brand-primary/5">
                                    <h4 className="font-bold text-brand-dark">أكمل طلبك</h4>
                                    <p className="text-sm text-brand-text-light my-2">أكملي طلبك بقطع يشتريها الآخرون عادةً مع منتجاتك.</p>
                                    <button onClick={getAiRecommendations} className="bg-brand-primary text-brand-bg font-bold py-2.5 px-6 rounded-full flex items-center justify-center gap-2 mx-auto hover:bg-opacity-90 transition-opacity active:scale-95">
                                        <SparklesIcon size="sm" />
                                        الحصول على توصيات AI
                                    </button>
                                </div>
                            ) : aiRecommendations.length > 0 ? (
                                <Carousel
                                    title="يُشترى معًا بشكل متكرر"
                                    items={aiRecommendations}
                                    renderItem={(item) => renderRecommendationItem(item, true)}
                                />
                            ) : (
                                <Carousel
                                    title="أكمل إطلالتك"
                                    items={defaultRecommendations}
                                    renderItem={(item) => renderRecommendationItem(item)}
                                />
                            )}
                        </div>
                    </div>

                    <div className="p-5 border-t border-brand-border space-y-4 bg-brand-subtle">
                         <div className="grid grid-cols-3 gap-2 text-center text-xs text-brand-text-light">
                            <button onClick={() => setActiveModal('gift')} className={`flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-brand-subtle ${state.giftWrap ? 'text-brand-primary font-bold' : ''}`}><GiftIcon size="sm"/> <span>تغليف هدية</span></button>
                            <button 
                                onClick={() => setActiveModal('note')}
                                disabled={!state.giftWrap} 
                                className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${state.giftWrap ? `hover:bg-brand-subtle ${state.orderNote ? 'text-brand-primary font-bold' : ''}` : 'text-brand-text-light/50 cursor-not-allowed'}`}>
                                    <NoteIcon size="sm"/> <span>رسالة هدية</span>
                            </button>
                            <button onClick={() => setActiveModal('shipping')} className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-brand-subtle"><ShippingIcon size="sm"/> <span>الشحن</span></button>
                         </div>
                         
                         <div>
                             <form className="flex gap-2" onSubmit={handleApplyCoupon}>
                                <input type="text" placeholder="أدخل رمز الكوبون" aria-label="أدخل رمز الكوبون" value={couponCode} onChange={e => setCouponCode(e.target.value)} className={`w-full bg-surface border rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-1 ${couponError ? 'border-brand-sale ring-brand-sale/50' : 'border-brand-border focus:ring-brand-dark'}`} />
                                <button type="submit" className="bg-brand-dark text-brand-bg font-bold py-2 px-6 rounded-full text-sm hover:bg-opacity-90 transition-all active:scale-95">تطبيق</button>
                            </form>
                            {couponError && <p className="text-brand-sale text-xs mt-2 px-2">{couponError}</p>}
                         </div>

                        <div className="flex flex-wrap gap-2">
                             {exampleCoupons.map(code => (
                                <button
                                    key={code}
                                    type="button"
                                    onClick={() => handleApplyExampleCoupon(code)}
                                    className="text-xs font-bold bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full hover:bg-brand-primary/20 transition-all flex items-center gap-1.5 active:scale-95"
                                >
                                    {copiedCoupon === code ? (
                                        <>
                                            <CheckIcon size="sm" />
                                            <span>تم التطبيق!</span>
                                        </>
                                    ) : (
                                        <>
                                            <CouponIcon size="sm" />
                                            <span>{code}</span>
                                        </>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-1 border-t border-brand-border pt-3">
                             <div className="flex justify-between items-center text-sm font-semibold">
                                <span className="text-brand-text">المجموع الفرعي:</span>
                                <span>{cartSubtotal.toFixed(2)} ج.م</span>
                            </div>
                             {state.giftWrap && (
                                <div className="flex justify-between items-center text-sm font-semibold">
                                    <span className="text-brand-text">تغليف هدية:</span>
                                    <span>10.00 ج.م</span>
                                </div>
                            )}
                            {state.appliedCoupon && (
                                <div className="flex justify-between items-center text-sm font-semibold">
                                    <span className="text-brand-instock">خصم ({state.appliedCoupon.code}):</span>
                                    <span className="text-brand-instock">-{discountAmount.toFixed(2)} ج.م</span>
                                </div>
                            )}
                             <div className="flex justify-between items-center font-bold text-lg pt-2">
                                <span>الإجمالي:</span>
                                <span className={`text-brand-dark transition-all duration-300 ${isSubtotalAnimating ? 'scale-110 text-brand-primary' : 'scale-100'}`}>{finalTotal.toFixed(2)} ج.م</span>
                            </div>
                        </div>

                        <p className="text-xs text-brand-text-light text-center">يتم احتساب الضرائب والشحن عند الدفع</p>
                        <div className="flex items-center justify-start gap-2">
                            <input type="checkbox" id="drawer-terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="h-4 w-4 rounded border-brand-border text-brand-dark focus:ring-brand-dark"/>
                            <label htmlFor="drawer-terms" className="text-sm">أوافق على <a href="#" className="underline font-semibold">الشروط والأحكام</a></label>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                             <button onClick={() => { navigateTo('checkout'); setIsOpen(false); }} className="w-full bg-brand-dark text-brand-bg font-bold py-3 rounded-full hover:bg-opacity-90 disabled:opacity-50 transition-transform active:scale-98" disabled={!agreedToTerms || cartItems.length === 0}>الدفع</button>
                             <button onClick={() => { navigateTo('cart'); setIsOpen(false); }} className="w-full bg-surface border border-brand-dark text-brand-dark font-bold py-3 rounded-full transition-all duration-200 hover:bg-brand-dark hover:text-brand-bg active:scale-98">عرض السلة</button>
                         </div>
                    </div>
                 </div>
            </div>

            {/* Modals */}
            <BottomModal isOpen={activeModal === 'gift'} onClose={() => setActiveModal(null)} title={state.giftWrap ? 'إزالة تغليف الهدية' : 'أضف تغليف هدية'}>
                <p className="text-brand-text-light mb-4">{state.giftWrap ? 'هل أنت متأكد أنك تريد إزالة تغليف الهدية؟' : `سيتم تغليف المنتج بعناية. الرسوم فقط 10.00 ج.م. هل تريد تغليف الهدايا؟`}</p>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={handleAddGiftWrap} className="w-full bg-brand-dark text-brand-bg font-bold py-3 rounded-full hover:bg-opacity-90">{state.giftWrap ? 'نعم، إزالة' : 'أضف تغليف هدية'}</button>
                    <button onClick={() => setActiveModal(null)} className="w-full bg-surface border border-brand-dark text-brand-dark font-bold py-3 rounded-full hover:bg-brand-dark hover:text-brand-bg">إلغاء</button>
                </div>
            </BottomModal>

            <BottomModal isOpen={activeModal === 'note'} onClose={() => setActiveModal(null)} title="إضافة رسالة هدية">
                <textarea placeholder="اكتب رسالتك هنا..." rows={5} value={noteText} onChange={(e) => setNoteText(e.target.value)} className="w-full border bg-surface border-brand-border rounded-lg p-3 mb-4 focus:ring-brand-dark focus:border-brand-dark"></textarea>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={handleSaveNote} className="w-full bg-brand-dark text-brand-bg font-bold py-3 rounded-full hover:bg-opacity-90">حفظ الرسالة</button>
                    <button onClick={() => setActiveModal(null)} className="w-full bg-surface border border-brand-dark text-brand-dark font-bold py-3 rounded-full hover:bg-brand-dark hover:text-brand-bg">إغلاق</button>
                </div>
            </BottomModal>

            <BottomModal isOpen={activeModal === 'shipping'} onClose={() => setActiveModal(null)} title="تقديرات الشحن">
                <div className="space-y-4">
                     {currentUser?.addresses && currentUser.addresses.length > 0 ? (
                        <div>
                            <label className="font-semibold text-sm mb-1 block">اختر عنوانًا للحصول على تقدير</label>
                            <div className="relative">
                                <select 
                                    value={shippingEstimateAddress}
                                    onChange={(e) => setShippingEstimateAddress(e.target.value)}
                                    className="w-full border border-brand-border rounded-lg p-3 appearance-none bg-surface"
                                >
                                    {currentUser.addresses.map(addr => (
                                        <option key={addr.id} value={addr.id}>{`${addr.name} - ${addr.city}`}</option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light pointer-events-none"/>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-brand-text-light">أضف عنوانًا إلى حسابك للحصول على تقديرات أسرع.</p>
                    )}
                </div>
                 <div className="grid grid-cols-2 gap-4 mt-6">
                    <button onClick={() => setActiveModal(null)} className="w-full bg-brand-dark text-brand-bg font-bold py-3 rounded-full hover:bg-opacity-90">تقدير</button>
                    <button onClick={() => setActiveModal(null)} className="w-full bg-surface border border-brand-dark text-brand-dark font-bold py-3 rounded-full hover:bg-brand-dark hover:text-brand-bg">إغلاق</button>
                </div>
            </BottomModal>
        </>
    );
};