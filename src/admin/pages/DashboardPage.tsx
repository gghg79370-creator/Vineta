import React from 'react';
import { KpiCard } from '../components/ui/KpiCard';
import { AdminOrder, AdminProduct, AdminCustomer } from '../data/adminData';
import { Card } from '../components/ui/Card';
import SalesChart from '../components/analytics/SalesChart';
import { ShoppingBagIcon, UserIcon, StarIcon, RssIcon } from '../../components/icons';

interface DashboardPageProps {
    navigate: (page: string, data?: any) => void;
    recentOrders: AdminOrder[];
    lowStockProducts: AdminProduct[];
    orders: AdminOrder[];
    customers: AdminCustomer[];
}

const ActivityFeed = () => {
    const activities = [
        { icon: <ShoppingBagIcon size="sm"/>, text: "طلب جديد #12468 من نورا أحمد.", time: "قبل 5 دقائق" },
        { icon: <UserIcon size="sm"/>, text: "عميل جديد سجل: karim@example.com.", time: "قبل 30 دقيقة" },
        { icon: <StarIcon size="sm"/>, text: "تقييم جديد 5 نجوم لـ 'جاكيت جلدي أنيق'.", time: "قبل ساعة" },
        { icon: <ShoppingBagIcon size="sm"/>, text: "طلب جديد #12467 من نورا أحمد.", time: "قبل 3 ساعات" },
    ];
    return (
        <div className="space-y-4">
            {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                    <div className="bg-gray-100 rounded-full p-2 text-gray-500">
                        {activity.icon}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-800">{activity.text}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}


const DashboardPage: React.FC<DashboardPageProps> = ({ navigate, recentOrders, lowStockProducts, orders, customers }) => {

    const statusClasses: { [key: string]: string } = {
        'Delivered': 'bg-green-100 text-green-700',
        'On the way': 'bg-yellow-100 text-yellow-700',
        'Cancelled': 'bg-red-100 text-red-700',
    };
    const statusTranslations: { [key: string]: string } = { 'Delivered': 'تم التوصيل', 'On the way': 'قيد التوصيل', 'Cancelled': 'تم الإلغاء' };
    
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;


    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">مرحباً بعودتك!</h1>
                    <p className="text-gray-500 mt-1">إليك ما يحدث في متجرك اليوم.</p>
                </div>
                <div className="flex items-center gap-3">
                     <button onClick={() => navigate('orders')} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                        عرض الطلبات
                    </button>
                    <button onClick={() => navigate('addProduct')} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-500 transition-colors">
                        إضافة منتج
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="إجمالي الإيرادات" value={`${totalRevenue.toFixed(2)} ج.م`} change="+12.5%" changeType="increase" />
                <KpiCard title="الطلبات" value={totalOrders.toString()} change="-2.1%" changeType="decrease" />
                <KpiCard title="متوسط قيمة الطلب" value={`${avgOrderValue.toFixed(2)} ج.م`} change="+5.0%" changeType="increase" />
                <KpiCard title="العملاء" value={totalCustomers.toString()} change="+0.5%" changeType="increase" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart & Recent Orders */}
                <div className="lg:col-span-2 space-y-8">
                     <Card title="نظرة عامة على المبيعات (آخر 30 يومًا)">
                        <SalesChart orders={orders} dateRange="30d" />
                    </Card>
                    <Card 
                        title="أحدث الطلبات"
                        actions={<button onClick={() => navigate('orders')} className="text-sm font-bold text-primary-600 hover:underline">عرض الكل</button>}
                    >
                        <div className="overflow-x-auto -m-4">
                            <table className="w-full text-sm text-right">
                                <thead className="text-gray-500">
                                    <tr>
                                        <th className="p-3 font-semibold">رقم الطلب</th>
                                        <th className="p-3 font-semibold">العميل</th>
                                        <th className="p-3 font-semibold">الإجمالي</th>
                                        <th className="p-3 font-semibold">الحالة</th>
                                        <th className="p-3 font-semibold">التاريخ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <tr key={order.id} className="border-t">
                                            <td className="p-3">
                                                <button onClick={() => navigate('orderDetail', order)} className="font-semibold text-primary-600 hover:underline">{order.id}</button>
                                            </td>
                                            <td className="p-3">{order.customer.name}</td>
                                            <td className="p-3">{order.total} ج.م</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusClasses[order.status]}`}>
                                                    {statusTranslations[order.status]}
                                                </span>
                                            </td>
                                            <td className="p-3 text-gray-500">{order.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>


                {/* Side column */}
                <div className="space-y-8">
                     <Card title="موجز الأنشطة">
                        <ActivityFeed />
                     </Card>
                     <Card 
                        title="منتجات على وشك النفاذ"
                        actions={<button onClick={() => navigate('products')} className="text-sm font-bold text-primary-600 hover:underline">عرض الكل</button>}
                    >
                        <div className="space-y-4">
                            {lowStockProducts.map(product => {
                                const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                                return (
                                <div key={product.id} className="flex items-center gap-4">
                                    <img src={product.image} alt={product.name} className="w-12 h-14 object-cover rounded-md"/>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{product.name}</p>
                                        <p className="text-xs text-gray-500">{product.sku}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-red-500">{totalStock}</p>
                                        <p className="text-xs text-gray-500">في المخزن</p>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;