
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
    isNew?: boolean;
    onSale?: boolean;
    rating?: number;
    reviewCount?: number;
    reviews?: Review[];
    sku?: string;
    availability?: string;
    itemsLeft?: number;
    soldIn24h?: number;
    saleEndDate?: string;
    variants?: Variant[];
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

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    isAdmin?: boolean;
}

export interface Address {
    id: number;
    type: 'الشحن' | 'الفوترة';
    name: string;
    details: string;
    isDefault: boolean;
}

export interface HeroSlide {
    id: number;
    bgImage: string;
    title: string;
    subtitle: string;
    buttonText: string;
    page: string;
}