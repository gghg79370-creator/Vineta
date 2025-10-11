import React, { useState } from 'react';
import { SaleCampaign } from '../../types';
import { PlusIcon } from '../../components/icons';
import SaleCampaignListTable from '../components/marketing/SaleCampaignListTable';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { Card } from '../components/ui/Card';

interface SaleCampaignsPageProps {
    campaigns: SaleCampaign[];
    navigate: (page: string, data?: any) => void;
    onDelete: (campaignId: number) => void;
}

const SaleCampaignsPage: React.FC<SaleCampaignsPageProps> = ({ campaigns, navigate, onDelete }) => {
    const [campaignToDelete, setCampaignToDelete] = useState<SaleCampaign | null>(null);

    const handleDeleteClick = (campaign: SaleCampaign) => {
        setCampaignToDelete(campaign);
    };

    const confirmDelete = () => {
        if (campaignToDelete) {
            onDelete(campaignToDelete.id);
            setCampaignToDelete(null);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-end items-center gap-4">
                <button 
                    onClick={() => navigate('addSaleCampaign')}
                    className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-admin-accentHover transition-colors w-full md:w-auto justify-center">
                    <PlusIcon />
                    <span>إنشاء حملة</span>
                </button>
            </div>
            <Card title="جميع حملات التخفيضات">
                <SaleCampaignListTable 
                    campaigns={campaigns} 
                    onEdit={(campaign) => navigate('editSaleCampaign', campaign)}
                    onDelete={handleDeleteClick}
                />
            </Card>
            <ConfirmDeleteModal
                isOpen={!!campaignToDelete}
                onClose={() => setCampaignToDelete(null)}
                onConfirm={confirmDelete}
                title="حذف الحملة"
                itemName={campaignToDelete?.title || ''}
            />
        </div>
    );
};

export default SaleCampaignsPage;
