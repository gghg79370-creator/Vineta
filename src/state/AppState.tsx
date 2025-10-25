import React, { createContext, useReducer, useContext, useMemo, useEffect } from 'react';
import { User, Product, Toast, TodoItem, WishlistItem, Address, Coupon, ThemeState, HeroSlide, SaleCampaign, Order, PaymentMethod, StockSubscription } from '../types';
import { 
    AdminProduct, AdminOrder, AdminCustomer, AdminDiscount, AdminBlogPost, AdminCategory, AdminSubscriber, AdminAnnouncement,
    allAdminProducts, allAdminOrders, allAdminCustomers, allAdminDiscounts, allAdminBlogPosts, allAdminCategories, allAdminSubscribers, allAdminAnnouncements
} from '../admin/data/adminData';
import { allProducts } from '../data/products';
import { ordersData as publicOrdersData } from '../data/orders';
import { heroSlidesData } from '../data/homepage';
import { saleCampaignsData } from '../data/sales';


// Types
interface CartDetail {
    id: number;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
}

interface State {
    currentUser: User | null;
    cart: CartDetail[];
    wishlist: WishlistItem[];
    compareList: number[];
    toasts: Toast[];
    recentlyViewed: number[];
    todos: TodoItem[];
    stockSubscriptions: StockSubscription[];
    appliedCoupon: Coupon | null;
    giftWrap: boolean;
    orderNote: string;
    theme: ThemeState;
    themeMode: 'light' | 'dark' | 'system';
    
    // All site data
    products: Product[];
    heroSlides: HeroSlide[];
    saleCampaigns: SaleCampaign[];
    orders: Order[]; // Public orders
    
    // All admin data
    adminProducts: AdminProduct[];
    adminOrders: AdminOrder[];
    adminCustomers: AdminCustomer[];
    adminDiscounts: AdminDiscount[];
    adminBlogPosts: AdminBlogPost[];
    adminCategories: AdminCategory[];
    adminSubscribers: AdminSubscriber[];
    adminAnnouncements: AdminAnnouncement[];
}

type Action =
    | { type: 'LOGIN'; payload: User }
    | { type: 'LOGOUT' }
    | { type: 'UPDATE_USER_PROFILE'; payload: Partial<User> }
    | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number; selectedSize: string; selectedColor: string } }
    | { type: 'UPDATE_CART_ITEM_QUANTITY'; payload: { id: number; selectedSize: string; selectedColor: string; quantity: number } }
    | { type: 'REMOVE_FROM_CART'; payload: { id: number; selectedSize: string; selectedColor: string } }
    | { type: 'SET_CART'; payload: CartDetail[] }
    | { type: 'TOGGLE_WISHLIST'; payload: number }
    | { type: 'SET_WISHLIST'; payload: WishlistItem[] }
    | { type: 'UPDATE_WISHLIST_NOTE'; payload: { productId: number; note: string } }
    | { type: 'TOGGLE_COMPARE'; payload: number }
    | { type: 'REMOVE_FROM_COMPARE'; payload: number }
    | { type: 'ADD_TOAST'; payload: Toast }
    | { type: 'REMOVE_TOAST'; payload: number }
    | { type: 'ADD_TO_RECENTLY_VIEWED'; payload: number }
    | { type: 'ADD_TODO'; payload: string }
    | { type: 'TOGGLE_TODO'; payload: number }
    | { type: 'REMOVE_TODO'; payload: number }
    | { type: 'UPDATE_TODO'; payload: { id: number; text: string } }
    | { type: 'ADD_STOCK_SUBSCRIPTION'; payload: StockSubscription }
    | { type: 'APPLY_COUPON'; payload: Coupon }
    | { type: 'REMOVE_COUPON' }
    | { type: 'ADD_ADDRESS'; payload: Omit<Address, 'id'> }
    | { type: 'UPDATE_ADDRESS'; payload: Address }
    | { type: 'DELETE_ADDRESS'; payload: number }
    | { type: 'SET_DEFAULT_ADDRESS'; payload: number }
    | { type: 'ADD_PAYMENT_METHOD'; payload: Omit<PaymentMethod, 'id'> }
    | { type: 'DELETE_PAYMENT_METHOD'; payload: number }
    | { type: 'SET_DEFAULT_PAYMENT_METHOD'; payload: number }
    | { type: 'SET_GIFT_WRAP'; payload: boolean }
    | { type: 'SET_ORDER_NOTE'; payload: string }
    | { type: 'SET_THEME'; payload: ThemeState }
    | { type: 'SET_THEME_MODE'; payload: 'light' | 'dark' | 'system' }
    // Site Data Actions
    | { type: 'SET_PRODUCTS'; payload: Product[] }
    | { type: 'SET_HERO_SLIDES'; payload: HeroSlide[] }
    | { type: 'SET_SALE_CAMPAIGNS'; payload: SaleCampaign[] }
    | { type: 'SET_ANNOUNCEMENTS'; payload: AdminAnnouncement[] }
    // Admin Data Actions
    | { type: 'SET_ADMIN_PRODUCTS'; payload: AdminProduct[] }
    | { type: 'SET_ADMIN_ORDERS'; payload: AdminOrder[] }
    | { type: 'SET_ADMIN_CUSTOMERS'; payload: AdminCustomer[] }
    | { type: 'SET_ADMIN_DISCOUNTS'; payload: AdminDiscount[] }
    | { type: 'SET_ADMIN_BLOG_POSTS'; payload: AdminBlogPost[] }
    | { type: 'SET_ADMIN_CATEGORIES'; payload: AdminCategory[] }
    | { type: 'SET_ADMIN_SUBSCRIBERS'; payload: AdminSubscriber[] }
    | { type: 'TOGGLE_SETUP_TASK'; payload: { taskId: string, isCompleted: boolean } }
    | { type: 'ADD_NOTIFICATION'; payload: any } // Simplified for now
    | { type: 'MARK_NOTIFICATION_READ'; payload: number }
    | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
    | { type: 'CLEAR_ALL_NOTIFICATIONS' }
    ;


