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
    const { state, dispatch, cartSubtotal, discountAmount, finalTotal } = useAppState();
    const { currentUser } = state;
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
        if (!currentUser) {
            addToast('الرجاء تسجيل الدخول لاستخدام قائمة الرغبات.', 'info');
            navigateTo('login');
            return;
        }
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

    const handleSaveNote = () => {
        dispatch({ type: 'SET_ORDER_NOTE', payload: orderNote });
        addToast('تم حفظ ملاحظة الطلب.', 'success');
        setIsNoteEditing(false);
    };

    const breadcrumbItems = [
        { label: 'الرئيسية', page: 'home' },
        { label: 'عربة التسوق' }
    ];

    // Handlers for TrendingProductsSection
    const addToCartHandler = (product: Product) => {
        dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1, selectedSize: product.sizes[0], selectedColor: product.colors[0] } });
        addToast(`${product.name} أضيف إلى السلة!`, 'success');
    };

    const toggleWishlistHandler = (product: Product) => {
        if (!currentUser) {
            addToast('الرجاء تسجيل الدخول لاستخدام قائمة الرغبات.', 'info');
            navigateTo('login');
            return;
        }
        dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });
        const isInWishlist = state.wishlist.some(item => item.id === product.id);
        addToast(
            !isInWishlist ? `تمت إضافة ${product.name} إلى قائمة الرغبات!` : `تمت إزالة ${product.name} من قائمة الرغبات.`,
            'success'
        );
    }

    const addToCompareHandler = (product: Product) => {
        dispatch({ type: 'TOGGLE_COMPARE', payload: product.id });
        addToast('تم تحديث قائمة المقارنة.', 'info');
    }

    return (
        <div className="bg-brand-subtle">
            <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="عربة التسوق" />
            <div className="container mx-auto px-4 py-12">
                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
                            <div className="hidden md:grid grid-cols-6 gap-4 font-bold text-sm text-brand-text-light border-b pb-4 mb-4">
                                <div className="col-span-3">المنتج</div>
                                <div className="col-span-1 text-center">السعر</div>
                                <div className="col-span-1 text-center">الكمية</div>
                                <div className="col-span-1 text-right">المجموع</div>
                            </div>
                            {cartItems.map(item => (
                                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center border-b py-4 last:border-b-0">
                                    <div className="col-span-3 flex items-center gap-4">
                                        <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg" />
                                        <div>
                                            <p className="font-bold text-brand-dark">{item.name}</p>
                                            <p className="text-sm text-brand-text-light">{item.selectedSize} / {item.selectedColor}</p>
                                            <div className="flex items-center gap-2 mt-2 text-xs">
                                                {!state.wishlist.some(wishlistItem => wishlistItem.id === item.id) && (
                                                    <>
                                                        <button onClick={() => handleMoveToWishlist(item)} className="flex items-center gap-1 hover:text-brand-primary"><HeartIcon size="sm" /> <span>انقل إلى قائمة الرغبات</span></button>
                                                        <span className="text-gray-300">|</span>
                                                    </>
                                                )}
                                                <button onClick={() => handleRemoveItem(item.id, item.selectedSize, item.selectedColor)} className="flex items-center gap-1 hover:text-brand-sale"><CloseIcon size="sm" /> <span>إزالة</span></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1 text-center font-semibold">{item.price} ج.م</div>
                                    <div className="col-span-1 flex justify-center">
                                        <div className="flex items-center border border-brand-border rounded-full bg-white w-28">
                                            <button onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="p-2 text-gray-500 disabled:opacity-50" disabled={item.quantity <= 1}><MinusIcon size="sm" /></button>
                                            <span className="px-2 font-bold text-sm flex-1 text-center">{item.quantity}</span>
                                            <button onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="p-2 text-gray-500"><PlusIcon size="sm" /></button>
                                        </div>
                                    </div>
                                    <div className="col-span-1 text-right font-bold text-brand-dark">{(parseFloat(item.price) * item.quantity).toFixed(2)} ج.م</div>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border lg:sticky top-28 space-y-4">
                                <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
                                
                                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                    <div className="relative flex-grow">
                                        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-text-light"><CouponIcon size="sm" /></div>
                                        <input type="text" placeholder="رمز الكوبون" aria-label="رمز الكوبون" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="w-full bg-white border border-brand-border rounded-full py-3 pr-11 pl-4" />
                                    </div>
                                    <button type="submit" className="bg-brand-dark text-white font-bold py-3 px-6 rounded-full text-sm">تطبيق</button>
                                </form>
                                
                                <div className="space-y-2 py-4 border-b border-t">
                                    <div className="flex justify-between"><span>المجموع الفرعي:</span><span className="font-semibold">{cartSubtotal.toFixed(2)} ج.م</span></div>
                                    <div className="flex justify-between"><span>الشحن:</span><span className="font-semibold text-brand-instock">مجاني</span></div>
                                    {state.appliedCoupon && (
                                        <div className="flex justify-between text-green-600">
                                            <span>خصم ({state.appliedCoupon.code}):</span>
                                            <span className="font-semibold">-{discountAmount.toFixed(2)} ج.م</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between font-bold text-xl py-2">
                                    <span>الإجمالي:</span><span className="text-brand-dark">{finalTotal.toFixed(2)} ج.م</span>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="flex items-center gap-2 font-semibold">
                                            <input type="checkbox" checked={state.giftWrap} onChange={(e) => dispatch({ type: 'SET_GIFT_WRAP', payload: e.target.checked })} className="h-4 w-4 rounded border-brand-border text-brand-dark focus:ring-brand-dark" />
                                            <GiftIcon size="sm" /> <span>تغليف كهدية (+10.00 ج.م)</span>
                                        </label>
                                    </div>
                                    <div>
                                        {isNoteEditing ? (
                                            <div className="space-y-2">
                                                <textarea placeholder="تعليمات للبائع..." rows={3} value={orderNote} onChange={(e) => setOrderNote(e.target.value)} className="w-full border border-brand-border rounded-lg p-2"></textarea>
                                                <div className="flex gap-2">
                                                    <button onClick={handleSaveNote} className="flex-1 text-xs bg-brand-dark text-white rounded-full py-1.5 font-semibold">حفظ</button>
                                                    <button onClick={() => setIsNoteEditing(false)} className="flex-1 text-xs bg-gray-200 text-gray-700 rounded-full py-1.5 font-semibold">إلغاء</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={() => setIsNoteEditing(true)} className="w-full text-right flex items-center justify-between text-sm font-semibold p-2 rounded-lg hover:bg-gray-50">
                                                <div className="flex items-center gap-2">
                                                    <NoteIcon size="sm" />
                                                    <span>{state.orderNote ? 'تعديل الملاحظة' : 'إضافة ملاحظة للطلب'}</span>
                                                </div>
                                                <PencilIcon size="sm" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <button onClick={() => navigateTo('checkout')} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 mt-4 flex items-center justify-center gap-2 transition-transform active:scale-98">
                                    <LockClosedIcon size="sm"/>
                                    <span>الانتقال إلى الدفع</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow-sm border">
                        <ShoppingBagIcon className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-brand-dark mb-2">سلة التسوق الخاصة بك فارغة.</h2>
                        <p className="text-brand-text-light mb-6 max-w-xs mx-auto">يبدو أنك لم تقم بإضافة أي شيء إلى سلتك بعد.</p>
                        <button onClick={() => navigateTo('shop')} className="bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all active:scale-95">
                            متابعة التسوق
                        </button>
                    </div>
                )}
                
                <div className="mt-16">
                     <TrendingProductsSection
                        title="قد يعجبك ايضا"
                        products={allProducts.slice(4, 8)}
                        navigateTo={navigateTo}
                        addToCart={addToCartHandler}
                        openQuickView={() => {}} // Dummy function
                        isCarousel
                        addToCompare={addToCompareHandler}
                        toggleWishlist={toggleWishlistHandler}
                    />
                </div>
            </div>
        </div>
    );
};

export default CartPage;