import React from 'react';
import { AdminMarketingCampaign } from '../../data/adminData';

interface CampaignListTableProps {
    campaigns: AdminMarketingCampaign[];
}

const CampaignListTable: React.FC<CampaignListTableProps> = ({ campaigns }) => {
    
    const getStatusClasses = (status: AdminMarketingCampaign['status']) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Draft': return 'bg-gray-100 text-gray-700';
            case 'Completed': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    
    const statusTranslations: { [key: string]: string } = { 'Active': 'نشطة', 'Draft': 'مسودة', 'Completed': 'مكتملة' };
    const channelTranslations: { [key: string]: string } = { 'Email': 'بريد إلكتروني', 'SMS': 'رسائل نصية', 'Social': 'وسائل التواصل' };


    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="p-3 font-semibold">اسم الحملة</th>
                        <th className="p-3 font-semibold">الحالة</th>
                        <th className="p-3 font-semibold">القناة</th>
                        <th className="p-3 font-semibold">مرات الفتح</th>
                        <th className="p-3 font-semibold">النقرات</th>
                        <th className="p-3 font-semibold">تاريخ البدء</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {campaigns.map(campaign => (
                        <tr key={campaign.id} className="hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-800">{campaign.name}</td>
                            <td className="p-3">
                                 <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusClasses(campaign.status)}`}>
                                    {statusTranslations[campaign.status]}
                                </span>
                            </td>
                            <td className="p-3 text-gray-500">{channelTranslations[campaign.channel]}</td>
                            <td className="p-3 text-gray-500">{campaign.opens.toLocaleString()}</td>
                            <td className="p-3 text-gray-500">{campaign.clicks.toLocaleString()}</td>
                            <td className="p-3 text-gray-500">{campaign.startDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CampaignListTable;