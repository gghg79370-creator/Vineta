import React from 'react';
import { AdminAnnouncement } from '../../data/adminData';
import { PencilIcon, TrashIcon } from '../../../components/icons';

interface AnnouncementListTableProps {
    announcements: AdminAnnouncement[];
    onEdit: (announcement: AdminAnnouncement) => void;
    onDelete: (announcement: AdminAnnouncement) => void;
}

const AnnouncementListTable: React.FC<AnnouncementListTableProps> = ({ announcements, onEdit, onDelete }) => {
    
    const getStatusClasses = (status: AdminAnnouncement['status']) => {
        return status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    };
    
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="p-3 font-semibold">المحتوى</th>
                        <th className="p-3 font-semibold">الحالة</th>
                        <th className="p-3 font-semibold">تاريخ البدء</th>
                        <th className="p-3 font-semibold">تاريخ الانتهاء</th>
                        <th className="p-3 font-semibold">إجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {announcements.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-800">{item.content}</td>
                            <td className="p-3">
                                 <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusClasses(item.status)}`}>
                                    {item.status === 'Active' ? 'نشط' : 'غير نشط'}
                                </span>
                            </td>
                            <td className="p-3 text-gray-500">{item.startDate}</td>
                             <td className="p-3 text-gray-500">{item.endDate || 'لا يوجد'}</td>
                            <td className="p-3">
                                 <div className="flex items-center gap-2">
                                    <button onClick={() => onEdit(item)} className="text-gray-400 hover:text-primary-600 p-1"><PencilIcon size="sm"/></button>
                                    <button onClick={() => onDelete(item)} className="text-gray-400 hover:text-red-500 p-1"><TrashIcon size="sm"/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AnnouncementListTable;
