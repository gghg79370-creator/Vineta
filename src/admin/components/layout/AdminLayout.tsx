import React, { useState } from 'react';
import { User } from '../../../types';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
    children: React.ReactNode;
    currentUser: User | null;
    activePage: string;
    setActivePage: (page: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentUser, activePage, setActivePage }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div dir="rtl" className="font-sans bg-gray-50 text-gray-800 flex min-h-screen">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                activePage={activePage}
                setActivePage={setActivePage}
            />
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'mr-20' : 'mr-64'}`}>
                <AdminHeader 
                    currentUser={currentUser} 
                    isSidebarCollapsed={isSidebarCollapsed} 
                    setIsSidebarCollapsed={setIsSidebarCollapsed} 
                />
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
