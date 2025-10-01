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
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="p-4 font-semibold">الكود</th>
                        <th className="p-4 font-semibold">النوع</th>
                        <th className="p-4 font-semibold">القيمة</th>
                        <th className="p-4 font-semibold">الحالة</th>
                        <th className="p-4 font-semibold">الاستخدام</th>
                        <th className="p-4 font-semibold"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/80">
                    {discounts.map(discount => (
                        <tr key={discount.id} className="hover:bg-gray-50">
                            <td className="p-4 font-semibold text-admin-accent">{discount.code}</td>
                            <td className="p-4 text-gray-500">{typeTranslations[discount.type]}</td>
                            <td className="p-4 font-semibold">
                                {discount.type === 'Percentage' ? `${discount.value}%` : `${discount.value.toFixed(2)} ج.م`}
                            </td>
                            <td className="p-4">
                                 <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusClasses(discount.status)}`}>
                                    {statusTranslations[discount.status]}
                                </span>
                            </td>
                            <td className="p-4 text-gray-500">
                                {discount.usageCount} {discount.usageLimit ? `/ ${discount.usageLimit}` : ''}
                            </td>
                            <td className="p-4 text-left">
                                <div className="flex items-center gap-2 justify-end">
                                    <button onClick={() => onEdit(discount)} className="text-gray-400 hover:text-admin-accent p-1"><PencilIcon size="sm"/></button>
                                    <button onClick={() => onDelete(discount)} className="text-gray-400 hover:text-red-500 p-1"><TrashIcon size="sm"/></button>
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