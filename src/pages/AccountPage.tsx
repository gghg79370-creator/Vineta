
import React, { useState, useEffect, useMemo } from 'react';
import { ordersData } from '../data/orders';
import { Order, User, Address, Product, TrackingEvent, TodoItem } from '../types';
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
    PencilIcon,
    LockClosedIcon,
    PackageIcon,
    PhoneIcon,
    EnvelopeIcon,
    SparklesIcon,
    ClipboardCheckIcon,
    PlusIcon,
    TrashIcon,
    Cog6ToothIcon,
    ChevronDownIcon,
    CameraIcon,
    GridViewIcon
} from '../components/icons';
import { useAppState } from '../state/AppState';
import { useToast } from '../hooks/useToast';
import Spinner from '../components/ui/Spinner';
import KpiCardSkeleton from '../components/ui/skeletons/KpiCardSkeleton';
import OrderHistorySkeleton from '../components/ui/skeletons/OrderHistorySkeleton';
import PasswordStrengthIndicator from '../components/ui/PasswordStrengthIndicator';
import { GoogleGenAI, Type } from "@google/genai";
import OrderTracker from '../components/ui/OrderTracker';
import { WishlistGrid } from '../components/wishlist/WishlistGrid';
import AddressModal from '../components/modals/AddressModal';
import { allProducts } from '../data/products';


interface AccountPageProps {
    navigateTo: (pageName: string, data?: any) => void;
    onLogout: () => void;
}

// Helper for both list and grid cards
const statusIcon = (status: Order['status']) => {
    switch (status) {
        case 'Delivered': return <CheckCircleIcon size="sm" className="w-4 h-4" />;
        case 'On the way': return <TruckIcon size="sm" className="w-4 h-4" />;
        case 'Cancelled': return <XCircleIcon size="sm" className="w-4 h-4" />;
        default: return null;
    }
};


