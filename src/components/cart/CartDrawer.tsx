import React, { useState, useRef, useMemo, useEffect } from 'react';
import { CartItem, Product } from '../../types';
import { CloseIcon, MinusIcon, PlusIcon, GiftIcon, NoteIcon, TruckIcon as ShippingIcon, ArrowLongRightIcon, ChevronDownIcon, SparklesIcon, CheckIcon, CouponIcon, ShoppingBagIcon } from '../icons';
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
    isMinimized: boolean;
}

interface BottomModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const BottomModal: React.FC<BottomModalProps> = ({ isOpen, onClose, title, children }) => {
    return (
        <div className={`fixed inset-0 z-[70] transition-opacity duration-300 ${isOpen ? 'bg-black/50' : 'bg-transparent pointer-events-none'}`} onClick={onClose}>
            <div className={`fixed bottom-0 right-0 left-0 bg-white rounded-t-2xl shadow-2xl p-6 transform transition-transform duration-400 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-brand-dark mb-4">{title}</h3>
                {children}
            </div>
        </div>
    );
};

const RecommendationSkeleton = () => (
    <div className="flex-shrink-0 w-44 animate-skeleton-pulse snap-start">
        <div className="bg-gray-100 rounded-xl h-full w-full">
            <div className="w-full h-40 bg-gray-200 rounded-t-xl"></div>
            <div className="p-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-3"></div>
                <div className="h-8 bg-gray-300 rounded-full w-full"></div>
            </div>
        </div>
    </div>
);


export const CartDrawer = ({ isOpen, setIsOpen, navigateTo, isMinimized }: CartDrawerProps) => {
    const { state, dispatch, cartSubtotal, discountAmount, finalTotal, cartCount } = useAppState();
    const { currentUser } = state;
    const addToast = useToast();
    
    const [activeModal, setActiveModal] = useState<null | 'gift' | 'note' | 'shipping'>(null);
    const [noteText, setNoteText] = useState(state.orderNote || '');
    const [couponCode, setCouponCode] = useState('');
    const [shippingEstimateAddress, setShippingEstimateAddress] = useState<string>(currentUser?.addresses.find(a => a.isDefault)?.id.toString() || '');


    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [hasBeenOpened, setHasBeenOpened] = useState(false);
    const shouldBeVisible = isOpen && !isMinimized;
    const [isSubtotalAnimating, setIsSubtotalAnimating] = useState(false);
    const prevSubtotalRef = useRef(cartSubtotal);
    const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

    // AI Recommendations State
    const [aiRecommendations, setAiRecommendations] = useState<{ product: Product, reason: string }[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [recommendationsFetched, setRecommendationsFetched] = useState(false);

     useEffect(() => {
        if (cartSubtotal > prevSubtotalRef.current) {
            setIsSubtotalAnimating(true);
            const timer = setTimeout(() => setIsSubtotalAnimating(false), 300);
            return () => clearTimeout(timer);
        }
        prevSubtotalRef.current = cartSubtotal;
    }, [cartSubtotal]);

    const cartItems = useMemo((): CartItem[] => {
        return state.cart.map(cartDetail => {
            const product = allProducts.find(p => p.id === cartDetail.id);
            return {
                ...(product as Product),
                quantity: cartDetail.quantity,
                selectedSize: cartDetail.selectedSize,
                selectedColor: cartDetail.selectedColor,
            };
        }).filter(item => item.id);
    }, [state.cart]);

    const [lastAddedItemName, setLastAddedItemName] = useState<string | null>(null);
    const prevCartCountRefForMessage = useRef(cartItems.length);

    useEffect(() => {
        if (cartItems.length > prevCartCountRefForMessage.current) {
            const lastItem = cartItems[cartItems.length - 1];
            if (lastItem) {
                setLastAddedItemName(lastItem.name);
                const timer = setTimeout(() => {
                    setLastAddedItemName(null);
                }, 4000); // Hide after 4 seconds
                
                return () => clearTimeout(timer);
            }
        }
        prevCartCountRefForMessage.current = cartItems.length;
    }, [cartItems]);

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
            return 'translate-x-full';
        }
        return shouldBeVisible ? 'animate-slide-in-right' : 'animate-slide-out-right';
    };

    const shippingThreshold = 230;
    const amountToFreeShipping = Math.max(0, shippingThreshold - cartSubtotal);
    const shippingProgress = Math.min((cartSubtotal / shippingThreshold) * 100, 100);

    const handleQuantityChange = (id: number, size: string, color: string, newQuantity: number) => {
        dispatch({ type: 'UPDATE_CART_ITEM_QUANTITY', payload: { id, selectedSize: size, selectedColor: color, quantity: newQuantity } });
    };

    const handleRemoveItem = (id: number, size: string, color: string) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id, selectedSize: size, selectedColor: color } });
    };
    
    const defaultRecommendations = useMemo(() => {
        const cartItemIds = new Set(cartItems.map(item => item.id));
        return allProducts
            .filter(p => !cartItemIds.has(p.id))
            .sort((a,b) => (b.soldIn24h || 0) - (a.soldIn24h || 0))
            .slice(0, 4);
    }, [cartItems]);

    const addToCartHandler = (product: Product) => {
        dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1, selectedColor: product.colors[0], selectedSize: product.sizes[0] } });
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

            const prompt = `أنت خبير تسويق إلكتروني لمتجر أزياء يسمى Vineta. لدى المستخدم هذه المنتجات في سلته: ${cartContent}. من قائمة المنتجات المتاحة التالية، أوصِ بـ 3 منتجات محددة تُشترى غالبًا مع المنتجات الموجودة في السلة. قدم سببًا قصيرًا وأنيقًا باللغة العربية لكل توصية. لا توصِ بمنتجات موجودة بالفعل في السلة. المنتجات المتاحة: ${availableProductsString}. قم بالرد فقط بكائن JSON.`;
    
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
                className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col cursor-pointer" 
                onClick={() => { navigateTo('product', isAi ? item.product : item); setIsOpen(false); }}>
                <div className="relative overflow-hidden">
                    <img src={isAi ? item.product.image : item.image} alt={isAi ? item.product.name : item.name} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
                     {isAi && (
                        <>
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <SparklesIcon size="sm" className="w-3 h-3"/>
                            اختيار AI
                        </div>
                        <div className="absolute top-2 right-2 group/tooltip">
                            <div className="w-5 h-5 flex items-center justify-center text-white/80 bg-black/40 rounded-full">
                              <i className="fa-solid fa-circle-info text-xs"></i>
                            </div>
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-brand-dark text-white text-xs rounded-lg p-2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-20 pointer-events-none">
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
                        className="w-full mt-2 bg-brand-dark text-white text-xs font-bold py-2 rounded-full hover:bg-opacity-90 transition-all active:scale-95"
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
        const codeToApply = couponCode.trim().toUpperCase();
        if (!codeToApply) return;
        
        const foundCoupon = validCoupons.find(c => c.code === codeToApply);
        if (foundCoupon) {
            dispatch({ type: 'APPLY_COUPON', payload: foundCoupon });
            addToast(`تم تطبيق الكوبون "${codeToApply}"!`, 'success');
        } else {
            dispatch({ type: 'REMOVE_COUPON' });
            addToast('كود الكوبون غير صالح.', 'error');
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
        addToast('تم حفظ ملاحظة الطلب.', 'success');
        setActiveModal(null);
    };

    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${shouldBeVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <div className={`fixed top-0 right-0 h-full w-[90vw] max-w-md bg-brand-subtle shadow-lg z-[60] ${getAnimationClass()}`}>
                 <div className="flex flex-col h-full">
                     <div className="p-5 flex justify-between items-center border-b bg-white">
                        <h2 className="font-bold text-xl text-brand-dark">عربة التسوق ({cartCount})</h2>
                        <button onClick={() => setIsOpen(false)} aria-label="إغلاق السلة" className="p-1 hover:bg-brand-subtle rounded-full"><CloseIcon /></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto bg-white">
                         {lastAddedItemName && (
                            <div className="p-4 bg-green-100 border-b border-green-200 animate-fade-in">
                                <div className="flex items-center gap-3 text-sm">
                                    <CheckIcon size="sm" className="text-green-600"/>
                                    <div>
                                        <span className="font-bold">"{lastAddedItemName}"</span>
                                        <span className="text-green-700"> تمت إضافته إلى سلتك!</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="p-5 border-b">
                            <p className="font-semibold text-center mb-4 text-sm text-brand-text">
                                {amountToFreeShipping > 0 ? (
                                    <span>أنفق <span className="text-brand-primary font-bold">{amountToFreeShipping.toFixed(2)} ج.م</span> إضافية للشحن المجاني</span>
                                ) : (
                                    <span className="text-brand-instock font-bold">لقد حصلت على شحن مجاني!</span>
                                )}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 relative">
                                <div className="bg-gradient-to-r from-red-400 to-brand-primary h-full rounded-full transition-all duration-500" style={{width: `${shippingProgress}%`}}></div>
                                <div className="absolute top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-brand-primary border-4 border-white shadow-md flex items-center justify-center transition-all duration-500" style={{ right: `calc(${shippingProgress}% - 16px)` }}>
                                    <ShippingIcon size="sm" className="text-white"/>
                                </div>
                            </div>
                        </div>

                        {cartItems.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                     <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-start gap-4 p-5">
                                        <img src={item.image} alt={item.name} className="w-20 h-24 flex-shrink-0 rounded-lg object-cover border border-gray-200"/>
                                        <div className="flex flex-1 flex-col self-stretch">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <p className="font-bold text-brand-dark text-sm leading-tight pr-2">{item.name}</p>
                                                    <button onClick={() => handleRemoveItem(item.id, item.selectedSize, item.selectedColor)} className="text-brand-text-light hover:text-red-500 flex-shrink-0 p-1 -mr-1"><CloseIcon size="sm"/></button>
                                                </div>
                                                <p className="text-xs text-brand-text-light mt-1">{`اللون: ${item.selectedColor}, المقاس: ${item.selectedSize}`}</p>
                                            </div>
                                            
                                            <div className="flex justify-between items-center mt-auto pt-2">
                                                <div className="flex items-center border border-brand-border rounded-full bg-white">
                                                    <button onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="p-1.5 text-gray-500 transition-transform active:scale-90 disabled:opacity-50" disabled={item.quantity <= 1} aria-label="تقليل الكمية"><MinusIcon size="sm"/></button>
                                                    <span className="px-2 font-bold text-sm w-8 text-center tabular-nums">{item.quantity}</span>
                                                    <button onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="p-1.5 text-gray-500 transition-transform active:scale-90" aria-label="زيادة الكمية"><PlusIcon size="sm"/></button>
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
                                <ShoppingBagIcon size="lg" className="text-gray-300 w-20 h-20 mb-4" />
                                <h3 className="text-xl font-bold text-brand-dark mb-2">سلة التسوق الخاصة بك فارغة</h3>
                                <p className="text-brand-text-light mb-6 max-w-xs mx-auto">يبدو أنك لم تقم بإضافة أي شيء إلى سلتك بعد. ابدأ التسوق الآن!</p>
                                <button
                                    onClick={() => { setIsOpen(false); navigateTo('shop'); }}
                                    className="bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all active:scale-95"
                                >
                                    متابعة التسوق
                                </button>
                            </div>
                        )}
                        
                        <div className="p-5 mt-4 bg-brand-subtle">
                             {isGenerating ? (
                                <>
                                <h3 className="font-bold text-lg mb-4">جارٍ البحث عن توصيات...</h3>
                                <div className="flex gap-4 -mx-5 px-5">
                                    {[...Array(3)].map((_, i) => <RecommendationSkeleton key={i} />)}
                                </div>
                                </>
                            ) : recommendationsFetched && aiRecommendations.length > 0 ? (
                                 <Carousel
                                    title="يُشترى معًا بشكل متكرر"
                                    items={aiRecommendations}
                                    renderItem={(item) => renderRecommendationItem(item, true)}
                                />
                            ) : !recommendationsFetched && cartItems.length > 0 ? (
                                 <div className="text-center p-4 border-2 border-dashed rounded-lg bg-indigo-50/50">
                                    <h4 className="font-bold text-brand-dark">أكمل طلبك</h4>
                                    <p className="text-sm text-brand-text-light my-2">أكملي طلبك بقطع يشتريها الآخرون عادةً مع منتجاتك.</p>
                                    <button onClick={getAiRecommendations} className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2.5 px-6 rounded-full flex items-center justify-center gap-2 mx-auto hover:opacity-90 transition-opacity active:scale-95">
                                        <SparklesIcon size="sm" />
                                        الحصول على توصيات AI
                                    </button>
                                </div>
                            ) : (
                                <Carousel
                                    title={cartItems.length > 0 ? "أكمل إطلالتك" : "ربما يعجبك ايضا"}
                                    items={defaultRecommendations}
                                    renderItem={(item) => renderRecommendationItem(item)}
                                />
                            )}
                        </div>
                    </div>

                    <div className="p-5 border-t space-y-4 bg-white mt-auto">
                         <div className="grid grid-cols-3 gap-2 text-center text-xs text-brand-text-light">
                            <button onClick={() => setActiveModal('gift')} className={`flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-brand-subtle ${state.giftWrap ? 'text-brand-primary' : ''}`}><GiftIcon size="sm"/> <span>تغليف هدية</span></button>
                            <button onClick={() => setActiveModal('note')} className={`flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-brand-subtle ${state.orderNote ? 'text-brand-primary' : ''}`}><NoteIcon size="sm"/> <span>ملاحظة</span></button>
                            <button onClick={() => setActiveModal('shipping')} className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-brand-subtle"><ShippingIcon size="sm"/> <span>الشحن</span></button>
                         </div>
                         
                         <form className="flex gap-2" onSubmit={handleApplyCoupon}>
                            <input type="text" placeholder="أدخل رمز الكوبون" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="w-full bg-white border border-brand-border rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dark" />
                            <button type="submit" className="bg-brand-dark text-white font-bold py-2 px-6 rounded-full text-sm hover:bg-opacity-90 transition-all active:scale-95">تطبيق</button>
                        </form>
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

                        <div className="space-y-1 border-t pt-3">
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
                                    <span className="text-green-600">خصم ({state.appliedCoupon.code}):</span>
                                    <span className="text-green-600">-{discountAmount.toFixed(2)} ج.م</span>
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
                             <button onClick={() => { navigateTo('checkout'); setIsOpen(false); }} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 disabled:opacity-50 transition-transform active:scale-98" disabled={!agreedToTerms || cartItems.length === 0}>الدفع</button>
                             <button onClick={() => { navigateTo('cart'); setIsOpen(false); }} className="w-full bg-white border border-brand-dark text-brand-dark font-bold py-3 rounded-full transition-all duration-200 hover:bg-brand-dark hover:text-white active:scale-98">عرض السلة</button>
                         </div>
                    </div>
                 </div>
            </div>

            {/* Modals */}
            <BottomModal isOpen={activeModal === 'gift'} onClose={() => setActiveModal(null)} title={state.giftWrap ? 'إزالة تغليف الهدية' : 'أضف تغليف هدية'}>
                <p className="text-brand-text-light mb-4">{state.giftWrap ? 'هل أنت متأكد أنك تريد إزالة تغليف الهدية؟' : `سيتم تغليف المنتج بعناية. الرسوم فقط 10.00 ج.م. هل تريد تغليف الهدايا؟`}</p>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={handleAddGiftWrap} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90">{state.giftWrap ? 'نعم، إزالة' : 'أضف تغليف هدية'}</button>
                    <button onClick={() => setActiveModal(null)} className="w-full bg-white border border-brand-dark text-brand-dark font-bold py-3 rounded-full hover:bg-brand-dark hover:text-white">إلغاء</button>
                </div>
            </BottomModal>

            <BottomModal isOpen={activeModal === 'note'} onClose={() => setActiveModal(null)} title="ملاحظة الطلب">
                <textarea placeholder="تعليمات للبائع..." rows={5} value={noteText} onChange={(e) => setNoteText(e.target.value)} className="w-full border border-brand-border rounded-lg p-3 mb-4 focus:ring-brand-dark focus:border-brand-dark"></textarea>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={handleSaveNote} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90">حفظ</button>
                    <button onClick={() => setActiveModal(null)} className="w-full bg-white border border-brand-dark text-brand-dark font-bold py-3 rounded-full hover:bg-brand-dark hover:text-white">إغلاق</button>
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
                                    className="w-full border border-brand-border rounded-lg p-3 appearance-none bg-white"
                                >
                                    {currentUser.addresses.map(addr => (
                                        <option key={addr.id} value={addr.id}>{`${addr.name} - ${addr.city}`}</option>
                                    ))}
                                </select>
                                <ChevronDownIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-brand-text-light">أضف عنوانًا إلى حسابك للحصول على تقديرات أسرع.</p>
                    )}
                </div>
                 <div className="grid grid-cols-2 gap-4 mt-6">
                    <button onClick={() => setActiveModal(null)} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90">تقدير</button>
                    <button onClick={() => setActiveModal(null)} className="w-full bg-white border border-brand-dark text-brand-dark font-bold py-3 rounded-full hover:bg-brand-dark hover:text-white">إغلاق</button>
                </div>
            </BottomModal>
        </>
    );
};