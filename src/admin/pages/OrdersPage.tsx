import React, { useState, useMemo } from 'react';
import { AdminOrder } from '../data/adminData';
import { Pagination } from '../components/ui/Pagination';
import { OrderListTable } from '../components/orders/OrderListTable';

interface OrdersPageProps {
    navigate: (page: string, data?: any) => void;
    orders: AdminOrder[];
}

const OrdersPage: React.FC<OrdersPageProps> = ({ navigate, orders }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const ordersPerPage = 10;

    const filteredOrders = useMemo(() => {
        return orders
            .filter(o => 
                o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(o => statusFilter === 'All' || o.status === statusFilter);
    }, [orders, searchTerm, statusFilter]);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">الطلبات</h1>
                <p className="text-gray-500 mt-1">عرض وإدارة جميع طلباتك.</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="search"
                        placeholder="بحث بالرقم أو اسم العميل..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/3 border-gray-300 rounded-lg"
                    />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full md:w-auto border-gray-300 rounded-lg">
                        <option value="All">كل الحالات</option>
                        <option value="On the way">قيد التوصيل</option>
                        <option value="Delivered">تم التوصيل</option>
                        <option value="Cancelled">تم الإلغاء</option>
                    </select>
                </div>
                <OrderListTable
                    orders={currentOrders}
                    onView={(order) => navigate('orderDetail', order)}
                />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};

export default OrdersPage;