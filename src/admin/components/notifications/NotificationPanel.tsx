
import React from 'react';
import { Notification } from '../../../types';
import { ShoppingBagIcon, CubeIcon, StarIcon } from '../../../components/icons';

interface NotificationPanelProps {
    notifications: Notification[];
    onMarkAsRead: (id: number) => void;
    onMarkAllAsRead: () => void;
    onClearAll: () => void;
    onNavigate: (page: string, data?: any) => void;
    onClose: () => void;
}

const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `قبل ${Math.floor(interval)} سنوات`;
    interval = seconds / 2592000;
    if (interval > 1) return `قبل ${Math.floor(interval)} أشهر`;
    interval = seconds / 86400;
    if (interval > 1) return `قبل ${Math.floor(interval)} أيام`;
    interval = seconds / 3600;
    if (interval > 1) return `قبل ${Math.floor(interval)} ساعات`;
    interval = seconds / 60;
    if (interval > 1) return `قبل ${Math.floor(interval)} دقائق`;
    return `قبل ${Math.floor(seconds)} ثوان`;
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead, onClearAll, onNavigate, onClose }) => {
    
    const handleNotificationClick = (notification: Notification) => {
        if(notification.link) {
            onNavigate(notification.link, notification.data);
        }
        if(!notification.isRead) {
            onMarkAsRead(notification.id);
        }
        onClose();
    };

    const icons: { [key: string]: React.ReactNode } = {
        order: <ShoppingBagIcon size="sm" className="text-blue-500" />,
        stock: <CubeIcon size="sm" className="text-amber-500" />,
        review: <StarIcon size="sm" className="text-green-500" />
    };

    return (
        <div className="absolute top-full mt-2 left-0 w-80 bg-admin-card-bg rounded-xl shadow-2xl border border-admin-border z-50 animate-fade-in-up origin-top-left">
            <div className="p-3 border-b border-admin-border flex justify-between items-center">
                <h3 className="font-bold text-admin-text-primary">الإشعارات</h3>
                <button onClick={onMarkAllAsRead} className="text-xs font-semibold text-admin-accent hover:underline">
                    وضع علامة "مقروء" على الكل
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto admin-sidebar-scrollbar">
                {notifications.length === 0 ? (
                    <p className="text-center text-admin-text-secondary py-8 text-sm">لا توجد إشعارات جديدة.</p>
                ) : (
                    notifications.map(notification => (
                        <button 
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className="w-full text-right p-3 flex items-start gap-3 hover:bg-admin-bg border-b last:border-b-0 border-admin-border"
                        >
                            <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                notification.type === 'order' ? 'bg-blue-100' :
                                notification.type === 'stock' ? 'bg-amber-100' :
                                'bg-green-100'
                            }`}>
                                {icons[notification.type]}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className={`font-semibold text-sm truncate ${!notification.isRead ? 'text-admin-text-primary' : 'text-admin-text-secondary'}`}>
                                    {notification.title}
                                </p>
                                <p className="text-xs text-admin-text-secondary line-clamp-2">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(notification.timestamp)}</p>
                            </div>
                            {!notification.isRead && (
                                <div className="w-2.5 h-2.5 bg-admin-accent rounded-full mt-1.5 flex-shrink-0"></div>
                            )}
                        </button>
                    ))
                )}
            </div>
             <div className="p-2 bg-admin-bg rounded-b-xl text-center">
                 <button onClick={onClearAll} className="text-xs font-semibold text-red-500 hover:underline">
                    مسح الكل
                </button>
            </div>
        </div>
    );
};

export default NotificationPanel;
