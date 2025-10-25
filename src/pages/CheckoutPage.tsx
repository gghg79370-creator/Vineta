import React, { useState, useMemo, useEffect } from 'react';
import { CartItem, Product, Address, Order } from '../types';
import { CheckIcon, CouponIcon, MapPinIcon, PlusIcon, CheckCircleIcon, LockClosedIcon } from '../components/icons';
import { useAppState } from '../state/AppState';
import { allProducts } from '../data/products';
import Spinner from '../components/ui/Spinner';
import { useToast } from '../hooks/useToast';
import { validCoupons } from '../data/coupons';

const CheckoutStepper = ({ currentStep }: { currentStep: number }) => {
    const steps = ['السلة', 'الشحن والدفع', 'التأكيد'];

    return (
        <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="flex items-center">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
                                    ${isCompleted ? 'bg-brand-primary text-white' : ''}
                                    ${isActive ? 'bg-surface text-brand-primary border-2 border-brand-primary' : ''}
                                    ${!isCompleted && !isActive ? 'bg-brand-border text-brand-text-light' : ''}`}
                                >
                                    {isCompleted ? <CheckIcon size="sm" /> : stepNumber}
                                </div>
                                <p className={`mt-2 text-sm text-center font-semibold transition-colors duration-300 ${isActive || isCompleted ? 'text-brand-dark' : 'text-brand-text-light'}`}>
                                    {step}
                                </p>
                            </div>
                            {stepNumber < steps.length && (
                                <div className={`flex-1 h-1 transition-colors duration-300 ${isCompleted ? 'bg-brand-primary' : 'bg-brand-border'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};


interface CheckoutPageProps {
  navigateTo: (pageName: string) => void;
}

const CheckoutPage = ({ navigateTo }: CheckoutPageProps) => {
    const { state, dispatch, cartSubtotal, discountAmount, finalTotal } = useAppState();
    const { currentUser } = state;
    const addToast = useToast();
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<number | 'new'>(currentUser?.addresses.find(a => a.isDefault)?.id || 'new');
    const [useDifferentBilling, setUseDifferentBilling] = useState(false);
    const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<number | 'new'>(currentUser?.addresses.find(a => a.isDefault)?.id || 'new');


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

    const shippingThreshold = 230;
    const shipping = cartSubtotal >= shippingThreshold ? 0 : 50;
    
    const [formData, setFormData] = useState({
        // shipping
        shipping_recipientName: '',
        shipping_street: '',
        shipping_city: '',
        shipping_postalCode: '',
        shipping_country: 'مصر',
        // billing
        billing_recipientName: '',
        billing_street: '',
        billing_city: '',
        billing_postalCode: '',
        billing_country: 'مصر',
        // contact
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        // payment
        cardName: '',
        cardNumber: '',
        cardExpiry: '',
        cardCVC: '',
    });

    useEffect(() => {
        const selectedAddress = currentUser?.addresses.find(a => a.id === selectedShippingAddressId);
        if (selectedAddress) {
            setFormData(prev => ({
                ...prev,
                shipping_recipientName: selectedAddress.recipientName,
                shipping_street: selectedAddress.street,
                shipping_city: selectedAddress.city,
                shipping_postalCode: selectedAddress.postalCode,
                shipping_country: selectedAddress.country,
            }));
        }
    }, [selectedShippingAddressId, currentUser?.addresses]);
    
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (selectedShippingAddressId === 'new') {
            if (!formData.shipping_recipientName.trim()) newErrors.shipping_recipientName = "الاسم مطلوب.";
            if (!formData.shipping_street.trim()) newErrors.shipping_street = "عنوان الشارع مطلوب.";
            if (!formData.shipping_city.trim()) newErrors.shipping_city = "المدينة مطلوبة.";
        }
        if (paymentMethod === 'creditCard') {
            if (!formData.cardName.trim()) newErrors.cardName = "الاسم على البطاقة مطلوب.";
            if (!formData.cardNumber.trim().match(/^\d{16}$/)) newErrors.cardNumber = "رقم البطاقة يجب أن يكون 16 رقمًا.";
            if (!formData.cardExpiry.trim().match(/^(0[1-9]|1[0-2])\/\d{2}$/)) newErrors.cardExpiry = "الصيغة الصحيحة MM/YY.";
            if (!formData.cardCVC.trim().match(/^\d{3,4}$/)) newErrors.cardCVC = "CVC يجب أن يكون 3 أو 4 أرقام.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsLoading(true);

            const newOrder = {
                total: finalTotal.toFixed(2),
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    variant: `${item.selectedSize} / ${item.selectedColor}`,
                    quantity: item.quantity,
                    price: item.price,
                })),
            };
    
            // Simulate API call to submit order
            setTimeout(() => {
                setIsLoading(false);
                console.log("Order Submitted:", newOrder, formData);
                // On success:
                addToast('تم تقديم طلبك بنجاح!', 'success');
                dispatch({ type: 'SET_CART', payload: [] }); // Clear the cart
                dispatch({ type: 'REMOVE_COUPON' });
                dispatch({ type: 'SET_GIFT_WRAP', payload: false });
                dispatch({ type: 'SET_ORDER_NOTE', payload: '' });
                navigateTo('orderConfirmation');
            }, 1500);
        }
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

    const AddressSelector: React.FC<{ addresses: Address[], selectedId: number | 'new', onSelect: (id: number | 'new') => void }> = ({ addresses, selectedId, onSelect }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map(address => {
                const isSelected = selectedId === address.id;
                return (
                     <div key={address.id} onClick={() => onSelect(address.id)} className={`relative border p-4 rounded-lg cursor-pointer transition-all ${isSelected ? 'border-brand-primary ring-2 ring-brand-primary/50' : 'hover:border-brand-text-light'}`}>
                        {address.isDefault && <div className="absolute top-2 left-2 text-xs bg-brand-primary text-white font-semibold px-2 py-0.5 rounded-full">افتراضي</div>}
                        {isSelected && <div className="absolute top-2 right-2 text-brand-primary"><CheckCircleIcon /></div>}
                        <div className="flex items-start gap-3">
                            <MapPinIcon className="w-6 h-6 text-brand-text-light mt-1"/>
                            <div className="flex-1">
                                <p className="font-bold">{address.name} <span className="text-xs font-normal text-brand-text-light">({address.recipientName})</span></p>
                                <p className="text-sm text-brand-text-light mt-1">{`${address.street}, ${address.city}`}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
            <div onClick={() => onSelect('new')} className={`border-2 border-dashed p-4 rounded-lg cursor-pointer transition-all flex items-center justify-center text-brand-text-light hover:border-brand-primary hover:text-brand-primary ${selectedId === 'new' ? 'border-brand-primary text-brand-primary ring-2 ring-brand-primary/50' : 'border-brand-border'}`}>
                <div className="text-center">
                    <PlusIcon className="w-8 h-8 mx-auto"/>
                    <p className="font-semibold mt-2">إضافة عنوان جديد</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-brand-subtle">
            <div className="py-12 bg-surface border-b border-brand-border">
                <div className="container mx-auto px-4">
                     <h1 className="text-4xl font-bold text-center mb-8">الدفع</h1>
                     <CheckoutStepper currentStep={2} />
                </div>
            </div>
            <div className="container mx-auto px-4 py-12">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-bold mb-6">عنوان الشحن</h2>
                         {currentUser && currentUser.addresses.length > 0 ? (
                            <AddressSelector addresses={currentUser.addresses} selectedId={selectedShippingAddressId} onSelect={setSelectedShippingAddressId} />
                         ) : <p className="text-brand-text-light text-sm mb-4">أدخل عنوان الشحن الخاص بك.</p>}
                        
                        {selectedShippingAddressId === 'new' && (
                            <div className="space-y-4 mt-4 p-4 border rounded-lg bg-surface animate-fade-in">
                                <div>
                                    <input name="shipping_recipientName" placeholder="الاسم الكامل *" onChange={handleChange} className={`w-full border p-3 rounded-lg ${errors.shipping_recipientName ? 'border-red-500' : 'border-brand-border'}`} autoComplete="shipping name" />
                                    {errors.shipping_recipientName && <p className="text-red-500 text-xs mt-1">{errors.shipping_recipientName}</p>}
                                </div>
                                <div>
                                    <input name="shipping_street" placeholder="عنوان الشارع *" onChange={handleChange} className={`w-full border p-3 rounded-lg ${errors.shipping_street ? 'border-red-500' : 'border-brand-border'}`} autoComplete="shipping street-address" />
                                    {errors.shipping_street && <p className="text-red-500 text-xs mt-1">{errors.shipping_street}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input name="shipping_city" placeholder="المدينة *" onChange={handleChange} className={`w-full border p-3 rounded-lg ${errors.shipping_city ? 'border-red-500' : 'border-brand-border'}`} autoComplete="shipping address-level2" />
                                        {errors.shipping_city && <p className="text-red-500 text-xs mt-1">{errors.shipping_city}</p>}
                                    </div>
                                    <input name="shipping_postalCode" placeholder="الرمز البريدي" onChange={handleChange} className="w-full border p-3 rounded-lg border-brand-border" autoComplete="shipping postal-code" />
                                </div>
                            </div>
                        )}
                        
                         <h2 className="text-2xl font-bold mb-6 mt-8">ملاحظات الطلب (اختياري)</h2>
                         <textarea
                            name="order_note"
                            placeholder="أضف ملاحظات حول طلبك، مثل تعليمات خاصة للتسليم."
                            rows={4}
                            value={state.orderNote}
                            onChange={(e) => dispatch({ type: 'SET_ORDER_NOTE', payload: e.target.value })}
                            className="w-full border p-3 rounded-lg border-brand-border bg-surface"
                        ></textarea>

                        <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-6">الدفع</h2>
                            <div className="space-y-3 bg-surface p-4 rounded-lg border">
                                <div className={`border p-4 rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand-primary ring-2 ring-brand-primary/50' : 'hover:border-brand-text-light'}`} onClick={() => setPaymentMethod('cod')}>
                                    <label className="font-semibold flex items-center gap-3 cursor-pointer">
                                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-4 w-4 text-brand-primary focus:ring-brand-primary"/> 
                                        الدفع عند الاستلام
                                    </label>
                                </div>
                                <div className={`border p-4 rounded-lg cursor-pointer transition-all ${paymentMethod === 'creditCard' ? 'border-brand-primary ring-2 ring-brand-primary/50' : 'hover:border-brand-text-light'}`} onClick={() => setPaymentMethod('creditCard')}>
                                    <label className="font-semibold flex items-center gap-3 cursor-pointer">
                                        <input type="radio" name="payment" value="creditCard" checked={paymentMethod === 'creditCard'} onChange={() => setPaymentMethod('creditCard')} className="h-4 w-4 text-brand-primary focus:ring-brand-primary"/>
                                        بطاقة الائتمان
                                    </label>
                                    {paymentMethod === 'creditCard' && (
                                        <div className="mt-4 space-y-4 animate-fade-in pl-8">
                                            <div>
                                                <input name="cardName" placeholder="الاسم على البطاقة" onChange={handleChange} className={`w-full border p-3 rounded-lg ${errors.cardName ? 'border-red-500' : 'border-brand-border'}`} autoComplete="cc-name" />
                                                {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                                            </div>
                                            <div>
                                                <input name="cardNumber" placeholder="رقم البطاقة" onChange={handleChange} className={`w-full border p-3 rounded-lg ${errors.cardNumber ? 'border-red-500' : 'border-brand-border'}`} inputMode="numeric" autoComplete="cc-number" />
                                                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <input name="cardExpiry" placeholder="تاريخ الانتهاء (MM/YY)" onChange={handleChange} className={`w-full border p-3 rounded-lg ${errors.cardExpiry ? 'border-red-500' : 'border-brand-border'}`} inputMode="numeric" autoComplete="cc-exp" />
                                                    {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>}
                                                </div>
                                                <div>
                                                    <input name="cardCVC" placeholder="CVC" onChange={handleChange} className={`w-full border p-3 rounded-lg ${errors.cardCVC ? 'border-red-500' : 'border-brand-border'}`} inputMode="numeric" autoComplete="cc-csc" />
                                                    {errors.cardCVC && <p className="text-red-500 text-xs mt-1">{errors.cardCVC}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-surface border border-brand-border p-6 rounded-lg lg:sticky top-28">
                            <h2 className="text-2xl font-bold mb-6">طلبك</h2>
                            <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                <div className="relative flex-grow">
                                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-text-light"><CouponIcon size="sm"/></div>
                                    <input type="text" placeholder="رمز الكوبون" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="w-full bg-surface border border-brand-border rounded-full py-3 pr-11 pl-4"/>
                                </div>
                                <button type="submit" className="bg-brand-dark text-white font-bold py-3 px-6 rounded-full text-sm">تطبيق</button>
                            </form>
                            {couponError && <p className="text-red-500 text-xs mt-2 px-2">{couponError}</p>}
                            <div className="space-y-3 border-b border-brand-border pb-4 mt-4 max-h-60 overflow-y-auto">
                                {cartItems.map(item => (
                                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img src={item.image} alt={item.name} className="w-14 h-16 rounded-md object-cover" />
                                                <span className="absolute -top-2 -right-2 bg-brand-dark text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{item.quantity}</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-brand-text-light">{item.selectedSize} / {item.selectedColor}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold">{(parseFloat(item.price) * item.quantity).toFixed(2)} ج.م</p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2 py-4 border-b border-brand-border">
                                <div className="flex justify-between"><span>المجموع الفرعي:</span><span className="font-semibold">{cartSubtotal.toFixed(2)} ج.م</span></div>
                                <div className="flex justify-between"><span>الشحن:</span><span className="font-semibold">{shipping === 0 ? 'مجاني' : `${shipping.toFixed(2)} ج.م`}</span></div>
                                {state.appliedCoupon && (
                                    <div className="flex justify-between text-brand-instock">
                                        <span>خصم ({state.appliedCoupon.code}):</span>
                                        <span className="font-semibold">-{discountAmount.toFixed(2)} ج.م</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between font-bold text-xl py-4 mb-4">
                                <span>الإجمالي:</span><span className="text-brand-dark">{finalTotal.toFixed(2)} ج.م</span>
                            </div>
                             <button type="submit" disabled={isLoading} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 mt-6 min-h-[48px] flex items-center justify-center transition-transform active:scale-98">
                                {isLoading ? <Spinner /> : <><LockClosedIcon size="sm"/> <span className="mr-2">تأكيد الطلب</span></>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;