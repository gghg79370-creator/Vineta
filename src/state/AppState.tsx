
import React, { createContext, useReducer, useContext, useMemo } from 'react';
import { User, Product, Toast, TodoItem, WishlistItem, Address, Coupon } from '../types';
import { cartItemsData } from '../data/cart';
import { allProducts } from '../data/products';

// Types
interface CartDetail {
    id: number;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
}

interface ThemeState {
    primaryColor: string;
    fontFamily: string;
    logoUrl: string | null;
    siteName: string;
}

interface State {
    currentUser: User | null;
    cart: CartDetail[];
    wishlist: WishlistItem[];
    compareList: number[];
    toasts: Toast[];
    recentlyViewed: number[];
    todos: TodoItem[];
    appliedCoupon: Coupon | null;
    giftWrap: boolean;
    orderNote: string;
    theme: ThemeState;
    themeMode: 'light' | 'dark';
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
    | { type: 'APPLY_COUPON'; payload: Coupon }
    | { type: 'REMOVE_COUPON' }
    | { type: 'ADD_ADDRESS'; payload: Omit<Address, 'id'> }
    | { type: 'UPDATE_ADDRESS'; payload: Address }
    | { type: 'DELETE_ADDRESS'; payload: number }
    | { type: 'SET_DEFAULT_ADDRESS'; payload: number }
    | { type: 'SET_GIFT_WRAP'; payload: boolean }
    | { type: 'SET_ORDER_NOTE'; payload: string }
    | { type: 'SET_THEME'; payload: ThemeState }
    | { type: 'SET_THEME_MODE'; payload: 'light' | 'dark' };


// Reducer
const appReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, currentUser: action.payload };
        case 'LOGOUT':
            return { ...state, currentUser: null };
        case 'UPDATE_USER_PROFILE':
            if (!state.currentUser) return state;
            return {
                ...state,
                currentUser: { ...state.currentUser, ...action.payload },
            };
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
            return {
                ...state,
                cart: [...state.cart, { id: product.id, quantity, selectedSize, selectedColor }],
            };
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
            return {
                ...state,
                cart: state.cart.filter(
                    item => !(item.id === id && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
                ),
            };
        }
        case 'SET_CART':
             return { ...state, cart: action.payload };
        case 'TOGGLE_WISHLIST': {
            const productId = action.payload;
            const isInWishlist = state.wishlist.some(item => item.id === productId);
            return {
                ...state,
                wishlist: isInWishlist
                    ? state.wishlist.filter(item => item.id !== productId)
                    : [...state.wishlist, { id: productId, note: '' }],
            };
        }
        case 'SET_WISHLIST':
             return { ...state, wishlist: action.payload };
        case 'UPDATE_WISHLIST_NOTE': {
            const { productId, note } = action.payload;
            return {
                ...state,
                wishlist: state.wishlist.map(item =>
                    item.id === productId ? { ...item, note } : item
                ),
            };
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
        case 'REMOVE_FROM_COMPARE': {
            return { ...state, compareList: state.compareList.filter(id => id !== action.payload) };
        }
        case 'ADD_TOAST':
            return { ...state, toasts: [...state.toasts, action.payload] };
        case 'REMOVE_TOAST':
            return { ...state, toasts: state.toasts.filter(toast => toast.id !== action.payload) };
        case 'ADD_TO_RECENTLY_VIEWED': {
            const productId = action.payload;
            const newRecentlyViewed = [
                productId,
                ...state.recentlyViewed.filter(id => id !== productId)
            ].slice(0, 10); // Keep max 10 items
            return {
                ...state,
                recentlyViewed: newRecentlyViewed,
            };
        }
        case 'ADD_TODO':
            return {
                ...state,
                todos: [...state.todos, { id: Date.now(), text: action.payload, completed: false }],
            };
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
                ),
            };
        case 'REMOVE_TODO':
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload),
            };
        case 'APPLY_COUPON':
            return { ...state, appliedCoupon: action.payload };
        case 'REMOVE_COUPON':
            return { ...state, appliedCoupon: null };
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
        case 'SET_GIFT_WRAP':
            return { ...state, giftWrap: action.payload };
        case 'SET_ORDER_NOTE':
            return { ...state, orderNote: action.payload };
        case 'SET_THEME':
            return { ...state, theme: action.payload };
        case 'SET_THEME_MODE':
            try {
                localStorage.setItem('themeMode', action.payload);
            } catch (e) {
                console.error("Failed to set theme mode in localStorage", e);
            }
            return { ...state, themeMode: action.payload };
        default:
            return state;
    }
};

