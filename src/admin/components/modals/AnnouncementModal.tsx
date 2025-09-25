import React, { useState, useEffect } from 'react';
import { AdminAnnouncement } from '../../data/adminData';

interface AnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (announcement: AdminAnnouncement) => void;
    announcementToEdit: AdminAnnouncement | null;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ isOpen, onClose, onSave, announcementToEdit }) => {
    const [announcement, setAnnouncement] = useState<Partial<AdminAnnouncement>>({});

    useEffect(() => {
        if (announcementToEdit) {
            setAnnouncement(announcementToEdit);
        } else {
            setAnnouncement({
                id: 0,
                content: '',
                status: 'Inactive',
                startDate: new Date().toISOString().split('T')[0],
                endDate: null
            });
        }
    }, [announcementToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // @ts-ignore
        const isChecked = e.target.checked;
        if (type === 'checkbox') {
            setAnnouncement(prev => ({...prev, [name]: isChecked ? 'Active' : 'Inactive' }));
        } else {
            setAnnouncement(prev => ({...prev, [name]: value }));
        }
    };
    
    const handleSave = () => {
        onSave(announcement as AdminAnnouncement);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold">{announcement?.id ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}</h3>
                     <button onClick={onClose}>&times;</button>
                </div>
                <div className="p-4 space-y-4">
                     <div>
                        <label className="text-sm font-medium">المحتوى</label>
                        <input type="text" name="content" placeholder="محتوى الإعلان" value={announcement.content || ''} onChange={handleChange} className="w-full border-gray-300 rounded-lg mt-1"/>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-sm font-medium">تاريخ البدء</label>
                            <input type="date" name="startDate" value={announcement.startDate || ''} onChange={handleChange} className="w-full border-gray-300 rounded-lg mt-1"/>
                         </div>
                         <div>
                            <label className="text-sm font-medium">تاريخ الانتهاء (اختياري)</label>
                            <input type="date" name="endDate" value={announcement.endDate || ''} onChange={handleChange} className="w-full border-gray-300 rounded-lg mt-1"/>
                         </div>
                     </div>
                     <label className="flex items-center gap-2 pt-2">
                        <input type="checkbox" name="status" checked={announcement.status === 'Active'} onChange={handleChange} className="rounded text-primary-600 focus:ring-primary-500" />
                        تفعيل الإعلان
                     </label>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="bg-white border border-gray-300 px-4 py-2 rounded-lg font-semibold">إلغاء</button>
                    <button onClick={handleSave} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold">حفظ</button>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementModal;
