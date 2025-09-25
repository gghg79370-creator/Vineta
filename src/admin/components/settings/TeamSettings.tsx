import React from 'react';
import { AdminTeamMember } from '../../data/adminData';
import { PlusIcon } from '../../../components/icons';

interface TeamSettingsProps {
    teamMembers: AdminTeamMember[];
}

const TeamSettings: React.FC<TeamSettingsProps> = ({ teamMembers }) => {

    const getStatusClasses = (status: AdminTeamMember['status']) => {
        return status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
    };
    
    const roleTranslations: { [key: string]: string } = { 'Administrator': 'مسؤول', 'Editor': 'محرر', 'Support': 'دعم' };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-gray-500">إدارة أعضاء الفريق والأذونات الخاصة بهم.</p>
                <button className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary-500">
                    <PlusIcon />
                    <span>دعوة عضو</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-3 font-semibold">العضو</th>
                            <th className="p-3 font-semibold">الدور</th>
                            <th className="p-3 font-semibold">آخر تسجيل دخول</th>
                            <th className="p-3 font-semibold">الحالة</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {teamMembers.map(member => (
                            <tr key={member.id} className="hover:bg-gray-50">
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-semibold text-gray-800">{member.name}</p>
                                            <p className="text-xs text-gray-500">{member.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 text-gray-500">{roleTranslations[member.role]}</td>
                                <td className="p-3 text-gray-500">{member.lastLogin ? new Date(member.lastLogin).toLocaleDateString('ar-EG') : 'لم يسجل الدخول'}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusClasses(member.status)}`}>
                                        {member.status === 'Active' ? 'نشط' : 'مدعو'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeamSettings;