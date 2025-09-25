import React from 'react';
import { AdminCategory } from '../../data/adminData';
import { PencilIcon, TrashIcon } from '../../../components/icons';

interface CategoryListTableProps {
    categories: (AdminCategory & { productCount: number, depth: number })[];
    onEdit: (category: AdminCategory) => void;
    onDelete: (category: AdminCategory) => void;
}

const CategoryListTable: React.FC<CategoryListTableProps> = ({ categories, onEdit, onDelete }) => {

    const getStatusClasses = (status: string) => {
        return status === 'Visible' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="p-3 font-semibold" title="اسم الفئة. الفئات المتداخلة تظهر بمسافة بادئة.">اسم الفئة</th>
                        <th className="p-3 font-semibold" title="إجمالي عدد المنتجات المرتبطة مباشرة بهذه الفئة.">عدد المنتجات</th>
                        <th className="p-3 font-semibold" title="حالة الفئة: 'مرئي' يعني أنها تظهر للعملاء، و 'مخفي' يعني أنها مخفية.">الحالة</th>
                        <th className="p-3 font-semibold" title="إجراءات سريعة مثل التعديل أو الحذف.">إجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {categories.map(category => (
                        <tr key={category.id} className="hover:bg-gray-50">
                            <td className="p-3">
                                <div className="flex items-center gap-3">
                                    <span style={{ marginRight: `${category.depth * 2}rem` }}>
                                       {category.depth > 0 && '— '} {category.name}
                                    </span>
                                </div>
                            </td>
                            <td className="p-3 text-gray-500">{category.productCount}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusClasses(category.status)}`}>
                                    {category.status === 'Visible' ? 'مرئي' : 'مخفي'}
                                </span>
                            </td>
                            <td className="p-3">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onEdit(category)} className="text-gray-400 hover:text-primary-600 p-1"><PencilIcon size="sm"/></button>
                                    <button onClick={() => onDelete(category)} className="text-gray-400 hover:text-red-500 p-1"><TrashIcon size="sm"/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryListTable;