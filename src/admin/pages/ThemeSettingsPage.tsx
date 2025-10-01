import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { AdminAnnouncement, HeroSlide } from '../../types';
import { PlusIcon, TrashIcon, PencilIcon } from '../../components/icons';
import AnnouncementModal from '../components/modals/AnnouncementModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';

// Simplified list component for announcements within this page
const AnnouncementList: React.FC<{ 
    announcements: AdminAnnouncement[], 
    onEdit: (announcement: AdminAnnouncement) => void, 
    onDelete: (announcement: AdminAnnouncement) => void 
}> = ({ announcements, onEdit, onDelete }) => {
    const getStatusClasses = (status: AdminAnnouncement['status']) => {
        return status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    };
    
    return (
        <div className="space-y-2">
            {announcements.map(announcement => (
                <div key={announcement.id} className="flex items-center gap-4 p-2 rounded-lg bg-gray-50 border">
                    <div className="flex-1">
                        <p className="font-semibold">{announcement.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span className={`px-2 py-0.5 rounded-full font-bold ${getStatusClasses(announcement.status)}`}>
                                {announcement.status === 'Active' ? 'نشط' : 'غير نشط'}
                            </span>
                            <span>يبدأ: {new Date(announcement.startDate).toLocaleDateString('ar-EG')}</span>
                            {announcement.endDate && <span>ينتهي: {new Date(announcement.endDate).toLocaleDateString('ar-EG')}</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(announcement)} className="text-gray-400 hover:text-admin-accent p-1"><PencilIcon size="sm"/></button>
                        <button onClick={() => onDelete(announcement)} className="text-gray-400 hover:text-red-500 p-1"><TrashIcon size="sm"/></button>
                    </div>
                </div>
            ))}
             {announcements.length === 0 && (
                <p className="text-center text-gray-500 py-4">لا توجد إعلانات حاليًا.</p>
            )}
        </div>
    );
};


interface ThemeSettingsPageProps {
    heroSlides: HeroSlide[];
    setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>>;
    announcements: AdminAnnouncement[];
    onAnnouncementsUpdate: (announcements: AdminAnnouncement[]) => void;
}

const ThemeSettingsPage: React.FC<ThemeSettingsPageProps> = ({ heroSlides, setHeroSlides, announcements, onAnnouncementsUpdate }) => {
    const [editingAnnouncement, setEditingAnnouncement] = useState<AdminAnnouncement | null>(null);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState<AdminAnnouncement | null>(null);

    const handleSaveAnnouncement = (announcement: AdminAnnouncement) => {
        let updatedAnnouncements;
        if (announcement.id && announcement.id !== 0) { // Existing announcement
            updatedAnnouncements = announcements.map(a => a.id === announcement.id ? announcement : a);
        } else { // New announcement
            updatedAnnouncements = [...announcements, { ...announcement, id: Date.now() }];
        }
        onAnnouncementsUpdate(updatedAnnouncements);
        setShowAnnouncementModal(false);
        setEditingAnnouncement(null);
    };

    const handleDeleteAnnouncement = () => {
        if (!announcementToDelete) return;
        const updatedAnnouncements = announcements.filter(a => a.id !== announcementToDelete.id);
        onAnnouncementsUpdate(updatedAnnouncements);
        setAnnouncementToDelete(null);
    };

    return (
        <div className="space-y-6">
            <AnnouncementModal 
                isOpen={showAnnouncementModal}
                onClose={() => {
                    setShowAnnouncementModal(false);
                    setEditingAnnouncement(null);
                }}
                onSave={handleSaveAnnouncement}
                announcementToEdit={editingAnnouncement}
            />
            <ConfirmDeleteModal 
                isOpen={!!announcementToDelete}
                onClose={() => setAnnouncementToDelete(null)}
                onConfirm={handleDeleteAnnouncement}
                title="حذف الإعلان"
                itemName={announcementToDelete?.content || ''}
            />

            <Card 
                title="شريط الإعلانات"
                actions={
                    <button 
                        onClick={() => { setEditingAnnouncement(null); setShowAnnouncementModal(true); }} 
                        className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-admin-accentHover transition-colors"
                    >
                        <PlusIcon />
                        <span>إضافة إعلان</span>
                    </button>
                }
            >
                <p className="text-gray-500 text-sm mb-4">إدارة شريط الإعلانات الذي يظهر في أعلى الموقع.</p>
                <AnnouncementList 
                    announcements={announcements} 
                    onEdit={(ann) => {
                        setEditingAnnouncement(ann); 
                        setShowAnnouncementModal(true);
                    }}
                    onDelete={(ann) => setAnnouncementToDelete(ann)}
                />
            </Card>

            <Card title="ألوان العلامة التجارية">
                 <p className="text-gray-500 text-sm">تخصيص الألوان الأساسية للمتجر (قيد الإنشاء).</p>
            </Card>
             <Card title="قسم الهيرو">
                 <p className="text-gray-500 text-sm">إدارة الشرائح في قسم الهيرو بالصفحة الرئيسية (قيد الإنشاء).</p>
            </Card>

        </div>
    );
};

export default ThemeSettingsPage;