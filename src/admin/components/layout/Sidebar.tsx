

import React, { useState } from 'react';
import { 
    HomeIcon, 
    ShoppingBagIcon, 
    CubeIcon, 
    UsersIcon, 
    ChartBarIcon, 
    TagIcon, 
    MegaphoneIcon, 
    DocumentTextIcon, 
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon,
    StarIcon,
    PaintBrushIcon
} from '../../../components/icons';

interface SidebarProps {
    isCollapsed: boolean;
    activePage: string;
    setActivePage: (page: string) => void;
}

// FIX: Replaced 'any' with a specific interface for props to ensure type safety and fix downstream type inference errors in NavGroup.
interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    page: string;
    activePage: string;
    isCollapsed: boolean;
    setActivePage: (page: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, page, activePage, isCollapsed, setActivePage }) => (
    <button
        onClick={() => setActivePage(page)}
        className={`flex items-center w-full h-12 px-6 text-right rounded-lg transition-colors
            ${activePage.startsWith(page) ? 'bg-primary-500 text-white shadow-md' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
            ${isCollapsed ? 'justify-center' : 'justify-start'}`}
    >
        {icon}
        {!isCollapsed && <span className="mr-4 text-sm font-semibold">{label}</span>}
    </button>
);

// FIX: Refactored to use a dedicated props interface and React.FC for better type safety and to resolve inference issues.
interface NavGroupProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    isCollapsed: boolean;
    initialOpen?: boolean;
}

const NavGroup: React.FC<NavGroupProps> = ({ title, icon, children, isCollapsed, initialOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);

    if (isCollapsed) {
        return (
            <div className="relative group">
                <div className="flex items-center w-full h-12 px-6 text-gray-400 justify-center">
                    {icon}
                </div>
                <div className="absolute right-full top-0 mr-2 w-48 bg-gray-700 rounded-lg shadow-lg hidden group-hover:block z-50 p-2 space-y-1">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center w-full h-12 px-6 text-right text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg">
                {icon}
                <span className="mr-4 text-sm font-semibold flex-1">{title}</span>
                <ChevronDownIcon size="sm" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="mt-1 space-y-1 pr-6">{children}</div>}
        </div>
    );
};


export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, activePage, setActivePage }) => {

    const salesPages = ['orders', 'discounts'];
    const catalogPages = ['products', 'categories', 'inventory', 'reviews'];
    const onlineStorePages = ['theme'];
    const marketingPages = ['marketing', 'campaigns', 'automations'];
    const contentPages = ['content', 'blog', 'pages'];

    const isPageActive = (pages: string[]) => pages.some(p => activePage.startsWith(p));
    
    return (
        <aside className={`fixed top-0 right-0 h-full bg-gray-800 text-white flex flex-col transition-all duration-300 z-40 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`flex items-center h-20 px-6 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                <span className={`text-2xl font-bold ${isCollapsed ? 'hidden' : 'block'}`}>Vineta</span>
                <span className={`text-2xl font-bold ${isCollapsed ? 'block' : 'hidden'}`}>V</span>
            </div>
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                <NavItem icon={<HomeIcon size="sm" />} label="لوحة التحكم" page="dashboard" activePage={activePage} isCollapsed={isCollapsed} setActivePage={setActivePage} />
                <NavItem icon={<ChartBarIcon size="sm" />} label="التحليلات" page="analytics" activePage={activePage} isCollapsed={isCollapsed} setActivePage={setActivePage} />
                
                <NavGroup title="المبيعات" icon={<ShoppingBagIcon size="sm" />} isCollapsed={isCollapsed} initialOpen={isPageActive(salesPages)}>
                    <NavItem icon={<div className="w-5"></div>} label="الطلبات" page="orders" activePage={activePage} isCollapsed={false} setActivePage={setActivePage} />
                    <NavItem icon={<div className="w-5"></div>} label="الخصومات" page="discounts" activePage={activePage} isCollapsed={false} setActivePage={setActivePage} />
                </NavGroup>
                
                <NavGroup title="الكتالوج" icon={<CubeIcon size="sm" />} isCollapsed={isCollapsed} initialOpen={isPageActive(catalogPages)}>
                     <NavItem icon={<div className="w-5"></div>} label="المنتجات" page="products" activePage={activePage} isCollapsed={false} setActivePage={setActivePage} />
                     <NavItem icon={<div className="w-5"></div>} label="الفئات" page="categories" activePage={activePage} isCollapsed={false} setActivePage={setActivePage} />
                     <NavItem icon={<div className="w-5"></div>} label="المخزون" page="inventory" activePage={activePage} isCollapsed={false} setActivePage={setActivePage} />
                     <NavItem icon={<div className="w-5"></div>} label="التقييمات" page="reviews" activePage={activePage} isCollapsed={false} setActivePage={setActivePage} />
                </NavGroup>

                <NavItem icon={<UsersIcon size="sm" />} label="العملاء" page="customers" activePage={activePage} isCollapsed={isCollapsed} setActivePage={setActivePage} />
                <NavItem icon={<MegaphoneIcon size="sm" />} label="التسويق" page="marketing" activePage={activePage} isCollapsed={isCollapsed} setActivePage={setActivePage} />

                <NavGroup title="المتجر الإلكتروني" icon={<PaintBrushIcon size="sm" />} isCollapsed={isCollapsed} initialOpen={isPageActive(onlineStorePages)}>
                    <NavItem icon={<div className="w-5"></div>} label="المظهر" page="theme" activePage={activePage} isCollapsed={false} setActivePage={setActivePage} />
                </NavGroup>
                
            </nav>
            <div className="px-4 py-4 space-y-2 border-t border-gray-700">
                 <NavItem icon={<Cog6ToothIcon size="sm" />} label="الإعدادات" page="settings" activePage={activePage} isCollapsed={isCollapsed} setActivePage={setActivePage} />
                 <NavItem icon={<ArrowRightOnRectangleIcon size="sm" />} label="الخروج" page="logout" activePage={activePage} isCollapsed={isCollapsed} setActivePage={setActivePage} />
            </div>
        </aside>
    );
};