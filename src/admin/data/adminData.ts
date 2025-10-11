// Admin-specific interfaces
import { Review } from '../../../types';

export interface AdminVariant {
    id: number;
    options: { [key: string]: string }; // e.g., { Size: 'S', Color: 'Red' }
    sku: string;
    price: string;
    stock: number;
    inventoryHistory: { date: string, event: string, adjustment: number }[];
}

export interface AdminProduct {
    id: number;
    name: string;
    image: string;
    images: string[];
    sku: string;
    price: string;
    compareAtPrice?: string;
    stock: number; // Keep total stock for simple products
    status: 'Published' | 'Draft';
    category: 'women' | 'men' | string;
    tags: string[];
    description: string;
    unitsSold?: number;
    variants: AdminVariant[];
    seoTitle: string;
    seoDescription: string;
    weight: number;
    weightUnit: 'kg' | 'g';
    reviews: Review[];
    badges?: { text: string; type: string }[];
}


export interface AdminOrder {
    id: string;
    date: string;
    status: 'Delivered' | 'On the way' | 'Cancelled';
    total: string;
    itemCount: number;
    items: {
        productId: number;
        variantId?: number;
        productName: string;
        productImage: string;
        sku: string;
        quantity: number;
        price: string;
    }[];
    customer: {
        name: string;
        email: string;
    };
    customerId: number;
    shippingAddress: string;
    billingAddress: string;
    trackingHistory: {
        status: string;
        date: string;
        location?: string;
    }[];
    notes: string;
}

export interface AdminCustomerNote {
    id: number;
    date: string;
    author: string;
    text: string;
}

export interface AdminCustomer {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    registeredDate: string;
    orderCount: number;
    totalSpent: number;
    status: 'Active' | 'Blocked';
    shippingAddress: string;
    billingAddress: string;
    tags: string[];
    notes: AdminCustomerNote[];
}

export interface AdminDiscount {
    id: number;
    code: string;
    type: 'Percentage' | 'Fixed Amount';
    value: number;
    status: 'Active' | 'Inactive' | 'Expired';
    usageCount: number;
    usageLimit: number | null;
    startDate: string;
    endDate: string | null;
}

export interface AdminMarketingCampaign {
    id: number;
    name: string;
    status: 'Active' | 'Draft' | 'Completed';
    channel: 'Email' | 'SMS' | 'Social';
    opens: number;
    clicks: number;
    startDate: string;
}

export interface AdminAutomation {
    id: number;
    name: string;
    trigger: string;
    status: 'Active' | 'Inactive';
    conversions: number;
}


export interface AdminBlogPost {
    id: number;
    title: string;
    author: string;
    status: 'Published' | 'Draft';
    publishDate: string;
    featuredImage: string;
    content: string;
}

export interface AdminCategory {
    id: number;
    name: string;
    description: string;
    parentId: number | null;
    status: 'Visible' | 'Hidden';
    image: string;
}

export interface AdminSubscriber {
    id: number;
    email: string;
    subscribedAt: string;
    status: 'Subscribed' | 'Unsubscribed';
}

export interface AdminAnnouncement {
    id: number;
    content: string;
    status: 'Active' | 'Inactive';
    startDate: string;
    endDate: string | null;
}

export interface AdminTeamMember {
    id: number;
    name: string;
    email: string;
    avatar: string;
    role: 'Administrator' | 'Editor' | 'Support';
    lastLogin: string | null;
    status: 'Active' | 'Invited';
}

export interface AdminMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    date: string;
    isRead: boolean;
}

export interface AdminHeroSlide {
    id: number;
    bgImage: string;
    title: string;
    subtitle: string;
    buttonText: string;
    page: string;
    status: 'Visible' | 'Hidden';
}

