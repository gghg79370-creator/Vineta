import React from 'react';
import { AdminMarketingCampaign, allAdminAutomations } from '../data/adminData';
import { PlusIcon, SparklesIcon } from '../../components/icons';
import CampaignListTable from '../components/marketing/CampaignListTable';
import { Card } from '../components/ui/Card';

interface MarketingPageProps {
    campaigns: AdminMarketingCampaign[];
    navigate: (page: string) => void;
}

const MarketingPage: React.FC<MarketingPageProps> = ({ campaigns, navigate }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">التسويق</h1>
                    <p className="text-gray-500 mt-1">إنشاء وإدارة حملاتك التسويقية.</p>
                </div>
                <div className="relative group">
                    <button 
                        disabled
                        className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary-500 transition-colors w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                        <PlusIcon />
                        <span>إنشاء حملة</span>
                    </button>
                    <div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        This feature is for demonstration purposes.
                    </div>
                </div>
            </div>
            
            <Card title="الحملات">
                <CampaignListTable campaigns={campaigns} />
            </Card>

            <Card title="الأتمتة">
                <div className="space-y-3">
                    {allAdminAutomations.map(automation => (
                        <div key={automation.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary-100 text-primary-600 p-2 rounded-lg">
                                    <SparklesIcon />
                                </div>
                                <div>
                                    <p className="font-semibold">{automation.name}</p>
                                    <p className="text-sm text-gray-500">{automation.trigger}</p>
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