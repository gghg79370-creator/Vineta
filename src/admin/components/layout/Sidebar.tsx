import React, { useState, useEffect } from 'react';
import { 
    HomeIcon, ShoppingBagIcon, CubeIcon, UsersIcon, ChartBarIcon, TagIcon, 
    MegaphoneIcon, PaintBrushIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, 
    ChevronDownIcon, StarIcon, DocumentTextIcon, CloseIcon, ChevronLeftIcon,
    EnvelopeIcon,
} from '../../../components/icons';
import { useAppState } from '../../../state/AppState';

interface SidebarProps {
    isOpen: boolean; // For mobile drawer
    setIsOpen: (isOpen: boolean) => void;
    isCollapsed: boolean; // For desktop collapse
    setIsCollapsed: (isCollapsed: boolean | ((prevState: boolean) => boolean)) => void;
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
    isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, page, activePage, setActivePage, isSubItem = false, isCollapsed }) => {
    const isActive = activePage.startsWith(page);
    return (
        <div className="relative group">
            <button
                onClick={() => setActivePage(page)}
                className={`flex items-center w-full h-11 px-4 text-right rounded-lg transition-all duration-200
                    ${isActive ? 'bg-admin-accent/10 text-admin-accent font-bold' : 'text-admin-textMuted hover:bg-admin-sidebarHover hover:text-white'}
                    ${isSubItem && !isCollapsed ? 'pr-10' : ''}`}
            >
                {isActive && <div className="absolute right-0 top-0 h-full w-1 bg-admin-accent rounded-r-full"></div>}
                <div className="w-5 flex justify-center">{icon}</div>
                {!isCollapsed && <span className="mr-3 text-sm font-semibold whitespace-nowrap">{label}</span>}
            </button>
            {isCollapsed && (
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-admin-sidebarHover text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {label}
                </div>
            )}
        </div>
    );
}

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
        return <div className="my-2 border-t border-admin-sidebarHover/50"></div>;
    }

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center w-full h-11 px-4 text-right text-admin-textMuted hover:bg-admin-sidebarHover hover:text-white rounded-lg transition-colors duration-200">
                <div className="w-5 flex justify-center">{icon}</div>
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
    isCollapsed: boolean;
    isMobile: boolean;
    closeSidebar?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ activePage, setActivePage, isCollapsed, isMobile, closeSidebar }) => {
    const { state: { theme } } = useAppState();
    const salesPages = ['orders', 'discounts'];
    const catalogPages = ['products', 'categories', 'inventory', 'reviews'];
    const onlineStorePages = ['theme'];
    const marketingPages = ['marketing', 'saleCampaigns', 'subscribers'];
    const contentPages = ['content', 'blog', 'pages'];

    const isPageActive = (pages: string[]) => pages.some(p => activePage.startsWith(p));
    
    const navItemProps = { activePage, setActivePage, isCollapsed };
    
    return (
        <>
            <div className={`flex items-center justify-between h-20 px-6 shrink-0 ${isCollapsed ? 'px-4' : 'px-6'}`}>
                {!isCollapsed && <span className="font-serif text-4xl font-bold text-white">{theme.siteName}</span>}
                {isMobile && (
                     <button onClick={closeSidebar} className="text-admin-textMuted hover:text-white p-2 -mr-2">
                        <CloseIcon />
                    </button>
                )}
            </div>
            <nav className={`flex-1 px-4 space-y-1.5 overflow-y-auto admin-sidebar-scrollbar ${isCollapsed ? 'px-2' : 'px-4'}`}>
                <NavItem icon={<HomeIcon size="sm" />} label="لوحة التحكم" page="dashboard" {...navItemProps} />
                <NavItem icon={<ChartBarIcon size="sm" />} label="التحليلات" page="analytics" {...navItemProps} />
                
                <div className="h-px bg-admin-sidebarHover my-4"></div>

                <NavGroup title="المبيعات" icon={<ShoppingBagIcon size="sm" />} initialOpen={isPageActive(salesPages)} isCollapsed={isCollapsed}>
                    <NavItem icon={<></>} label="الطلبات" page="orders" isSubItem {...navItemProps} />
                    <NavItem icon={<></>} label="الخصومات" page="discounts" isSubItem {...navItemProps} />
                </NavGroup>
                
                <NavGroup title="الكتالوج" icon={<CubeIcon size="sm" />} initialOpen={isPageActive(catalogPages)} isCollapsed={isCollapsed}>
                     <NavItem icon={<></>} label="المنتجات" page="products" isSubItem {...navItemProps} />
                     <NavItem icon={<></>} label="الفئات" page="categories" isSubItem {...navItemProps} />
                     <NavItem icon={<></>} label="المخزون" page="inventory" isSubItem {...navItemProps} />
                     <NavItem icon={<></>} label="التقييمات" page="reviews" isSubItem {...navItemProps} />
                </NavGroup>

                <NavItem icon={<UsersIcon size="sm" />} label="العملاء" page="customers" {...navItemProps} />
                
                <NavGroup title="التسويق" icon={<MegaphoneIcon size="sm" />} initialOpen={isPageActive(marketingPages)} isCollapsed={isCollapsed}>
                    <NavItem icon={<></>} label="الحملات" page="marketing" isSubItem {...navItemProps} />
                    <NavItem icon={<></>} label="حملات التخفيضات" page="saleCampaigns" isSubItem {...navItemProps} />
                    <NavItem icon={<></>} label="المشتركون" page="subscribers" isSubItem {...navItemProps} />
                </NavGroup>
                
                 <NavGroup title="المحتوى" icon={<DocumentTextIcon size="sm" />} initialOpen={isPageActive(contentPages)} isCollapsed={isCollapsed}>
                    <NavItem icon={<></>} label="المدونة" page="content" isSubItem {...navItemProps} />
                </NavGroup>

                <NavGroup title="المتجر الإلكتروني" icon={<PaintBrushIcon size="sm" />} initialOpen={isPageActive(onlineStorePages)} isCollapsed={isCollapsed}>
                    <NavItem icon={<></>} label="المظهر" page="theme" isSubItem {...navItemProps} />
                </NavGroup>
                
            </nav>
            <div className={`px-4 py-4 space-y-2 border-t border-admin-sidebarHover shrink-0 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                 <NavItem icon={<Cog6ToothIcon size="sm" />} label="الإعدادات" page="settings" {...navItemProps} />
                 <div className="relative group">
                    <a href="/" title="العودة للموقع" className="flex items-center w-full h-11 px-4 text-right rounded-lg transition-all duration-200 text-admin-textMuted hover:bg-admin-sidebarHover hover:text-white">
                        <div className="w-5 flex justify-center"><ArrowRightOnRectangleIcon size="sm" /></div>
                        {!isCollapsed && <span className="mr-3 text-sm font-semibold whitespace-nowrap">العودة للموقع</span>}
                    </a>
                    {isCollapsed && (
                        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-admin-sidebarHover text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            العودة للموقع
                        </div>
                    )}
                 </div>
            </div>
        </>
    );
};


export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed, activePage, setActivePage }) => {
    
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
                <SidebarContent isMobile={true} closeSidebar={() => setIsOpen(false)} activePage={activePage} setActivePage={setActivePage} isCollapsed={false} />
            </aside>

            {/* Desktop Sidebar */}
            <aside className={`fixed top-0 right-0 h-full bg-admin-sidebar text-white flex-col transition-all duration-300 z-30 hidden md:flex ${isCollapsed ? 'w-20' : 'w-64'}`}>
                 <SidebarContent isMobile={false} activePage={activePage} setActivePage={setActivePage} isCollapsed={isCollapsed} />
                 <button 
                    onClick={() => setIsCollapsed(prev => !prev)}
                    className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-admin-border rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-admin-accent hover:text-admin-accent transition-all z-40"
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                 >
                    <ChevronLeftIcon className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                 </button>
            </aside>
        </>
    );
};