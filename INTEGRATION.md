# Backend Integration Guide

This document outlines how the frontend components integrate with the Supabase backend services.

## Authentication Integration

### Updated Pages

#### LoginPage (`src/pages/LoginPage.tsx`)
- **Changed**: Uses `authService.signIn()` instead of mock authentication
- **Behavior**: 
  - Authenticates users with Supabase Auth
  - Retrieves customer profile from database
  - Falls back to mock mode if Supabase not configured
  - Shows real error messages from backend

#### RegisterPage (`src/pages/RegisterPage.tsx`)
- **Changed**: Uses `authService.signUp()` instead of mock registration
- **Behavior**:
  - Creates Supabase Auth user
  - Creates customer profile in database
  - Auto-assigns 'Customer' role
  - Sends verification email (if configured)

#### ForgotPasswordPage (`src/pages/ForgotPasswordPage.tsx`)
- **Changed**: Uses `authService.resetPassword()` 
- **Behavior**:
  - Sends password reset email via Supabase
  - Includes redirect URL back to app

#### ResetPasswordPage (`src/pages/ResetPasswordPage.tsx`)
- **Changed**: Uses `authService.updatePassword()`
- **Behavior**:
  - Updates password in Supabase Auth
  - Redirects to login after success

## Service Layer Architecture

All backend operations go through service modules in `src/services/`:

### ProductService (`productService.ts`)
Handles all product-related operations:
- Fetching products from database
- Searching products
- CRUD operations for admins
- Product reviews

**Example Usage:**
```typescript
import { productService } from '../services/productService';

// Get all products
const products = await productService.getAllProducts();

// Search products
const results = await productService.searchProducts('dress');

// Add a review
const review = await productService.addReview(productId, userId, {
  author: 'John Doe',
  rating: 5,
  text: 'Great product!',
  image: '',
  status: 'Pending'
});
```

### AuthService (`authService.ts`)
Handles authentication and user management:
- Sign up, sign in, sign out
- Password reset
- Profile updates
- Session management

**Example Usage:**
```typescript
import { authService } from '../services/authService';

// Sign in
const { user, error } = await authService.signIn(email, password);

// Update profile
const { user: updatedUser, error } = await authService.updateProfile(userId, {
  name: 'New Name',
  phone: '1234567890'
});

// Listen to auth changes
authService.onAuthStateChange((user) => {
  if (user) {
    console.log('User logged in:', user);
  } else {
    console.log('User logged out');
  }
});
```

### CartService (`cartService.ts`)
Handles shopping cart operations:
- Add/remove items
- Update quantities
- Sync local cart to database

**Example Usage:**
```typescript
import { cartService } from '../services/cartService';

// Get cart
const cartItems = await cartService.getCart(userId);

// Add to cart
const item = await cartService.addToCart(userId, productId, quantity, size, color);

// Clear cart
await cartService.clearCart(userId);
```

### OrderService (`orderService.ts`)
Handles order management:
- Place orders
- Track orders
- Order history

**Example Usage:**
```typescript
import { orderService } from '../services/orderService';

// Get user orders
const orders = await orderService.getUserOrders(userId);

// Create order
const order = await orderService.createOrder(
  userId,
  cartItems,
  total,
  shippingAddress,
  billingAddress,
  paymentMethod
);

// Update status (admin)
await orderService.updateOrderStatus(orderId, 'On the way');
```

### WishlistService (`wishlistService.ts`)
Handles wishlist operations:
- Add/remove items
- Update notes

**Example Usage:**
```typescript
import { wishlistService } from '../services/wishlistService';

// Get wishlist
const items = await wishlistService.getWishlist(userId);

// Add to wishlist
await wishlistService.addToWishlist(userId, productId, 'Want for summer');

// Remove from wishlist
await wishlistService.removeFromWishlist(userId, productId);
```

### AdminService (`adminService.ts`)
Handles admin-specific operations:
- Manage announcements, hero slides, campaigns
- Dashboard analytics
- Content management

**Example Usage:**
```typescript
import { adminService } from '../services/adminService';

// Get dashboard stats
const stats = await adminService.getDashboardStats();

// Manage announcements
const announcements = await adminService.getAnnouncements();
await adminService.createAnnouncement({
  content: 'Free shipping!',
  status: 'Active',
  startDate: new Date().toISOString(),
  endDate: null
});
```

## Mock Mode vs. Production Mode

All services support two modes:

### Mock Mode (Default)
- **When**: Supabase credentials not configured
- **Behavior**: Falls back to static data from `src/data/` files
- **Logging**: Warns about mock mode in console
- **Perfect for**: Development, testing UI without database

### Production Mode
- **When**: Supabase credentials are configured in `.env.local`
- **Behavior**: All operations use real database
- **Data**: Persisted in Supabase PostgreSQL
- **Perfect for**: Production deployment, real users

## Error Handling

All services follow a consistent error handling pattern:

```typescript
try {
  const { data, error } = await service.operation();
  
  if (error) {
    // Handle error
    console.error('Error:', error);
    setError(error);
  } else {
    // Handle success
    setData(data);
  }
} catch (err) {
  // Handle unexpected errors
  console.error('Unexpected error:', err);
  setError('An unexpected error occurred');
}
```

## Loading States

Components should implement loading states when calling services:

```typescript
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);

const fetchData = async () => {
  setLoading(true);
  try {
    const result = await service.getData();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

## Next Integration Steps

### High Priority
1. **ShopPage** - Replace product filters with database queries
2. **ProductDetailPage** - Load product details from database
3. **CartPage** - Sync cart with database
4. **CheckoutPage** - Create real orders
5. **AccountPage** - Load user profile and orders from database

### Medium Priority
6. **Admin Dashboard** - Use adminService for all operations
7. **BlogListPage** - Load blog posts from database
8. **SearchPage** - Use database search
9. **WishlistPage** - Sync with database

### Lower Priority
10. **Real-time subscriptions** - Add live updates
11. **Image uploads** - Integrate Supabase Storage
12. **Analytics** - Add reporting queries

## Testing Checklist

Before deploying to production:

- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test password reset flow
- [ ] Test cart operations
- [ ] Test order placement
- [ ] Test admin operations
- [ ] Test with Supabase configured
- [ ] Test in mock mode (without Supabase)
- [ ] Verify RLS policies work correctly
- [ ] Test error handling
- [ ] Verify loading states work
- [ ] Check console for warnings/errors

## Common Issues

### Issue: "Supabase credentials not found"
**Solution**: Add credentials to `.env.local`

### Issue: RLS policy error
**Solution**: Check that user is authenticated and has correct role

### Issue: Data not persisting
**Solution**: Verify Supabase client is initialized correctly

### Issue: Type errors
**Solution**: Ensure database types in `supabase.ts` match your schema

## Performance Tips

1. **Use indexes**: Already created in schema.sql
2. **Limit queries**: Use pagination for large datasets
3. **Cache data**: Store frequently accessed data in state
4. **Optimize images**: Use Supabase Storage with transformations
5. **Real-time sparingly**: Only subscribe to critical updates

## Security Considerations

1. **RLS policies**: Enforce data access at database level
2. **Validate input**: Always validate user input on frontend and backend
3. **Environment variables**: Never commit credentials to git
4. **HTTPS only**: Always use secure connections
5. **Rate limiting**: Consider implementing rate limiting for API calls

---

This integration preserves all existing UI functionality while adding real backend persistence and authentication.
