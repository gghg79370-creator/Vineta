import React from 'react';
import { CartItem } from '../types';
import { Breadcrumb } from '../components/ui/Breadcrumb';

interface CheckoutPageProps {
  navigateTo: (pageName: string) => void;
  cartItems: CartItem[];
}

const CheckoutPage = ({ navigateTo, cartItems }: CheckoutPageProps) => {

    const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    const shipping = 0;
    const total = subtotal + shipping;

    const breadcrumbItems = [
        { label: 'الرئيسية', page: 'home' },
        { label: 'السلة', page: 'cart' },
        { label: 'الدفع' }
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="الدفع" />
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-bold mb-6">تفاصيل الفوترة</h2>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="الاسم الأول" className="w-full border p-3 rounded-lg" />
                                <input type="text" placeholder="الاسم الأخير" className="w-full border p-3 rounded-lg" />
                            </div>
                            <input type="text" placeholder="عنوان الشارع" className="w-full border p-3 rounded-lg" />
                            <input type="text" placeholder="المدينة" className="w-full border p-3 rounded-lg" />
                            <input type="text" placeholder="الرمز البريدي" className="w-full border p-3 rounded-lg" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="email" placeholder="البريد الإلكتروني" className="w-full border p-3 rounded-lg" />
                                <input type="tel" placeholder="الهاتف" className="w-full border p-3 rounded-lg" />
                            </div>
                            <textarea placeholder="ملاحظات الطلب (اختياري)" rows={4} className="w-full border p-3 rounded-lg"></textarea>
                        </form>
                    </div>
                    <div>
                        <div className="bg-brand-subtle p-6 rounded-lg">
                            <h2 className="text-2xl font-bold mb-6">طلبك</h2>
                            <div className="space-y-3 border-b pb-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <img src={item.image} alt={item.name} className="w-14 h-16 rounded-md object-cover" />
                                            <div>
                                                <p className="font-semibold">{item.name} <span className="font-normal text-sm">x {item.quantity}</span></p>
                                                <p className="text-sm text-brand-text-light">{item.selectedSize} / {item.selectedColor}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold">{(parseFloat(item.price) * item.quantity).toFixed(2)} ج.م</p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2 py-4 border-b">
                                <div className="flex justify-between"><span>المجموع الفرعي:</span><span className="font-semibold">{subtotal.toFixed(2)} ج.م</span></div>
                                <div className="flex justify-between"><span>الشحن:</span><span className="font-semibold">{shipping.toFixed(2)} ج.م</span></div>
                            </div>
                            <div className="flex justify-between font-bold text-xl py-4">
                                <span>الإجمالي:</span><span className="text-brand-dark">{total.toFixed(2)} ج.م</span>
                            </div>
                             <div className="space-y-3">
                                <div className="border p-3 rounded-lg">
                                    <label className="font-semibold flex items-center gap-2"><input type="radio" name="payment" defaultChecked/> الدفع عند الاستلام</label>
                                </div>
                                 <div className="border p-3 rounded-lg">
                                    <label className="font-semibold flex items-center gap-2"><input type="radio" name="payment"/> بطاقة الائتمان</label>
                                </div>
                            </div>
                             <button onClick={() => navigateTo('orderConfirmation')} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90 mt-6">تأكيد الطلب</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;