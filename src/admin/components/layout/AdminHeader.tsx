import React from 'react';
import { User } from '../../../types';
import { SearchIcon, BellIcon, ChevronDownIcon, Bars3Icon, ChevronRightIcon, ChevronLeftIcon } from '../../../components/icons';

interface AdminHeaderProps {
    currentUser: User | null;
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: (isCollapsed: boolean) => void;
}

export const AdminHeader = ({ currentUser, isSidebarCollapsed, setIsSidebarCollapsed }: AdminHeaderProps) => {
    return (
        <header className="h-20 bg-white border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between h-full px-6">
                <div className="flex items-center">
                    <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 -mr-2 rounded-full text-gray-500 hover:bg-gray-100">
                        {isSidebarCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="search" placeholder="بحث..." className="bg-gray-100 border-transparent rounded-full py-2 pr-10 pl-4 w-64 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    
                    <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                        <BellIcon />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

                    <div className="flex items-center gap-3">
                        <img 
                            src="https://randomuser.me/api/portraits/women/32.jpg"
                            alt={currentUser?.name || 'Admin profile picture'}
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="hidden sm:block">
                            <p className="font-semibold text-sm text-gray-900">{currentUser?.name}</p>
                            <p className="text-xs text-gray-500">مدير</p>
                        </div>
                        <button className="hidden sm:block text-gray-500">
                            <ChevronDownIcon />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};