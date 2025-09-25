

import React, { useState } from 'react';
import { User, HeroSlide, Review } from '../types';
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
import SubscribersPage from './pages/SubscribersPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
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
import ThemeSettingsPage from './pages/ThemeSettingsPage';

import { 
    allAdminProducts, 
    allAdminOrders, 
    allAdminCustomers,
    allAdminDiscounts,
    allAdminMarketingCampaigns,
    allAdminBlogPosts,
    allAdminCategories,
    allAdminSubscribers,
    allAdminAnnouncements,
    allAdminMessages,
    AdminProduct,
    AdminOrder,
    AdminCustomer,
    AdminDiscount,
    AdminBlogPost,
    AdminCategory,
    AdminAnnouncement
} from './data/adminData';


interface AdminDashboardProps {
    currentUser: User | null;
    heroSlides: HeroSlide[];
    setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>>;
    announcements: string[];
    setAnnouncements: React.Dispatch<React.SetStateAction<string[]>>;
}

const AdminDashboard = ({ currentUser, heroSlides, setHeroSlides, announcements, setAnnouncements }: AdminDashboardProps) => {
    const [activePage, setActivePage] = useState('dashboard');
    const [pageData, setPageData] = useState<any>(null);
    
    const [products, setProducts] = useState(allAdminProducts);
    const [orders, setOrders] = useState(allAdminOrders);
    const [customers, setCustomers] = useState(allAdminCustomers);
    const [discounts, setDiscounts] = useState(allAdminDiscounts);
    const [blogPosts, setBlogPosts] = useState(allAdminBlogPosts);
    const [categories, setCategories] = useState(allAdminCategories);
    const [adminAnnouncements, setAdminAnnouncements] = useState(allAdminAnnouncements);

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
    
    const handleStatusChange = (orderId: string, newStatus: AdminOrder['status']) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
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

    const handleAnnouncementsUpdate = (newAdminAnnouncements: AdminAnnouncement[]) => {
        setAdminAnnouncements(newAdminAnnouncements);
        const activeAnnouncements = newAdminAnnouncements
            .filter(a => a.status === 'Active')
            .map(a => a.content);
        setAnnouncements(activeAnnouncements);
    };

    const renderPage = () => {
        switch (activePage) {
            // Dashboard
            case 'dashboard': return <DashboardPage navigate={navigate} recentOrders={orders.slice(0, 5)} lowStockProducts={products.filter(p => p.variants.some(v => v.stock > 0 && v.stock <= 10)).slice(0, 4)} orders={orders} customers={customers} />;
            
            // Catalog
            case 'products': return <ProductsPage navigate={navigate} products={products} onDeleteProducts={handleDeleteProducts} />;
            case 'addProduct': return <AddProductPage navigate={navigate} onSave={handleSaveProduct} />;
            case 'editProduct': return <AddProductPage navigate={navigate} onSave={handleSaveProduct} productToEdit={pageData} />;
            case 'categories': return <CategoriesPage navigate={navigate} categories={categories} products={products} onDeleteCategory={handleDeleteCategory} />;
            case 'addCategory': return <AddCategoryPage navigate={navigate} onSave={handleSaveCategory} categories={categories} />;
            case 'editCategory': return <AddCategoryPage navigate={navigate} onSave={handleSaveCategory} categories={categories} categoryToEdit={pageData} />;
            case 'inventory': return <InventoryPage products={products} setProducts={setProducts} />;
            case 'reviews': return <ReviewsPage products={products} onStatusChange={handleReviewStatusChange} onDelete={handleDeleteReview} />;

            // Sales
            case 'orders': return <OrdersPage navigate={navigate} orders={orders} />;
            case 'orderDetail': return <OrderDetailPage navigate={navigate} order={pageData} customers={customers} onStatusChange={handleStatusChange} products={products} />;
            case 'discounts': return <DiscountsPage discounts={discounts} navigate={navigate} onDeleteDiscounts={handleDeleteDiscounts} />;
            case 'addDiscount': return <AddDiscountPage navigate={navigate} onSave={handleSaveDiscount} />;
            case 'editDiscount': return <AddDiscountPage navigate={navigate} onSave={handleSaveDiscount} discountToEdit={pageData} />;

            // Customers
            case 'customers': return <CustomersPage navigate={navigate} customers={customers} onDeleteCustomers={handleDeleteCustomers} />;
            case 'customerDetail': return <CustomerDetailPage navigate={navigate} customer={pageData} orders={orders.filter(o => o.customerId === pageData.id)} onSave={handleSaveCustomer} />;
            
            // Marketing
            case 'marketing': return <MarketingPage navigate={navigate} campaigns={allAdminMarketingCampaigns} />;
            
            // Online Store
            case 'theme': return <ThemeSettingsPage heroSlides={heroSlides} setHeroSlides={setHeroSlides} announcements={adminAnnouncements} onAnnouncementsUpdate={handleAnnouncementsUpdate} />;

            // Other
            case 'analytics': return <AnalyticsPage orders={orders} products={products} customers={customers} />;
            case 'content': return <BlogPostsPage navigate={navigate} blogPosts={blogPosts} onDeletePost={handleDeletePost}/>;
            case 'addBlogPost': return <AddBlogPostPage navigate={navigate} onSave={handleSavePost} />;
            case 'editBlogPost': return <AddBlogPostPage navigate={navigate} onSave={handleSavePost} postToEdit={pageData} />;
            case 'messages': return <ContactMessagesPage messages={allAdminMessages} />;
            case 'settings': return <SettingsPage />;

            default: return <DashboardPage navigate={navigate} recentOrders={orders.slice(0, 5)} lowStockProducts={products.filter(p => p.variants.some(v => v.stock > 0 && v.stock <= 10)).slice(0, 4)} orders={orders} customers={customers}/>;
        }
    };

    return (
        <AdminLayout currentUser={currentUser} activePage={activePage} setActivePage={navigate}>
            {renderPage()}
        </AdminLayout>
    );
};

export default AdminDashboard;