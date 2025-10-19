import React, { useState, useEffect } from 'react';
import { User, HeroSlide, Review, SaleCampaign, AdminAnnouncement, Notification } from '../types';
import { AdminLayout } from './components/layout/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import DiscountsPage from './pages/DiscountsPage';
import MarketingPage from './pages/MarketingPage';
import BlogPostsPage from './pages/BlogPostsPage';
import CategoriesPage from './pages/CategoriesPage';
import SettingsPage from './pages/SettingsPage';
import AddProductPage from './pages/AddProductPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import AddDiscountPage from './pages/AddDiscountPage';
import AddBlogPostPage from './pages/AddBlogPostPage';
import AddCategoryPage from './pages/AddCategoryPage';
import ContactMessagesPage from './pages/ContactMessagesPage';
import InventoryPage from './pages/InventoryPage';
import ReviewsPage from './pages/ReviewsPage';
// FIX: Correctly import ThemeSettingsPage which was previously causing an error due to a truncated file.
import ThemeSettingsPage from './pages/ThemeSettingsPage';
import SaleCampaignsPage from './pages/SaleCampaignsPage';
import AddSaleCampaignPage from './pages/AddSaleCampaignPage';
import SubscribersPage from './pages/SubscribersPage';

import { 
    allAdminProducts, 
    allAdminOrders, 
    allAdminCustomers,
    allAdminDiscounts,
    allAdminMarketingCampaigns,
    allAdminBlogPosts,
    allAdminCategories,
    AdminProduct,
    AdminOrder,
    AdminCustomer,
    AdminDiscount,
    AdminBlogPost,
    AdminCategory,
    AdminVariant,
    allAdminSubscribers,
} from './data/adminData';


interface AdminDashboardProps {
    currentUser: User | null;
    heroSlides: HeroSlide[];
    setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>>;
    announcements: AdminAnnouncement[];
    setAnnouncements: React.Dispatch<React.SetStateAction<AdminAnnouncement[]>>;
    saleCampaigns: SaleCampaign[];
    setSaleCampaigns: React.Dispatch<React.SetStateAction<SaleCampaign[]>>;
}