// Mock Data
export const allAdminProducts: AdminProduct[] = [
    { id: 1, name: 'بنطلون مزيج الكتان', image: 'https://i.ibb.co/bFqfL4N/pdp-main.png', images: ['https://i.ibb.co/3Wf1yqf/pdp-thumb-1.png', 'https://i.ibb.co/bFqfL4N/pdp-main.png', 'https://i.ibb.co/GvxB2YF/pdp-thumb-2.png'], sku: 'AD1FSSE0YR', price: '60.00', compareAtPrice: '80.00', stock: 15, status: 'Published', category: 'women', tags:['ملابس', 'بنطلون', 'كتان', 'صيف', 'كاجوال', 'واسع الساق', 'رائج'], description: 'Elegant linen-blend trousers.', unitsSold: 120, variants: [{id: 101, options: {Size: 'M', Color: 'Beige'}, sku: 'AD1-M-BE', price: '60.00', stock: 15, inventoryHistory: []}], seoTitle: 'Linen Blend Trousers', seoDescription: 'Comfortable and stylish linen blend trousers for summer.', weight: 0.5, weightUnit: 'kg', reviews: [
        { id: 1, author: "إميلي ر.", rating: 4, date: "3 مارس 2025", text: "مذهل للغاية!", image: "https://randomuser.me/api/portraits/women/4.jpg", status: 'Approved' },
        { id: 2, author: "جيمس ل.", rating: 5, date: "3 مارس 2025", text: "أحببته!", image: "https://randomuser.me/api/portraits/men/7.jpg", status: 'Approved' },
        { id: 3, author: "مستخدم", rating: 3, date: "4 مارس 2025", text: "هذا تعليق قيد المراجعة.", image: "https://randomuser.me/api/portraits/men/10.jpg", status: 'Pending' },
    ], badges: [{ text: 'خصم 25%', type: 'sale' }]},
    { id: 2, name: 'بلوزة بأكمام طويلة', image: 'https://images.unsplash.com/photo-1581655353564-df123a164d16?q=80&w=1974&auto=format&fit=crop', images:[], sku: 'VIN-BL-002', price: '180.00', stock: 8, status: 'Published', category: 'women', tags:['بلوزة', 'أساسي', 'نسائي', 'قطن', 'أكمام طويلة', 'جديد', 'ملابس', 'كاجوال'], description: 'A stylish long-sleeve blouse.', unitsSold: 95, variants: [{id: 102, options: {Size: 'S'}, sku: 'VIN-BL-S', price: '180.00', stock: 8, inventoryHistory: []}], seoTitle: '', seoDescription: '', weight: 0.3, weightUnit: 'kg', reviews: [{ id: 5, author: "سارة ك.", rating: 4, date: "6 مارس 2025", text: "الخامة جيدة ولكن المقاس كان صغيرًا بعض الشيء.", image: "https://randomuser.me/api/portraits/women/12.jpg", status: 'Pending' }], badges: [{ text: 'جديد', type: 'new' }] },
    { id: 3, name: 'بنطلون جينز عصري', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1974&auto=format&fit=crop', images:[], sku: 'VIN-JN-003', price: '320.00', stock: 0, status: 'Published', category: 'women', tags:['جينز', 'بنطلون', 'نسائي', 'دينيم', 'عصري', 'ملابس', 'كاجوال'], description: 'Modern and comfortable jeans.', unitsSold: 250, variants: [], seoTitle: '', seoDescription: '', weight: 0.7, weightUnit: 'kg', reviews: [], badges: [] },
    { id: 4, name: 'قميص رجالي كلاسيكي', image: 'https://images.unsplash.com/photo-1596755094514-7e724d082a93?q=80&w=1974&auto=format&fit=crop', images:[], sku: 'VIN-SH-004', price: '250.00', compareAtPrice: '300.00', stock: 30, status: 'Draft', category: 'men', tags:['قميص', 'رجالي', 'كلاسيكي', 'قطن', 'عمل', 'ملابس', 'رسمي'], description: 'Classic men shirt.', unitsSold: 75, variants: [], seoTitle: '', seoDescription: '', weight: 0.4, weightUnit: 'kg', reviews: [], badges: [{ text: 'خصم 17%', type: 'sale' }] },
    { id: 5, name: 'جاكيت جلدي أنيق', image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=1992&auto=format&fit=crop', images:[], sku: 'VIN-JK-005', price: '450.00', stock: 5, status: 'Published', category: 'men', tags:['جاكيت', 'جلد', 'للجنسين', 'شتاء', 'رائج', 'ملابس'], description: 'A sleek leather jacket.', unitsSold: 180, variants: [], seoTitle: '', seoDescription: '', weight: 1.2, weightUnit: 'kg', reviews: [
        { id: 4, author: "أحمد", rating: 5, date: "5 مارس 2025", text: "جودة ممتازة، أوصي به بشدة.", image: "https://randomuser.me/api/portraits/men/11.jpg", status: 'Approved' },
        { id: 6, author: "علي حسن", rating: 4, date: "8 مارس 2025", text: "جاكيت رائع لكن التوصيل تأخر قليلاً.", image: "https://randomuser.me/api/portraits/men/15.jpg", status: 'Pending' }
    ], badges: [{ text: 'رائج', type: 'trending' }] },
];

