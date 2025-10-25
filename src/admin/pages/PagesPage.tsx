
import React, { useState } from 'react';
import { AdminPage } from '../data/adminData'; 
import { Card } from '../components/ui/Card';
import { PlusIcon } from '../../components/icons';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import PageListTable from '../components/content/PageListTable'; 

interface PagesPageProps {
    pages: AdminPage[];
    navigate: (page: string, data?: any) => void;
    onDeletePage: (pageId: number) => void;
}

const PagesPage: React.FC<PagesPageProps> = ({ pages, navigate, onDeletePage }) => {
    const [pageToDelete, setPageToDelete] = useState<AdminPage | null>(null);

    const handleDeleteClick = (page: AdminPage) => {
        setPageToDelete(page);
    };

    const confirmDelete = () => {
        if (pageToDelete) {
            onDeletePage(pageToDelete.id);
            setPageToDelete(null);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">الصفحات</h1>
                <button 
                    onClick={() => navigate('addPage')}
                    className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-admin-accentHover">
                    <PlusIcon />
                    <span>إنشاء صفحة</span>
                </button>
            </div>
            <Card title="كل الصفحات">
                <PageListTable
                    pages={pages}
                    onEdit={(page) => navigate('editPage', page)}
                    onDelete={handleDeleteClick}
                />
            </Card>
            <ConfirmDeleteModal
                isOpen={!!pageToDelete}
                onClose={() => setPageToDelete(null)}
                onConfirm={confirmDelete}
                title="حذف الصفحة"
                itemName={pageToDelete?.title || ''}
            />
        </div>
    );
};

export default PagesPage;
