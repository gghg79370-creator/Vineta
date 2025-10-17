

import React from 'react';
import { AdminOrder } from '../../data/adminData';

interface OrderListTableProps {
    orders: AdminOrder[];
    selectedOrders: string[];
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectOne: (orderId: string) => void;
    onView: (order: AdminOrder) => void;
    onStatusChange: (orderId: string, newStatus: AdminOrder['status']) => void;
}

export const OrderListTable: React.FC<OrderListTableProps> = ({ orders, selectedOrders, onSelectAll, onSelectOne, onView, onStatusChange }) => {
    const statusClasses: { [key: string]: string } = {
        'Delivered': 'bg-green-100 text-green-800',
        'On the way': 'bg-amber-100 text-amber-800',
        'Cancelled': 'bg-red-100 text-red-800',
    };
    const statusTranslations: { [key: string]: string } = { 'Delivered': 'تم التوصيل', 'On the way': 'قيد التوصيل', 'Cancelled': 'تم الإلغاء' };

    return (
        <div>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {orders.map(order => (
                    <div key={order.id} className={`bg-white p-4 rounded-lg shadow-sm border ${selectedOrders.includes(order.id) ? 'border-admin-accent ring-1 ring-admin-accent' : 'border-gray-200/80'}`}>
                         <div className="flex items-start gap-4">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-admin-accent focus:ring-admin-accent/50 mt-1"
                                checked={selectedOrders.includes(order.id)}
                                onChange={() => onSelectOne(order.id)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex-1" onClick={() => onView(order)}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-bold text-admin-accent">{order.id}</p>
                                        <p className="text-xs text-gray-500">{order.date}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${statusClasses[order.status]}`}>
                                        {statusTranslations[order.status]}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold">{order.customer.name}</p>
                                    <p className="font-bold">{order.total} ج.م</p>
                                </div>
                            </div>
                         </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto -mx-5">
                <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-4 w-4">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-admin-accent focus:ring-admin-accent/50"
                                    onChange={onSelectAll}
                                    checked={orders.length > 0 && selectedOrders.length === orders.length}
                                />
                            </th>
                            <th className="px-5 py-3 font-semibold">رقم الطلب</th>
                            <th className="px-5 py-3 font-semibold">التاريخ</th>
                            <th className="px-5 py-3 font-semibold">العميل</th>
                            <th className="px-5 py-3 font-semibold">الإجمالي</th>
                            <th className="px-5 py-3 font-semibold">الحالة</th>
                            <th className="px-5 py-3 font-semibold">العناصر</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/80">
                        {orders.map(order => (
                            <tr key={order.id} onClick={() => onView(order)} className={`hover:bg-gray-50 cursor-pointer ${selectedOrders.includes(order.id) ? 'bg-admin-accent/5' : ''}`}>
                                 <td className="p-4">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-admin-accent focus:ring-admin-accent/50"
                                        checked={selectedOrders.includes(order.id)}
                                        onChange={() => onSelectOne(order.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </td>
                                <td className="px-5 py-4 font-semibold text-admin-accent">{order.id}</td>
                                <td className="px-5 py-4 text-gray-500">{order.date}</td>
                                <td className="px-5 py-4 font-semibold">{order.customer.name}</td>
                                <td className="px-5 py-4">{order.total} ج.م</td>
                                <td className="px-5 py-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => onStatusChange(order.id, e.target.value as AdminOrder['status'])}
                                        onClick={(e) => e.stopPropagation()}
                                        className={`w-full text-right bg-transparent border-0 font-bold text-xs rounded-md focus:ring-2 focus:ring-admin-accent/50 p-1 appearance-none ${statusClasses[order.status]}`}
                                    >
                                        <option value="On the way">{statusTranslations['On the way']}</option>
                                        <option value="Delivered">{statusTranslations['Delivered']}</option>
                                        <option value="Cancelled">{statusTranslations['Cancelled']}</option>
                                    </select>
                                </td>
                                <td className="px-5 py-4 text-gray-500">{order.itemCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};