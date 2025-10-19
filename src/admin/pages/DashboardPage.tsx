import React, { useState } from 'react';
import { KpiCard } from '../components/ui/KpiCard';
import { AdminOrder, AdminProduct, AdminCustomer } from '../data/adminData';
import { Card } from '../components/ui/Card';
import SalesChart from '../components/analytics/SalesChart';
import { ShoppingBagIcon, StarIcon, CurrencyDollarIcon, UsersIcon, PencilIcon, ChevronDownIcon } from '../../components/icons';
import { User } from '../../types';

interface SetupTask {
    id: string;
    text: string;
    completed: boolean;
    link: string;
}

interface SetupGuideProps {
    tasks: SetupTask[];
    onToggleTask: (taskId: string, isCompleted: boolean) => void;
    navigate: (page: string) => void;
}

const SetupGuide: React.FC<SetupGuideProps> = ({ tasks, onToggleTask, navigate }) => {
    const [isOpen, setIsOpen] = useState(true);
    const completedCount = tasks.filter(t => t.completed).length;
    const progress = (completedCount / tasks.length) * 100;

    return (
        <Card title="">
            <div className="p-0">
                <div className="flex justify-between items-center cursor-pointer p-5" onClick={() => setIsOpen(!isOpen)}>
                    <div>
                        <h3 className="font-bold text-lg">دليل إعداد متجرك</h3>
                        <p className="text-sm text-admin-text-secondary">{completedCount} من {tasks.length} مهام مكتملة</p>
                        <div className="w-full bg-admin-border rounded-full h-2 mt-2 max-w-xs">
                            <div className="bg-admin-accent h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
                {isOpen && (
                    <div className="px-5 pb-5 animate-fade-in">
                        {tasks.map(task => (
                            <div key={task.id} className="flex items-center gap-4 py-3 border-b border-admin-border last:border-b-0">
                                <input
                                    type="checkbox"
                                    id={`task-${task.id}`}
                                    className="sr-only task-input"
                                    checked={task.completed}
                                    onChange={(e) => onToggleTask(task.id, e.target.checked)}
                                />
                                <label htmlFor={`task-${task.id}`} className="task-checkbox-label cursor-pointer flex items-center justify-center w-6 h-6 rounded-md border-2 border-admin-border bg-admin-card-bg flex-shrink-0">
                                    <svg className="task-checkbox-svg w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline className="task-checkbox-path" points="20 6 9 17 4 12"></polyline></svg>
                                </label>
                                <div className="flex-1">
                                    <button onClick={() => navigate(task.link)} className={`font-semibold text-right w-full ${task.completed ? 'task-text-completed' : 'text-admin-text-primary hover:text-admin-accent'}`}>
                                        {task.text}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};


interface DashboardPageProps {
    navigate: (page: string, data?: any) => void;
    recentOrders: AdminOrder[];
    lowStockProducts: AdminProduct[];
    orders: AdminOrder[];
    customers: AdminCustomer[];
    currentUser: User | null;
    setupTasks: SetupTask[];
    onToggleTask: (taskId: string, isCompleted: boolean) => void;
}

const ActivityFeed = () => {
    const activities = [
        { icon: <ShoppingBagIcon size="sm"/>, text: "طلب جديد #12468 من نورا أحمد.", time: "قبل 5 دقائق" },
        { icon: <UsersIcon size="sm"/>, text: "عميل جديد سجل: karim@example.com.", time: "قبل 30 دقيقة" },
        { icon: <StarIcon size="sm"/>, text: "تقييم جديد 5 نجوم لـ 'جاكيت جلدي أنيق'.", time: "قبل ساعة" },
        { icon: <ShoppingBagIcon size="sm"/>, text: "طلب جديد #12467 من نورا أحمد.", time: "قبل 3 ساعات" },
    ];
    return (
        <div className="space-y-4">
            {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                    <div className="bg-admin-bg rounded-full p-2.5 text-admin-text-secondary">
                        {activity.icon}
                    </div>
                    <div>
                        <p className="text-sm text-admin-text-primary">{activity.text}</p>
                        <p className="text-xs text-admin-text-secondary">{activity.time}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

const DashboardPage: React.FC<DashboardPageProps> = ({ navigate, recentOrders, lowStockProducts, orders, customers, currentUser, setupTasks, onToggleTask }) => {

    const statusClasses: { [key: string]: string } = {
        'Delivered': 'bg-green-100 text-green-800',
        'On the way': 'bg-amber-100 text-amber-800',
        'Cancelled': 'bg-red-100 text-red-800',
    };
    const statusTranslations: { [key: string]: string } = { 'Delivered': 'تم التوصيل', 'On the way': 'قيد التوصيل', 'Cancelled': 'تم الإلغاء' };
    
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const userRole = currentUser?.role || 'Administrator';


    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in-up">
            <SetupGuide tasks={setupTasks} onToggleTask={onToggleTask} navigate={navigate} />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {userRole === 'Administrator' && (
                    <>
                        <KpiCard title="إجمالي الإيرادات" value={`${totalRevenue.toFixed(2)} ج.م`} change="+12.5%" changeType="increase" icon={<CurrencyDollarIcon size="md" />} />
                        <KpiCard title="متوسط قيمة الطلب" value={`${avgOrderValue.toFixed(2)} ج.م`} change="+5.0%" changeType="increase" icon={<CurrencyDollarIcon size="md" />} />
                    </>
                )}
                 {(userRole === 'Administrator' || userRole === 'Support') && (
                    <>
                        <KpiCard title="الطلبات" value={totalOrders.toString()} change="-2.1%" changeType="decrease" icon={<ShoppingBagIcon size="md" />} />
                        <KpiCard title="العملاء" value={totalCustomers.toString()} change="+0.5%" changeType="increase" icon={<UsersIcon size="md" />} />
                    </>
                 )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart & Recent Orders */}
                <div className="lg:col-span-2 space-y-8">
                     {userRole === 'Administrator' && (
                        <Card title="نظرة عامة على المبيعات (آخر 30 يومًا)">
                            <SalesChart orders={orders} dateRange="30d" />
                        </Card>
                     )}
                    <Card 
                        title="أحدث الطلبات"
                        actions={<button onClick={() => navigate('orders')} className="text-sm font-bold text-admin-accent hover:underline">عرض الكل</button>}
                    >
                        {/* Desktop Table */}
                        <div className="overflow-x-auto -mx-5 hidden md:block">
                            <table className="w-full text-sm text-right">
                                <thead className="text-admin-text-secondary">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold">رقم الطلب</th>
                                        <th className="px-5 py-3 font-semibold">العميل</th>
                                        <th className="px-5 py-3 font-semibold">الإجمالي</th>
                                        <th className="px-5 py-3 font-semibold">الحالة</th>
                                        <th className="px-5 py-3 font-semibold">التاريخ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <tr key={order.id} className="border-t border-admin-border">
                                            <td className="px-5 py-4">
                                                <button onClick={() => navigate('orderDetail', order)} className="font-semibold text-admin-accent hover:underline">{order.id}</button>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <img src={customers.find(c => c.id === order.customerId)?.avatar} alt={order.customer.name} className="w-8 h-8 rounded-full" />
                                                    <span>{order.customer.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">{order.total} ج.م</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${statusClasses[order.status]}`}>
                                                    {statusTranslations[order.status]}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-admin-text-secondary">{order.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Mobile List */}
                        <div className="md:hidden space-y-4">
                             {recentOrders.map(order => (
                                <div key={order.id} onClick={() => navigate('orderDetail', order)} className="p-4 bg-admin-bg/50 rounded-lg border border-admin-border">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-admin-accent">{order.id}</p>
                                            <p className="text-xs text-admin-text-secondary">{order.date}</p>
                                        </div>
                                         <span className={`px-2 py-1 rounded-md text-xs font-bold ${statusClasses[order.status]}`}>
                                            {statusTranslations[order.status]}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <img src={customers.find(c => c.id === order.customerId)?.avatar} alt={order.customer.name} className="w-8 h-8 rounded-full" />
                                            <span className="text-sm font-semibold">{order.customer.name}</span>
                                        </div>
                                        <p className="font-bold">{order.total} ج.م</p>
                                    </div>
                                </div>
                             ))}
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
                        actions={<button onClick={() => navigate('inventory')} className="text-sm font-bold text-admin-accent hover:underline">عرض الكل</button>}
                    >
                        <div className="space-y-4">
                            {lowStockProducts.map(product => {
                                const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                                return (
                                <div key={product.id} className="flex items-center gap-3">
                                    <img src={product.image} alt={product.name} className="w-12 h-14 object-cover rounded-md"/>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm text-admin-text-primary">{product.name}</p>
                                        <p className="text-xs text-admin-text-secondary">{product.sku}</p>
                                    </div>
                                    <div className="text-right flex items-center gap-2">
                                        <div>
                                            <p className="font-bold text-red-500 text-lg">{totalStock}</p>
                                            <p className="text-xs text-admin-text-secondary">في المخزن</p>
                                        </div>
                                        <button onClick={() => navigate('editProduct', product)} className="text-gray-400 hover:text-admin-accent p-1" aria-label={`Edit ${product.name}`}>
                                            <PencilIcon size="sm"/>
                                        </button>
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