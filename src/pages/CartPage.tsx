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
            className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 animate-fade-in"
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


const CartPage = ({ navigateTo }: CartPageProps) => {
    const { state, dispatch, cartSubtotal, discountAmount, finalTotal } = useAppState();
    const { currentUser } = state;
    const addToast = useToast();
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [orderNote, setOrderNote] = useState(state.orderNote || '');
    const [isNoteEditing, setIsNoteEditing] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

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
            return;
        }
        const isInWishlist = state.wishlist.some(wishlistItem => wishlistItem.id === item.id);
        if (!isInWishlist) {
            dispatch({ type: 'TOGGLE_WISHLIST', payload: item.id });
        }
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id: item.id, selectedSize: item.selectedSize, selectedColor: item.selectedColor } });
        addToast(`${item.name} تم نقله إلى قائمة الرغبات.`, 'success');
    };
    
    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
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

    const handleSaveNote = () => {
        dispatch({ type: 'SET_ORDER_NOTE', payload: orderNote });
        addToast('تم حفظ رسالة الهدية.', 'success');
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
            <ConfirmationModal
                isOpen={!!itemToRemove}
                onClose={() => setItemToRemove(null)}
                onConfirm={confirmRemoveItem}
                title="إزالة المنتج"
                message={`هل أنت متأكد أنك تريد إزالة "${itemToRemove?.name}" من سلة التسوق؟`}
            />
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
                                                <button onClick={() => handleRemoveItemClick(item)} className="flex items-center gap-1 hover:text-brand-sale"><CloseIcon size="sm" /> <span>إزالة</span></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`col-span-1 text-center font-bold ${item.oldPrice ? 'text-brand-sale' : 'text-brand-dark'}`}>
                                        {item.price} ج.م
                                        {item.oldPrice && <p className="text-xs text-brand-text-light line-through font-normal">{item.oldPrice} ج.م</p>}
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <div className="flex items-center border border-brand-border rounded-full bg-white w-28">
                                            <button onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="p-2 text-gray-500 disabled:opacity-50 hover:bg-gray-100 rounded-full transition-colors" disabled={item.quantity <= 1}><MinusIcon size="sm" /></button>
                                            <span className="px-2 font-bold text-sm flex-1 text-center">{item.quantity}</span>
                                            <button onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><PlusIcon size="sm" /></button>
                                        </div>
                                    </div>
                                    <div className={`col-span-1 text-right font-bold ${item.oldPrice ? 'text-brand-sale' : 'text-brand-dark'}`}>{(parseFloat(item.price) * item.quantity).toFixed(2)} ج.م</div>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border lg:sticky top-28 space-y-4">
                                <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
                                
                                <div>
                                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                        <div className="relative flex-grow">
                                            <div className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-text-light"><CouponIcon size="sm" /></div>
                                            <input type="text" placeholder="رمز الكوبون" aria-label="رمز الكوبون" value={couponCode} onChange={e => setCouponCode(e.target.value)} className={`w-full bg-white border rounded-full py-3 pr-11 pl-4 ${couponError ? 'border-brand-sale' : 'border-brand-border'}`} />
                                        </div>
                                        <button type="submit" className="bg-brand-dark text-white font-bold py-3 px-6 rounded-full text-sm">تطبيق</button>
                                    </form>
                                    {couponError && <p className="text-red-500 text-xs mt-2 px-2">{couponError}</p>}
                                </div>

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
                                        <label className="flex items-center gap-2 font-semibold cursor-pointer">
                                            <input type="checkbox" checked={state.giftWrap} onChange={(e) => dispatch({ type: 'SET_GIFT_WRAP', payload: e.target.checked })} className="h-4 w-4 rounded border-brand-border text-brand-dark focus:ring-brand-dark" />
                                            <GiftIcon size="sm" /> <span>تغليف كهدية (+10.00 ج.م)</span>
                                        </label>
                                    </div>
                                    {state.giftWrap && (
                                    <div className="animate-fade-in">
                                        {isNoteEditing ? (
                                            <div className="space-y-2 pt-2">
                                                <label className="text-sm font-semibold text-brand-text-light">رسالة الهدية:</label>
                                                <textarea placeholder="اكتب رسالتك هنا..." rows={3} value={orderNote} onChange={(e) => setOrderNote(e.target.value)} className="w-full border border-brand-border rounded-lg p-2"></textarea>
                                                <div className="flex gap-2">
                                                    <button onClick={handleSaveNote} className="flex-1 text-xs bg-brand-dark text-white rounded-full py-1.5 font-semibold">حفظ الرسالة</button>
                                                    <button onClick={() => setIsNoteEditing(false)} className="flex-1 text-xs bg-gray-200 text-gray-700 rounded-full py-1.5 font-semibold">إلغاء</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={() => setIsNoteEditing(true)} className="w-full text-right flex items-center justify-between text-sm font-semibold p-2 rounded-lg hover:bg-gray-50">
                                                <div className="flex items-center gap-2">
                                                    <NoteIcon size="sm" />
                                                    <span>{state.orderNote ? 'تعديل رسالة الهدية' : 'إضافة رسالة هدية'}</span>
                                                </div>
                                                <PencilIcon size="sm" />
                                            </button>
                                        )}
                                    </div>
                                    )}
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