import React from 'react';
import { AdminCustomer } from '../../data/adminData';

interface CustomerListTableProps {
    customers: AdminCustomer[];
    selectedCustomers: number[];
    onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectOne: (customerId: number) => void;
    onView: (customer: AdminCustomer) => void;
}

export const CustomerListTable: React.FC<CustomerListTableProps> = ({ customers, selectedCustomers, onSelectAll, onSelectOne, onView }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="p-3 w-4">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                onChange={onSelectAll}
                                checked={customers.length > 0 && selectedCustomers.length === customers.length}
                            />
                        </th>
                        <th className="p-3 font-semibold">العميل</th>
                        <th className="p-3 font-semibold">البريد الإلكتروني</th>
                        <th className="p-3 font-semibold">الهاتف</th>
                        <th className="p-3 font-semibold">الطلبات</th>
                        <th className="p-3 font-semibold">إجمالي الإنفاق</th>
                        <th className="p-3 font-semibold">إجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {customers.map(customer => (
                        <tr key={customer.id} className={`hover:bg-gray-50 ${selectedCustomers.includes(customer.id) ? 'bg-primary-50' : ''}`}>
                             <td className="p-3">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    checked={selectedCustomers.includes(customer.id)}
                                    onChange={() => onSelectOne(customer.id)}
                                />
                            </td>
                            <td className="p-3">
                                <div className="flex items-center gap-3">
                                    <img src={customer.avatar} alt={customer.name} className="w-10 h-10 object-cover rounded-full"/>
                                    <span className="font-semibold text-gray-800">{customer.name}</span>
                                </div>
                            </td>
                            <td className="p-3 text-gray-500">{customer.email}</td>
                             <td className="p-3 text-gray-500">{customer.phone}</td>
                            <td className="p-3 text-center">{customer.orderCount}</td>
                            <td className="p-3 font-semibold">{customer.totalSpent.toFixed(2)} ج.م</td>
                            <td className="p-3">
                                <button onClick={() => onView(customer)} className="font-semibold text-primary-600 hover:underline">
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
