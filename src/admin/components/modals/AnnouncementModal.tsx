import React, { useState, useEffect } from 'react';
import { AdminAnnouncement } from '../../../types';

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
            setAnnouncement({
                ...announcementToEdit,
                startDate: announcementToEdit.startDate ? new Date(announcementToEdit.startDate).toISOString().split('T')[0] : '',
                endDate: announcementToEdit.endDate ? new Date(announcementToEdit.endDate).toISOString().split('T')[0] : '',
            });
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
            setAnnouncement(prev => ({...prev, [name]: value === '' ? null : value }));
        }
    };
    
    const handleSave = () => {
        if(!announcement.content?.trim()) {
            alert('محتوى الإعلان لا يمكن أن يكون فارغًا.');
            return;
        }
        onSave(announcement as AdminAnnouncement);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-admin-card-bg rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-4 border-b border-admin-border flex justify-between items-center">
                    <h3 className="font-bold text-lg text-admin-text-primary">{announcement?.id && announcement.id !== 0 ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}</h3>
                     <button onClick={onClose} className="text-admin-text-secondary hover:text-admin-text-primary">&times;</button>
                </div>
                <div className="p-4 space-y-4">
                     <div>
                        <label className="admin-form-label">المحتوى *</label>
                        <input type="text" name="content" placeholder="محتوى الإعلان" value={announcement.content || ''} onChange={handleChange} className="admin-form-input"/>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="admin-form-label">تاريخ البدء</label>
                            <input type="date" name="startDate" value={announcement.startDate || ''} onChange={handleChange} className="admin-form-input"/>
                         </div>
                         <div>
                            <label className="admin-form-label">تاريخ الانتهاء (اختياري)</label>
                            <input type="date" name="endDate" value={announcement.endDate || ''} onChange={handleChange} className="admin-form-input"/>
                         </div>
                     </div>
                     <label className="flex items-center gap-2 pt-2 cursor-pointer">
                        <input type="checkbox" name="status" checked={announcement.status === 'Active'} onChange={handleChange} className="w-4 h-4 rounded text-admin-accent focus:ring-admin-accent/50" />
                        <span className="font-semibold text-sm">تفعيل الإعلان</span>
                     </label>
                </div>
                <div className="p-4 bg-admin-bg flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="bg-admin-card-bg border border-admin-border px-4 py-2 rounded-lg font-semibold hover:bg-admin-bg">إلغاء</button>
                    <button onClick={handleSave} className="bg-admin-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-admin-accentHover">حفظ</button>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementModal;