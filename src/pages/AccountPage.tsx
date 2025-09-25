import React, { useState } from 'react';
import { ordersData } from '../data/orders';
import { Order, User, Address } from '../types';
import { OrderDetailModal } from '../components/modals/OrderDetailModal';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { 
    UserIcon, 
    CheckCircleIcon, 
    TruckIcon, 
    XCircleIcon,
    ShoppingBagIcon,
    HeartIcon,
    CloseIcon,
    MapPinIcon,
    LogoutIcon,
    Bars3Icon,
    PencilIcon
} from '../components/icons';

interface AccountPageProps {
    navigateTo: (pageName: string) => void;
    currentUser: User | null;
    onLogout: () => void;
}

const AccountPage = ({ navigateTo, currentUser, onLogout }: AccountPageProps) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [accountDetails, setAccountDetails] = useState({
        fullName: currentUser?.name || 'فينيتا فام',
        email: currentUser?.email || 'vineta@example.com',
        phone: currentUser?.phone || '01234567890',
    });
    
    const [addresses, setAddresses] = useState<Address[]>([
        { id: 1, type: 'الشحن', name: 'المنزل', details: '123 شارع ياران، بانشبول، 2196، أستراليا', isDefault: true },
        { id: 2, type: 'الفوترة', name: 'العمل', details: '456 شارع رئيسي، وسط المدينة، 2196، أستراليا', isDefault: false },
    ]);

    const breadcrumbItems = [
        { label: 'الرئيسية', page: 'home' },
        { label: 'حسابي' }
    ];

    const DashboardContent = () => (
        <div>
            <p className="mb-8 text-lg">
                مرحباً <span className="font-bold">{accountDetails.fullName}</span>! (لست {accountDetails.fullName}؟ <button onClick={onLogout} className="font-bold underline text-brand-primary">تسجيل الخروج</button>)
            </p>
            <p className="mb-10 text-brand-text-light leading-relaxed">
                اليوم هو يوم رائع لتفقد صفحة حسابك. يمكنك التحقق من <button onClick={() => setActiveTab('orders')} className="underline text-brand-primary font-semibold">طلباتك الأخيرة</button> أو إلقاء نظرة على <button onClick={() => setActiveTab('wishlist')} className="underline text-brand-primary font-semibold">قائمة رغباتك</button>. أو ربما يمكنك البدء في <button onClick={() => navigateTo('shop')} className="underline text-brand-primary font-semibold">التسوق من أحدث عروضنا</button>؟
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => setActiveTab('orders')} className="bg-white p-6 rounded-lg border border-brand-border flex items-center gap-6 cursor-pointer hover:shadow-lg hover:border-brand-dark transition-all text-right w-full">
                    <div className="relative">
                        <ShoppingBagIcon className="w-12 h-12 text-brand-dark" />
                        <span className="absolute -top-1 -left-1 bg-brand-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">{ordersData.length}</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl mb-1">الطلبات</h3>
                        <p className="text-brand-text-light text-sm">تحقق من تاريخ جميع طلباتك</p>
                    </div>
                </button>
                 <button onClick={() => setActiveTab('wishlist')} className="bg-white p-6 rounded-lg border border-brand-border flex items-center gap-6 cursor-pointer hover:shadow-lg hover:border-brand-dark transition-all text-right w-full">
                    <div className="relative">
                        <HeartIcon className="w-12 h-12 text-brand-dark" />
                        <span className="absolute -top-1 -left-1 bg-brand-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">2</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl mb-1">قائمة الرغبات</h3>
                        <p className="text-brand-text-light text-sm">تحقق من قائمة رغباتك</p>
                    </div>
                </button>
                 <button onClick={() => setActiveTab('addresses')} className="bg-white p-6 rounded-lg border border-brand-border flex items-center gap-6 cursor-pointer hover:shadow-lg hover:border-brand-dark transition-all text-right w-full">
                    <MapPinIcon className="w-12 h-12 text-brand-dark" />
                    <div>
                        <h3 className="font-bold text-xl mb-1">العناوين</h3>
                        <p className="text-brand-text-light text-sm">إدارة عناوين الشحن والفوترة</p>
                    </div>
                </button>
                 <button onClick={() => setActiveTab('details')} className="bg-white p-6 rounded-lg border border-brand-border flex items-center gap-6 cursor-pointer hover:shadow-lg hover:border-brand-dark transition-all text-right w-full">
                    <UserIcon className="w-12 h-12 text-brand-dark" />
                    <div>
                        <h3 className="font-bold text-xl mb-1">تفاصيل الحساب</h3>
                        <p className="text-brand-text-light text-sm">تحديث معلوماتك الشخصية</p>
                    </div>
                </button>
            </div>
        </div>
    );

    const statusTranslations: { [key: string]: string } = { 'Delivered': 'تم التوصيل', 'On the way': 'قيد التوصيل', 'Cancelled': 'تم الإلغاء' };
    const statusClasses: { [key: string]: string } = { 'تم التوصيل': 'bg-brand-delivered/10 text-brand-delivered', 'قيد التوصيل': 'bg-brand-onway/10 text-brand-onway', 'تم الإلغاء': 'bg-brand-sale/10 text-brand-sale' };
    const statusIcon = (status: Order['status']) => {
        switch (status) {
            case 'Delivered': return <CheckCircleIcon size="sm" className="w-4 h-4" />;
            case 'On the way': return <TruckIcon size="sm" className="w-4 h-4" />;
            case 'Cancelled': return <XCircleIcon size="sm" className="w-4 h-4" />;
            default: return null;
        }
    };

    const OrdersContent = () => (
        <div>
            <h2 className="text-xl font-bold mb-4">طلباتي</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="bg-brand-subtle text-brand-text-light">
                        <tr>
                            <th className="p-3 font-semibold">الطلب</th>
                            <th className="p-3 font-semibold">التاريخ</th>
                            <th className="p-3 font-semibold">الحالة</th>
                            <th className="p-3 font-semibold">الإجمالي</th>
                            <th className="p-3 font-semibold">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersData.map(order => {
                            const translatedStatus = statusTranslations[order.status] || order.status;
                            return (
                                <tr key={order.id} className="border-b">
                                    <td className="p-3 font-bold text-brand-dark">{order.id}</td>
                                    <td className="p-3">{order.date}</td>
                                    <td className="p-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold ${statusClasses[translatedStatus]}`}>
                                            {statusIcon(order.status)}
                                            {translatedStatus}
                                        </span>
                                    </td>
                                    <td className="p-3">{order.total} ج.م</td>
                                    <td className="p-3"><button onClick={() => setSelectedOrder(order)} className="font-bold text-brand-primary">عرض</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const DetailsContent = () => (
        <div>
            <h2 className="text-xl font-bold mb-4">تفاصيل الحساب</h2>
            <form className="space-y-4 max-w-lg">
                <div>
                    <label className="block font-semibold mb-1 text-sm text-brand-text-light">الاسم الكامل</label>
                    <input type="text" value={accountDetails.fullName} onChange={(e) => setAccountDetails({ ...accountDetails, fullName: e.target.value })} className="w-full border p-2 rounded-lg border-brand-border" />
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-sm text-brand-text-light">البريد الإلكتروني</label>
                    <input type="email" value={accountDetails.email} onChange={(e) => setAccountDetails({ ...accountDetails, email: e.target.value })} className="w-full border p-2 rounded-lg border-brand-border" />
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-sm text-brand-text-light">رقم الهاتف</label>
                    <input type="tel" value={accountDetails.phone} onChange={(e) => setAccountDetails({ ...accountDetails, phone: e.target.value })} className="w-full border p-2 rounded-lg border-brand-border" />
                </div>
                <div>
                    <h3 className="font-bold mt-4 mb-2">تغيير كلمة المرور</h3>
                    <input type="password" placeholder="كلمة المرور الحالية" className="w-full border p-2 rounded-lg border-brand-border mb-2" />
                    <input type="password" placeholder="كلمة المرور الجديدة" className="w-full border p-2 rounded-lg border-brand-border mb-2" />
                    <input type="password" placeholder="تأكيد كلمة المرور الجديدة" className="w-full border p-2 rounded-lg border-brand-border" />
                </div>
                <button type="button" className="bg-brand-dark text-white font-bold py-3 px-8 rounded-full">حفظ التغييرات</button>
            </form>
        </div>
    );
    
    const AddressesContent = () => (
         <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">عناويني</h2>
                <button className="bg-brand-dark text-white font-bold py-2 px-5 rounded-full text-sm">إضافة عنوان جديد</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map(address => (
                    <div key={address.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                             <div>
                                <h3 className="font-bold">{address.name} ({address.type})</h3>
                                {address.isDefault && <span className="text-xs bg-brand-subtle text-brand-text-light font-semibold px-2 py-0.5 rounded-full">افتراضي</span>}
                             </div>
                             <button className="text-brand-text-light hover:text-brand-dark"><PencilIcon size="sm"/></button>
                        </div>
                        <p className="text-brand-text-light mt-2">{address.details}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const WishlistContent = () => (
        <div>
            <h2 className="text-xl font-bold mb-4">قائمة رغباتي</h2>
            <p>قائمة رغباتك فارغة حالياً. يمكنك إضافة منتجات عن طريق النقر على أيقونة القلب.</p>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardContent />;
            case 'orders': return <OrdersContent />;
            case 'details': return <DetailsContent />;
            case 'addresses': return <AddressesContent />;
            case 'wishlist': return <WishlistContent />;
            default: return <DashboardContent />;
        }
    };
    
    const SidebarNav = ({ isMobile = false }) => {
        const handleNav = (tab: string) => {
            if (tab === 'logout') {
                onLogout();
            } else {
                 setActiveTab(tab);
            }
            if (isMobile) setIsSidebarOpen(false);
        };
        const navItems = [
            { id: 'dashboard', label: 'لوحة التحكم', icon: <UserIcon size="sm"/> },
            { id: 'orders', label: 'طلباتي', icon: <ShoppingBagIcon size="sm"/> },
            { id: 'wishlist', label: 'قائمة رغباتي', icon: <HeartIcon size="sm"/> },
            { id: 'addresses', label: 'العناوين', icon: <MapPinIcon size="sm"/> },
            { id: 'details', label: 'تفاصيل الحساب', icon: <PencilIcon size="sm"/> },
            { id: 'logout', label: 'تسجيل الخروج', icon: <LogoutIcon size="sm"/> },
        ];
        return (
            <nav className="flex flex-col">
                {navItems.map(item => (
                    <button 
                        key={item.id} 
                        onClick={() => handleNav(item.id)} 
                        className={`w-full text-right p-4 font-semibold text-base flex items-center gap-3 ${activeTab === item.id ? 'bg-brand-primary/10 text-brand-primary border-r-4 border-brand-primary' : 'hover:bg-gray-100 text-brand-text-light hover:text-brand-dark'}`}>
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        );
    };

    return (
        <div className="bg-brand-subtle">
            <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="حسابي" />
            
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden fixed top-1/2 -translate-y-1/2 left-0 bg-brand-dark text-white shadow-lg p-2 rounded-r-md z-30">
                <Bars3Icon size="md" />
            </button>

            <div className={`fixed inset-0 z-50 md:hidden ${!isSidebarOpen && 'pointer-events-none'}`}>
                <div className={`fixed inset-0 bg-black/40 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsSidebarOpen(false)}></div>
                <div className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-xl transition-transform transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                     <div className="p-4 flex justify-between items-center border-b">
                        <h2 className="font-bold text-lg">قائمة الحساب</h2>
                        <button onClick={() => setIsSidebarOpen(false)}><CloseIcon /></button>
                    </div>
                    <SidebarNav isMobile={true} />
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row-reverse gap-8">
                    <aside className="hidden md:block w-72 flex-shrink-0">
                        <div className="bg-white rounded-lg overflow-hidden border">
                           <SidebarNav />
                        </div>
                    </aside>
                    <main className="flex-1 bg-white p-6 rounded-lg border">
                        {renderContent()}
                    </main>
                </div>
            </div>
            
            <OrderDetailModal isOpen={!!selectedOrder} order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </div>
    );
};

export default AccountPage;
