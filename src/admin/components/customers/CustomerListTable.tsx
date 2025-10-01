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
        <div>
             {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {customers.map(customer => {
                    const isSelected = selectedCustomers.includes(customer.id);
                    return (
                        <div key={customer.id} className={`bg-white p-4 rounded-lg shadow-sm border ${isSelected ? 'border-admin-accent ring-1 ring-admin-accent' : 'border-gray-200/80'}`}>
                            <div className="flex items-start gap-4">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-admin-accent focus:ring-admin-accent/50 mt-1"
                                    checked={isSelected}
                                    onChange={() => onSelectOne(customer.id)}
                                />
                                <div className="flex-1" onClick={() => onView(customer)}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <img src={customer.avatar} alt={customer.name} className="w-10 h-10 object-cover rounded-full"/>
                                            <div>
                                                <p className="font-bold text-gray-800">{customer.name}</p>
                                                <p className="text-xs text-gray-500">{customer.email}</p>
                                            </div>
                                        </div>
                                         <button onClick={(e) => { e.stopPropagation(); onView(customer); }} className="font-semibold text-admin-accent text-sm">
                                            عرض
                                        </button>
                                    </div>
                                    <div className="mt-3 pt-3 border-t text-xs flex justify-around">
                                        <div className="text-center">
                                            <p className="text-gray-500">الطلبات</p>
                                            <p className="font-semibold">{customer.orderCount}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-500">إجمالي الإنفاق</p>
                                            <p className="font-semibold">{customer.totalSpent.toFixed(2)} ج.م</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
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
                                    checked={customers.length > 0 && selectedCustomers.length === customers.length}
                                />
                            </th>
                            <th className="p-4 font-semibold">العميل</th>
                            <th className="p-4 font-semibold">الطلبات</th>
                            <th className="p-4 font-semibold">إجمالي الإنفاق</th>
                            <th className="p-4 font-semibold"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/80">
                        {customers.map(customer => (
                            <tr key={customer.id} className={`hover:bg-gray-50 ${selectedCustomers.includes(customer.id) ? 'bg-admin-accent/5' : ''}`}>
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-admin-accent focus:ring-admin-accent/50"
                                        checked={selectedCustomers.includes(customer.id)}
                                        onChange={() => onSelectOne(customer.id)}
                                    />
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={customer.avatar} alt={customer.name} className="w-10 h-10 object-cover rounded-full"/>
                                        <div>
                                            <span className="font-semibold text-gray-800">{customer.name}</span>
                                            <p className="text-xs text-gray-500">{customer.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-center">{customer.orderCount}</td>
                                <td className="p-4 font-semibold">{customer.totalSpent.toFixed(2)} ج.م</td>
                                <td className="p-4 text-left">
                                    <button onClick={() => onView(customer)} className="font-semibold text-admin-accent hover:underline">
                                        عرض
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};