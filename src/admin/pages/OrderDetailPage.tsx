import React, { useState } from 'react';
import { AdminOrder, AdminCustomer, AdminProduct } from '../data/adminData';
import { Card } from '../components/ui/Card';
import { PackageIcon, TruckIcon, CheckCircleIcon, UserIcon, MapPinIcon, DocumentDuplicateIcon } from '../../components/icons';
import { useToast } from '../../hooks/useToast';
import { useAppState } from '../../state/AppState';

const PrintableInvoice = ({ order, customer }: { order: AdminOrder; customer?: AdminCustomer }) => {
    const { state: { theme } } = useAppState();
    const subtotal = parseFloat(order.total); // Assuming total is subtotal before shipping/taxes for this example
    const shipping = 0.00;
    const taxes = 0.00;
    const total = subtotal + shipping + taxes;

    return (
        <div id="printable-invoice" className="hidden print:block font-sans">
            <header className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-4xl font-bold font-serif text-gray-800">{theme.siteName}</h1>
                    <p className="text-gray-500">فاتورة طلب</p>
                </div>
                <div className="text-left">
                    <p className="font-bold text-lg">{order.id}</p>
                    <p className="text-gray-600">تاريخ الطلب: {order.date}</p>
                </div>
            </header>
            <main>
                <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="text-right">
                        <h2 className="font-bold text-gray-500 uppercase tracking-wide text-sm mb-2">فاتورة إلى</h2>
                        <p className="font-bold text-gray-800">{customer?.name}</p>
                        <p className="text-gray-600">{order.billingAddress}</p>
                        <p className="text-gray-600">{customer?.email}</p>
                    </div>
                    <div className="text-left">
                        <h2 className="font-bold text-gray-500 uppercase tracking-wide text-sm mb-2">شحن إلى</h2>
                        <p className="font-bold text-gray-800">{customer?.name}</p>
                        <p className="text-gray-600">{order.shippingAddress}</p>
                    </div>
                </div>

                <table className="w-full text-right">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 font-semibold text-gray-600">المنتج</th>
                            <th className="p-3 font-semibold text-gray-600 text-center">الكمية</th>
                            <th className="p-3 font-semibold text-gray-600 text-center">السعر</th>
                            <th className="p-3 font-semibold text-gray-600 text-left">المجموع</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {order.items.map((item, index) => (
                            <tr key={index}>
                                <td className="p-3">
                                    <p className="font-semibold text-gray-800">{item.productName}</p>
                                    <p className="text-xs text-gray-500">{item.sku}</p>
                                </td>
                                <td className="p-3 text-center">{item.quantity}</td>
                                <td className="p-3 text-center">{parseFloat(item.price).toFixed(2)} ج.م</td>
                                <td className="p-3 text-left font-semibold">{(parseFloat(item.price) * item.quantity).toFixed(2)} ج.م</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end mt-8">
                    <div className="w-full max-w-xs space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-600">المجموع الفرعي:</span><span className="font-semibold">{subtotal.toFixed(2)} ج.م</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">الشحن:</span><span className="font-semibold">{shipping.toFixed(2)} ج.م</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">الضرائب:</span><span className="font-semibold">{taxes.toFixed(2)} ج.م</span></div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span className="text-gray-800">الإجمالي:</span><span className="text-gray-800">{total.toFixed(2)} ج.م</span></div>
                    </div>
                </div>
            </main>
            <footer className="mt-16 pt-4 border-t text-center text-xs text-gray-500">
                <p>شكراً لتسوقك في {theme.siteName}!</p>
            </footer>
        </div>
    );
};


interface OrderDetailPageProps {
    order: AdminOrder;
    customers: AdminCustomer[];
    products: AdminProduct[];
    onStatusChange: (orderId: string, newStatus: AdminOrder['status']) => void;
    navigate: (page: string, data?: any) => void;
    onNoteSave: (orderId: string, note: string) => void;
}

const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ order, customers, products, onStatusChange, navigate, onNoteSave }) => {
    
    const [note, setNote] = useState(order.notes || '');
    const customer = customers.find(c => c.id === order.customerId);
    const addToast = useToast();

    const statusClasses: { [key: string]: string } = {
        'Delivered': 'bg-green-100 text-green-700',
        'On the way': 'bg-yellow-100 text-yellow-700',
        'Cancelled': 'bg-red-100 text-red-700',
    };
    const statusTranslations: { [key: string]: string } = { 'Delivered': 'تم التوصيل', 'On the way': 'قيد التوصيل', 'Cancelled': 'تم الإلغاء' };

    const getStatusIcon = (status: string, isCompleted: boolean) => {
        const activeClass = isCompleted ? 'text-admin-accent' : 'text-gray-400';
        const iconSize = 'w-6 h-6';
        switch (status) {
            case 'تم الطلب': return <PackageIcon className={`${iconSize} ${activeClass}`} />;
            case 'تم الشحن': return <TruckIcon className={`${iconSize} ${activeClass}`} />;
            case 'قيد التوصيل': return <TruckIcon className={`${iconSize} ${activeClass}`} />;
            case 'تم التوصيل': return <CheckCircleIcon className={`${iconSize} ${isCompleted ? 'text-green-500' : 'text-gray-400'}`} />;
            default: return null;
        }
    };

    const handleSaveNote = () => {
        onNoteSave(order.id, note);
        addToast('تم حفظ الملاحظة!', 'success');
    };
    
    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">طلب {order.id}</h1>
                        <p className="text-gray-500 mt-1 text-sm">{order.date} &bull; {order.itemCount} منتجات</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.print()} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 text-sm">
                            طباعة الفاتورة
                        </button>
                        <select 
                            value={order.status} 
                            onChange={(e) => onStatusChange(order.id, e.target.value as AdminOrder['status'])}
                            className="admin-form-input text-sm font-semibold"
                        >
                            <option value="On the way">قيد التوصيل</option>
                            <option value="Delivered">تم التوصيل</option>
                            <option value="Cancelled">تم الإلغاء</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card title="المنتجات المطلوبة">
                            <table className="w-full text-sm text-right">
                                <tbody className="divide-y divide-gray-100">
                                    {order.items.map(item => {
                                        const product = products.find(p => p.id === item.productId);
                                        const variant = product?.variants.find(v => v.id === item.variantId);
                                        const variantInfo = variant ? Object.values(variant.options).join(' / ') : 'مقاس موحد';
                                        
                                        return (
                                            <tr key={`${item.productId}-${item.variantId || ''}`}>
                                                <td className="p-3 w-4/6">
                                                    <div className="flex items-center gap-3">
                                                        <img src={item.productImage} alt={item.productName} className="w-12 h-14 object-cover rounded-md"/>
                                                        <div>
                                                            <p className="font-semibold">{item.productName}</p>
                                                            <p className="text-xs text-gray-500">{variantInfo}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-gray-500 w-1/6">{item.price} ج.م &times; {item.quantity}</td>
                                                <td className="p-3 font-bold text-right w-1/6">{(parseFloat(item.price) * item.quantity).toFixed(2)} ج.م</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="flex justify-end mt-4 pt-4 border-t">
                                <div className="w-full max-w-xs space-y-2 text-sm">
                                    <div className="flex justify-between"><span>المجموع الفرعي:</span><span className="font-semibold">{order.total} ج.م</span></div>
                                    <div className="flex justify-between"><span>الشحن:</span><span className="font-semibold">0.00 ج.م</span></div>
                                    <div className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span>الإجمالي:</span><span>{order.total} ج.م</span></div>
                                </div>
                            </div>
                        </Card>
                        <Card title="مسار الطلب">
                            <div className="relative pr-8">
                                {order.trackingHistory.map((event, index) => {
                                    const isLast = index === order.trackingHistory.length - 1;
                                    return (
                                        <div key={index} className="relative pb-8 last:pb-0">
                                            { !isLast && <div className="absolute top-5 -right-3 w-0.5 h-full bg-admin-accent"></div> }
                                            <div className="flex items-start gap-4">
                                                <div className="relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 bg-admin-accent/10">
                                                    {getStatusIcon(event.status, true)}
                                                </div>
                                                <div className="pt-2">
                                                    <p className="font-bold">{event.status}</p>
                                                    <p className="text-sm text-gray-500 mt-1">{event.date}</p>
                                                    {event.location && <p className="text-xs text-gray-500">{event.location}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <Card title="العميل">
                            <div className="flex items-center gap-3">
                            {customer && <img src={customer.avatar} alt={customer.name} className="w-12 h-12 rounded-full" />}
                            <div>
                                    <button onClick={() => navigate('customerDetail', customer)} className="font-bold text-admin-accent hover:underline">{order.customer.name}</button>
                                <p className="text-sm text-gray-500">{order.customer.email}</p>
                            </div>
                            </div>
                        </Card>
                        <Card title="ملاحظات الطلب">
                            <textarea rows={4} placeholder="أضف ملاحظة..." value={note} onChange={(e) => setNote(e.target.value)} className="admin-form-input text-sm"></textarea>
                            <button onClick={handleSaveNote} className="w-full mt-2 bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 text-sm">حفظ الملاحظة</button>
                        </Card>
                        <Card title="معلومات الشحن">
                            <div className="space-y-2 text-sm">
                                <p className="font-semibold">{order.customer.name}</p>
                                <p className="text-gray-500">{order.shippingAddress}</p>
                            </div>
                        </Card>
                        <Card title="معلومات الفوترة">
                            <div className="space-y-2 text-sm">
                                <p className="font-semibold">{order.customer.name}</p>
                                <p className="text-gray-500">{order.billingAddress}</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            <PrintableInvoice order={order} customer={customer} />
        </>
    );
};

export default OrderDetailPage;