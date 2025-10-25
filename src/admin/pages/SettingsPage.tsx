
import React, { useState } from 'react';
import { allAdminTeamMembers, AdminTeamMember } from '../data/adminData';
import TeamSettings from '../components/settings/TeamSettings';
import ThemeSettings from '../components/settings/ThemeSettings';
import LocalizationSettings from '../components/settings/LocalizationSettings';
import InviteMemberModal from '../components/modals/InviteMemberModal';
import { UsersIcon, PaintBrushIcon, GlobeAltIcon, CreditCardIcon, TruckIcon } from '../../components/icons';

const PaymentSettings = () => (
    <div>
        <h3 className="text-xl font-bold text-admin-text-primary">إعدادات الدفع</h3>
        <p className="text-admin-text-secondary mt-1 text-sm">إدارة بوابات الدفع وتكوين خيارات الدفع.</p>
        <div className="mt-6 space-y-4">
             <div className="p-4 border rounded-lg flex justify-between items-center">
                <span className="font-semibold">الدفع عند الاستلام</span>
                <button className="text-sm font-bold text-admin-accent hover:underline">تكوين</button>
            </div>
            <div className="p-4 border rounded-lg flex justify-between items-center">
                <span className="font-semibold">Stripe</span>
                <button className="text-sm font-bold text-admin-accent hover:underline">تفعيل</button>
            </div>
             <div className="p-4 border rounded-lg flex justify-between items-center">
                <span className="font-semibold">PayPal</span>
                <button className="text-sm font-bold text-admin-accent hover:underline">تفعيل</button>
            </div>
        </div>
    </div>
);

const ShippingSettings = () => (
    <div>
        <h3 className="text-xl font-bold text-admin-text-primary">الشحن والتوصيل</h3>
        <p className="text-admin-text-secondary mt-1 text-sm">إدارة مناطق الشحن، والأسعار، وخيارات التوصيل.</p>
        <div className="mt-6">
            <button className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg">إضافة منطقة شحن</button>
        </div>
    </div>
);

const TaxSettings = () => (
     <div>
        <h3 className="text-xl font-bold text-admin-text-primary">الضرائب</h3>
        <p className="text-admin-text-secondary mt-1 text-sm">تكوين قواعد الضرائب والمناطق.</p>
         <div className="mt-6 p-4 border rounded-lg">
            <p className="font-semibold">مصر</p>
            <p className="text-sm text-admin-text-secondary mt-1">14% ضريبة القيمة المضافة مطبقة على جميع الطلبات.</p>
        </div>
    </div>
);

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('team');
    const [teamMembers, setTeamMembers] = useState(allAdminTeamMembers);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const handleInvite = (newMemberData: { email: string; role: AdminTeamMember['role'] }) => {
        const newMember: AdminTeamMember = {
            ...newMemberData,
            id: Date.now(),
            name: newMemberData.email.split('@')[0], // Simple name generation
            avatar: `https://i.pravatar.cc/150?u=${newMemberData.email}`,
            lastLogin: null,
            status: 'Invited'
        };
        setTeamMembers(prev => [newMember, ...prev]);
        setIsInviteModalOpen(false);
    };

    const tabs = [
        { id: 'team', label: 'الفريق والأذونات', icon: <UsersIcon size="sm"/> },
        { id: 'payments', label: 'الدفع', icon: <CreditCardIcon size="sm"/> },
        { id: 'shipping', label: 'الشحن', icon: <TruckIcon size="sm"/> },
        { id: 'taxes', label: 'الضرائب', icon: <span className="font-bold text-lg w-5 text-center">%</span> },
        { id: 'theme', label: 'المظهر', icon: <PaintBrushIcon size="sm"/> },
        { id: 'localization', label: 'اللغة والمنطقة', icon: <GlobeAltIcon size="sm" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'team':
                return <TeamSettings teamMembers={teamMembers} onInvite={() => setIsInviteModalOpen(true)} />;
            case 'payments':
                return <PaymentSettings />;
            case 'shipping':
                return <ShippingSettings />;
            case 'taxes':
                return <TaxSettings />;
            case 'theme':
                return <ThemeSettings />;
            case 'localization':
                return <LocalizationSettings />;
            default:
                return null;
        }
    };

    return (
        <>
            <InviteMemberModal 
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSave={handleInvite}
            />
            <div className="bg-admin-card-bg rounded-xl border border-admin-border" style={{ boxShadow: 'var(--admin-shadow)' }}>
                <div className="grid grid-cols-1 md:grid-cols-4 min-h-[calc(100vh-12rem)]">
                    <div className="md:col-span-1 border-l border-admin-border p-4">
                         <h2 className="text-lg font-bold text-admin-text-primary mb-4 px-2">الإعدادات</h2>
                         <nav className="space-y-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg text-right
                                        ${ activeTab === tab.id
                                            ? 'bg-admin-accent/10 text-admin-accent'
                                            : 'text-admin-text-secondary hover:bg-gray-100 hover:text-admin-text-primary dark:hover:bg-gray-800/50'
                                        }`
                                    }
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="md:col-span-3">
                        <div className="p-6 md:p-8">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsPage;
