import React from 'react';
import { AdminTeamMember } from '../../data/adminData';
import { PlusIcon } from '../../../components/icons';

interface TeamSettingsProps {
    teamMembers: AdminTeamMember[];
    onInvite: () => void;
}

const TeamSettings: React.FC<TeamSettingsProps> = ({ teamMembers, onInvite }) => {

    const getStatusClasses = (status: AdminTeamMember['status']) => {
        return status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
    };
    
    const roleTranslations: { [key: string]: string } = { 'Administrator': 'مسؤول', 'Editor': 'محرر', 'Support': 'دعم' };

    return (
        <div className="space-y-6">
            <div>
                 <h3 className="text-xl font-bold text-admin-text-primary">الفريق والأذونات</h3>
                 <p className="text-admin-text-secondary mt-1 text-sm">إدارة أعضاء الفريق والأذونات الخاصة بهم.</p>
            </div>
            <div className="flex justify-end">
                <button onClick={onInvite} className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-admin-accentHover">
                    <PlusIcon />
                    <span>دعوة عضو</span>
                </button>
            </div>
            <div className="overflow-x-auto border border-admin-border rounded-lg">
                <table className="w-full text-sm text-right">
                    <thead className="bg-admin-bg text-admin-text-secondary">
                        <tr>
                            <th className="p-3 font-semibold">العضو</th>
                            <th className="p-3 font-semibold">الدور</th>
                            <th className="p-3 font-semibold">آخر تسجيل دخول</th>
                            <th className="p-3 font-semibold">الحالة</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border">
                        {teamMembers.map(member => (
                            <tr key={member.id} className="hover:bg-admin-bg">
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-semibold text-admin-text-primary">{member.name}</p>
                                            <p className="text-xs text-admin-text-secondary">{member.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 text-admin-text-secondary">{roleTranslations[member.role]}</td>
                                <td className="p-3 text-admin-text-secondary">{member.lastLogin ? new Date(member.lastLogin).toLocaleDateString('ar-EG') : 'لم يسجل الدخول'}</td>
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