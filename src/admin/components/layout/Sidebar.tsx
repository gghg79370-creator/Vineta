import React, { useState, useEffect } from 'react';
import { 
    HomeIcon, ShoppingBagIcon, CubeIcon, UsersIcon, ChartBarIcon, TagIcon, 
    MegaphoneIcon, PaintBrushIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, 
    ChevronDownIcon, StarIcon, DocumentTextIcon, CloseIcon
} from '../../../components/icons';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    activePage: string;
    setActivePage: (page: string) => void;
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    page: string;
    activePage: string;
    setActivePage: (page: string) => void;
    isSubItem?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, page, activePage, setActivePage, isSubItem = false }) => {
    const isActive = activePage.startsWith(page);
    return (
        <button
            onClick={() => setActivePage(page)}
            className={`flex items-center w-full h-11 px-4 text-right rounded-lg transition-all duration-200 relative
                ${isActive ? 'bg-admin-accent/10 text-admin-accent font-bold' : 'text-admin-textMuted hover:bg-admin-sidebarHover hover:text-white'}
                ${isSubItem ? 'pr-10' : ''}`}
        >
            {isActive && <div className="absolute right-0 top-0 h-full w-1 bg-admin-accent rounded-r-full"></div>}
            {icon}
            <span className="mr-3 text-sm font-semibold">{label}</span>
        </button>
    );
}

interface NavGroupProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    initialOpen?: boolean;
}

const NavGroup: React.FC<NavGroupProps> = ({ title, icon, children, initialOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center w-full h-11 px-4 text-right text-admin-textMuted hover:bg-admin-sidebarHover hover:text-white rounded-lg transition-colors duration-200">
                {icon}
                <span className="mr-3 text-sm font-semibold flex-1">{title}</span>
                <ChevronDownIcon size="sm" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="mt-1 space-y-1 animate-fade-in">{children}</div>}
        </div>
    );
};

interface SidebarContentProps {
    activePage: string;
    setActivePage: (page: string) => void;
    isMobile: boolean;
    closeSidebar?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ activePage, setActivePage, isMobile, closeSidebar }) => {
    const salesPages = ['orders', 'discounts'];
    const catalogPages = ['products', 'categories', 'inventory', 'reviews'];
    const onlineStorePages = ['theme'];
    const marketingPages = ['marketing', 'saleCampaigns'];
    const contentPages = ['content', 'blog', 'pages'];

    const isPageActive = (pages: string[]) => pages.some(p => activePage.startsWith(p));
    
    return (
        <>
            <div className="flex items-center justify-between h-20 px-6 shrink-0">
                <span className="font-serif text-4xl font-bold text-white">Vineta</span>
                {isMobile && (
                     <button onClick={closeSidebar} className="text-admin-textMuted hover:text-white p-2 -mr-2">
                        <CloseIcon />
                    </button>
                )}
            </div>
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto admin-sidebar-scrollbar">
                <NavItem icon={<HomeIcon size="sm" />} label="لوحة التحكم" page="dashboard" activePage={activePage} setActivePage={setActivePage} />
                <NavItem icon={<ChartBarIcon size="sm" />} label="التحليلات" page="analytics" activePage={activePage} setActivePage={setActivePage} />
                
                <div className="h-px bg-admin-sidebarHover my-4"></div>

                <NavGroup title="المبيعات" icon={<ShoppingBagIcon size="sm" />} initialOpen={isPageActive(salesPages)}>
                    <NavItem icon={<></>} label="الطلبات" page="orders" activePage={activePage} setActivePage={setActivePage} isSubItem />
                    <NavItem icon={<></>} label="الخصومات" page="discounts" activePage={activePage} setActivePage={setActivePage} isSubItem />
                </NavGroup>
                
                <NavGroup title="الكتالوج" icon={<CubeIcon size="sm" />} initialOpen={isPageActive(catalogPages)}>
                     <NavItem icon={<></>} label="المنتجات" page="products" activePage={activePage} setActivePage={setActivePage} isSubItem />
                     <NavItem icon={<></>} label="الفئات" page="categories" activePage={activePage} setActivePage={setActivePage} isSubItem />
                     <NavItem icon={<></>} label="المخزون" page="inventory" activePage={activePage} setActivePage={setActivePage} isSubItem />
                     <NavItem icon={<></>} label="التقييمات" page="reviews" activePage={activePage} setActivePage={setActivePage} isSubItem />
                </NavGroup>

                <NavItem icon={<UsersIcon size="sm" />} label="العملاء" page="customers" activePage={activePage} setActivePage={setActivePage} />
                
                <NavGroup title="التسويق" icon={<MegaphoneIcon size="sm" />} initialOpen={isPageActive(marketingPages)}>
                    <NavItem icon={<></>} label="الحملات" page="marketing" activePage={activePage} setActivePage={setActivePage} isSubItem />
                    <NavItem icon={<></>} label="حملات التخفيضات" page="saleCampaigns" activePage={activePage} setActivePage={setActivePage} isSubItem />
                </NavGroup>
                
                 <NavGroup title="المحتوى" icon={<DocumentTextIcon size="sm" />} initialOpen={isPageActive(contentPages)}>
                    <NavItem icon={<></>} label="المدونة" page="content" activePage={activePage} setActivePage={setActivePage} isSubItem />
                </NavGroup>

                <NavGroup title="المتجر الإلكتروني" icon={<PaintBrushIcon size="sm" />} initialOpen={isPageActive(onlineStorePages)}>
                    <NavItem icon={<></>} label="المظهر" page="theme" activePage={activePage} setActivePage={setActivePage} isSubItem />
                </NavGroup>
                
            </nav>
            <div className="px-4 py-4 space-y-2 border-t border-admin-sidebarHover shrink-0">
                 <NavItem icon={<Cog6ToothIcon size="sm" />} label="الإعدادات" page="settings" activePage={activePage} setActivePage={setActivePage} />
                 <a href="/" className="flex items-center w-full h-11 px-4 text-right rounded-lg transition-all duration-200 text-admin-textMuted hover:bg-admin-sidebarHover hover:text-white">
                    <ArrowRightOnRectangleIcon size="sm" />
                    <span className="mr-3 text-sm font-semibold">الخروج</span>
                 </a>
            </div>
        </>
    );
};


export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, activePage, setActivePage }) => {
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // call on initial render
        return () => window.removeEventListener('resize', handleResize);
    }, [setIsOpen]);
    
    return (
        <>
            {/* Mobile Sidebar (Drawer) */}
            <div className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <aside className={`fixed top-0 right-0 h-full bg-admin-sidebar text-white flex flex-col transition-transform duration-300 z-50 w-64 ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
                <SidebarContent isMobile={true} closeSidebar={() => setIsOpen(false)} activePage={activePage} setActivePage={setActivePage} />
            </aside>

            {/* Desktop Sidebar */}
            <aside className="fixed top-0 right-0 h-full bg-admin-sidebar text-white flex-col transition-all duration-300 z-30 w-64 hidden md:flex">
                 <SidebarContent isMobile={false} activePage={activePage} setActivePage={setActivePage} />
            </aside>
        </>
    );
};