const getInitialThemeMode = (): 'light' | 'dark' => {
    try {
        const storedTheme = localStorage.getItem('themeMode');
        if (storedTheme === 'light' || storedTheme === 'dark') {
            return storedTheme;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
    } catch (e) {
        // Can fail in SSR or restricted environments
    }
    return 'light';
};


// Initial State
const initialCartDetails = cartItemsData.map(item => ({
    id: item.id,
    quantity: item.quantity,
    selectedSize: item.selectedSize,
    selectedColor: item.selectedColor,
}));

const initialState: State = {
    currentUser: { 
        id: '1', 
        name: 'فينيتا فام', 
        email: 'admin@example.com', 
        phone: '01234567890', 
        isAdmin: true, 
        role: 'Administrator',
        addresses: [
            { id: 1, type: 'الشحن', name: 'المنزل', recipientName: 'فينيتا فام', street: '123 شارع ياران', city: 'القاهرة', postalCode: '11511', country: 'مصر', isDefault: true },
            { id: 2, type: 'الفوترة', name: 'العمل', recipientName: 'فينيتا فام', street: '456 شارع رئيسي', city: 'الجيزة', postalCode: '12511', country: 'مصر', isDefault: false },
        ]
    },
    cart: initialCartDetails,
    wishlist: [
        { id: allProducts[2].id, note: 'هدية عيد ميلاد' },
        { id: allProducts[5].id, note: '' }
    ],
    compareList: [],
    toasts: [],
    recentlyViewed: [],
    todos: [
        { id: 1, text: 'شراء فستان جديد للحفلة', completed: false },
        { id: 2, text: 'التحقق من تخفيضات الصيف', completed: true },
        { id: 3, text: 'إرجاع الجاكيت الجلدي', completed: false },
    ],
    appliedCoupon: null,
    giftWrap: false,
    orderNote: '',
    theme: {
        primaryColor: '#ff6f61',
        fontFamily: "'Poppins', 'Tajawal', sans-serif",
        logoUrl: null,
        siteName: 'Vineta',
    },
    themeMode: getInitialThemeMode(),
};

// Context and Provider
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

    const cartCount = useMemo(() => {
        return state.cart.reduce((acc, item) => acc + item.quantity, 0);
    }, [state.cart]);

    const cartSubtotal = useMemo(() => {
        return state.cart.reduce((sum, cartDetail) => {
            const product = allProducts.find(p => p.id === cartDetail.id);
            if (!product) return sum;
            return sum + parseFloat(product.price) * cartDetail.quantity;
        }, 0);
    }, [state.cart]);

    const discountAmount = useMemo(() => {
        if (!state.appliedCoupon) return 0;
        if (state.appliedCoupon.code === 'FREESHIP') {
             // Let's assume shipping is 50 for now if subtotal is below threshold
             const shippingThreshold = 230;
             const shippingCost = cartSubtotal >= shippingThreshold ? 0 : 50;
             return shippingCost;
        }
        if (state.appliedCoupon.type === 'percentage') {
            return cartSubtotal * (state.appliedCoupon.value / 100);
        }
        if (state.appliedCoupon.type === 'fixed') {
            return Math.min(state.appliedCoupon.value, cartSubtotal); // Can't discount more than the subtotal
        }
        return 0;
    }, [state.appliedCoupon, cartSubtotal]);

    const finalTotal = useMemo(() => {
        const giftWrapCost = state.giftWrap ? 10 : 0;
        const total = cartSubtotal + giftWrapCost - discountAmount;
        return Math.max(0, total);
    }, [cartSubtotal, discountAmount, state.giftWrap]);


    const contextValue = useMemo(() => ({ 
        state, 
        dispatch,
        cartCount,
        cartSubtotal,
        discountAmount,
        finalTotal,
    }), [state, dispatch, cartCount, cartSubtotal, discountAmount, finalTotal]);
    
    return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>;
};

// Custom hook to use the context
export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
};
