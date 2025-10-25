

export interface WishlistItem {
    id: number;
    note: string;
}

export interface StockSubscription {
    productId: number;
    variantId?: number; // Optional for products without variants
    email: string;
}

export interface HeroSlide {
    id: number;
    bgImage: string;
    bgVideo?: string;
    bgVideoType?: string;
    title: string;
    subtitle: string;
    description?: string;
    buttonText: string;
    page: string;
    status: 'Visible' | 'Hidden';
    productName?: string;
    productPrice?: string;
    productId?: number;
}

export interface Review {
    id: number;
    author: string;
    rating: number;
    date: string;
    text: string;
    image: string;
    status: 'Pending' | 'Approved' | 'Hidden';
}

export interface Variant {
  id: number;
  size: string;
  color: string;
  price: string;
  oldPrice?: string;
  stock: number;
  sku: string;
}

export interface Badge {
  text: string;
  type: 'new' | 'sale' | 'trending' | 'vip' | 'custom';
}

export interface Product {
    id: number;
    name: string;
    brand?: string;
    price: string;
    oldPrice?: string;
    image: string;
    images?: string[];
    description?: string;
    colors: string[];
    sizes: string[];
    tags: string[];
    category: 'women' | 'men';
    badges?: Badge[];
    rating?: number;
    reviewCount?: number;
    reviews?: Review[];
    sku?: string;
    availability?: string;
    itemsLeft?: number;
    soldIn24h?: number;
    viewingNow?: number;
    saleEndDate?: string;
    variants?: Variant[];
    specifications?: string[];
    materialComposition?: string;
    careInstructions?: string[];
    weight?: number;
    weightUnit?: 'kg' | 'g';
    viewCount?: number;
}

export interface SaleCampaign {
    id: number;
    title: string;
    subtitle: string;
    discountText: string;
    couponCode: string;
    buttonText: string;
    image: string;
    saleEndDate: string; // ISO string
    page: string;
    status: 'Active' | 'Draft';
}

export interface CartItem extends Product {
    quantity: number;
    selectedSize: string;
    selectedColor: string;
}

export interface Filters {
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  onSale: boolean;
  materials: string[];
  categories: string[];
  tags: string[];
}

export interface OrderItem {
    id: number;
    name: string;
    image: string;
    variant: string;
    quantity: number;
    price: string;
}

export interface TrackingEvent {
    status: 'تم الطلب' | 'تم الشحن' | 'قيد التوصيل' | 'تم التوصيل' | 'تم إلغاء الطلب';
    date: string;
    location?: string;
}

export interface Order {
    id: string;
    date: string;
    status: 'Delivered' | 'On the way' | 'Cancelled';
    total: string;
    items: OrderItem[];
    estimatedDelivery?: string;
    trackingHistory?: TrackingEvent[];
}

export interface PaymentMethod {
    id: number;
    cardType: 'visa' | 'mastercard' | 'amex';
    last4: string;
    expiryMonth: string;
    expiryYear: string;
    isDefault: boolean;
}

export interface User {
    id:string;
    name: string;
    email: string;
    phone?: string;
    isAdmin?: boolean;
    role?: 'Administrator' | 'Editor' | 'Support';
    addresses: Address[];
    paymentMethods: PaymentMethod[];
}

export interface Address {
    id: number;
    type: 'الشحن' | 'الفوترة';
    name: string; // e.g., 'Home', 'Work'
    recipientName: string;
    street: string;
    city: string; // Governorate
    postalCode: string;
    country: string;
    isDefault: boolean;
}


export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface Coupon {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
}

export interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
}

export interface AdminAnnouncement {
    id: number;
    content: string;
    status: 'Active' | 'Inactive';
    startDate: string;
    endDate: string | null;
}

export interface Notification {
  id: number;
  type: 'order' | 'stock' | 'review';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  link?: string;
  data?: any;
}

export interface ThemeState {
    primaryColor: string;
    fontFamily: string;
    logoUrl: string | null;
    siteName: string;
    chatbotWelcomeMessage: string;
}