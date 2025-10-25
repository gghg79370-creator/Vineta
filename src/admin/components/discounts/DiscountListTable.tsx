
import React from 'react';
import { AdminDiscount } from '../../data/adminData';
import { PencilIcon, TrashIcon } from '../../../components/icons';

interface DiscountListTableProps {
    discounts: AdminDiscount[];
    onEdit: (discount: AdminDiscount) => void;
    onDelete: (discount: AdminDiscount) => void;
}

const DiscountListTable: React.FC<DiscountListTableProps> = ({ discounts, onEdit, onDelete }) => {
    
    const getStatusClasses = (status: AdminDiscount['status']) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Inactive': return 'bg-gray-100 text-gray-700';
            case 'Expired': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    
    const statusTranslations: { [key: string]: string } = { 'Active': 'نشط', 'Inactive': 'غير نشط', 'Expired': 'منتهي الصلاحية' };
    const typeTranslations: { [key: string]: string } = { 'Percentage': 'نسبة مئوية', 'Fixed Amount': 'مبلغ ثابت' };


    return (
        <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm text-right">
                <thead className="bg-admin-bg text-admin-text-secondary">
                    <tr>
                        <th className="px-5 py-3 font-semibold">الكود</th>
                        <th className="px-5 py-3 font-semibold">النوع</th>
                        <th className="px-5 py-3 font-semibold">القيمة</th>
                        <th className="px-5 py-3 font-semibold">الحالة</th>
                        <th className="px-5 py-3 font-semibold">الاستخدام</th>
                        <th className="px-5 py-3 font-semibold"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                    {discounts.map(discount => (
                        <tr key={discount.id} className="hover:bg-admin-bg">
                            <td className="px-5 py-4 font-semibold text-admin-accent">{discount.code}</td>
                            <td className="px-5 py-4 text-admin-text-secondary">{typeTranslations[discount.type]}</td>
                            <td className="px-5 py-4 font-semibold">
                                {discount.type === 'Percentage' ? `${discount.value}%` : `${discount.value.toFixed(2)} ج.م`}
                            </td>
                            <td className="px-5 py-4">
                                 <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusClasses(discount.status)}`}>
                                    {statusTranslations[discount.status]}
                                </span>
                            </td>
                            <td className="px-5 py-4 text-admin-text-secondary">
                                {discount.usageCount} {discount.usageLimit ? `/ ${discount.usageLimit}` : ''}
                            </td>
                            <td className="px-5 py-4 text-left">
                                <div className="flex items-center gap-2 justify-end">
                                    <button onClick={() => onEdit(discount)} className="text-admin-text-secondary hover:text-admin-accent p-1"><PencilIcon size="sm"/></button>
                                    <button onClick={() => onDelete(discount)} className="text-admin-text-secondary hover:text-red-500 p-1"><TrashIcon size="sm"/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DiscountListTable;
