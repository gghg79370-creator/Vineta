import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { allAdminTeamMembers } from '../data/adminData';
import TeamSettings from '../components/settings/TeamSettings';
import ThemeSettings from '../components/settings/ThemeSettings';
import LocalizationSettings from '../components/settings/LocalizationSettings';


const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('team');

    const tabs = [
        { id: 'team', label: 'الفريق والأذونات' },
        { id: 'theme', label: 'المظهر' },
        { id: 'localization', label: 'اللغة والمنطقة' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'team':
                return <TeamSettings teamMembers={allAdminTeamMembers} />;
            case 'theme':
                return <ThemeSettings />;
            case 'localization':
                return <LocalizationSettings />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
                <p className="text-gray-500 mt-1">إدارة إعدادات متجرك.</p>
            </div>
            <Card title="إعدادات المتجر">
                <div className="flex border-b">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 font-semibold text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-b-2 border-primary-600 text-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="py-6">
                    {renderContent()}
                </div>
            </Card>
        </div>
    );
};

export default SettingsPage;