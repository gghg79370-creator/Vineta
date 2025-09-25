import React from 'react';
import { AdminOrder } from '../../data/adminData';

interface OrderListTableProps {
    orders: AdminOrder[];
    onView: (order: AdminOrder) => void;
}

export const OrderListTable: React.FC<OrderListTableProps> = ({ orders, onView }) => {
    const statusClasses: { [key: string]: string } = {
        'Delivered': 'bg-green-100 text-green-700',
        'On the way': 'bg-yellow-100 text-yellow-700',
        'Cancelled': 'bg-red-100 text-red-700',
    };
    const statusTranslations: { [key: string]: string } = { 'Delivered': 'تم التوصيل', 'On the way': 'قيد التوصيل', 'Cancelled': 'تم الإلغاء' };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="p-3 font-semibold">رقم الطلب</th>
                        <th className="p-3 font-semibold">التاريخ</th>
                        <th className="p-3 font-semibold">العميل</th>
                        <th className="p-3 font-semibold">الإجمالي</th>
                        <th className="p-3 font-semibold">الحالة</th>
                        <th className="p-3 font-semibold">العناصر</th>
                        <th className="p-3 font-semibold">إجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                            <td className="p-3 font-semibold text-primary-600">{order.id}</td>
                            <td className="p-3 text-gray-500">{order.date}</td>
                            <td className="p-3 font-semibold">{order.customer.name}</td>
                            <td className="p-3">{order.total} ج.م</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusClasses[order.status]}`}>
                                    {statusTranslations[order.status]}
                                </span>
                            </td>
                            <td className="p-3 text-gray-500">{order.itemCount}</td>
                            <td className="p-3">
                                <button onClick={() => onView(order)} className="font-semibold text-primary-600 hover:underline">
                                    عرض
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};