// Reducer
const appReducer = (state: State, action: Action): State => {
    switch (action.type) {
        // USER AUTH & PROFILE
        case 'LOGIN': return { ...state, currentUser: action.payload };
        case 'LOGOUT': return { ...state, currentUser: null };
        case 'UPDATE_USER_PROFILE':
            if (!state.currentUser) return state;
            return { ...state, currentUser: { ...state.currentUser, ...action.payload } };
        case 'ADD_ADDRESS': {
            if (!state.currentUser) return state;
            const newAddress: Address = { ...action.payload, id: Date.now() };
            let addresses = [...state.currentUser.addresses, newAddress];
            if (newAddress.isDefault) {
                addresses = addresses.map(addr => addr.id === newAddress.id ? addr : { ...addr, isDefault: false });
            }
            return { ...state, currentUser: { ...state.currentUser, addresses } };
        }
        case 'UPDATE_ADDRESS': {
            if (!state.currentUser) return state;
            let addresses = state.currentUser.addresses.map(addr => addr.id === action.payload.id ? action.payload : addr);
            if (action.payload.isDefault) {
                 addresses = addresses.map(addr => addr.id === action.payload.id ? addr : { ...addr, isDefault: false });
            }
            return { ...state, currentUser: { ...state.currentUser, addresses } };
        }
        case 'DELETE_ADDRESS': {
            if (!state.currentUser) return state;
            const addresses = state.currentUser.addresses.filter(addr => addr.id !== action.payload);
            return { ...state, currentUser: { ...state.currentUser, addresses } };
        }
        case 'SET_DEFAULT_ADDRESS': {
            if (!state.currentUser) return state;
            const addresses = state.currentUser.addresses.map(addr => ({ ...addr, isDefault: addr.id === action.payload }));
            return { ...state, currentUser: { ...state.currentUser, addresses } };
        }

        // PAYMENT METHODS
        case 'ADD_PAYMENT_METHOD': {
            if (!state.currentUser) return state;
            const newMethod: PaymentMethod = { ...action.payload, id: Date.now() };
            let methods = [...state.currentUser.paymentMethods, newMethod];
            if (newMethod.isDefault) {
                methods = methods.map(m => m.id === newMethod.id ? m : { ...m, isDefault: false });
            } else if (methods.length === 1) {
                methods[0].isDefault = true;
            }
            return { ...state, currentUser: { ...state.currentUser, paymentMethods: methods }};
        }
        case 'DELETE_PAYMENT_METHOD': {
            if (!state.currentUser) return state;
            const wasDefaultDeleted = state.currentUser.paymentMethods.find(m => m.id === action.payload)?.isDefault;
            let methods = state.currentUser.paymentMethods.filter(m => m.id !== action.payload);
            if (wasDefaultDeleted && methods.length > 0) {
                methods[0] = { ...methods[0], isDefault: true };
            }
            return { ...state, currentUser: { ...state.currentUser, paymentMethods: methods }};
        }
        case 'SET_DEFAULT_PAYMENT_METHOD': {
            if (!state.currentUser) return state;
            const methods = state.currentUser.paymentMethods.map(m => ({ ...m, isDefault: m.id === action.payload }));
            return { ...state, currentUser: { ...state.currentUser, paymentMethods: methods }};
        }

        // CART, WISHLIST, COMPARE
        case 'ADD_TO_CART': {
            const { product, quantity, selectedSize, selectedColor } = action.payload;
            const existingItemIndex = state.cart.findIndex(
                item => item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
            );
            if (existingItemIndex > -1) {
                const updatedCart = [...state.cart];
                updatedCart[existingItemIndex].quantity += quantity;
                return { ...state, cart: updatedCart };
            }
            return { ...state, cart: [...state.cart, { id: product.id, quantity, selectedSize, selectedColor }] };
        }
        case 'UPDATE_CART_ITEM_QUANTITY': {
             const { id, selectedSize, selectedColor, quantity } = action.payload;
             const updatedCart = state.cart
                .map(item =>
                    item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
                        ? { ...item, quantity }
                        : item
                )
                .filter(item => item.quantity > 0);
             return { ...state, cart: updatedCart };
        }
        case 'REMOVE_FROM_CART': {
            const { id, selectedSize, selectedColor } = action.payload;
            return { ...state, cart: state.cart.filter(item => !(item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor)) };
        }
        case 'SET_CART': return { ...state, cart: action.payload };
        case 'TOGGLE_WISHLIST': {
            const productId = action.payload;
            const isInWishlist = state.wishlist.some(item => item.id === productId);
            return { ...state, wishlist: isInWishlist ? state.wishlist.filter(item => item.id !== productId) : [...state.wishlist, { id: productId, note: '' }] };
        }
        case 'SET_WISHLIST': return { ...state, wishlist: action.payload };
        case 'UPDATE_WISHLIST_NOTE': {
            const { productId, note } = action.payload;
            return { ...state, wishlist: state.wishlist.map(item => item.id === productId ? { ...item, note } : item) };
        }
        case 'TOGGLE_COMPARE': {
            const productId = action.payload;
            const isInCompare = state.compareList.includes(productId);
             if (isInCompare) {
                return { ...state, compareList: state.compareList.filter(id => id !== productId) };
            }
            if (state.compareList.length < 4) {
                return { ...state, compareList: [...state.compareList, productId] };
            }
            return state;
        }
        case 'REMOVE_FROM_COMPARE': return { ...state, compareList: state.compareList.filter(id => id !== action.payload) };

        // UI & MISC
        case 'ADD_TOAST': return { ...state, toasts: [...state.toasts, action.payload] };
        case 'REMOVE_TOAST': return { ...state, toasts: state.toasts.filter(toast => toast.id !== action.payload) };
        case 'ADD_TO_RECENTLY_VIEWED': {
            const productId = action.payload;
            const newRecentlyViewed = [productId, ...state.recentlyViewed.filter(id => id !== productId)].slice(0, 10);
            return { ...state, recentlyViewed: newRecentlyViewed };
        }
        case 'ADD_TODO': return { ...state, todos: [...state.todos, { id: Date.now(), text: action.payload, completed: false }] };
        case 'TOGGLE_TODO': return { ...state, todos: state.todos.map(todo => todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo) };
        case 'REMOVE_TODO': return { ...state, todos: state.todos.filter(todo => todo.id !== action.payload) };
        case 'UPDATE_TODO': {
            const { id, text } = action.payload;
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === id ? { ...todo, text } : todo
                ),
            };
        }
        case 'ADD_STOCK_SUBSCRIPTION': {
            const existingSub = state.stockSubscriptions.find(
                sub => sub.productId === action.payload.productId &&
                       sub.variantId === action.payload.variantId &&
                       sub.email.toLowerCase() === action.payload.email.toLowerCase()
            );
            if (existingSub) {
                return state; // Already subscribed
            }
            return { ...state, stockSubscriptions: [...state.stockSubscriptions, action.payload] };
        }
        case 'APPLY_COUPON': return { ...state, appliedCoupon: action.payload };
        case 'REMOVE_COUPON': return { ...state, appliedCoupon: null };
        case 'SET_GIFT_WRAP': return { ...state, giftWrap: action.payload };
        case 'SET_ORDER_NOTE': return { ...state, orderNote: action.payload };
        case 'SET_THEME': return { ...state, theme: action.payload };
        case 'SET_THEME_MODE':
            return { ...state, themeMode: action.payload };

        // SITE & ADMIN DATA
        case 'SET_PRODUCTS': return { ...state, products: action.payload };
        case 'SET_HERO_SLIDES': return { ...state, heroSlides: action.payload };
        case 'SET_SALE_CAMPAIGNS': return { ...state, saleCampaigns: action.payload };
        case 'SET_ANNOUNCEMENTS': return { ...state, adminAnnouncements: action.payload }; // Note: Using adminAnnouncements
        case 'SET_ADMIN_PRODUCTS': return { ...state, adminProducts: action.payload };
        case 'SET_ADMIN_ORDERS': return { ...state, adminOrders: action.payload };
        case 'SET_ADMIN_CUSTOMERS': return { ...state, adminCustomers: action.payload };
        case 'SET_ADMIN_DISCOUNTS': return { ...state, adminDiscounts: action.payload };
        case 'SET_ADMIN_BLOG_POSTS': return { ...state, adminBlogPosts: action.payload };
        case 'SET_ADMIN_CATEGORIES': return { ...state, adminCategories: action.payload };
        case 'SET_ADMIN_SUBSCRIBERS': return { ...state, adminSubscribers: action.payload };

        default: return state;
    }
};

