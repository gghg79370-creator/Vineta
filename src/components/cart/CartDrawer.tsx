

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { CartItem, Product } from '../../types';
import { CloseIcon, MinusIcon, PlusIcon, GiftIcon, NoteIcon, CouponIcon, TruckIcon as ShippingIcon, PencilIcon, ArrowLongRightIcon, ChevronDownIcon } from '../icons';
import { allProducts } from '../../data/products';

interface CartDrawerProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    navigateTo: (pageName: string, data?: any) => void;
    cartItems: CartItem[];
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    addToCart: (product: Product) => void;
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

export const CartDrawer = ({ isOpen, setIsOpen, navigateTo, cartItems, setCartItems, addToCart }: CartDrawerProps) => {
    const [activeModal, setActiveModal] = useState<null | 'gift' | 'note' | 'coupon' | 'shipping'>(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [hasBeenOpened, setHasBeenOpened] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setHasBeenOpened(true);
        }
    }, [isOpen]);

    const getAnimationClass = () => {
        if (!hasBeenOpened && !isOpen) {
            return 'translate-x-full';
        }
        return isOpen ? 'animate-slide-in-right' : 'animate-slide-out-right';
    };

    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    const shippingThreshold = 230;
    const amountToFreeShipping = Math.max(0, shippingThreshold - total);
    const shippingProgress = Math.min((total / shippingThreshold) * 100, 100);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleQuantityChange = (itemId: number, size: string, color: string, delta: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId && item.selectedSize === size && item.selectedColor === color
                    ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    const handleRemoveItem = (itemId: number, size: string, color: string) => {
        setCartItems(prevItems => prevItems.filter(item => !(item.id === itemId && item.selectedSize === size && item.selectedColor === color)));
    };

    const handleScroll = (direction: 'right' | 'left') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };
    
    const recommendedProducts = useMemo(() => {
        if (cartItems.length === 0) {
            return allProducts.slice(0, 4); // Default recommendations
        }
        
        const cartItemIds = new Set(cartItems.map(item => item.id));
        const cartCategories = new Set(cartItems.map(item => item.category));

        const recommendations = allProducts.filter(p => 
            !cartItemIds.has(p.id) && cartCategories.has(p.category)
        );

        // If not enough category-based recommendations, fill with best-sellers
        if (recommendations.length < 4) {
            const bestSellers = allProducts
                .filter(p => !cartItemIds.has(p.id) && !recommendations.some(r => r.id === p.id))
                .sort((a,b) => (b.soldIn24h || 0) - (a.soldIn24h || 0));
            recommendations.push(...bestSellers.slice(0, 4 - recommendations.length));
        }

        return recommendations.slice(0, 4);
    }, [cartItems]);

    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <div className={`fixed top-0 right-0 h-full w-[90vw] max-w-md bg-brand-subtle shadow-lg z-[60] ${getAnimationClass()}`}>
                 <div className="flex flex-col h-full">
                     <div className="p-5 flex justify-between items-center border-b bg-white">
                        <h2 className="font-bold text-xl text-brand-dark">عربة التسوق</h2>
                        <button onClick={() => setIsOpen(false)} aria-label="إغلاق السلة" className="p-1 hover:bg-brand-subtle rounded-full"><CloseIcon /></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-5 bg-white border-b">
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
                            <div className="p-5 space-y-4 bg-white">
                                {cartItems.map((item, index) => (
                                     <div key={`${item.id}-${index}`} className="flex gap-4">
                                        <img src={item.image} alt={item.name} className="w-24 h-28 rounded-lg object-cover shadow-sm"/>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="font-bold text-brand-dark text-base">{item.name}</p>
                                                 <button onClick={() => handleRemoveItem(item.id, item.selectedSize, item.selectedColor)} className="text-brand-text-light hover:text-brand-dark"><CloseIcon size="sm"/></button>
                                            </div>
                                            <button className="flex items-center gap-1.5 text-sm text-brand-text-light mt-1 hover:text-brand-dark">
                                                <span>{`أبيض / ${item.selectedSize}`}</span>
                                                <PencilIcon className="w-3 h-3"/>
                                            </button>
                                             <div className="flex justify-between items-center mt-3">
                                                <div className="flex items-center border border-brand-border rounded-full bg-white">
                                                    <button onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, -1)} className="p-2" aria-label="تقليل الكمية"><MinusIcon size="sm"/></button>
                                                    <span className="px-2 font-bold text-sm w-8 text-center">{item.quantity}</span>
                                                    <button onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, 1)} className="p-2" aria-label="زيادة الكمية"><PlusIcon size="sm"/></button>
                                                </div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-brand-dark font-bold">{item.price} ج.م</span>
                                                    {item.oldPrice && <span className="text-brand-text-light line-through text-xs">{item.oldPrice} ج.م</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-5 text-center bg-white">
                                <p className="text-brand-text-light mt-4">سلة التسوق الخاصة بك فارغة</p>
                            </div>
                        )}
                        
                        <div className="p-5 mt-4 bg-white">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">ربما يعجبك ايضا</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => handleScroll('right')} className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors"><ArrowLongRightIcon size="sm" /></button>
                                    <button onClick={() => handleScroll('left')} className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors rotate-180"><ArrowLongRightIcon size="sm" /></button>
                                </div>
                            </div>
                            <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2 -mx-5 px-5">
                                {recommendedProducts.map(p => (
                                    <div key={p.id} className="flex-shrink-0 w-40">
                                        <div className="bg-white border border-brand-border rounded-lg p-3">
                                            <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-md mb-2" />
                                            <p className="font-semibold text-sm truncate">{p.name}</p>
                                            <div className="flex items-baseline gap-1 mt-1">
                                              <p className="text-brand-primary font-bold text-sm">{p.price} ج.م</p>
                                              {p.oldPrice && <p className="text-brand-text-light line-through text-xs">{p.oldPrice} ج.م</p>}
                                            </div>
                                            <button onClick={() => addToCart(p)} className="w-full mt-2 bg-brand-dark text-white text-xs font-bold py-2 rounded-full hover:bg-opacity-90">أضف إلى السلة</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-5 border-t space-y-4 bg-white mt-auto">
                         <div className="grid grid-cols-4 gap-2 text-center text-xs text-brand-text-light">
                            <button onClick={() => setActiveModal('gift')} className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-brand-subtle"><GiftIcon size="sm"/> <span>تغليف هدية</span></button>
                            <button onClick={() => setActiveModal('note')} className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-brand-subtle"><NoteIcon size="sm"/> <span>ملاحظة</span></button>
                            <button onClick={() => setActiveModal('coupon')} className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-brand-subtle"><CouponIcon size="sm"/> <span>كوبون</span></button>
                            <button onClick={() => setActiveModal('shipping')} className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-brand-subtle"><ShippingIcon size="sm"/> <span>الشحن</span></button>
                         </div>

                        <div className="flex justify-between items-center font-bold text-lg">
                            <span>الإجمالي:</span>
                            <span className="text-brand-dark">{total.toFixed(2)} ج.م</span>
                        </div>
                        <p className="text-xs text-brand-text-light text-center">يتم احتساب الضرائب والشحن عند الدفع</p>
                        <div className="flex items-center justify-start gap-2">
                            <input type="checkbox" id="drawer-terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="h-4 w-4 rounded border-brand-border text-brand-dark focus:ring-brand-dark"/>
                            <label htmlFor="drawer-terms" className="text-sm">أوافق على <a href="#" className="underline font-semibold">الشروط والأحكام</a></label>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                             <button onClick={() => { navigateTo('checkout'); setIsOpen(false); }} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 disabled:opacity-50" disabled={!agreedToTerms}>الدفع</button>
                             <button onClick={() => { navigateTo('cart'); setIsOpen(false); }} className="w-full bg-white border border-brand-dark text-brand-dark font-bold py-3 rounded-full hover:bg-brand-dark hover:text-white">عرض السلة</button>
                         </div>
                    </div>
                 </div>
            </div>

            {/* Modals */}
            <BottomModal isOpen={activeModal === 'gift'} onClose={() => setActiveModal(null)} title="أضف تغليف هدية">
                <p className="text-brand-text-light mb-4">سيتم تغليف المنتج بعناية. الرسوم فقط <span className="font-bold text-brand-dark">10.00 ج.م</span>. هل تريد تغليف الهدايا؟</p>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setActiveModal(null)} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90">أضف تغليف هدية</button>
                    <button onClick={() => setActiveModal(null)} className="w-full bg-white border border-brand-dark text-brand-dark font-bold py-3 rounded-full hover:bg-brand-dark hover:text-white">إلغاء</button>
                </div>
            </BottomModal>

            <BottomModal isOpen={activeModal === 'note'} onClose={() => setActiveModal(null)} title="ملاحظة الطلب">
                <textarea placeholder="تعليمات للبائع..." rows={5} className="w-full border border-brand-border rounded-lg p-3 mb-4 focus:ring-brand-dark focus:border-brand-dark"></textarea>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setActiveModal(null)} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90">حفظ</button>
                    <button onClick={() => setActiveModal(null)} className="w-full bg-white border border-brand-dark text-brand-dark font-bold py-3 rounded-full hover:bg-brand-dark hover:text-white">إغلاق</button>
                </div>
            </BottomModal>

            <BottomModal isOpen={activeModal === 'coupon'} onClose={() => setActiveModal(null)} title="أضف كوبون">
                <p className="text-brand-text-light mb-2 text-sm">* سيتم احتساب الخصم وتطبيقه عند الدفع</p>
                <input type="text" placeholder="" className="w-full border border-brand-border rounded-lg p-3 mb-4 focus:ring-brand-dark focus:border-brand-dark" />
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setActiveModal(null)} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90">حفظ</button>
                    <button onClick={() => setActiveModal(null)} className="w-full bg-white border border-brand-dark text-brand-dark font-bold py-3 rounded-full hover:bg-brand-dark hover:text-white">إغلاق</button>
                </div>
            </BottomModal>

            <BottomModal isOpen={activeModal === 'shipping'} onClose={() => setActiveModal(null)} title="تقديرات الشحن">
                <div className="space-y-4">
                    <div>
                        <label className="font-semibold text-sm mb-1 block">الدولة</label>
                        <div className="relative">
                            <select className="w-full border border-brand-border rounded-lg p-3 appearance-none bg-white">
                                <option>الولايات المتحدة</option>
                                <option>مصر</option>
                            </select>
                            <ChevronDownIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                        </div>
                    </div>
                     <div>
                        <label className="font-semibold text-sm mb-1 block">الولاية/المقاطعة</label>
                        <div className="relative">
                           <select className="w-full border border-brand-border rounded-lg p-3 appearance-none bg-white">
                                <option>كاليفورنيا</option>
                                <option>القاهرة</option>
                            </select>
                             <ChevronDownIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                        </div>
                    </div>
                     <div>
                        <label className="font-semibold text-sm mb-1 block">الرمز البريدي</label>
                        <input type="text" className="w-full border border-brand-border rounded-lg p-3"/>
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4 mt-6">
                    <button onClick={() => setActiveModal(null)} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90">تقدير</button>
                    <button onClick={() => setActiveModal(null)} className="w-full bg-white border border-brand-dark text-brand-dark font-bold py-3 rounded-full hover:bg-brand-dark hover:text-white">إغلاق</button>
                </div>
            </BottomModal>
        </>
    );
};
