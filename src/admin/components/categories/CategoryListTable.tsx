import React from 'react';
import { AdminCategory } from '../../data/adminData';
import { PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '../../../components/icons';

interface CategoryListTableProps {
    categories: (AdminCategory & { productCount: number, depth: number })[];
    onEdit: (category: AdminCategory) => void;
    onDelete: (category: AdminCategory) => void;
    editingCategory: { id: number; name: string } | null;
    setEditingCategory: (value: { id: number; name: string } | null) => void;
    onSave: (id: number) => void;
}

const CategoryListTable: React.FC<CategoryListTableProps> = ({ categories, onEdit, onDelete, editingCategory, setEditingCategory, onSave }) => {

    const getStatusClasses = (status: string) => {
        return status === 'Visible' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="px-5 py-3 font-semibold" title="اسم الفئة. الفئات المتداخلة تظهر بمسافة بادئة.">اسم الفئة</th>
                        <th className="px-5 py-3 font-semibold" title="إجمالي عدد المنتجات المرتبطة مباشرة بهذه الفئة.">عدد المنتجات</th>
                        <th className="px-5 py-3 font-semibold" title="حالة الفئة: 'مرئي' يعني أنها تظهر للعملاء، و 'مخفي' يعني أنها مخفية.">الحالة</th>
                        <th className="px-5 py-3 font-semibold" title="إجراءات سريعة مثل التعديل أو الحذف."></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                    {categories.map(category => (
                        <tr key={category.id} className="hover:bg-gray-50">
                            <td className="px-5 py-3">
                                {editingCategory?.id === category.id ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editingCategory.name}
                                            onChange={(e) => setEditingCategory({ id: category.id, name: e.target.value })}
                                            className="admin-form-input p-1"
                                            autoFocus
                                            onKeyDown={(e) => e.key === 'Enter' && onSave(category.id)}
                                        />
                                        <button onClick={() => onSave(category.id)} className="text-green-500 p-1 hover:bg-green-100 rounded-full"><CheckCircleIcon size="sm"/></button>
                                        <button onClick={() => setEditingCategory(null)} className="text-red-500 p-1 hover:bg-red-100 rounded-full"><XCircleIcon size="sm"/></button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <span style={{ marginRight: `${category.depth * 1.5}rem` }} className="font-semibold text-gray-800">
                                           {category.depth > 0 && <span className="text-gray-400 mr-2">↳</span>} {category.name}
                                        </span>
                                    </div>
                                )}
                            </td>
                            <td className="px-5 py-3 text-gray-500">{category.productCount}</td>
                            <td className="px-5 py-3">
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${getStatusClasses(category.status)}`}>
                                    {category.status === 'Visible' ? 'مرئي' : 'مخفي'}
                                </span>
                            </td>
                            <td className="px-5 py-3 text-left">
                                <div className="flex items-center gap-2 justify-end">
                                    <button onClick={() => setEditingCategory({id: category.id, name: category.name})} className="text-gray-400 hover:text-admin-accent p-1"><PencilIcon size="sm"/></button>
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