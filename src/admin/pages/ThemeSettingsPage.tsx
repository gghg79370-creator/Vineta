

import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { AdminAnnouncement } from '../data/adminData';
import { PlusIcon, TrashIcon, PencilIcon, Bars3Icon } from '../../components/icons';
import { HeroSlide } from '../../types';
import AnnouncementModal from '../components/modals/AnnouncementModal';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import AnnouncementListTable from '../components/marketing/AnnouncementListTable';


interface ThemeSettingsPageProps {
    heroSlides: HeroSlide[];
    setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>>;
    announcements: AdminAnnouncement[];
    onAnnouncementsUpdate: (announcements: AdminAnnouncement[]) => void;
}

const ThemeSettingsPage: React.FC<ThemeSettingsPageProps> = ({ heroSlides, setHeroSlides, announcements, onAnnouncementsUpdate }) => {
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
    const [editingAnnouncement, setEditingAnnouncement] = useState<AdminAnnouncement | null>(null);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{type: 'slide' | 'announcement', id: number} | null>(null);


    const handleSaveSlide = () => {
        if (!editingSlide) return;
        if (heroSlides.some(s => s.id === editingSlide.id)) {
            setHeroSlides(heroSlides.map(s => s.id === editingSlide.id ? editingSlide : s));
        } else {
            setHeroSlides([...heroSlides, { ...editingSlide, id: Date.now() }]);
        }
        setEditingSlide(null);
    };

    const handleAddNewSlide = () => {
        setEditingSlide({
            id: 0,
            title: '',
            subtitle: '',
            buttonText: '',
            page: 'shop',
            bgImage: '',
        });
    };
    
    const handleDeleteSlide = (id: number) => {
        setHeroSlides(heroSlides.filter(s => s.id !== id));
        setItemToDelete(null);
    };

    const handleSaveAnnouncement = (announcement: AdminAnnouncement) => {
        let updatedAnnouncements;
        if (announcements.some(a => a.id === announcement.id)) {
            updatedAnnouncements = announcements.map(a => a.id === announcement.id ? announcement : a);
        } else {
            updatedAnnouncements = [...announcements, { ...announcement, id: Date.now() }];
        }
        onAnnouncementsUpdate(updatedAnnouncements);
        setShowAnnouncementModal(false);
    };

    const handleDeleteAnnouncement = (id: number) => {
        const updatedAnnouncements = announcements.filter(a => a.id !== id);
        onAnnouncementsUpdate(updatedAnnouncements);
        setItemToDelete(null);
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;
        if (itemToDelete.type === 'slide') {
            handleDeleteSlide(itemToDelete.id);
        } else {
            handleDeleteAnnouncement(itemToDelete.id);
        }
    }


    const SlideForm = () => (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-4 border-b">
                    <h3 className="font-bold">{editingSlide?.id === 0 ? 'إضافة شريحة جديدة' : 'تعديل الشريحة'}</h3>
                </div>
                <div className="p-4 space-y-3">
                     <input type="text" placeholder="عنوان URL للصورة" value={editingSlide?.bgImage} onChange={e => setEditingSlide({...editingSlide!, bgImage: e.target.value})} className="w-full border-gray-300 rounded-lg"/>
                     <input type="text" placeholder="العنوان الرئيسي" value={editingSlide?.title} onChange={e => setEditingSlide({...editingSlide!, title: e.target.value})} className="w-full border-gray-300 rounded-lg"/>
                     <input type="text" placeholder="العنوان الفرعي" value={editingSlide?.subtitle} onChange={e => setEditingSlide({...editingSlide!, subtitle: e.target.value})} className="w-full border-gray-300 rounded-lg"/>
                     <input type="text" placeholder="نص الزر" value={editingSlide?.buttonText} onChange={e => setEditingSlide({...editingSlide!, buttonText: e.target.value})} className="w-full border-gray-300 rounded-lg"/>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end gap-3">
                    <button onClick={() => setEditingSlide(null)} className="bg-white border px-4 py-2 rounded-lg font-semibold">إلغاء</button>
                    <button onClick={handleSaveSlide} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold">حفظ</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {editingSlide && <SlideForm />}
            <AnnouncementModal 
                isOpen={showAnnouncementModal}
                onClose={() => setShowAnnouncementModal(false)}
                onSave={handleSaveAnnouncement}
                announcementToEdit={editingAnnouncement}
            />
            <ConfirmDeleteModal 
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={confirmDelete}
                title={`حذف ${itemToDelete?.type === 'slide' ? 'الشريحة' : 'الإعلان'}`}
                itemName={itemToDelete?.type === 'slide' 
                    ? heroSlides.find(s => s.id === itemToDelete.id)?.title || ''
                    : announcements.find(a => a.id === itemToDelete.id)?.content || ''
                }
            />

            <div>
                <h1 className="text-3xl font-bold text-gray-900">تخصيص المظهر</h1>
                <p className="text-gray-500 mt-1">إدارة مظهر ومحتوى متجرك الإلكتروني.</p>
            </div>
            <Card title="قسم الهيرو">
                 <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-500 text-sm">إدارة الشرائح في قسم الهيرو بالصفحة الرئيسية.</p>
                    <button onClick={handleAddNewSlide} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary-500">
                        <PlusIcon />
                        <span>إضافة شريحة</span>
                    </button>
                </div>
                <div className="space-y-2">
                    {heroSlides.map(slide => (
                        <div key={slide.id} className="flex items-center gap-4 p-2 rounded-lg bg-gray-50 border">
                             <Bars3Icon className="text-gray-400 cursor-grab"/>
                             <img src={slide.bgImage} alt={slide.title} className="w-24 h-16 object-cover rounded-md"/>
                             <div className="flex-1">
                                <p className="font-semibold">{slide.title}</p>
                                <p className="text-xs text-gray-500">{slide.subtitle}</p>
                             </div>
                             <div className="flex items-center gap-2">
                                <button onClick={() => setEditingSlide(slide)} className="text-gray-400 hover:text-primary-600 p-1"><PencilIcon size="sm"/></button>
                                <button onClick={() => setItemToDelete({type: 'slide', id: slide.id})} className="text-gray-400 hover:text-red-500 p-1"><TrashIcon size="sm"/></button>
                             </div>
                        </div>
                    ))}
                </div>
            </Card>
             <Card title="شريط الإعلانات">
                 <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-500 text-sm">إدارة شريط الإعلانات الذي يظهر في أعلى الموقع.</p>
                    <button onClick={() => { setEditingAnnouncement(null); setShowAnnouncementModal(true); }} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary-500">
                        <PlusIcon />
                        <span>إضافة إعلان</span>
                    </button>
                </div>
                <AnnouncementListTable 
                    announcements={announcements} 
                    onEdit={(ann) => {setEditingAnnouncement(ann); setShowAnnouncementModal(true)}}
                    onDelete={(ann) => setItemToDelete({type: 'announcement', id: ann.id})}
                />
            </Card>
        </div>
    );
};

export default ThemeSettingsPage;