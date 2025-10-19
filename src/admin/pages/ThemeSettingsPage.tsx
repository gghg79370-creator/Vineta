import React, { useState } from 'react';
import { HeroSlide, AdminAnnouncement } from '../../types';
import { Card } from '../components/ui/Card';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '../../components/icons';
import HeroSlideModal from '../components/modals/HeroSlideModal';
import AnnouncementModal from '../components/modals/AnnouncementModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { useToast } from '../../hooks/useToast';

interface ThemeSettingsPageProps {
    heroSlides: HeroSlide[];
    setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>>;
    announcements: AdminAnnouncement[];
    onAnnouncementsUpdate: React.Dispatch<React.SetStateAction<AdminAnnouncement[]>>;
}

const ThemeSettingsPage: React.FC<ThemeSettingsPageProps> = ({ heroSlides, setHeroSlides, announcements, onAnnouncementsUpdate }) => {
    // Hero Slide State
    const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
    const [slideToEdit, setSlideToEdit] = useState<HeroSlide | null>(null);
    const [slideToDelete, setSlideToDelete] = useState<HeroSlide | null>(null);

    // Announcement State
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [announcementToEdit, setAnnouncementToEdit] = useState<AdminAnnouncement | null>(null);
    const [announcementToDelete, setAnnouncementToDelete] = useState<AdminAnnouncement | null>(null);

    const addToast = useToast();
    
    // Hero Slide Handlers
    const handleAddHeroSlide = () => {
        setSlideToEdit(null);
        setIsHeroModalOpen(true);
    };

    const handleEditHeroSlide = (slide: HeroSlide) => {
        setSlideToEdit(slide);
        setIsHeroModalOpen(true);
    };

    const handleSaveHeroSlide = (slide: HeroSlide) => {
        if (slide.id === 0) { // New slide
            setHeroSlides(prev => [...prev, { ...slide, id: Date.now() }]);
            addToast('تمت إضافة الشريحة بنجاح!', 'success');
        } else { // Edit slide
            setHeroSlides(prev => prev.map(s => s.id === slide.id ? slide : s));
            addToast('تم حفظ الشريحة بنجاح!', 'success');
        }
        setIsHeroModalOpen(false);
    };

    const handleDeleteHeroSlide = (slide: HeroSlide) => {
        setSlideToDelete(slide);
    };
    
    const confirmDeleteHeroSlide = () => {
        if (slideToDelete) {
            setHeroSlides(prev => prev.filter(s => s.id !== slideToDelete.id));
            addToast('تم حذف الشريحة.', 'success');
            setSlideToDelete(null);
        }
    };
    
    // Announcement Handlers
    const handleAddAnnouncement = () => {
        setAnnouncementToEdit(null);
        setIsAnnouncementModalOpen(true);
    };

    const handleEditAnnouncement = (announcement: AdminAnnouncement) => {
        setAnnouncementToEdit(announcement);
        setIsAnnouncementModalOpen(true);
    };
    
    const handleSaveAnnouncement = (announcement: AdminAnnouncement) => {
        if (announcement.id === 0) {
            onAnnouncementsUpdate(prev => [...prev, { ...announcement, id: Date.now() }]);
            addToast('تمت إضافة الإعلان بنجاح!', 'success');
        } else {
            onAnnouncementsUpdate(prev => prev.map(a => a.id === announcement.id ? announcement : a));
            addToast('تم حفظ الإعلان بنجاح!', 'success');
        }
        setIsAnnouncementModalOpen(false);
    };
    
    const handleDeleteAnnouncement = (announcement: AdminAnnouncement) => {
        setAnnouncementToDelete(announcement);
    };
    
    const confirmDeleteAnnouncement = () => {
        if (announcementToDelete) {
            onAnnouncementsUpdate(prev => prev.filter(a => a.id !== announcementToDelete.id));
            addToast('تم حذف الإعلان.', 'success');
            setAnnouncementToDelete(null);
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-admin-text-primary">تخصيص الصفحة الرئيسية</h1>
            </div>
            
            <Card title="شرائح العرض الرئيسية (Hero Slides)">
                <div className="flex justify-end mb-4">
                    <button onClick={handleAddHeroSlide} className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-admin-accentHover">
                        <PlusIcon />
                        <span>إضافة شريحة</span>
                    </button>
                </div>
                <div className="space-y-3">
                    {heroSlides.map(slide => (
                        <div key={slide.id} className="bg-admin-bg p-3 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src={slide.bgImage} alt={slide.title} className="w-24 h-14 object-cover rounded-md"/>
                                <div>
                                    <p className="font-bold">{slide.title}</p>
                                    <p className="text-xs text-admin-text-secondary">{slide.subtitle}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {slide.status === 'Visible' ? <EyeIcon className="text-green-500"/> : <EyeSlashIcon className="text-gray-400"/>}
                                <button onClick={() => handleEditHeroSlide(slide)} className="text-admin-text-secondary hover:text-admin-accent"><PencilIcon/></button>
                                <button onClick={() => handleDeleteHeroSlide(slide)} className="text-admin-text-secondary hover:text-red-500"><TrashIcon/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="شريط الإعلانات العلوي">
                <div className="flex justify-end mb-4">
                    <button onClick={handleAddAnnouncement} className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-admin-accentHover">
                        <PlusIcon />
                        <span>إضافة إعلان</span>
                    </button>
                </div>
                <div className="space-y-2">
                     {announcements.map(ann => (
                        <div key={ann.id} className="bg-admin-bg p-3 rounded-lg flex items-center justify-between">
                            <p className="font-semibold">{ann.content}</p>
                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${ann.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {ann.status === 'Active' ? 'نشط' : 'غير نشط'}
                                </span>
                                <button onClick={() => handleEditAnnouncement(ann)} className="text-admin-text-secondary hover:text-admin-accent"><PencilIcon/></button>
                                <button onClick={() => handleDeleteAnnouncement(ann)} className="text-admin-text-secondary hover:text-red-500"><TrashIcon/></button>
                            </div>
                        </div>
                     ))}
                </div>
            </Card>

            {/* Modals */}
            <HeroSlideModal isOpen={isHeroModalOpen} onClose={() => setIsHeroModalOpen(false)} onSave={handleSaveHeroSlide} slide={slideToEdit} />
            <AnnouncementModal isOpen={isAnnouncementModalOpen} onClose={() => setIsAnnouncementModalOpen(false)} onSave={handleSaveAnnouncement} announcementToEdit={announcementToEdit} />
            <ConfirmDeleteModal isOpen={!!slideToDelete} onClose={() => setSlideToDelete(null)} onConfirm={confirmDeleteHeroSlide} title="حذف الشريحة" itemName={slideToDelete?.title || ''} />
            <ConfirmDeleteModal isOpen={!!announcementToDelete} onClose={() => setAnnouncementToDelete(null)} onConfirm={confirmDeleteAnnouncement} title="حذف الإعلان" itemName={announcementToDelete?.content || ''} />
        </div>
    );
};

export default ThemeSettingsPage;