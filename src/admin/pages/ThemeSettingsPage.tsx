
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { AdminAnnouncement, HeroSlide } from '../../types';
import { PlusIcon, TrashIcon, PencilIcon } from '../../components/icons';
import AnnouncementModal from '../components/modals/AnnouncementModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import HeroSlideModal from '../components/modals/HeroSlideModal';

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

const HeroSlideList: React.FC<{
    slides: HeroSlide[];
    onEdit: (slide: HeroSlide) => void;
    onDelete: (slide: HeroSlide) => void;
}> = ({ slides, onEdit, onDelete }) => {
    const getStatusClasses = (status: HeroSlide['status']) => {
        return status === 'Visible' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-3">
            {slides.map(slide => (
                <div key={slide.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border">
                    <img src={slide.bgImage} alt={slide.title} className="w-20 h-16 object-cover rounded-md flex-shrink-0" />
                    <div className="flex-1">
                        <p className="font-bold">{slide.title}</p>
                        <p className="text-xs text-gray-500">{slide.subtitle}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusClasses(slide.status)}`}>
                        {slide.status === 'Visible' ? 'مرئي' : 'مخفي'}
                    </span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(slide)} className="text-gray-400 hover:text-admin-accent p-1"><PencilIcon size="sm" /></button>
                        <button onClick={() => onDelete(slide)} className="text-gray-400 hover:text-red-500 p-1"><TrashIcon size="sm" /></button>
                    </div>
                </div>
            ))}
             {slides.length === 0 && (
                <p className="text-center text-gray-500 py-4">لا توجد شرائح حاليًا.</p>
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
    
    const [editingHeroSlide, setEditingHeroSlide] = useState<HeroSlide | null>(null);
    const [showHeroSlideModal, setShowHeroSlideModal] = useState(false);
    const [heroSlideToDelete, setHeroSlideToDelete] = useState<HeroSlide | null>(null);

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
    
    const handleSaveHeroSlide = (slide: HeroSlide) => {
        if (slide.id && slide.id !== 0) { // Edit
            setHeroSlides(prev => prev.map(s => s.id === slide.id ? slide : s));
        } else { // Add
            setHeroSlides(prev => [...prev, { ...slide, id: Date.now() }]);
        }
        setShowHeroSlideModal(false);
        setEditingHeroSlide(null);
    };

    const handleDeleteHeroSlide = () => {
        if (!heroSlideToDelete) return;
        setHeroSlides(prev => prev.filter(s => s.id !== heroSlideToDelete.id));
        setHeroSlideToDelete(null);
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
             <HeroSlideModal 
                isOpen={showHeroSlideModal}
                onClose={() => {
                    setShowHeroSlideModal(false);
                    setEditingHeroSlide(null);
                }}
                onSave={handleSaveHeroSlide}
                slide={editingHeroSlide}
            />
             <ConfirmDeleteModal 
                isOpen={!!heroSlideToDelete}
                onClose={() => setHeroSlideToDelete(null)}
                onConfirm={handleDeleteHeroSlide}
                title="حذف الشريحة"
                itemName={heroSlideToDelete?.title || ''}
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

            <Card 
                title="قسم الهيرو (Hero Section)"
                actions={
                    <button 
                        onClick={() => { setEditingHeroSlide(null); setShowHeroSlideModal(true); }} 
                        className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-admin-accentHover transition-colors"
                    >
                        <PlusIcon />
                        <span>إضافة شريحة</span>
                    </button>
                }
            >
                 <p className="text-gray-500 text-sm mb-4">إدارة الشرائح في قسم الهيرو بالصفحة الرئيسية.</p>
                 <HeroSlideList 
                    slides={heroSlides}
                    onEdit={(slide) => { setEditingHeroSlide(slide); setShowHeroSlideModal(true); }}
                    onDelete={(slide) => setHeroSlideToDelete(slide)}
                 />
            </Card>

            <Card title="ألوان العلامة التجارية">
                 <p className="text-gray-500 text-sm">تخصيص الألوان الأساسية للمتجر (قيد الإنشاء).</p>
            </Card>
        </div>
    );
};

export default ThemeSettingsPage;