const AdminDashboard = ({ currentUser, heroSlides, setHeroSlides, announcements: appAnnouncements, setAnnouncements: setAppAnnouncements, saleCampaigns, setSaleCampaigns }: AdminDashboardProps) => {
    const [activePage, setActivePage] = useState('dashboard');
    const [pageData, setPageData] = useState<any>(null);
    
    // Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // For desktop

    const [products, setProducts] = useState(allAdminProducts);
    const [orders, setOrders] = useState(allAdminOrders);
    const [customers, setCustomers] = useState(allAdminCustomers);
    const [discounts, setDiscounts] = useState(allAdminDiscounts);
    const [blogPosts, setBlogPosts] = useState(allAdminBlogPosts);
    const [categories, setCategories] = useState(allAdminCategories);
    const [subscribers, setSubscribers] = useState(allAdminSubscribers);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [setupTasks, setSetupTasks] = useState([
        { id: 'addProduct', text: 'أضف منتجك الأول', completed: false, link: 'addProduct' },
        { id: 'customizeTheme', text: 'تخصيص مظهر متجرك', completed: false, link: 'theme' },
        { id: 'addDiscount', text: 'إنشاء خصم', completed: false, link: 'addDiscount' },
        { id: 'setupPayment', text: 'إعداد طرق الدفع', completed: false, link: 'settings' },
    ]);
    
    const handleToggleSetupTask = (taskId: string, isCompleted: boolean) => {
        setSetupTasks(prev => prev.map(task => task.id === taskId ? { ...task, completed: isCompleted } : task));
    };

    // Simulate real-time events for notifications
    useEffect(() => {
        const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
            const newNotification: Notification = {
                id: Date.now() + Math.random(),
                timestamp: new Date(),
                isRead: false,
                ...notification,
            };
            setNotifications(prev => [newNotification, ...prev].slice(0, 20)); // Keep max 20 notifications
        };

        const orderTimer = setTimeout(() => {
            const newOrder: AdminOrder = {
                id: `#${Math.floor(10000 + Math.random() * 90000)}`,
                date: new Date().toISOString().split('T')[0],
                status: 'On the way',
                total: (Math.random() * 500 + 50).toFixed(2),
                itemCount: 2,
                customer: { name: 'عميل جديد', email: 'new@example.com' },
                customerId: 99,
                items: [
                    { productId: 1, variantId: 101, productName: 'بنطلون مزيج الكتان', productImage: products[0].image, sku: 'AD1-M-BE', quantity: 1, price: '60.00'},
                    { productId: 2, variantId: 102, productName: 'بلوزة بأكمام طويلة', productImage: products[1].image, sku: 'VIN-BL-S', quantity: 1, price: '180.00'}
                ],
                shippingAddress: '123 Main St, Cairo, Egypt', billingAddress: '123 Main St, Cairo, Egypt', 
                trackingHistory: [ { status: 'تم الطلب', date: new Date().toLocaleDateString('en-CA') }], notes: ''
            };
            setOrders(prev => [newOrder, ...prev]);
            addNotification({
                type: 'order',
                title: 'طلب جديد!',
                message: `تم استلام طلب جديد ${newOrder.id} بقيمة ${newOrder.total} ج.م.`,
                link: 'orderDetail',
                data: newOrder,
            });
        }, 8000);

        const stockTimer = setTimeout(() => {
            const productToUpdateIndex = products.findIndex(p => p.variants.some(v => v.stock > 10));
            if (productToUpdateIndex === -1) return;

            const updatedProducts = JSON.parse(JSON.stringify(products));
            const product = updatedProducts[productToUpdateIndex];
            const variantIndex = product.variants.findIndex((v: AdminVariant) => v.stock > 10);
            if(variantIndex === -1) return;

            product.variants[variantIndex].stock = 3;
            updatedProducts[productToUpdateIndex] = product;

            setProducts(updatedProducts);
            addNotification({
                type: 'stock',
                title: 'انخفاض المخزون',
                message: `المنتج "${product.name}" (${Object.values(product.variants[variantIndex].options).join(' / ')}) على وشك النفاذ.`,
                link: 'editProduct',
                data: product,
            });
        }, 15000);

        return () => {
            clearTimeout(orderTimer);
            clearTimeout(stockTimer);
        };
    }, []);

    const handleMarkAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };
    
    const handleClearAll = () => {
        setNotifications([]);
    };

    const navigate = (page: string, data?: any) => {
        setActivePage(page);
        setPageData(data);
    };

    const handleSaveProduct = (product: AdminProduct) => {
        if(product.id === 0){ // New product
            const newProduct = { ...product, id: products.length + 100 };
            setProducts(prev => [newProduct, ...prev]);
        } else { // Edit product
            setProducts(prev => prev.map(p => p.id === product.id ? product : p));
        }
        navigate('products');
    };

    const handleDeleteProducts = (productIds: number[]) => {
        setProducts(prev => prev.filter(p => !productIds.includes(p.id)));
    };
    
    const handlePublishProducts = (productIds: number[], publish: boolean) => {
        setProducts(prev => prev.map(p => 
            productIds.includes(p.id) ? { ...p, status: publish ? 'Published' : 'Draft' } : p
        ));
    };
    
    const handleDuplicateProduct = (productToDuplicate: AdminProduct) => {
        const newProduct = {
            ...productToDuplicate,
            id: Date.now(), // new unique ID
            name: `نسخة من ${productToDuplicate.name}`,
            status: 'Draft' as 'Draft',
        };
        setProducts(prev => [newProduct, ...prev]);
    };

    const handleStatusChange = (orderId: string, newStatus: AdminOrder['status']) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const handleSaveOrderNote = (orderId: string, note: string) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, notes: note } : o));
    };
    
    const handleSaveCustomer = (customer: AdminCustomer) => {
        setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
    };

    const handleDeleteCustomers = (customerIds: number[]) => {
        setCustomers(prev => prev.filter(c => !customerIds.includes(c.id)));
    };

    const handleSaveDiscount = (discount: AdminDiscount) => {
        if(discount.id === 0) {
            setDiscounts(prev => [{...discount, id: discounts.length + 1}, ...prev]);
        } else {
            setDiscounts(prev => prev.map(d => d.id === discount.id ? discount : d));
        }
        navigate('discounts');
    };

    const handleDeleteDiscounts = (discountIds: number[]) => {
        setDiscounts(prev => prev.filter(d => !discountIds.includes(d.id)));
    };
    
    const handleSavePost = (post: AdminBlogPost) => {
        if(post.id === 0) {
            setBlogPosts(prev => [{...post, id: blogPosts.length + 1}, ...prev]);
        } else {
            setBlogPosts(prev => prev.map(p => p.id === post.id ? post : p));
        }
        navigate('content');
    };
    
    const handleDeletePost = (postId: number) => {
        setBlogPosts(prev => prev.filter(p => p.id !== postId));
    };
    
    const handleSaveCategory = (category: AdminCategory) => {
        if(category.id === 0) {
            setCategories(prev => [{...category, id: categories.length + 1}, ...prev]);
        } else {
            setCategories(prev => prev.map(c => c.id === category.id ? category : c));
        }
        navigate('categories');
    };

    const handleDeleteCategory = (categoryId: number) => {
        setCategories(prev => prev.filter(p => p.id !== categoryId));
    };

    const handleReviewStatusChange = (productId: number, reviewId: number, status: Review['status']) => {
        setProducts(prevProducts => {
            return prevProducts.map(p => {
                if (p.id === productId) {
                    const updatedReviews = p.reviews.map(r => r.id === reviewId ? { ...r, status } : r);
                    return { ...p, reviews: updatedReviews };
                }
                return p;
            });
        });
    };
    
    const handleDeleteReview = (productId: number, reviewId: number) => {
        setProducts(prevProducts => {
            return prevProducts.map(p => {
                if (p.id === productId) {
                    const updatedReviews = p.reviews.filter(r => r.id !== reviewId);
                    return { ...p, reviews: updatedReviews };
                }
                return p;
            });
        });
    };

    const handleSaveSaleCampaign = (campaign: SaleCampaign) => {
        if (campaign.id === 0) {
            setSaleCampaigns(prev => [{...campaign, id: Date.now()}, ...prev]);
        } else {
            setSaleCampaigns(prev => prev.map(c => c.id === campaign.id ? campaign : c));
        }
        navigate('saleCampaigns');
    };

    const handleDeleteSaleCampaign = (campaignId: number) => {
        setSaleCampaigns(prev => prev.filter(c => c.id !== campaignId));
    };


    const renderPage = () => {
        switch (activePage) {
            // Dashboard
            case 'dashboard': return <DashboardPage navigate={navigate} recentOrders={orders.slice(0, 5)} lowStockProducts={products.filter(p => p.variants.some(v => v.stock > 0 && v.stock <= 10)).slice(0, 4)} orders={orders} customers={customers} currentUser={currentUser} setupTasks={setupTasks} onToggleTask={handleToggleSetupTask} />;
            
            // Catalog
            case 'products': return <ProductsPage navigate={navigate} products={products} onDeleteProducts={handleDeleteProducts} onPublishProducts={handlePublishProducts} onDuplicateProduct={handleDuplicateProduct} />;
            case 'addProduct': return <AddProductPage navigate={navigate} onSave={handleSaveProduct} />;
            case 'editProduct': return <AddProductPage navigate={navigate} onSave={handleSaveProduct} productToEdit={pageData} />;
            case 'categories': return <CategoriesPage navigate={navigate} categories={categories} products={products} onDeleteCategory={handleDeleteCategory} onSaveCategory={handleSaveCategory} />;
            case 'addCategory': return <AddCategoryPage navigate={navigate} onSave={handleSaveCategory} categories={categories} />;
            case 'editCategory': return <AddCategoryPage navigate={navigate} onSave={handleSaveCategory} categories={categories} categoryToEdit={pageData} />;
            case 'inventory': return <InventoryPage products={products} setProducts={setProducts} />;
            case 'reviews': return <ReviewsPage products={products} onStatusChange={handleReviewStatusChange} onDelete={handleDeleteReview} />;

            // Sales
            case 'orders': return <OrdersPage navigate={navigate} orders={orders} onStatusChange={handleStatusChange} />;
            case 'orderDetail': return <OrderDetailPage navigate={navigate} order={pageData} customers={customers} products={products} onStatusChange={handleStatusChange} onNoteSave={handleSaveOrderNote} />;
            case 'discounts': return <DiscountsPage discounts={discounts} navigate={navigate} onDeleteDiscounts={handleDeleteDiscounts} />;
            case 'addDiscount': return <AddDiscountPage navigate={navigate} onSave={handleSaveDiscount} />;
            case 'editDiscount': return <AddDiscountPage navigate={navigate} onSave={handleSaveDiscount} discountToEdit={pageData} />;

            // Customers
            case 'customers': return <CustomersPage navigate={navigate} customers={customers} onDeleteCustomers={handleDeleteCustomers} />;
            case 'customerDetail':
                if (!pageData) {
                    return (
                        <div className="text-center p-8">
                            <h2 className="text-xl font-bold">لم يتم العثور على العميل</h2>
                            <p className="text-gray-500 mt-2">يرجى العودة إلى قائمة العملاء واختيار عميل لعرض تفاصيله.</p>
                            <button onClick={() => navigate('customers')} className="mt-4 bg-admin-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-admin-accentHover">
                                العودة إلى العملاء
                            </button>
                        </div>
                    );
                }
                return <CustomerDetailPage navigate={navigate} customer={pageData} orders={orders.filter(o => o.customerId === pageData.id)} onSave={handleSaveCustomer} />;
            
            // Marketing
            case 'marketing': return <MarketingPage navigate={navigate} campaigns={allAdminMarketingCampaigns} />;
            case 'saleCampaigns': return <SaleCampaignsPage navigate={navigate} campaigns={saleCampaigns} onDelete={handleDeleteSaleCampaign} />;
            case 'addSaleCampaign': return <AddSaleCampaignPage navigate={navigate} onSave={handleSaveSaleCampaign} />;
            case 'editSaleCampaign': return <AddSaleCampaignPage navigate={navigate} onSave={handleSaveSaleCampaign} campaignToEdit={pageData} />;
            case 'subscribers': return <SubscribersPage subscribers={subscribers} />;
            
            // Online Store
            case 'theme': return <ThemeSettingsPage heroSlides={heroSlides} setHeroSlides={setHeroSlides} announcements={appAnnouncements} onAnnouncementsUpdate={setAppAnnouncements} />;

            // Other
            case 'analytics': return <AnalyticsPage orders={orders} products={products} customers={customers} />;
            case 'content': return <BlogPostsPage navigate={navigate} blogPosts={blogPosts} onDeletePost={handleDeletePost}/>;
            case 'addBlogPost': return <AddBlogPostPage navigate={navigate} onSave={handleSavePost} />;
            case 'editBlogPost': return <AddBlogPostPage navigate={navigate} onSave={handleSavePost} postToEdit={pageData} />;
            case 'messages': return <ContactMessagesPage />;
            case 'settings': return <SettingsPage />;

            default: return <DashboardPage navigate={navigate} recentOrders={orders.slice(0, 5)} lowStockProducts={products.filter(p => p.variants.some(v => v.stock > 0 && v.stock <= 10)).slice(0, 4)} orders={orders} customers={customers} currentUser={currentUser} setupTasks={setupTasks} onToggleTask={handleToggleSetupTask} />;
        }
    };

    return (
        <AdminLayout 
            currentUser={currentUser} 
            activePage={activePage} 
            setActivePage={navigate}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAll}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
        >
            {renderPage()}
        </AdminLayout>
    );
};

export default AdminDashboard;
