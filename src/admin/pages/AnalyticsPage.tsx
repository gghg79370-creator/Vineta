import React, { useState, useMemo } from 'react';
import { AdminOrder, AdminProduct, AdminCustomer } from '../data/adminData';
import { Card } from '../components/ui/Card';
import { KpiCard } from '../components/ui/KpiCard';
import SalesChart from '../components/analytics/SalesChart';
import CategoryPieChart from '../components/analytics/CategoryPieChart';
import { CurrencyDollarIcon, ShoppingBagIcon, UsersIcon } from '../../components/icons';

type DateRange = '7d' | '30d' | '90d' | 'ytd';

interface AnalyticsPageProps {
    orders: AdminOrder[];
    products: AdminProduct[];
    customers: AdminCustomer[];
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ orders, products, customers }) => {
    const [dateRange, setDateRange] = useState<DateRange>('30d');

    const filteredData = useMemo(() => {
        const now = new Date();
        let startDate = new Date();

        switch (dateRange) {
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(now.getDate() - 90);
                break;
            case 'ytd':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
        }

        const filteredOrders = orders.filter(o => new Date(o.date) >= startDate && o.status !== 'Cancelled');
        const filteredCustomers = customers.filter(c => new Date(c.registeredDate) >= startDate);

        return { orders: filteredOrders, customers: filteredCustomers };
    }, [orders, customers, dateRange]);
    
    const kpiData = useMemo(() => {
        const totalSales = filteredData.orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
        const orderCount = filteredData.orders.length;
        const avgOrderValue = orderCount > 0 ? totalSales / orderCount : 0;
        const newCustomers = filteredData.customers.length;
        return { totalSales, orderCount, avgOrderValue, newCustomers };
    }, [filteredData]);

    const topSellingProducts = useMemo(() => {
        return [...products]
            .sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0))
            .slice(0, 5);
    }, [products]);
    

    const salesByCategory = useMemo(() => {
        const categoryMap: { [key: string]: number } = { 'men': 0, 'women': 0 };
        filteredData.orders.forEach(order => {
            order.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product && product.category) {
                    categoryMap[product.category] = (categoryMap[product.category] || 0) + (parseFloat(item.price) * item.quantity);
                }
            });
        });
        return Object.entries(categoryMap).map(([name, value]) => ({ name: name === 'men' ? 'رجال' : 'نساء', value }));
    }, [filteredData.orders, products]);


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <select value={dateRange} onChange={(e) => setDateRange(e.target.value as DateRange)} className="admin-form-input text-sm font-semibold w-auto">
                        <option value="7d">آخر 7 أيام</option>
                        <option value="30d">آخر 30 يومًا</option>
                        <option value="90d">آخر 90 يومًا</option>
                        <option value="ytd">منذ بداية العام</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="إجمالي المبيعات" value={`${kpiData.totalSales.toFixed(2)} ج.م`} change="+12.5%" changeType="increase" icon={<CurrencyDollarIcon size="md" />} />
                <KpiCard title="الطلبات" value={kpiData.orderCount.toString()} change="-2.1%" changeType="decrease" icon={<ShoppingBagIcon size="md" />} />
                <KpiCard title="متوسط قيمة الطلب" value={`${kpiData.avgOrderValue.toFixed(2)} ج.م`} change="+5.0%" changeType="increase" icon={<CurrencyDollarIcon size="md" />} />
                <KpiCard title="عملاء جدد" value={kpiData.newCustomers.toString()} change="+0.5%" changeType="increase" icon={<UsersIcon size="md" />} />
            </div>

            <Card title="نظرة عامة على المبيعات">
                <SalesChart orders={filteredData.orders} dateRange={dateRange} />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <Card title="المنتجات الأكثر مبيعًا">
                        <div className="space-y-4">
                            {topSellingProducts.map(product => (
                                <div key={product.id} className="flex items-center gap-4">
                                    <img src={product.image} alt={product.name} className="w-12 h-14 object-cover rounded-md"/>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{product.name}</p>
                                        <p className="text-xs text-gray-500">{product.sku}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">{product.unitsSold} <span className="font-normal text-sm">مبيعات</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                <div>
                    <Card title="المبيعات حسب الفئة">
                       <CategoryPieChart data={salesByCategory} />
                    </Card>
                </div>
            </div>
            
            <Card title="التقارير">
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50">
                        <div>
                            <p className="font-semibold">تقرير المبيعات</p>
                            <p className="text-sm text-gray-500">ملخص المبيعات، الطلبات، والضرائب.</p>
                        </div>
                        <button className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 text-sm">
                            إنشاء تقرير
                        </button>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50">
                        <div>
                            <p className="font-semibold">تقرير المخزون</p>
                            <p className="text-sm text-gray-500">نظرة عامة على مستويات المخزون الحالية.</p>
                        </div>
                        <button className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 text-sm">
                            إنشاء تقرير
                        </button>
                    </div>
                </div>
            </Card>

        </div>
    );
};

export default AnalyticsPage;
