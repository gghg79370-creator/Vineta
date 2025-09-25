import React, { useState } from 'react';
import { CartItem, Product, Order, TrackingEvent } from '../types';
import { CloseIcon, MinusIcon, PlusIcon, CouponIcon, PackageIcon, TruckIcon, CheckCircleIcon } from '../components/icons';
import { allProducts } from '../data/products';
import { ordersData } from '../data/orders';
import { TrendingProductsSection } from '../components/product/TrendingProductsSection';

interface CartPageProps {
    cartItems: CartItem[];
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    navigateTo: (pageName: string, data?: any) => void;
    compareList: Product[];
    addToCompare: (product: Product) => void;
    addToCart: (product: Product) => void;
    openQuickView: (product: Product) => void;
    wishlistItems: Product[];
    toggleWishlist: (product: Product) => void;
}

const CartPage = ({ cartItems, setCartItems, navigateTo, compareList, addToCompare, addToCart, openQuickView, wishlistItems, toggleWishlist }: CartPageProps) => {
    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

    const [trackingId, setTrackingId] = useState('');
    const [trackedOrder, setTrackedOrder] = useState<Order | null | undefined>(undefined); // undefined: initial, null: not found

    const handleQuantityChange = (itemId: number, size: string, color: string, delta: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId && item.selectedSize === size && item.selectedColor === color
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    const handleRemoveItem = (itemId: number, size: string, color: string) => {
        setCartItems(prevItems => prevItems.filter(item => !(item.id === itemId && item.selectedSize === size && item.selectedColor === color)));
    };
    
    const handleTrackOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingId.trim()) {
            setTrackedOrder(undefined);
            return;
        }
        const foundOrder = ordersData.find(order => order.id === `#${trackingId.replace('#', '')}`);
        setTrackedOrder(foundOrder || null);
    };

    const OrderTracking = () => {
        const timelineStatuses: TrackingEvent['status'][] = ['تم الطلب', 'تم الشحن', 'قيد التوصيل', 'تم التوصيل'];
        
        const getStatusIcon = (status: TrackingEvent['status'], isCompleted: boolean) => {
            const activeClass = isCompleted ? 'text-brand-delivered' : 'text-brand-text-light';
            const iconSize = 'w-6 h-6';
            switch (status) {
                case 'تم الطلب': return <PackageIcon className={`${iconSize} ${activeClass}`} />;
                case 'تم الشحن': return <TruckIcon className={`${iconSize} ${activeClass}`} />;
                case 'قيد التوصيل': return <TruckIcon className={`${iconSize} ${activeClass}`} />;
                case 'تم التوصيل': return <CheckCircleIcon className={`${iconSize} ${isCompleted ? 'text-brand-delivered' : 'text-brand-text-light'}`} />;
                default: return null;
            }
        };

        return (
            <div className="my-16 border-t pt-12">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-2 text-brand-dark">تتبع طلبك</h2>
                    <p className="text-brand-text-light mb-6">أدخل رقم الطلب الخاص بك أدناه للاطلاع على حالة الشحن.</p>
                    <form onSubmit={handleTrackOrder} className="flex gap-2 max-w-md mx-auto">
                        <input
                            type="text"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            placeholder="أدخل رقم الطلب (مثل: 12345)"
                            className="w-full bg-white border border-brand-border rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                        />
                        <button type="submit" className="bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 flex-shrink-0">
                            تتبع
                        </button>
                    </form>
                </div>
                <div className="mt-8 max-w-2xl mx-auto">
                    {trackedOrder === null && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center animate-fade-in">
                            لم يتم العثور على طلب بهذا الرقم. يرجى التحقق من الرقم والمحاولة مرة أخرى.
                        </div>
                    )}
                    {trackedOrder && trackedOrder.trackingHistory && (
                         <div className="bg-brand-subtle p-6 rounded-lg border animate-fade-in">
                             <h3 className="text-xl font-bold mb-1 text-brand-dark">تفاصيل الطلب {trackedOrder.id}</h3>
                             <p className="text-brand-text-light mb-4 text-sm">التسليم المتوقع: {trackedOrder.estimatedDelivery}</p>

                             <div className="relative pr-8 mt-6">
                                {timelineStatuses.map((status, index) => {
                                    const event = trackedOrder.trackingHistory?.find(e => e.status === status);
                                    const isCompleted = !!event;
                                    const lastEvent = trackedOrder.trackingHistory![trackedOrder.trackingHistory!.length - 1];
                                    const isCurrentEvent = lastEvent?.status === status && trackedOrder.status !== 'Delivered';
                                    const lineCompleted = trackedOrder.trackingHistory!.length > index;

                                     return (
                                        <div key={status} className="relative pb-8 last:pb-0">
                                            {index < timelineStatuses.length - 1 && (
                                                <div className={`absolute top-5 -right-3 w-0.5 h-full ${lineCompleted ? 'bg-brand-delivered' : 'bg-brand-border'}`}></div>
                                            )}
                                            <div className="flex items-start gap-4">
                                                <div className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 ${isCompleted ? 'bg-brand-delivered/10' : 'bg-gray-200'}`}>
                                                    {isCurrentEvent && <span className="absolute animate-sonar-pulse bg-brand-delivered rounded-full h-10 w-10 z-0"></span>}
                                                    <div className="relative z-10">{getStatusIcon(status, isCompleted)}</div>
                                                </div>
                                                <div className="pt-2">
                                                    <p className={`font-bold ${isCurrentEvent ? 'text-brand-primary' : 'text-brand-dark'}`}>{status}</p>
                                                    {event && <p className="text-sm text-brand-text-light mt-1">{event.date}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8">سلة التسوق</h1>
                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="overflow-x-auto">
                                <table className="w-full text-right">
                                    <thead className="border-b">
                                        <tr>
                                            <th className="font-semibold p-3" colSpan={2}>المنتج</th>
                                            <th className="font-semibold p-3">السعر</th>
                                            <th className="font-semibold p-3">الكمية</th>
                                            <th className="font-semibold p-3">المجموع الفرعي</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map(item => (
                                            <tr key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="border-b">
                                                <td className="p-3"><img src={item.image} alt={item.name} className="w-20 h-24 rounded-md object-cover"/></td>
                                                <td className="p-3">
                                                    <p className="font-bold text-brand-dark">{item.name}</p>
                                                    <p className="text-sm text-brand-text-light">{`اللون: ${item.selectedColor}, المقاس: ${item.selectedSize}`}</p>
                                                </td>
                                                <td className="p-3 font-semibold">{item.price} ج.م</td>
                                                <td className="p-3">
                                                    <div className="flex items-center border border-brand-border rounded-full bg-brand-subtle/50 w-28 justify-between">
                                                        <button onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, -1)} className="p-1.5" aria-label="تقليل الكمية"><MinusIcon size="sm"/></button>
                                                        <span className="px-2 font-bold text-sm">{item.quantity}</span>
                                                        <button onClick={() => handleQuantityChange(item.id, item.selectedSize, item.selectedColor, 1)} className="p-1.5" aria-label="زيادة الكمية"><PlusIcon size="sm"/></button>
                                                    </div>
                                                </td>
                                                <td className="p-3 font-bold text-brand-dark">{(parseFloat(item.price) * item.quantity).toFixed(2)} ج.م</td>
                                                <td className="p-3">
                                                    <button onClick={() => handleRemoveItem(item.id, item.selectedSize, item.selectedColor)} className="text-brand-text-light hover:text-brand-dark"><CloseIcon size="sm"/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-brand-subtle p-6 rounded-lg">
                                <h2 className="text-xl font-bold mb-4">ملخص السلة</h2>
                                <div className="relative mb-4">
                                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-text-light"><CouponIcon size="sm"/></div>
                                    <input type="text" placeholder="رمز الكوبون" className="w-full bg-white border border-brand-border rounded-full py-3 pr-11 pl-4"/>
                                </div>
                                <div className="space-y-2 border-b pb-4 mb-4">
                                    <div className="flex justify-between"><span>المجموع الفرعي:</span><span className="font-semibold">{total.toFixed(2)} ج.م</span></div>
                                    <div className="flex justify-between"><span>الشحن:</span><span className="font-semibold">مجاني</span></div>
                                </div>
                                <div className="flex justify-between font-bold text-xl mb-6">
                                    <span>الإجمالي:</span><span className="text-brand-dark">{total.toFixed(2)} ج.م</span>
                                </div>
                                <div className="space-y-3">
                                    <button onClick={() => navigateTo('checkout')} className="w-full bg-brand-dark text-white font-bold py-3 rounded-full hover:bg-opacity-90">المتابعة إلى الدفع</button>
                                    <button onClick={() => navigateTo('shop')} className="w-full bg-white border border-brand-border text-brand-dark font-bold py-3 rounded-full hover:bg-brand-subtle">
                                        متابعة التسوق
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-lg font-semibold mb-4">سلة التسوق فارغة.</p>
                        <button onClick={() => navigateTo('shop')} className="bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90">
                            العودة للتسوق
                        </button>
                    </div>
                )}

                <OrderTracking />
                
                <TrendingProductsSection
                    title="قد يعجبك أيضًا"
                    products={allProducts.slice(4, 8)}
                    navigateTo={navigateTo}
                    addToCart={addToCart}
                    openQuickView={openQuickView}
                    isCarousel
                    compareList={compareList}
                    addToCompare={addToCompare}
                    wishlistItems={wishlistItems}
                    toggleWishlist={toggleWishlist}
                />
            </div>
        </div>
    );
};

export default CartPage;