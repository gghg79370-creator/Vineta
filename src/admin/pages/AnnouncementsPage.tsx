import React from 'react';
import { AdminAnnouncement } from '../data/adminData';
import { PlusIcon } from '../../components/icons';
import AnnouncementListTable from '../components/marketing/AnnouncementListTable';

interface AnnouncementsPageProps {
    announcements: AdminAnnouncement[];
}

const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({ announcements }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">الإعلانات</h1>
                    <p className="text-gray-500 mt-1">إدارة الإعلانات واللافتات على مستوى الموقع.</p>
                </div>
                <button 
                    className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary-500 transition-colors w-full md:w-auto justify-center">
                    <PlusIcon />
                    <span>إنشاء إعلان</span>
                </button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <AnnouncementListTable announcements={announcements} />
            </div>
        </div>
    );
};

export default AnnouncementsPage;