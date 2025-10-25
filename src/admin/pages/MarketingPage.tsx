import React from 'react';
import { AdminMarketingCampaign, allAdminAutomations } from '../data/adminData';
import { PlusIcon, SparklesIcon } from '../../components/icons';
import CampaignListTable from '../components/marketing/CampaignListTable';
import { Card } from '../components/ui/Card';

interface MarketingPageProps {
    campaigns: AdminMarketingCampaign[];
    navigate: (page: string, data?: any) => void;
}

const MarketingPage: React.FC<MarketingPageProps> = ({ campaigns, navigate }) => {
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
            
            <Card title="الحملات" actions={<a href="#" onClick={(e) => { e.preventDefault(); navigate('saleCampaigns'); }} className="text-sm font-bold text-admin-accent hover:underline">عرض الكل</a>}>
                <CampaignListTable campaigns={campaigns.slice(0, 5)} />
            </Card>

            <Card title="الأتمتة">
                <div className="space-y-3">
                    {allAdminAutomations.map(automation => (
                        <div key={automation.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-admin-bg">
                            <div className="flex items-center gap-4">
                                <div className="bg-admin-accent/10 text-admin-accent p-2 rounded-lg">
                                    <SparklesIcon />
                                </div>
                                <div>
                                    <p className="font-semibold">{automation.name}</p>
                                    <p className="text-sm text-admin-text-secondary">{automation.trigger}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-sm"><span className="font-bold">{automation.conversions}</span> تحويلات</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${automation.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {automation.status === 'Active' ? 'نشط' : 'غير نشط'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

        </div>
    );
};

export default MarketingPage;