import React, { useState, useEffect, useRef } from 'react';
import { User, Notification } from '../../../types';
import { SearchIcon, BellIcon, Bars3Icon } from '../../../components/icons';
import NotificationPanel from '../notifications/NotificationPanel';

interface AdminHeaderProps {
    currentUser: User | null;
    toggleSidebar: () => void;
    notifications: Notification[];
    onMarkAsRead: (id: number) => void;
    onMarkAllAsRead: () => void;
    onClearAll: () => void;
    onNavigate: (page: string, data?: any) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ currentUser, toggleSidebar, notifications, onMarkAsRead, onMarkAllAsRead, onClearAll, onNavigate }) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const panelRef = useRef<HTMLDivElement>(null);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'صباح الخير';
        if (hour < 18) return 'مساء الخير';
        return 'مساء الخير';
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsPanelOpen(false);
            }
        };

        if (isPanelOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPanelOpen]);


    return (
        <header className="h-20 bg-white/80 backdrop-blur-lg border-b border-admin-border flex-shrink-0 sticky top-0 z-20">
            <div className="flex items-center justify-between h-full px-4 md:px-6 lg:px-8">
                {/* Left side: Mobile Toggle & Page Title */}
                <div className="flex items-center gap-2">
                    <button onClick={toggleSidebar} className="p-2 -mr-2 rounded-full text-gray-500 hover:bg-gray-100 md:hidden">
                        <Bars3Icon />
                    </button>
                    <div className="hidden md:block">
                        <h1 className="text-xl font-bold text-gray-800">
                            {getGreeting()}, {currentUser?.name?.split(' ')[0]} 👋
                        </h1>
                    </div>
                </div>

                {/* Right side: Actions & Profile */}
                <div className="flex items-center gap-2 md:gap-4">
                     <div className="relative">
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <SearchIcon size="sm" className="text-gray-400" />
                        </div>
                        <input type="search" placeholder="بحث..." className="bg-gray-100 border-none rounded-lg py-2.5 pr-10 pl-4 text-sm w-40 sm:w-48 lg:w-64 focus:ring-2 focus:ring-admin-accent focus:bg-white transition-all" />
                    </div>
                    
                    <div className="relative" ref={panelRef}>
                        <button onClick={() => setIsPanelOpen(prev => !prev)} className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                            <BellIcon />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-white">
                                </span>
                            )}
                        </button>
                        {isPanelOpen && (
                            <NotificationPanel 
                                notifications={notifications}
                                onMarkAsRead={onMarkAsRead}
                                onMarkAllAsRead={onMarkAllAsRead}
                                onClearAll={onClearAll}
                                onNavigate={onNavigate}
                                onClose={() => setIsPanelOpen(false)}
                            />
                        )}
                    </div>


                    <div className="w-px h-8 bg-admin-border hidden sm:block"></div>

                    <div className="flex items-center gap-3">
                        <img 
                            src="https://randomuser.me/api/portraits/women/32.jpg"
                            alt={currentUser?.name || 'Admin profile picture'}
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="hidden sm:block">
                            <p className="font-semibold text-sm text-gray-900">{currentUser?.name}</p>
                            <p className="text-xs text-gray-500">{currentUser?.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};