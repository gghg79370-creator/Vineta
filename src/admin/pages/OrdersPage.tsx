
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AdminOrder } from '../data/adminData';
import { Pagination } from '../components/ui/Pagination';
import { OrderListTable } from '../components/orders/OrderListTable';
import { Card } from '../components/ui/Card';
import { useToast } from '../../hooks/useToast';
import { ArrowUpTrayIcon } from '../../components/icons';

interface OrdersPageProps {
    navigate: (page: string, data?: any) => void;
    orders: AdminOrder[];
    onStatusChange: (orderId: string, newStatus: AdminOrder['status']) => void;
}

const OrdersPage: React.FC<OrdersPageProps> = ({ navigate, orders, onStatusChange }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const addToast = useToast();
    const searchInputRef = useRef<HTMLInputElement>(null);

    const filterButtons = [
        { value: 'All', label: 'الكل' },
        { value: 'On the way', label: 'قيد التوصيل' },
        { value: 'Delivered', label: 'تم التوصيل' },
        { value: 'Cancelled', label: 'تم الإلغاء' }
    ];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    
    useEffect(() => {
        setSelectedOrders([]);
    }, [currentPage, searchTerm, statusFilter]);

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
    
    const handleStatusUpdate = (orderId: string, newStatus: AdminOrder['status']) => {
        onStatusChange(orderId, newStatus);
        addToast(`تم تحديث حالة الطلب ${orderId}`, 'success');
    };

     const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedOrders(currentOrders.map(o => o.id));
        } else {
            setSelectedOrders([]);
        }
    }

    const handleSelectOne = (orderId: string) => {
        setSelectedOrders(prev => 
            prev.includes(orderId) 
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const handleBulkStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as AdminOrder['status'];
        if (newStatus && selectedOrders.length > 0) {
            selectedOrders.forEach(orderId => {
                onStatusChange(orderId, newStatus);
            });
            addToast(`تم تحديث ${selectedOrders.length} طلبات.`, 'success');
            setSelectedOrders([]);
        }
    };

    return (
        <Card title="جميع الطلبات">
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <input
                        ref={searchInputRef}
                        type="search"
                        placeholder="بحث بالرقم أو اسم العميل..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="admin-form-input w-full md:w-1/3"
                    />
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50 w-full md:w-auto overflow-x-auto scrollbar-hide">
                        {filterButtons.map(btn => (
                            <button
                                key={btn.value}
                                onClick={() => setStatusFilter(btn.value)}
                                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors whitespace-nowrap ${
                                    statusFilter === btn.value
                                        ? 'bg-white text-admin-accent shadow-sm'
                                        : 'text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                    <button className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2 justify-center flex-shrink-0">
                        <ArrowUpTrayIcon size="sm"/>
                        <span>تصدير</span>
                    </button>
                </div>

                 {selectedOrders.length > 0 && (
                    <div className="bg-admin-accent/10 p-3 rounded-lg flex items-center justify-between animate-fade-in">
                        <p className="font-semibold text-sm text-admin-accent">{selectedOrders.length} طلبات محددة</p>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-admin-accent">تغيير الحالة إلى:</label>
                            <select onChange={handleBulkStatusChange} className="admin-form-input p-1.5 text-xs font-semibold">
                                <option value="">اختر...</option>
                                <option value="On the way">قيد التوصيل</option>
                                <option value="Delivered">تم التوصيل</option>
                                <option value="Cancelled">تم الإلغاء</option>
                            </select>
                        </div>
                    </div>
                )}

                <OrderListTable
                    orders={currentOrders}
                    selectedOrders={selectedOrders}
                    onSelectAll={handleSelectAll}
                    onSelectOne={handleSelectOne}
                    onView={(order) => navigate('orderDetail', order)}
                    onStatusChange={handleStatusUpdate}
                />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </Card>
    );
};

export default OrdersPage;
