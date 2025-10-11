/**
 * Application Constants
 * Centralized configuration values and magic numbers
 */

// API Configuration
export const API_CONFIG = {
  GEMINI_MODEL: 'gemini-2.5-flash',
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_RETRY_ATTEMPTS: 3,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PRODUCTS_PER_PAGE: 12,
  ORDERS_PER_PAGE: 10,
  BLOG_POSTS_PER_PAGE: 9,
  REVIEWS_PER_PAGE: 5,
} as const;

// Price & Currency
export const CURRENCY = {
  SYMBOL: 'ر.س',
  CODE: 'SAR',
  DECIMAL_PLACES: 2,
} as const;

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MIN_PRODUCT_NAME_LENGTH: 3,
  MAX_PRODUCT_NAME_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 5000,
  PHONE_REGEX: /^[0-9]{10}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Cart & Wishlist
export const CART = {
  MAX_QUANTITY_PER_ITEM: 99,
  MIN_QUANTITY_PER_ITEM: 1,
  FREE_SHIPPING_THRESHOLD: 200,
} as const;

// Image Sizes
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 150, height: 150 },
  CARD: { width: 400, height: 500 },
  DETAIL: { width: 800, height: 1000 },
  HERO: { width: 1920, height: 800 },
} as const;

// UI Constants
export const UI = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  SKELETON_PULSE_DURATION: 1500,
} as const;

// Rating
export const RATING = {
  MIN: 1,
  MAX: 5,
  STEP: 0.5,
} as const;

// Admin Dashboard
export const ADMIN = {
  ITEMS_PER_PAGE: 10,
  MAX_BULK_OPERATIONS: 100,
  SESSION_TIMEOUT: 3600000, // 1 hour
  NOTIFICATION_LIMIT: 50,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'vineta_user',
  CART: 'vineta_cart',
  WISHLIST: 'vineta_wishlist',
  THEME: 'vineta_theme',
  THEME_MODE: 'vineta_theme_mode',
  RECENT_SEARCHES: 'vineta_recent_searches',
  COMPARE_LIST: 'vineta_compare_list',
  ACCOUNT_TAB: 'accountActiveTab',
  LANGUAGE: 'vineta_language',
} as const;

// Routes
export const ROUTES = {
  HOME: 'home',
  SHOP: 'shop',
  PRODUCT: 'product',
  CART: 'cart',
  WISHLIST: 'wishlist',
  CHECKOUT: 'checkout',
  ACCOUNT: 'account',
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgotPassword',
  RESET_PASSWORD: 'resetPassword',
  EMAIL_VERIFICATION: 'emailVerification',
  ORDER_CONFIRMATION: 'orderConfirmation',
  CONTACT: 'contact',
  FAQ: 'faq',
  BLOG: 'blog',
  BLOG_POST: 'blogPost',
  SEARCH: 'search',
  COMPARE: 'compare',
  STYLE_ME: 'style-me',
  ADMIN: 'admin',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: 'Active',
  DRAFT: 'Draft',
  ARCHIVED: 'Archived',
  OUT_OF_STOCK: 'OutOfStock',
} as const;

// Discount Types
export const DISCOUNT_TYPES = {
  PERCENTAGE: 'Percentage',
  FIXED_AMOUNT: 'FixedAmount',
  FREE_SHIPPING: 'FreeShipping',
  BUY_X_GET_Y: 'BuyXGetY',
} as const;

// Social Media Links
export const SOCIAL_LINKS = {
  INSTAGRAM: 'https://instagram.com/vineta',
  FACEBOOK: 'https://facebook.com/vineta',
  TWITTER: 'https://twitter.com/vineta',
  TIKTOK: 'https://tiktok.com/@vineta',
} as const;

// Error Messages (Arabic)
export const ERROR_MESSAGES = {
  GENERIC: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
  NETWORK: 'خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.',
  AUTH_FAILED: 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد.',
  NOT_FOUND: 'لم يتم العثور على العنصر المطلوب.',
  UNAUTHORIZED: 'ليس لديك صلاحية للوصول إلى هذا المورد.',
  VALIDATION: 'يرجى التحقق من البيانات المدخلة.',
  SESSION_EXPIRED: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.',
} as const;

// Success Messages (Arabic)
export const SUCCESS_MESSAGES = {
  ADDED_TO_CART: 'تمت إضافة المنتج إلى السلة',
  ADDED_TO_WISHLIST: 'تمت إضافة المنتج إلى قائمة الرغبات',
  ORDER_PLACED: 'تم تقديم طلبك بنجاح',
  PROFILE_UPDATED: 'تم تحديث الملف الشخصي',
  PASSWORD_CHANGED: 'تم تغيير كلمة المرور',
  EMAIL_SENT: 'تم إرسال البريد الإلكتروني',
  REVIEW_SUBMITTED: 'تم إرسال تقييمك',
  SAVED: 'تم الحفظ بنجاح',
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
} as const;

// AI Configuration
export const AI_CONFIG = {
  MAX_RECOMMENDATIONS: 4,
  MAX_SEARCH_SUGGESTIONS: 5,
  MAX_TASK_SUGGESTIONS: 5,
  CONTEXT_WINDOW: 1000,
} as const;

export default {
  API_CONFIG,
  PAGINATION,
  CURRENCY,
  VALIDATION,
  CART,
  IMAGE_SIZES,
  UI,
  RATING,
  ADMIN,
  STORAGE_KEYS,
  ROUTES,
  ORDER_STATUS,
  PRODUCT_STATUS,
  DISCOUNT_TYPES,
  SOCIAL_LINKS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FILE_UPLOAD,
  AI_CONFIG,
};
