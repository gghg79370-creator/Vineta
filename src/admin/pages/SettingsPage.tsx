import React, { useState } from 'react';
import { allAdminTeamMembers } from '../data/adminData';
import TeamSettings from '../components/settings/TeamSettings';
import ThemeSettings from '../components/settings/ThemeSettings';
import LocalizationSettings from '../components/settings/LocalizationSettings';
import { UsersIcon, PaintBrushIcon } from '../../components/icons';

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('team');

    const tabs = [
        { id: 'team', label: 'الفريق والأذونات', icon: <UsersIcon size="sm"/> },
        { id: 'theme', label: 'المظهر', icon: <PaintBrushIcon size="sm"/> },
        // { id: 'localization', label: 'اللغة والمنطقة' },
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
        <div className="bg-white rounded-xl shadow-sm border border-admin-border">
            <div className="grid grid-cols-1 md:grid-cols-4 min-h-[calc(100vh-12rem)]">
                <div className="md:col-span-1 border-l border-admin-border p-4">
                     <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">الإعدادات</h2>
                     <nav className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg text-right
                                    ${ activeTab === tab.id
                                        ? 'bg-admin-accent/10 text-admin-accent'
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
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
                    <div className="p-6">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;