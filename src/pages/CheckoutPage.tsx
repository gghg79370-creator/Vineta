
import React, { useState, useMemo, useEffect } from 'react';
import { CartItem, Product, Address } from '../types';
import { CheckIcon, CouponIcon, MapPinIcon } from '../components/icons';
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
                                    ${isActive ? 'bg-white text-brand-primary border-2 border-brand-primary' : ''}
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

    const validate = () => { /* validation logic will go here */ return true; };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                navigateTo('orderConfirmation');
            }, 1500);
        }
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

    const AddressSelector: React.FC<{ addresses: Address[], selectedId: number | 'new', onSelect: (id: number | 'new') => void }> = ({ addresses, selectedId, onSelect }) => (
        <div className="space-y-3">
            {addresses.map(address => (
                 <div key={address.id} onClick={() => onSelect(address.id)} className={`border p-4 rounded-lg cursor-pointer transition-all ${selectedId === address.id ? 'border-brand-primary ring-2 ring-brand-primary/50' : 'hover:border-gray-400'}`}>
                    <label className="font-semibold flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="shippingAddress" value={address.id} checked={selectedId === address.id} onChange={() => onSelect(address.id)} className="h-4 w-4 text-brand-primary focus:ring-brand-primary"/> 
                         <div className="flex-1">
                             <p className="font-bold">{address.name} <span className="text-xs font-normal text-gray-500">({address.recipientName})</span></p>
                             <p className="text-sm text-gray-600 mt-1">{`${address.street}, ${address.city}`}</p>
                         </div>
                    </label>
                </div>
            ))}
             <div onClick={() => onSelect('new')} className={`border p-4 rounded-lg cursor-pointer transition-all ${selectedId === 'new' ? 'border-brand-primary ring-2 ring-brand-primary/50' : 'hover:border-gray-400'}`}>
                <label className="font-semibold flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="shippingAddress" value="new" checked={selectedId === 'new'} onChange={() => onSelect('new')} className="h-4 w-4 text-brand-primary focus:ring-brand-primary"/> 
                    استخدام عنوان جديد
                </label>
            </div>
        </div>
    );

    return (
        <div className="bg-brand-subtle">
            <div className="py-12 bg-white border-b">
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
                         ) : <p className="text-gray-500 text-sm mb-4">أدخل عنوان الشحن الخاص بك.</p>}
                        
                        {selectedShippingAddressId === 'new' && (
                            <div className="space-y-4 mt-4 p-4 border rounded-lg bg-white animate-fade-in">
                                <input name="shipping_recipientName" placeholder="الاسم الكامل *" onChange={handleChange} className="w-full border p-3 rounded-lg border-brand-border" />
                                <input name="shipping_street" placeholder="عنوان الشارع *" onChange={handleChange} className="w-full border p-3 rounded-lg border-brand-border" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input name="shipping_city" placeholder="المدينة *" onChange={handleChange} className="w-full border p-3 rounded-lg border-brand-border" />
                                    <input name="shipping_postalCode" placeholder="الرمز البريدي" onChange={handleChange} className="w-full border p-3 rounded-lg border-brand-border" />
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-6">الدفع</h2>
                            <div className="space-y-3 bg-white p-4 rounded-lg border">
                                <div className={`border p-4 rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand-primary ring-2 ring-brand-primary/50' : 'hover:border-gray-400'}`} onClick={() => setPaymentMethod('cod')}>
                                    <label className="font-semibold flex items-center gap-3 cursor-pointer">
                                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-4 w-4 text-brand-primary focus:ring-brand-primary"/> 
                                        الدفع عند الاستلام
                                    </label>
                                </div>
                                <div className={`border p-4 rounded-lg cursor-pointer transition-all ${paymentMethod === 'creditCard' ? 'border-brand-primary ring-2 ring-brand-primary/50' : 'hover:border-gray-400'}`} onClick={() => setPaymentMethod('creditCard')}>
                                    <label className="font-semibold flex items-center gap-3 cursor-pointer">
                                        <input type="radio" name="payment" value="creditCard" checked={paymentMethod === 'creditCard'} onChange={() => setPaymentMethod('creditCard')} className="h-4 w-4 text-brand-primary focus:ring-brand-primary"/>
                                        بطاقة الائتمان
                                    </label>
                                    {paymentMethod === 'creditCard' && (
                                        <div className="mt-4 space-y-4 animate-fade-in">
                                            {/* Payment form fields here */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white border p-6 rounded-lg lg:sticky top-28">
                            <h2 className="text-2xl font-bold mb-6">طلبك</h2>
                            <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-4">
                                <div className="relative flex-grow">
                                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-text-light"><CouponIcon size="sm"/></div>
                                    <input type="text" placeholder="رمز الكوبون" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="w-full bg-white border border-brand-border rounded-full py-3 pr-11 pl-4"/>
                                </div>
                                <button type="submit" className="bg-brand-dark text-white font-bold py-3 px-6 rounded-full text-sm">تطبيق</button>
                            </form>
                            <div className="space-y-3 border-b pb-4 max-h-60 overflow-y-auto">
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
                            <div className="space-y-2 py-4 border-b">
                                <div className="flex justify-between"><span>المجموع الفرعي:</span><span className="font-semibold">{cartSubtotal.toFixed(2)} ج.م</span></div>
                                <div className="flex justify-between"><span>الشحن:</span><span className="font-semibold">{shipping === 0 ? 'مجاني' : `${shipping.toFixed(2)} ج.م`}</span></div>
                                {state.appliedCoupon && (
                                    <div className="flex justify-between text-green-600">
                                        <span>خصم ({state.appliedCoupon.code}):</span>
                                        <span className="font-semibold">-{discountAmount.toFixed(2)} ج.م</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between font-bold text-xl py-4 mb-4">
                                <span>الإجمالي:</span><span className="text-brand-dark">{finalTotal.toFixed(2)} ج.م</span>
                            </div>
                             <button type="submit" disabled={isLoading} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 mt-6 min-h-[48px] flex items-center justify-center transition-transform active:scale-98">
                                {isLoading ? <Spinner /> : 'تأكيد الطلب'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
