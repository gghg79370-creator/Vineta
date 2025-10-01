import React, { useState, useMemo, useEffect } from 'react';
import { User, Notification } from '../../../types';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';
import { Breadcrumbs } from '../ui/Breadcrumbs';

const breadcrumbMap: { [key: string]: { label: string; parent?: string } } = {
  dashboard: { label: 'لوحة التحكم' },
  products: { label: 'المنتجات', parent: 'dashboard' },
  addProduct: { label: 'إضافة منتج', parent: 'products' },
  editProduct: { label: 'تعديل المنتج', parent: 'products' },
  categories: { label: 'الفئات', parent: 'dashboard' },
  addCategory: { label: 'إضافة فئة', parent: 'categories' },
  editCategory: { label: 'تعديل فئة', parent: 'categories' },
  inventory: { label: 'المخزون', parent: 'dashboard' },
  reviews: { label: 'التقييمات', parent: 'dashboard' },
  
  orders: { label: 'الطلبات', parent: 'dashboard' },
  orderDetail: { label: 'تفاصيل الطلب', parent: 'orders' },
  discounts: { label: 'الخصومات', parent: 'dashboard' },
  addDiscount: { label: 'إضافة خصم', parent: 'discounts' },
  editDiscount: { label: 'تعديل الخصم', parent: 'discounts' },

  customers: { label: 'العملاء', parent: 'dashboard' },
  customerDetail: { label: 'تفاصيل العميل', parent: 'customers' },

  marketing: { label: 'التسويق', parent: 'dashboard' },
  saleCampaigns: { label: 'حملات التخفيضات', parent: 'marketing' },
  addSaleCampaign: { label: 'إضافة حملة', parent: 'saleCampaigns' },
  editSaleCampaign: { label: 'تعديل حملة', parent: 'saleCampaigns' },
  
  theme: { label: 'تخصيص المظهر', parent: 'dashboard' },

  analytics: { label: 'التحليلات', parent: 'dashboard' },
  
  content: { label: 'منشورات المدونة', parent: 'dashboard' },
  addBlogPost: { label: 'إضافة منشور', parent: 'content' },
  editBlogPost: { label: 'تعديل منشور', parent: 'content' },

  messages: { label: 'الرسائل', parent: 'dashboard' },
  settings: { label: 'الإعدادات', parent: 'dashboard' },
};


interface AdminLayoutProps {
    children: React.ReactNode;
    currentUser: User | null;
    activePage: string;
    setActivePage: (page: string, data?: any) => void;
    notifications: Notification[];
    onMarkAsRead: (id: number) => void;
    onMarkAllAsRead: () => void;
    onClearAll: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentUser, activePage, setActivePage, notifications, onMarkAsRead, onMarkAllAsRead, onClearAll }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const breadcrumbs = useMemo(() => {
      const trail: { page: string; label: string }[] = [];
      let currentPageKey: string | undefined = activePage;

      while (currentPageKey) {
        const pageInfo = breadcrumbMap[currentPageKey];
        if (pageInfo) {
          trail.unshift({ page: currentPageKey, label: pageInfo.label });
          currentPageKey = pageInfo.parent;
        } else {
          break;
        }
      }
      return trail;
    }, [activePage]);
    
    const currentPageLabel = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : '';

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) { // Meta for Mac
                let targetPage: string | null = null;
                switch (e.key.toLowerCase()) {
                    case 'p':
                        if (activePage !== 'addProduct' && activePage !== 'editProduct') {
                            targetPage = 'addProduct';
                        }
                        break;
                    case 'o':
                        targetPage = 'orders';
                        break;
                    case 'c':
                        targetPage = 'customers';
                        break;
                    case 'd':
                        targetPage = 'dashboard';
                        break;
                }
                if (targetPage && targetPage !== activePage) {
                    e.preventDefault();
                    setActivePage(targetPage);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activePage, setActivePage]);


    return (
        <div dir="rtl" className="font-sans bg-admin-bg text-gray-800 flex min-h-screen">
            <Sidebar 
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                activePage={activePage}
                setActivePage={setActivePage}
            />
            <div className={`flex-1 flex flex-col transition-all duration-300 md:mr-64`}>
                <AdminHeader 
                    currentUser={currentUser} 
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                    currentPageLabel={currentPageLabel}
                    notifications={notifications}
                    onMarkAsRead={onMarkAsRead}
                    onMarkAllAsRead={onMarkAllAsRead}
                    onClearAll={onClearAll}
                    onNavigate={setActivePage}
                />
                 <div className="p-4 md:p-6 lg:p-8">
                    <Breadcrumbs items={breadcrumbs} onNavigate={setActivePage} />
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};