const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
        const saved = localStorage.getItem(key);
        if (saved === null) return defaultValue;
        return JSON.parse(saved);
    } catch (error) {
        console.error(`Could not load or parse ${key} from localStorage`, error);
        return defaultValue;
    }
};

const initialState: State = {
    currentUser: getInitialState<User | null>('vinetaCurrentUser', { 
        id: '1', name: 'فينيتا فام', email: 'admin@example.com', phone: '01234567890', isAdmin: true, role: 'Administrator', 
        addresses: [{ id: 1, type: 'الشحن', name: 'المنزل', recipientName: 'فينيتا فام', street: '123 شارع ياران', city: 'القاهرة', postalCode: '11511', country: 'مصر', isDefault: true }],
        paymentMethods: [
            { id: 1, cardType: 'visa', last4: '4242', expiryMonth: '12', expiryYear: '2025', isDefault: true },
            { id: 2, cardType: 'mastercard', last4: '5555', expiryMonth: '08', expiryYear: '2026', isDefault: false }
        ]
    }),
    cart: getInitialState<CartDetail[]>('vinetaCart', []),
    wishlist: getInitialState<WishlistItem[]>('vinetaWishlist', [{ id: 3, note: 'هدية عيد ميلاد' }, { id: 6, note: '' }]),
    compareList: getInitialState<number[]>('vinetaCompareList', []),
    toasts: [],
    recentlyViewed: getInitialState<number[]>('vinetaRecentlyViewed', []),
    todos: getInitialState<TodoItem[]>('vinetaTodos', [{ id: 1, text: 'شراء فستان جديد للحفلة', completed: false }, { id: 2, text: 'التحقق من تخفيضات الصيف', completed: true }]),
    stockSubscriptions: getInitialState<StockSubscription[]>('vinetaStockSubscriptions', []),
    appliedCoupon: getInitialState<Coupon | null>('vinetaAppliedCoupon', null),
    giftWrap: getInitialState<boolean>('vinetaGiftWrap', false),
    orderNote: getInitialState<string>('vinetaOrderNote', ''),
    theme: getInitialState<ThemeState>('vinetaTheme', { primaryColor: '#ff6f61', fontFamily: "'Poppins', 'Tajawal', sans-serif", logoUrl: null, siteName: 'Vineta', chatbotWelcomeMessage: 'أهلاً بك في {siteName}! أنا Vinnie، مساعدك الشخصي في عالم الموضة. كيف يمكنني المساعدة؟'}),
    themeMode: getInitialState<'light' | 'dark' | 'system'>('vinetaThemeMode', 'system'),
    
    // Site Data
    products: getInitialState<Product[]>('vinetaProducts', allProducts),
    heroSlides: getInitialState<HeroSlide[]>('vinetaHeroSlides', heroSlidesData),
    saleCampaigns: getInitialState<SaleCampaign[]>('vinetaSaleCampaigns', saleCampaignsData),
    orders: getInitialState<Order[]>('vinetaOrders', publicOrdersData),

    // Admin Data
    adminProducts: getInitialState<AdminProduct[]>('vinetaAdminProducts', allAdminProducts),
    adminOrders: getInitialState<AdminOrder[]>('vinetaAdminOrders', allAdminOrders),
    adminCustomers: getInitialState<AdminCustomer[]>('vinetaAdminCustomers', allAdminCustomers),
    adminDiscounts: getInitialState<AdminDiscount[]>('vinetaAdminDiscounts', allAdminDiscounts),
    adminBlogPosts: getInitialState<AdminBlogPost[]>('vinetaAdminBlogPosts', allAdminBlogPosts),
    adminCategories: getInitialState<AdminCategory[]>('vinetaAdminCategories', allAdminCategories),
    adminSubscribers: getInitialState<AdminSubscriber[]>('vinetaAdminSubscribers', allAdminSubscribers),
    adminAnnouncements: getInitialState<AdminAnnouncement[]>('vinetaAdminAnnouncements', allAdminAnnouncements),
};