export const allAdminCustomers: AdminCustomer[] = [
    { id: 1, name: 'نورا أحمد', email: 'noura.a@example.com', phone: '0123456789', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', registeredDate: '2023-05-10', orderCount: 5, totalSpent: 2500, status: 'Active', shippingAddress: '123 Main St, Cairo, Egypt', billingAddress: '123 Main St, Cairo, Egypt', tags: ['VIP', 'Repeat Buyer'], notes: [{id: 1, date: '2024-08-20', author: 'Admin', text: 'Customer called about a sizing issue.'}] },
    { id: 2, name: 'أحمد محمود', email: 'ahmed.m@example.com', phone: '0112345678', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', registeredDate: '2023-06-15', orderCount: 2, totalSpent: 800, status: 'Active', shippingAddress: '456 Oak Ave, Alexandria, Egypt', billingAddress: '456 Oak Ave, Alexandria, Egypt', tags: [], notes: [] },
];

export const allAdminOrders: AdminOrder[] = [
    { 
        id: '#12345', date: '2025-05-15', status: 'Delivered', total: '720.00', itemCount: 2, customer: { name: 'نورا أحمد', email: 'noura.a@example.com' }, customerId: 1, 
        items: [
            { productId: 1, variantId: 101, productName: 'بنطلون مزيج الكتان', productImage: allAdminProducts[0].image, sku: 'AD1-M-BE', quantity: 1, price: '60.00'},
            { productId: 2, variantId: 102, productName: 'بلوزة بأكمام طويلة', productImage: allAdminProducts[1].image, sku: 'VIN-BL-S', quantity: 1, price: '180.00'}
        ], 
        shippingAddress: '123 Main St, Cairo, Egypt', billingAddress: '123 Main St, Cairo, Egypt', trackingHistory: [ { status: 'تم الطلب', date: '15 May 2025' }, { status: 'تم الشحن', date: '16 May 2025' }, { status: 'تم التوصيل', date: '18 May 2025' }], notes: 'Customer requested gift wrapping.' 
    },
    { 
        id: '#23154', date: '2025-05-16', status: 'Cancelled', total: '460.00', itemCount: 2, customer: { name: 'أحمد محمود', email: 'ahmed.m@example.com' }, customerId: 2, 
        items: [
             { productId: 4, productName: 'قميص رجالي كلاسيكي', productImage: allAdminProducts[3].image, sku: 'VIN-SH-004', quantity: 2, price: '250.00'}
        ], 
        shippingAddress: '456 Oak Ave, Alexandria, Egypt', billingAddress: '456 Oak Ave, Alexandria, Egypt', trackingHistory: [ { status: 'تم الطلب', date: '16 May 2025' }, { status: 'تم إلغاء الطلب', date: '17 May 2025' }], notes: '' 
    },
    { 
        id: '#12467', date: '2025-05-17', status: 'On the way', total: '920.00', itemCount: 1, customer: { name: 'نورا أحمد', email: 'noura.a@example.com' }, customerId: 1, 
        items: [
             { productId: 5, productName: 'جاكيت جلدي أنيق', productImage: allAdminProducts[4].image, sku: 'VIN-JK-005', quantity: 1, price: '450.00'}
        ], 
        shippingAddress: '123 Main St, Cairo, Egypt', billingAddress: '123 Main St, Cairo, Egypt', trackingHistory: [ { status: 'تم الطلب', date: '17 May 2025' }, { status: 'تم الشحن', date: '18 May 2025' }, { status: 'قيد التوصيل', date: '19 May 2025' }], notes: '' 
    },
];

export const allAdminDiscounts: AdminDiscount[] = [
    { id: 1, code: 'SUMMER25', type: 'Percentage', value: 25, status: 'Active', usageCount: 150, usageLimit: 1000, startDate: '2024-06-01', endDate: '2024-08-31' },
    { id: 2, code: 'NEWBIE10', type: 'Fixed Amount', value: 10, status: 'Active', usageCount: 320, usageLimit: null, startDate: '2024-01-01', endDate: null },
    { id: 3, code: 'FLASH30', type: 'Percentage', value: 30, status: 'Expired', usageCount: 50, usageLimit: 50, startDate: '2024-05-20', endDate: '2024-05-21' },
];

export const allAdminMarketingCampaigns: AdminMarketingCampaign[] = [
    { id: 1, name: 'حملة الصيف', status: 'Completed', channel: 'Email', opens: 1200, clicks: 350, startDate: '2024-06-01'},
    { id: 2, name: 'إطلاق مجموعة الخريف', status: 'Active', channel: 'Social', opens: 5600, clicks: 1200, startDate: '2024-08-15'},
];

export const allAdminAutomations: AdminAutomation[] = [
    { id: 1, name: 'استرداد السلة المتروكة', trigger: 'بعد 6 ساعات من ترك السلة', status: 'Active', conversions: 42 },
    { id: 2, name: 'ترحيب بالعميل الجديد', trigger: 'فور التسجيل', status: 'Active', conversions: 150 },
    { id: 3, name: 'متابعة ما بعد الشراء', trigger: 'بعد 7 أيام من التسليم', status: 'Inactive', conversions: 0 },
];


export const allAdminBlogPosts: AdminBlogPost[] = [
    { id: 1, title: 'أفضل 5 صيحات لهذا الصيف', author: 'نورا أحمد', status: 'Published', publishDate: '2024-06-10', featuredImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2124&auto=format&fit=crop', content: 'محتوى المقال...' },
    { id: 2, title: 'كيفية تنسيق الجينز', author: 'أحمد محمود', status: 'Draft', publishDate: '2024-07-01', featuredImage: 'https://images.unsplash.com/photo-1602293589914-9FF05f8b2f45?q=80&w=1974&auto=format&fit=crop', content: 'محتوى المقال...' },
];

export const allAdminCategories: AdminCategory[] = [
    { id: 1, name: 'ملابس نسائية', description: 'كل ما يتعلق بالملابس النسائية', parentId: null, status: 'Visible', image: '' },
    { id: 2, name: 'فساتين', description: '', parentId: 1, status: 'Visible', image: '' },
    { id: 3, name: 'ملابس رجالية', description: 'كل ما يتعلق بالملابس الرجالية', parentId: null, status: 'Visible', image: '' },
];

export const allAdminSubscribers: AdminSubscriber[] = [
    {id: 1, email: 'subscriber1@example.com', subscribedAt: '2024-01-15', status: 'Subscribed'},
    {id: 2, email: 'subscriber2@example.com', subscribedAt: '2024-02-20', status: 'Subscribed'},
];

export const allAdminAnnouncements: AdminAnnouncement[] = [
    { id: 1, content: 'شحن مجاني للطلبات فوق 500 ج.م', status: 'Active', startDate: '2024-01-01', endDate: null},
    { id: 2, content: 'ضمان مدى الحياة', status: 'Active', startDate: '2024-01-01', endDate: null},
    { id: 3, content: 'عرض لفترة محدودة', status: 'Active', startDate: '2024-08-20', endDate: '2024-09-20'},
    { id: 4, content: 'تمديد فترة الإرجاع إلى 60 يومًا', status: 'Inactive', startDate: '2024-07-01', endDate: null},
];

export const allAdminTeamMembers: AdminTeamMember[] = [
    { id: 1, name: 'نورا أحمد', email: 'noura@vineta.com', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', role: 'Administrator', lastLogin: '2024-08-20T10:00:00Z', status: 'Active' },
    { id: 2, name: 'أحمد محمود', email: 'ahmed@vineta.com', avatar: 'https://randomuser.me/api/portraits/men/46.jpg', role: 'Editor', lastLogin: '2024-08-19T14:30:00Z', status: 'Active' },
];

export const allAdminMessages: AdminMessage[] = [
    {id: 1, name: 'سارة', email: 'sara@example.com', subject: 'استفسار عن طلب', message: 'مرحبا، أود أن أعرف حالة طلبي رقم #12340.', date: '2024-08-20', isRead: false},
    {id: 2, name: 'كريم', email: 'karim@example.com', subject: 'مشكلة في الدفع', message: 'أواجه مشكلة عند محاولة الدفع باستخدام بطاقتي.', date: '2024-08-19', isRead: true}
];

export const allAdminHeroSlides: AdminHeroSlide[] = [
    { id: 1, bgImage: 'https://images.unsplash.com/photo-1517036324233-1c3cf7b246a4?q=80&w=1974&auto=format&fit=crop', title: 'تألقي بشكل لم يسبق له مثيل', subtitle: 'اكتشفي أحدث مجموعاتنا الصيفية', buttonText: 'تسوقي الآن', page: 'shop', status: 'Visible' },
    { id: 2, bgImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop', title: 'تخفيضات نهاية الموسم', subtitle: 'خصم يصل إلى 50% على منتجات مختارة', buttonText: 'اكتشفي العروض', page: 'shop', status: 'Visible' },
];
