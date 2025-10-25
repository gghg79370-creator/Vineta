
import React from 'react';
import { AdminPage } from '../../data/adminData';
import { PencilIcon, TrashIcon } from '../../../components/icons';

interface PageListTableProps {
    pages: AdminPage[];
    onEdit: (page: AdminPage) => void;
    onDelete: (page: AdminPage) => void;
}

const PageListTable: React.FC<PageListTableProps> = ({ pages, onEdit, onDelete }) => {
    const getStatusClasses = (status: string) => {
        return status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm text-right">
                <thead className="bg-admin-bg text-admin-text-secondary">
                    <tr>
                        <th className="px-5 py-3 font-semibold">العنوان</th>
                        <th className="px-5 py-3 font-semibold">الرابط</th>
                        <th className="px-5 py-3 font-semibold">الحالة</th>
                        <th className="px-5 py-3 font-semibold">آخر تعديل</th>
                        <th className="px-5 py-3 font-semibold"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                    {pages.map(page => (
                        <tr key={page.id} className="hover:bg-admin-bg">
                            <td className="px-5 py-4 font-semibold text-admin-text-primary">{page.title}</td>
                            <td className="px-5 py-4 text-admin-text-secondary">/{page.slug}</td>
                            <td className="px-5 py-4">
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${getStatusClasses(page.status)}`}>
                                    {page.status === 'Published' ? 'منشورة' : 'مخفية'}
                                </span>
                            </td>
                            <td className="px-5 py-4 text-admin-text-secondary">{page.lastModified}</td>
                            <td className="px-5 py-4 text-left">
                                <div className="flex items-center gap-2 justify-end">
                                    <button onClick={() => onEdit(page)} className="text-admin-text-secondary hover:text-admin-accent p-1"><PencilIcon size="sm"/></button>
                                    <button onClick={() => onDelete(page)} className="text-admin-text-secondary hover:text-red-500 p-1"><TrashIcon size="sm"/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PageListTable;