const OrderCard: React.FC<{ order: Order, isExpanded: boolean, onToggle: () => void, navigateTo: (page: string, data?: any) => void }> = ({ order, isExpanded, onToggle, navigateTo }) => {
    const statusTranslations: { [key: string]: string } = { 'Delivered': 'تم التوصيل', 'On the way': 'قيد التوصيل', 'Cancelled': 'تم الإلغاء' };
    const statusClasses: { [key: string]: string } = { 'تم التوصيل': 'bg-brand-delivered/10 text-brand-delivered', 'قيد التوصيل': 'bg-brand-onway/10 text-brand-onway', 'تم الإلغاء': 'bg-brand-sale/10 text-brand-sale' };
    const translatedStatus = statusTranslations[order.status] || order.status;

    return (
        <div className="bg-white border border-brand-border rounded-xl overflow-hidden transition-all duration-300">
            <div className="p-4 cursor-pointer hover:bg-brand-subtle" onClick={onToggle}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-xs text-brand-text-light">رقم الطلب</p>
                            <p className="font-bold text-brand-primary">{order.id}</p>
                        </div>
                        <div>
                            <p className="text-xs text-brand-text-light">التاريخ</p>
                            <p className="font-semibold text-brand-dark">{order.date}</p>
                        </div>
                        <div>
                            <p className="text-xs text-brand-text-light">الإجمالي</p>
                            <p className="font-bold text-brand-dark">{order.total} ج.م</p>
                        </div>
                        <div>
                            <p className="text-xs text-brand-text-light">الحالة</p>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold ${statusClasses[translatedStatus]}`}>
                                {statusIcon(order.status)}
                                {translatedStatus}
                            </span>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <ChevronDownIcon className={`w-6 h-6 text-brand-text-light transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 md:p-6 border-t border-brand-border bg-brand-subtle/50 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="md:col-span-3">
                            <h4 className="font-bold text-md mb-3 text-brand-dark">المنتجات ({order.items.length})</h4>
                            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-md flex-shrink-0" />
                                        <div className="text-sm flex-grow">
                                            <p className="font-bold text-brand-dark">{item.name}</p>
                                            <p className="text-xs text-brand-text-light">{item.variant}</p>
                                            <p className="text-xs text-brand-text-light">الكمية: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-brand-dark mr-auto text-sm flex-shrink-0">{(parseFloat(item.price) * item.quantity).toFixed(2)} ج.م</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <h4 className="font-bold text-md mb-3 text-brand-dark">تتبع الشحنة</h4>
                            <OrderTracker order={order} />
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row justify-end items-center gap-3">
                        <button className="bg-white border border-brand-border text-brand-dark font-bold py-2 px-5 rounded-full text-sm hover:bg-brand-subtle w-full sm:w-auto">
                            إعادة الطلب
                        </button>
                         <button className="bg-brand-dark text-white font-bold py-2 px-5 rounded-full text-sm hover:bg-opacity-90 w-full sm:w-auto">
                            ترك تقييم
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const OrderGridCard: React.FC<{ order: Order, isExpanded: boolean, onToggle: () => void }> = ({ order, isExpanded, onToggle }) => {
    const statusTranslations: { [key: string]: string } = { 'Delivered': 'تم التوصيل', 'On the way': 'قيد التوصيل', 'Cancelled': 'تم الإلغاء' };
    const statusClasses: { [key: string]: string } = { 'تم التوصيل': 'bg-brand-delivered/10 text-brand-delivered', 'قيد التوصيل': 'bg-brand-onway/10 text-brand-onway', 'تم الإلغاء': 'bg-brand-sale/10 text-brand-sale' };
    const translatedStatus = statusTranslations[order.status] || order.status;

    return (
        <div className="bg-white border border-brand-border rounded-xl overflow-hidden transition-all duration-300">
            <div className="p-4 cursor-pointer hover:bg-brand-subtle" onClick={onToggle}>
                <div className="flex justify-between items-start">
                    <p className="font-bold text-brand-primary text-sm">{order.id}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold ${statusClasses[translatedStatus]}`}>
                        {statusIcon(order.status)}
                        {translatedStatus}
                    </span>
                </div>
                <div className="mt-4 text-sm space-y-2">
                    <div className="flex justify-between"><span className="text-brand-text-light">التاريخ:</span><span className="font-semibold text-brand-dark">{order.date}</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-light">الإجمالي:</span><span className="font-bold text-brand-dark">{order.total} ج.م</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-light">المنتجات:</span><span className="font-semibold text-brand-dark">{order.items.length}</span></div>
                </div>
            </div>
            {isExpanded && (
                <div className="p-4 border-t border-brand-border bg-brand-subtle/50 animate-fade-in">
                    <h4 className="font-bold text-sm mb-2 text-brand-dark">المنتجات</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs">
                                <img src={item.image} alt={item.name} className="w-8 h-10 object-cover rounded-sm" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-brand-dark truncate">{item.name}</p>
                                    <p className="text-brand-text-light">الكمية: {item.quantity}</p>
                                </div>
                                <p className="font-semibold flex-shrink-0">{(parseFloat(item.price) * item.quantity).toFixed(2)} ج.م</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const AccountPage = ({ navigateTo, onLogout }: AccountPageProps) => {
    const { state, dispatch } = useAppState();
    const { currentUser, wishlist } = state;

    const [activeTab, setActiveTab] = useState(() => localStorage.getItem('accountActiveTab') || 'dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const addToast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        localStorage.setItem('accountActiveTab', activeTab);
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        
        return () => clearTimeout(timer);
    }, [activeTab]);

    const breadcrumbItems = [ { label: 'الرئيسية', page: 'home' }, { label: 'حسابي' } ];

    const DashboardContent = () => (
        <div>
            {isLoading ? (
                <div className="animate-skeleton-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-8"></div>
                    <div className="h-5 bg-gray-200 rounded w-full mb-10"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => <KpiCardSkeleton key={i} />)}
                    </div>
                </div>
            ) : (
                <>
                    <p className="mb-8 text-lg">
                        مرحباً <span className="font-bold">{currentUser?.name}</span>! (لست {currentUser?.name}؟ <button onClick={onLogout} className="font-bold underline text-brand-primary">تسجيل الخروج</button>)
                    </p>
                    <p className="mb-10 text-brand-text-light leading-relaxed">
                        اليوم هو يوم رائع لتفقد صفحة حسابك. يمكنك التحقق من <button onClick={() => setActiveTab('orders')} className="underline text-brand-primary font-semibold">طلباتك الأخيرة</button> أو إلقاء نظرة على <button onClick={() => setActiveTab('wishlist')} className="underline text-brand-primary font-semibold">قائمة رغباتك</button>. أو ربما يمكنك البدء في <button onClick={() => navigateTo('shop')} className="underline text-brand-primary font-semibold">التسوق من أحدث عروضنا</button>؟
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button onClick={() => setActiveTab('orders')} className="bg-white p-6 rounded-lg border border-brand-border flex items-center gap-6 cursor-pointer hover:shadow-lg hover:border-brand-dark transition-all text-right w-full">
                            <div className="relative"><ShoppingBagIcon className="w-12 h-12 text-brand-dark" /><span className="absolute -top-1 -left-1 bg-brand-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">{ordersData.length}</span></div>
                            <div><h3 className="font-bold text-xl mb-1">الطلبات</h3><p className="text-brand-text-light text-sm">تحقق من تاريخ جميع طلباتك</p></div>
                        </button>
                         <button onClick={() => setActiveTab('profile')} className="bg-white p-6 rounded-lg border border-brand-border flex items-center gap-6 cursor-pointer hover:shadow-lg hover:border-brand-dark transition-all text-right w-full">
                            <UserIcon className="w-12 h-12 text-brand-dark" />
                            <div><h3 className="font-bold text-xl mb-1">تفاصيل الحساب</h3><p className="text-brand-text-light text-sm">تحديث معلوماتك وعناوينك</p></div>
                        </button>
                         <button onClick={() => setActiveTab('wishlist')} className="bg-white p-6 rounded-lg border border-brand-border flex items-center gap-6 cursor-pointer hover:shadow-lg hover:border-brand-dark transition-all text-right w-full">
                            <div className="relative"><HeartIcon className="w-12 h-12 text-brand-dark" /><span className="absolute -top-1 -left-1 bg-brand-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">{state.wishlist.length}</span></div>
                            <div><h3 className="font-bold text-xl mb-1">قائمة الرغبات</h3><p className="text-brand-text-light text-sm">تحقق من قائمة رغباتك</p></div>
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    const OrdersContent = () => {
        const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
        const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    
        const toggleOrder = (orderId: string) => {
            setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
        };
    
        return isLoading ? <OrderHistorySkeleton /> : (
            <div>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-dark">طلباتي</h2>
                    <div className="hidden md:flex items-center gap-1 border border-brand-border rounded-full p-1 bg-white">
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-brand-subtle text-brand-dark' : 'text-brand-text-light hover:bg-brand-subtle'}`} aria-label="List View">
                            <Bars3Icon size="sm" />
                        </button>
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-brand-subtle text-brand-dark' : 'text-brand-text-light hover:bg-brand-subtle'}`} aria-label="Grid View">
                            <GridViewIcon columns={2} className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {ordersData.length > 0 ? (
                    viewMode === 'list' ? (
                        <div className="space-y-4">
                            {ordersData.map(order => (
                                <OrderCard 
                                    key={order.id}
                                    order={order} 
                                    isExpanded={expandedOrderId === order.id}
                                    onToggle={() => toggleOrder(order.id)}
                                    navigateTo={navigateTo}
                                />
                            ))}
                        </div>
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {ordersData.map(order => (
                                <OrderGridCard 
                                    key={order.id}
                                    order={order}
                                    isExpanded={expandedOrderId === order.id}
                                    onToggle={() => toggleOrder(order.id)}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="text-center py-16 bg-brand-subtle rounded-lg">
                        <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-brand-dark">لا توجد طلبات بعد</h3>
                        <p className="text-brand-text-light my-2">يبدو أنك لم تقم بأي طلبات بعد.</p>
                        <button onClick={() => navigateTo('shop')} className="mt-4 bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 active:scale-95">
                            ابدأ التسوق
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const AccountDetailsContent = () => {
        const { currentUser } = state;
        const { addresses } = currentUser || { addresses: [] };
        
        const [isEditingProfile, setIsEditingProfile] = useState(false);
        const [profileData, setProfileData] = useState({ name: currentUser?.name || '', email: currentUser?.email || '', phone: currentUser?.phone || '' });
        const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
        const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

        const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
        const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);

        const handleAddAddressClick = () => {
            setAddressToEdit(null);
            setIsAddressModalOpen(true);
        };

        const handleEditAddressClick = (address: Address) => {
            setAddressToEdit(address);
            setIsAddressModalOpen(true);
        };
        
        const handleDeleteAddress = (addressId: number) => {
            if (window.confirm('هل أنت متأكد أنك تريد حذف هذا العنوان؟')) {
                dispatch({ type: 'DELETE_ADDRESS', payload: addressId });
                addToast('تم حذف العنوان بنجاح!', 'success');
            }
        };

        const handleSetDefault = (addressId: number) => {
            dispatch({ type: 'SET_DEFAULT_ADDRESS', payload: addressId });
            addToast('تم تحديث العنوان الافتراضي.', 'success');
        };

        const handleSaveAddress = (address: Omit<Address, 'id'> | Address) => {
            if ('id' in address && address.id > 0) {
                dispatch({ type: 'UPDATE_ADDRESS', payload: address });
                addToast('تم تحديث العنوان بنجاح!', 'success');
            } else {
                dispatch({ type: 'ADD_ADDRESS', payload: address });
                addToast('تمت إضافة العنوان بنجاح!', 'success');
            }
            setIsAddressModalOpen(false);
        };

        const handleProfileSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            setIsSubmittingProfile(true);
            const payload = { name: profileData.name, email: profileData.email, phone: profileData.phone };
            dispatch({ type: 'UPDATE_USER_PROFILE', payload });
            setTimeout(() => {
                setIsSubmittingProfile(false);
                setIsEditingProfile(false);
                addToast('تم حفظ الملف الشخصي بنجاح!', 'success');
            }, 1000);
        };

        const handlePasswordSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (passwordData.newPassword.length < 8) {
                addToast('يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل.', 'error');
                return;
            }
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                addToast('كلمتا المرور الجديدتان غير متطابقتين.', 'error');
                return;
            }
            // Mock API call
            console.log("Updating password...");
            addToast('تم تحديث كلمة المرور بنجاح!', 'success');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        };
        
        const InputField = ({ label, value, ...props }: any) => (
            <div>
                <label className="block font-semibold mb-1 text-sm text-brand-text-light">{label}</label>
                <input value={value} {...props} className="w-full border p-2 rounded-lg border-brand-border focus:ring-brand-dark" />
            </div>
        );

        const InfoRow = ({ label, value, icon }: any) => (
            <div className="flex items-start gap-4 py-3">
                {React.cloneElement(icon, { className: "w-5 h-5 text-brand-text-light mt-1" })}
                <div>
                    <p className="text-sm text-brand-text-light font-semibold">{label}</p>
                    <p className="font-semibold text-brand-dark">{value || '-'}</p>
                </div>
            </div>
        );
        
        const AddressCard: React.FC<{ address: Address }> = ({ address }) => (
            <div className={`border p-4 rounded-xl relative ${address.isDefault ? 'border-brand-primary' : ''}`}>
                {address.isDefault && <div className="absolute top-3 left-3 text-xs bg-brand-primary text-white font-semibold px-2 py-0.5 rounded-full">افتراضي</div>}
                <h4 className="font-bold text-brand-dark">{address.name} <span className="font-normal text-sm text-brand-text-light">({address.recipientName})</span></h4>
                <p className="text-brand-text-light mt-2 text-sm leading-relaxed">{`${address.street}, ${address.city}, ${address.country}, ${address.postalCode}`}</p>
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <button onClick={() => handleEditAddressClick(address)} className="text-sm font-semibold text-brand-primary hover:underline">تعديل</button>
                    <span className="text-brand-border">|</span>
                    <button onClick={() => handleDeleteAddress(address.id)} className="text-sm font-semibold text-brand-sale hover:underline">حذف</button>
                    {!address.isDefault && (
                        <>
                            <span className="text-brand-border">|</span>
                            <button onClick={() => handleSetDefault(address.id)} className="text-sm font-semibold text-green-600 hover:underline">تعيين كافتراضي</button>
                        </>
                    )}
                </div>
            </div>
        );

        const AccountDetailsSkeleton = () => (
            <div className="animate-skeleton-pulse space-y-8">
                <div className="border rounded-lg p-6">
                    <div className="flex items-center gap-6 mb-6">
                        <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                        <div className="space-y-3">
                            <div className="h-6 bg-gray-300 rounded w-48"></div>
                            <div className="h-4 bg-gray-200 rounded w-64"></div>
                        </div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="border rounded-lg p-6">
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-full mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                </div>
            </div>
        );


        return isLoading ? <AccountDetailsSkeleton /> : (
            <div>
                <h2 className="text-2xl font-bold mb-6 text-brand-dark">تفاصيل الحساب</h2>
                <div className="space-y-8">
                    {/* Personal Information Card */}
                    <div className="border p-6 rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-lg">المعلومات الشخصية</h3>
                            {!isEditingProfile && <button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:underline"><PencilIcon size="sm" /> تعديل</button>}
                        </div>

                        <div className="flex items-center gap-6 mb-6">
                            <div className="relative">
                                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Avatar" className="w-24 h-24 rounded-full"/>
                                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border rounded-full flex items-center justify-center hover:bg-gray-100"><CameraIcon size="sm"/></button>
                            </div>
                            <div>
                                <h4 className="font-bold text-xl text-brand-dark">{currentUser?.name}</h4>
                                <p className="text-brand-text-light">{currentUser?.email}</p>
                            </div>
                        </div>

                        {isEditingProfile ? (
                            <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg animate-fade-in">
                                <InputField label="الاسم الكامل" value={profileData.name} onChange={(e: any) => setProfileData({...profileData, name: e.target.value})} />
                                <InputField label="البريد الإلكتروني" type="email" value={profileData.email} onChange={(e: any) => setProfileData({...profileData, email: e.target.value})} />
                                <InputField label="رقم الهاتف" type="tel" value={profileData.phone} onChange={(e: any) => setProfileData({...profileData, phone: e.target.value})} />
                                <div className="flex items-center gap-3 pt-2">
                                    <button type="button" onClick={() => setIsEditingProfile(false)} className="bg-white border border-brand-border text-brand-dark font-bold py-2.5 px-6 rounded-full">إلغاء</button>
                                    <button type="submit" disabled={isSubmittingProfile} className="bg-brand-dark text-white font-bold py-2.5 px-6 rounded-full min-h-[44px] flex items-center justify-center">{isSubmittingProfile ? <Spinner size="sm"/> : 'حفظ'}</button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <InfoRow label="الاسم الكامل" value={currentUser?.name} icon={<UserIcon/>}/>
                                <InfoRow label="البريد الإلكتروني" value={currentUser?.email} icon={<EnvelopeIcon/>}/>
                                <InfoRow label="رقم الهاتف" value={currentUser?.phone} icon={<PhoneIcon/>}/>
                            </div>
                        )}
                    </div>

                    {/* Password Card */}
                    <div className="border p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-4">كلمة المرور والأمان</h3>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
                            <InputField label="كلمة المرور الحالية" type="password" value={passwordData.currentPassword} onChange={(e: any) => setPasswordData({...passwordData, currentPassword: e.target.value})} />
                            <div>
                                <InputField label="كلمة المرور الجديدة" type="password" value={passwordData.newPassword} onChange={(e: any) => setPasswordData({...passwordData, newPassword: e.target.value})}/>
                                <PasswordStrengthIndicator password={passwordData.newPassword} />
                            </div>
                            <InputField label="تأكيد كلمة المرور الجديدة" type="password" value={passwordData.confirmPassword} onChange={(e: any) => setPasswordData({...passwordData, confirmPassword: e.target.value})}/>
                            <button type="submit" className="bg-brand-dark text-white font-bold py-2.5 px-6 rounded-full">تحديث كلمة المرور</button>
                        </form>
                    </div>

                    {/* Address Book Card */}
                    <div className="border p-6 rounded-lg">
                         <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">دفتر العناوين</h3><button onClick={handleAddAddressClick} className="flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:underline"><PlusIcon size="sm"/> إضافة عنوان جديد</button></div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.length > 0 ? (
                                addresses.map(address => <AddressCard key={address.id} address={address} />)
                            ) : (
                                <p className="text-brand-text-light md:col-span-2 text-center py-4">لا توجد عناوين محفوظة.</p>
                            )}
                         </div>
                    </div>
                </div>
                <AddressModal 
                    isOpen={isAddressModalOpen}
                    onClose={() => setIsAddressModalOpen(false)}
                    onSave={handleSaveAddress}
                    addressToEdit={addressToEdit}
                />
            </div>
        );
    };

    const WishlistContent = () => (
        isLoading ? (
             <div className="animate-skeleton-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">{[...Array(3)].map((_, i) => <div key={i} className="bg-gray-200 rounded-lg aspect-[4/5]"></div>)}</div>
            </div>
        ) : (
            <div>
                <h2 className="text-2xl font-bold mb-6 text-brand-dark">قائمة رغباتي</h2>
                <WishlistGrid navigateTo={navigateTo} />
            </div>
        )
    );
    
    const PlannerContent = () => {
        const { state, dispatch } = useAppState();
        const { todos, wishlist } = state;
        const [newTodoText, setNewTodoText] = useState('');
        const [suggestions, setSuggestions] = useState<string[]>([]);
        const [isGenerating, setIsGenerating] = useState(false);
    
        const handleAddTodo = (e: React.FormEvent, text?: string) => {
            e.preventDefault();
            const textToAdd = text || newTodoText;
            if (textToAdd.trim()) {
                dispatch({ type: 'ADD_TODO', payload: textToAdd.trim() });
                if (!text) setNewTodoText('');
                if (text) setSuggestions(prev => prev.filter(s => s !== text));
            }
        };
    
        const handleToggleTodo = (id: number) => {
            dispatch({ type: 'TOGGLE_TODO', payload: id });
        };
        
        const handleRemoveTodo = (id: number) => {
            dispatch({ type: 'REMOVE_TODO', payload: id });
        };

        const getAiSuggestions = async () => {
            setIsGenerating(true);
            setSuggestions([]);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

                const wishlistItems = wishlist.map(item => allProducts.find(p => p.id === item.id)?.name).filter(Boolean).join(', ');
                const recentOrders = ordersData.slice(0, 2).flatMap(o => o.items.map(i => i.name)).join(', ');
                
                const prompt = `أنت مساعد تسوق شخصي. بناءً على نشاط المستخدم الأخير، اقترح 3-5 مهام تسوق قصيرة وقابلة للتنفيذ باللغة العربية.
- عناصر قائمة الرغبات: ${wishlistItems || 'لا يوجد'}
- الطلبات الأخيرة: ${recentOrders || 'لا يوجد'}
- الموسم القادم: الصيف

مثال على المهام: "ابحث عن حذاء رياضي أبيض يتناسب مع بنطلون الجينز", "اشترِ هدية عيد ميلاد لأحمد", "تحقق من مجموعة الصيف الجديدة".
قم بالرد فقط بمصفوفة JSON من السلاسل النصية.`;

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                });
                setSuggestions(JSON.parse(response.text));

            } catch (error) {
                console.error("Error getting AI suggestions:", error);
                addToast("حدث خطأ أثناء الحصول على الاقتراحات.", "error");
            } finally {
                setIsGenerating(false);
            }
        };
    
        return (
             <div>
                <h2 className="text-2xl font-bold mb-6 text-brand-dark">مخطط التسوق</h2>
                <div className="max-w-2xl mx-auto">
                     <div className="p-4 bg-indigo-50/50 rounded-lg border-2 border-dashed border-indigo-200 mb-8 text-center">
                        <h4 className="font-bold text-brand-dark">هل تحتاج إلى بعض الإلهام؟</h4>
                        <p className="text-sm text-brand-text-light my-2">دع مساعدنا الذكي يقترح عليك مهام تسوق بناءً على أسلوبك ونشاطك.</p>
                        <button onClick={getAiSuggestions} disabled={isGenerating} className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2.5 px-6 rounded-full flex items-center justify-center gap-2 mx-auto hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50">
                            {isGenerating ? <Spinner size="sm"/> : <><SparklesIcon size="sm" /> <span>الحصول على اقتراحات ذكية</span></>}
                        </button>
                    </div>

                    {suggestions.length > 0 && (
                        <div className="mb-6 animate-fade-in">
                            <h3 className="font-bold mb-3">اقتراحات لك:</h3>
                            <div className="space-y-2">
                                {suggestions.map((suggestion, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                                        <span className="text-sm font-semibold">{suggestion}</span>
                                        <button onClick={(e) => handleAddTodo(e, suggestion)} className="text-sm font-bold text-admin-accent hover:underline flex items-center gap-1"><PlusIcon size="sm"/> إضافة</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
                        <input type="text" value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)} placeholder="أضف مهمة جديدة..." className="w-full bg-white border border-brand-border rounded-full py-2.5 px-5 focus:outline-none focus:ring-2 focus:ring-brand-dark"/>
                        <button type="submit" className="bg-brand-dark text-white font-bold py-2.5 px-6 rounded-full hover:bg-opacity-90 flex-shrink-0"><PlusIcon size="sm" /></button>
                    </form>

                    <div className="space-y-3">
                        {todos.map(todo => (
                             <div key={todo.id} className="flex items-center justify-between p-3 bg-brand-subtle rounded-lg">
                                 <div className="flex items-center gap-3">
                                    <input type="checkbox" id={`task-${todo.id}`} className="sr-only task-input" checked={todo.completed} onChange={() => handleToggleTodo(todo.id)}/>
                                    <label htmlFor={`task-${todo.id}`} className="task-checkbox-label cursor-pointer flex items-center justify-center w-6 h-6 rounded-md border-2 border-brand-border bg-white">
                                         <svg className="task-checkbox-svg w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline className="task-checkbox-path" points="20 6 9 17 4 12"></polyline></svg>
                                    </label>
                                    <span className={`font-semibold ${todo.completed ? 'task-text-completed' : 'text-brand-dark'}`}>{todo.text}</span>
                                 </div>
                                 <button onClick={() => handleRemoveTodo(todo.id)} className="text-brand-text-light hover:text-brand-sale p-1"><TrashIcon size="sm" /></button>
                             </div>
                        ))}
                         {todos.length === 0 && !isGenerating && suggestions.length === 0 && (
                            <p className="text-center text-gray-500 py-4">قائمتك فارغة. أضف مهمة أو احصل على اقتراحات ذكية للبدء!</p>
                         )}
                    </div>
                </div>
            </div>
        );
    };
    
    const TrackOrderContent = () => {
        const [trackingId, setTrackingId] = useState('');
        const [trackedOrder, setTrackedOrder] = useState<Order | null | undefined>(undefined);
        const [aiPrediction, setAiPrediction] = useState<{ estimatedDate: string; notification: string } | null>(null);
        const [isPredicting, setIsPredicting] = useState(false);

        const handleTrackOrder = (e: React.FormEvent) => {
            e.preventDefault();
            setAiPrediction(null);
            if (!trackingId.trim()) {
                setTrackedOrder(undefined);
                return;
            }
            setTrackedOrder(ordersData.find(order => order.id === `#${trackingId.replace('#', '')}`) || null);
        };

        const getAiPrediction = async (order: Order) => {
            setIsPredicting(true);
            setAiPrediction(null);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const prompt = `أنت خبير توقعات لوجستية لمتجر إلكتروني في مصر. يقوم عميل بتتبع طلبه. بناءً على سجل تتبع الطلب، وتاريخ اليوم (${new Date().toLocaleDateString('en-CA')})، وأوقات الشحن المعتادة داخل مصر, قدم تاريخ تسليم تقديري واقعي وتحديث حالة موجز ومطمئن باللغة العربية.
                رقم الطلب: ${order.id}
                سجل التتبع: ${JSON.stringify(order.trackingHistory)}
                
                قم بالرد فقط بكائن JSON يحتوي على مفتاحين: "estimatedDate" (نص مثل "25 مايو 2025") و "notification" (رسالة ودية باللغة العربية حول حالة التسليم، مع ذكر أي تأخيرات محتملة).`;

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                estimatedDate: { type: Type.STRING, description: 'تاريخ التسليم المتوقع بالصيغة العربية، مثلاً "25 مايو 2025".' },
                                notification: { type: Type.STRING, description: 'تحديث حالة ودود باللغة العربية.' }
                            },
                            required: ['estimatedDate', 'notification']
                        }
                    }
                });
                setAiPrediction(JSON.parse(response.text));
            } catch (error) {
                console.error("Error getting AI prediction:", error);
                addToast('حدث خطأ أثناء الحصول على التوقع.', 'error');
            } finally {
                setIsPredicting(false);
            }
        };


        return (
            <div>
                <h2 className="text-2xl font-bold mb-6 text-brand-dark">تتبع طلبك</h2>
                <p className="text-brand-text-light mb-6 max-w-2xl">أدخل رقم الطلب الخاص بك أدناه للاطلاع على حالة الشحن.</p>
                <form onSubmit={handleTrackOrder} className="flex gap-2 max-w-md"><input type="text" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="أدخل رقم الطلب (مثل: 12345)" className="w-full bg-white border border-brand-border rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-brand-dark" /><button type="submit" className="bg-brand-dark text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 flex-shrink-0">تتبع</button></form>
                <div className="mt-8 max-w-2xl">
                    {trackedOrder === null && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center animate-fade-in">لم يتم العثور على طلب بهذا الرقم.</div>}
                    {trackedOrder && trackedOrder.trackingHistory && (
                         <div className="bg-brand-subtle p-6 rounded-lg border animate-fade-in">
                             <h3 className="text-xl font-bold mb-1 text-brand-dark">تفاصيل الطلب {trackedOrder.id}</h3>
                             <p className="text-brand-text-light mb-4 text-sm">التسليم المتوقع: {trackedOrder.estimatedDelivery}</p>
                             
                             <OrderTracker order={trackedOrder} />
                             
                             <div className="mt-6 border-t pt-6">
                                {aiPrediction ? (
                                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg animate-fade-in">
                                        <h4 className="font-bold text-indigo-800">توقع التسليم بالذكاء الاصطناعي</h4>
                                        <p className="text-indigo-700 mt-1"><strong>التاريخ المتوقع:</strong> {aiPrediction.estimatedDate}</p>
                                        <p className="text-indigo-700 mt-1">{aiPrediction.notification}</p>
                                    </div>
                                ) : (
                                    <button onClick={() => getAiPrediction(trackedOrder)} disabled={isPredicting} className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2.5 px-6 rounded-full flex items-center justify-center gap-2 mx-auto hover:opacity-90 transition-opacity disabled:opacity-50">
                                        {isPredicting ? <Spinner size="sm"/> : <><SparklesIcon size="sm" /> <span>الحصول على توقع التسليم بالذكاء الاصطناعي</span></>}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardContent />; case 'orders': return <OrdersContent />; case 'profile': return <AccountDetailsContent />;
            case 'wishlist': return <WishlistContent />; case 'planner': return <PlannerContent />; case 'trackOrder': return <TrackOrderContent />; default: return <DashboardContent />;
        }
    };
    
    const SidebarNav = ({ isMobile = false }) => {
        const handleNav = (tab: string) => {
            if (tab === 'logout') {
                onLogout();
            } else if (tab === 'admin') {
                navigateTo('admin');
            } else {
                setActiveTab(tab);
            }
    
            if (isMobile) {
                setIsSidebarOpen(false);
            }
        };
    
        const navItems: ({ id: string; label: string; icon: React.ReactElement; count?: number })[] = [
            { id: 'dashboard', label: 'لوحة التحكم', icon: <UserIcon size="sm" /> },
            { id: 'orders', label: 'طلباتي', icon: <ShoppingBagIcon size="sm" /> },
            { id: 'trackOrder', label: 'تتبع الطلب', icon: <TruckIcon size="sm" /> },
            { id: 'wishlist', label: 'قائمة رغباتي', icon: <HeartIcon size="sm" />, count: wishlist.length },
            { id: 'planner', label: 'مخطط التسوق', icon: <ClipboardCheckIcon size="sm" /> },
            { id: 'profile', label: 'تفاصيل الحساب', icon: <LockClosedIcon size="sm" /> },
        ];
    
        if (currentUser?.isAdmin) {
            navItems.push({
                id: 'admin',
                label: 'لوحة تحكم المشرف',
                icon: <Cog6ToothIcon size="sm" />,
            });
        }
    
        navItems.push({ id: 'logout', label: 'تسجيل الخروج', icon: <LogoutIcon size="sm" /> });
    
        return (
            <nav className="flex flex-col">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => handleNav(item.id)}
                        className={`w-full text-right p-4 font-semibold text-base flex items-center gap-3 ${
                            activeTab === item.id
                                ? 'bg-brand-primary/10 text-brand-primary border-r-4 border-brand-primary'
                                : 'hover:bg-gray-100 text-brand-text-light hover:text-brand-dark'
                        }`}
                    >
                        {item.icon}
                        <span className="flex-1">{item.label}</span>
                        {item.count ? (
                            <span className="text-xs bg-brand-primary text-white font-bold rounded-full px-2 py-0.5">{item.count}</span>
                        ) : null}
                    </button>
                ))}
            </nav>
        );
    };

    return (
        <div className="bg-brand-subtle">
            <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="حسابي" />
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden fixed top-1/2 -translate-y-1/2 left-0 bg-brand-dark text-white shadow-lg p-2 rounded-r-md z-30"><Bars3Icon size="md" /></button>
            <div className={`fixed inset-0 z-50 md:hidden ${!isSidebarOpen && 'pointer-events-none'}`}><div className={`fixed inset-0 bg-black/40 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsSidebarOpen(false)}></div><div className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-xl transition-transform transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}><div className="p-4 flex justify-between items-center border-b"><h2 className="font-bold text-lg">قائمة الحساب</h2><button onClick={() => setIsSidebarOpen(false)}><CloseIcon /></button></div><SidebarNav isMobile={true} /></div></div>
            <div className="container mx-auto px-4 py-12"><div className="flex flex-col md:flex-row-reverse gap-8"><aside className="hidden md:block w-72 flex-shrink-0"><div className="bg-white rounded-lg overflow-hidden border"><SidebarNav /></div></aside><main className="flex-1 bg-white p-6 rounded-lg border min-h-[500px]">{renderContent()}</main></div></div>
        </div>
    );
};

export default AccountPage;
