import React from 'react';
import { SaleCampaign } from '../../../types';
import { PencilIcon, TrashIcon } from '../../../components/icons';

interface SaleCampaignListTableProps {
    campaigns: SaleCampaign[];
    onEdit: (campaign: SaleCampaign) => void;
    onDelete: (campaign: SaleCampaign) => void;
}

const SaleCampaignListTable: React.FC<SaleCampaignListTableProps> = ({ campaigns, onEdit, onDelete }) => {
    
    const getStatusClasses = (status: SaleCampaign['status']) => {
        return status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
    };
    
    const statusTranslations: { [key: string]: string } = { 'Active': 'نشط', 'Draft': 'مسودة' };

    return (
        <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="px-5 py-3 font-semibold">العنوان</th>
                        <th className="px-5 py-3 font-semibold">نص الخصم</th>
                        <th className="px-5 py-3 font-semibold">الحالة</th>
                        <th className="px-5 py-3 font-semibold">تاريخ الانتهاء</th>
                        <th className="px-5 py-3 font-semibold"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                    {campaigns.map(campaign => (
                        <tr key={campaign.id} className="hover:bg-gray-50">
                            <td className="px-5 py-4 font-semibold text-gray-800">{campaign.title}</td>
                            <td className="px-5 py-4 font-semibold text-admin-accent">{campaign.discountText}</td>
                            <td className="px-5 py-4">
                                 <span className={`px-2 py-1 rounded-md text-xs font-bold ${getStatusClasses(campaign.status)}`}>
                                    {statusTranslations[campaign.status]}
                                </span>
                            </td>
                            <td className="px-5 py-4 text-gray-500">{new Date(campaign.saleEndDate).toLocaleDateString('ar-EG')}</td>
                            <td className="px-5 py-4 text-left">
                                <div className="flex items-center gap-2 justify-end">
                                    <button onClick={() => onEdit(campaign)} className="text-gray-400 hover:text-admin-accent p-1"><PencilIcon size="sm"/></button>
                                    <button onClick={() => onDelete(campaign)} className="text-gray-400 hover:text-red-500 p-1"><TrashIcon size="sm"/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SaleCampaignListTable;