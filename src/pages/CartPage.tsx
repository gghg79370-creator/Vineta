
import React, { useState, useMemo } from 'react';
import { CartItem, Product } from '../types';
import { CloseIcon, MinusIcon, PlusIcon, CouponIcon, HeartIcon, ShoppingBagIcon, GiftIcon, NoteIcon, PencilIcon, LockClosedIcon } from '../components/icons';
import { allProducts } from '../data/products';
import { TrendingProductsSection } from '../components/product/TrendingProductsSection';
import { useAppState } from '../state/AppState';
import { useToast } from '../hooks/useToast';
import { validCoupons } from '../data/coupons';
import { Breadcrumb } from '../components/ui/Breadcrumb';

interface CartPageProps {
    navigateTo: (pageName: string, data?: any) => void;
}

const CartPage = ({ navigateTo }: CartPageProps) => {
    const { state, dispatch, cartCount, cartSubtotal, discountAmount, finalTotal } = useAppState();
    const addToast = useToast();
    const [couponCode, setCouponCode] = useState('');
    const [orderNote, setOrderNote] = useState(state.orderNote || '');
    const [isNoteEditing, setIsNoteEditing] = useState(false);

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

    const handleQuantityChange = (id: number, size: string, color: string, newQuantity: number) => {
        dispatch({ type: 'UPDATE_CART_ITEM_QUANTITY', payload: { id, selectedSize: size, selectedColor: color, quantity: newQuantity } });
    };

    const handleRemoveItem = (id: number, size: string, color: string) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id, selectedSize: size, selectedColor: color } });
    };
    
    const handleMoveToWishlist = (item: CartItem) => {
        const isInWishlist = state.wishlist.some(wishlistItem => wishlistItem.id === item.id);
        if (!isInWishlist) {
            dispatch({ type: 'TOGGLE_WISHLIST', payload: item.id });
        }
        handleRemoveItem(item.id, item.selectedSize, item.selectedColor);
        addToast(`${item.name} تم نقله إلى قائمة الرغبات.`, 'success');
    };
    
    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
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
    
    const handleGiftWrapToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'SET_GIFT_WRAP', payload: e.target.checked });
        addToast(e.target.checked ? 'تمت إضافة تغليف الهدية!' : 'تمت إزالة تغليف الهدية.', e.target.checked ? 'success' : 'info');
    };

    const handleSaveNote = () => {
        dispatch({ type: 'SET_ORDER_NOTE', payload: orderNote });
        addToast('تم حفظ الملاحظة.', 'success');
        setIsNoteEditing(false);
    };

    const addToCart = (product: Product) => {
        dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1, selectedSize: product.sizes[0], selectedColor: product.colors[0] } });
    };

    const openQuickView = (product: Product) => { /* Logic to open quick view modal would go here */ };
    const toggleWishlist = (product: Product) => dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });
    const addToCompare = (product: Product) => dispatch({ type: 'TOGGLE_COMPARE', payload: product.id });
    
    const breadcrumbItems = [
        { label: 'الرئيسية', page: 'home' },
        { label: 'سلة التسوق' }
    ];
    
    const shippingThreshold = 230;
    const shipping = cartSubtotal >= shippingThreshold ? 0 : 50;
    const totalWithShipping = finalTotal + shipping;

    return (
        <div className="bg-gray-50">
            <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="سلة التسوق" />
            <div className="container mx-auto px-4 py-12">
                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 items-start">
                        <div className="lg:col-span-8 bg-white rounded-lg shadow-sm border p-6 space-y-6">
                             <h2 className="text-2xl font-bold text-brand-dark">عربة التسوق ({cartCount} منتجات)</h2>
                            {cartItems.map(item => (
                                <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex flex-col sm:flex-row gap-4 border-b pb-6 last:border-b-0 last:pb-0">
                                    <img src={item.image} alt={item.name} className="w-24 h-32 rounded-md object-cover self-center sm:self-start"/>
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-brand-dark cursor-pointer hover:text-brand-primary" onClick={() => navigateTo('product', item)}>{item.name}</p>
                                                <p className="text-sm text-gray-500 mt-1">{`اللون: ${item.selectedColor}, المقاس: ${item.selectedSize}`}</p>
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <button onClick={() => handleMoveToWishlist(item)} className="text-gray-400 hover:text-brand-primary p-1" aria-label="Move to wishlist"><HeartIcon size="sm"/></button>
                                                <button onClick={() => handleRemoveItem(item.id, item.selectedSize, item.selectedColor)} className="text-gray-400 hover:text-red-500 p-1"><CloseIcon size="sm"/></button>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-grow"></div>
                                        
                                        <div className="flex items-end justify-between mt-4">
                                            <div className="flex items-center border border-brand-border rounded-full bg-white w-28 justify-between">
                                                <button onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="p-2 transition-transform active:scale-90" aria-label="تقليل الكمية"><MinusIcon size="sm"/></button>
                                                <span className="px-1 font-bold text-sm">{item.quantity}</span>
                                                <button onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="p-2 transition-transform active:scale-90" aria-label="زيادة الكمية"><PlusIcon size="sm"/></button>
                                            </div>
                                            <p className="font-bold text-lg text-brand-dark">{(parseFloat(item.price) * item.quantity).toFixed(2)} ج.م</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-4 mt-8 lg:mt-0">
                            <div className="bg-white border p-6 rounded-lg shadow-sm lg:sticky lg:top-28">
                                <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>

                                <div className="space-y-4 border-y py-4 my-4">
                                    <label className="flex justify-between items-center cursor-pointer">
                                        <span className="flex items-center gap-2 font-semibold text-brand-dark"><GiftIcon size="sm"/> تغليف كهدية (+10.00 ج.م)</span>
                                        <input type="checkbox" checked={state.giftWrap} onChange={handleGiftWrapToggle} className="h-5 w-5 rounded text-brand-dark focus:ring-brand-dark focus:ring-offset-2"/>
                                    </label>
                                    <div className="border-t pt-4">
                                        {isNoteEditing ? (
                                            <div className="space-y-2 animate-fade-in">
                                                <label className="font-semibold text-brand-dark flex items-center gap-2 text-sm"><NoteIcon size="sm"/> إضافة ملاحظة للطلب</label>
                                                <textarea value={orderNote} onChange={e => setOrderNote(e.target.value)} rows={3} className="w-full border p-2 rounded-lg border-brand-border" placeholder="تعليمات خاصة..."></textarea>
                                                <div className="flex gap-2 justify-end">
                                                    <button onClick={() => setIsNoteEditing(false)} className="text-xs font-semibold py-1 px-3">إلغاء</button>
                                                    <button onClick={handleSaveNote} className="bg-brand-dark text-white text-xs font-semibold py-1 px-3 rounded-md">حفظ</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                            <button onClick={() => setIsNoteEditing(true)} className="flex justify-between items-center w-full">
                                                <span className="flex items-center gap-2 font-semibold text-brand-dark"><NoteIcon size="sm"/> {state.orderNote ? 'تعديل الملاحظة' : 'إضافة ملاحظة'}</span>
                                                <PencilIcon size="sm" className="text-gray-400"/>
                                            </button>
                                            {state.orderNote && <p className="text-xs text-gray-500 mt-1 pl-7 line-clamp-2">"{state.orderNote}"</p>}
                                            </>
                                        )}
                                    </div>
                                </div>

                                <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-4">
                                    <div className="relative flex-grow">
                                        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-text-light"><CouponIcon size="sm"/></div>
                                        <input type="text" placeholder="رمز الكوبون" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="w-full bg-white border border-brand-border rounded-full py-3 pr-11 pl-4"/>
                                    </div>
                                    <button type="submit" className="bg-brand-dark text-white font-bold py-3 px-6 rounded-full text-sm hover:bg-opacity-90 transition-transform active:scale-95">تطبيق</button>
                                </form>
                                <div className="space-y-2 border-b pb-4 mb-4 text-sm">
                                    <div className="flex justify-between text-brand-text"><span>المجموع الفرعي:</span><span className="font-semibold">{cartSubtotal.toFixed(2)} ج.م</span></div>
                                    {state.giftWrap && (<div className="flex justify-between text-brand-text"><span>تغليف هدية:</span><span className="font-semibold">10.00 ج.م</span></div>)}
                                    <div className="flex justify-between text-brand-text"><span>الشحن:</span><span className="font-semibold">{shipping === 0 ? 'مجاني' : `${shipping.toFixed(2)} ج.م`}</span></div>
                                    {state.appliedCoupon && (
                                        <div className="flex justify-between text-green-600">
                                            <span>خصم ({state.appliedCoupon.code}):</span>
                                            <span className="font-semibold">-{discountAmount.toFixed(2)} ج.م</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between font-bold text-xl mb-6">
                                    <span>الإجمالي:</span><span className="text-brand-dark">{totalWithShipping.toFixed(2)} ج.م</span>
                                </div>
                                <div className="space-y-3">
                                    <button onClick={() => navigateTo('checkout')} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 transition-transform active:scale-98 flex items-center justify-center gap-2">
                                        <LockClosedIcon size="sm"/>
                                        <span>الدفع الآمن</span>
                                    </button>
                                    <button onClick={() => navigateTo('shop')} className="w-full bg-white border border-brand-border text-brand-dark font-bold py-3 rounded-full hover:bg-brand-subtle">
                                        متابعة التسوق
                                    </button>
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-xs text-gray-500 mb-2">طرق الدفع المقبولة</p>
                                    <div className="flex gap-2 justify-center flex-wrap opacity-60">
                                        <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/visa.svg?v=1650634288" alt="Visa" className="h-5"/>
                                        <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/master.svg?v=1650634288" alt="Mastercard" className="h-5"/>
                                        <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/paypal.svg?v=1650634288" alt="Paypal" className="h-5"/>
                                        <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/gpay.svg?v=1650634288" alt="Google Pay" className="h-5"/>
                                        <img src="https://cdn.shopify.com/s/files/1/0605/7353/7349/files/apple-pay.svg?v=1650634288" alt="Apple Pay" className="h-5"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-gray-200">
                        <ShoppingBagIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-brand-dark mb-2">سلة التسوق الخاصة بك فارغة</h2>
                        <p className="text-brand-text-light mb-6 max-w-xs mx-auto">لم تقم بإضافة أي منتجات بعد. هيا بنا نملأها!</p>
                        <button onClick={() => navigateTo('shop')} className="bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all active:scale-95">
                            اكتشف المنتجات
                        </button>
                    </div>
                )}
                
                <div className="mt-20">
                    <TrendingProductsSection
                        title="قد يعجبك أيضًا"
                        products={allProducts.slice(4, 8)}
                        navigateTo={navigateTo}
                        addToCart={addToCart}
                        openQuickView={openQuickView}
                        isCarousel
                        addToCompare={addToCompare}
                        toggleWishlist={toggleWishlist}
                    />
                </div>
            </div>
        </div>
    );
};

export default CartPage;