const AppStateContext = createContext<{ 
    state: State; 
    dispatch: React.Dispatch<Action>; 
    cartCount: number; 
    cartSubtotal: number;
    discountAmount: number;
    finalTotal: number;
} | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        try {
            Object.keys(initialState).forEach(key => {
                if (key !== 'toasts') { // Don't persist toasts
                    localStorage.setItem(`vineta${key.charAt(0).toUpperCase() + key.slice(1)}`, JSON.stringify(state[key as keyof State]));
                }
            });
        } catch (error) {
            console.error("Could not save state to localStorage", error);
        }
    }, [state]);

    const cartCount = useMemo(() => state.cart.reduce((acc, item) => acc + item.quantity, 0), [state.cart]);

    const cartSubtotal = useMemo(() => {
        return state.cart.reduce((sum, cartDetail) => {
            const product = state.products.find(p => p.id === cartDetail.id);
            if (!product) return sum;
            let price = product.price;
            if (product.variants && product.variants.length > 0) {
                const variant = product.variants.find(v => v.size === cartDetail.selectedSize && v.color === cartDetail.selectedColor);
                if (variant) price = variant.price;
            }
            return sum + parseFloat(price) * cartDetail.quantity;
        }, 0);
    }, [state.cart, state.products]);

    const discountAmount = useMemo(() => {
        if (!state.appliedCoupon) return 0;
        if (state.appliedCoupon.code === 'FREESHIP') {
             const shippingThreshold = 230;
             return cartSubtotal >= shippingThreshold ? 0 : 50;
        }
        if (state.appliedCoupon.type === 'percentage') {
            return cartSubtotal * (state.appliedCoupon.value / 100);
        }
        if (state.appliedCoupon.type === 'fixed') {
            return Math.min(state.appliedCoupon.value, cartSubtotal);
        }
        return 0;
    }, [state.appliedCoupon, cartSubtotal]);

    const finalTotal = useMemo(() => {
        const giftWrapCost = state.giftWrap ? 10 : 0;
        const total = cartSubtotal + giftWrapCost - discountAmount;
        return Math.max(0, total);
    }, [cartSubtotal, discountAmount, state.giftWrap]);


    const contextValue = useMemo(() => ({ state, dispatch, cartCount, cartSubtotal, discountAmount, finalTotal }), [state, dispatch, cartCount, cartSubtotal, discountAmount, finalTotal]);
    
    return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
};