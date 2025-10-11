# Vineta E-commerce - Full Stack Setup Guide

## Overview

Vineta is a complete full-stack e-commerce platform built with:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS
- **AI Features**: Google Gemini API

## Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- A Supabase account (free tier available at https://supabase.com)
- A Google Gemini API key (for AI features)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at https://supabase.com
2. Go to **Settings > API** and copy:
   - Project URL
   - Anon/Public API key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from example
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Gemini API Key (for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database Schema

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/schema.sql`
4. Paste into the SQL Editor and run the query
5. This will create all tables, policies, and functions

### 5. (Optional) Seed Database with Sample Data

You can use the existing mock data to seed your database. A migration script is provided:

```bash
npm run seed
```

Note: Seeding functionality needs to be implemented based on your data needs.

### 6. Run the Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see your app!

## Project Structure

```
vineta/
├── src/
│   ├── admin/              # Admin dashboard components
│   │   ├── components/     # Admin UI components
│   │   ├── data/           # Mock admin data (can be removed after migration)
│   │   └── pages/          # Admin page components
│   ├── components/         # Frontend components
│   │   ├── cart/           # Shopping cart components
│   │   ├── layout/         # Layout components (header, footer, etc.)
│   │   ├── modals/         # Modal dialogs
│   │   └── ui/             # Reusable UI components
│   ├── data/               # Mock data (can be removed after migration)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Library configurations
│   │   └── supabase.ts     # Supabase client setup
│   ├── pages/              # Frontend pages
│   ├── services/           # API service layer
│   │   ├── adminService.ts      # Admin operations
│   │   ├── authService.ts       # Authentication
│   │   ├── cartService.ts       # Cart management
│   │   ├── orderService.ts      # Order management
│   │   ├── productService.ts    # Product operations
│   │   └── wishlistService.ts   # Wishlist management
│   ├── state/              # State management
│   │   └── AppState.tsx    # Global app state
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   └── Router.tsx          # Client-side routing
├── supabase/
│   └── schema.sql          # Database schema
├── .env.local.example      # Environment variables template
├── package.json
└── README.md
```

## Database Schema

The application uses the following main tables:

### Core Tables
- **products** - Product catalog with variants
- **product_variants** - Size/color variations of products
- **customers** - User accounts and profiles
- **orders** - Customer orders
- **cart** - Shopping cart items
- **wishlist** - Saved items for later

### Content Tables
- **categories** - Product categories
- **blog_posts** - Blog articles
- **reviews** - Product reviews
- **hero_slides** - Homepage hero carousel
- **sale_campaigns** - Promotional campaigns

### Admin Tables
- **announcements** - Site-wide announcements
- **discounts** - Coupon codes and discounts
- **contact_messages** - Customer inquiries
- **newsletter_subscribers** - Email subscribers

### Security

Row Level Security (RLS) is enabled on all tables with policies for:
- **Public read** for products, categories, blog posts, etc.
- **User-specific data** for cart, wishlist, and orders
- **Admin-only** operations for managing content

## API Services

The application uses a service layer architecture:

### ProductService (`src/services/productService.ts`)
- `getAllProducts()` - Fetch all products
- `getProductById(id)` - Get a single product
- `searchProducts(query)` - Search products
- `createProduct()` - Add new product (admin)
- `updateProduct()` - Update product (admin)
- `deleteProduct()` - Delete product (admin)
- `getProductReviews()` - Get product reviews
- `addReview()` - Add a review

### AuthService (`src/services/authService.ts`)
- `signUp()` - Register new user
- `signIn()` - Login
- `signOut()` - Logout
- `getCurrentUser()` - Get current session
- `resetPassword()` - Password reset
- `updateProfile()` - Update user profile

### CartService (`src/services/cartService.ts`)
- `getCart()` - Get user's cart
- `addToCart()` - Add item to cart
- `updateCartItem()` - Update quantity
- `removeFromCart()` - Remove item
- `clearCart()` - Empty cart

### OrderService (`src/services/orderService.ts`)
- `getUserOrders()` - Get user's order history
- `getOrderById()` - Get specific order
- `createOrder()` - Place new order
- `updateOrderStatus()` - Update order (admin)
- `cancelOrder()` - Cancel order

### WishlistService (`src/services/wishlistService.ts`)
- `getWishlist()` - Get user's wishlist
- `addToWishlist()` - Save item for later
- `removeFromWishlist()` - Remove item
- `updateWishlistNote()` - Add note to item

### AdminService (`src/services/adminService.ts`)
- Announcement management
- Hero slide management
- Sale campaign management
- Dashboard analytics

## Authentication Flow

1. **Registration**: New users sign up via `authService.signUp()`
   - Creates Supabase Auth user
   - Creates customer profile in database
   - Auto-login after registration

2. **Login**: Users sign in via `authService.signIn()`
   - Validates credentials with Supabase Auth
   - Fetches customer profile
   - Syncs local cart to database

3. **Session Management**: 
   - Sessions persist in localStorage
   - Auto-refresh tokens
   - Auth state changes trigger UI updates

4. **Role-Based Access**:
   - Customer role for regular users
   - Administrator, Editor, Support roles for staff
   - RLS policies enforce access control

## Features

### Customer Features
✅ Product browsing and search
✅ Shopping cart management
✅ Wishlist/Save for later
✅ User authentication
✅ Order placement and tracking
✅ Product reviews
✅ User profile management
✅ Address management
✅ Order history

### Admin Features
✅ Product management (CRUD)
✅ Order management
✅ Customer management
✅ Inventory tracking
✅ Review moderation
✅ Blog post management
✅ Category management
✅ Discount/coupon management
✅ Analytics dashboard
✅ Hero slide management
✅ Sale campaign management
✅ Site announcements
✅ Contact message handling

### Advanced Features
✅ Real-time updates via Supabase subscriptions
✅ Image storage with Supabase Storage
✅ Full-text search
✅ Row Level Security
✅ AI-powered chatbot (Gemini)
✅ Responsive design
✅ Arabic RTL support
✅ Dark/Light theme

## Mock Mode

The application can run in "mock mode" if Supabase credentials are not configured:
- Falls back to static data from `src/data/` files
- All write operations log warnings but don't fail
- Useful for development and testing UI

To enable mock mode: Simply don't set the Supabase environment variables.

## Migration from Mock Data

To migrate existing mock data to Supabase:

1. Set up your Supabase database with the schema
2. Create a migration script to insert mock data
3. Run the migration
4. Update the service layer to use real data

Example migration script structure:

```typescript
import { supabase } from './src/lib/supabase';
import { allProducts } from './src/data/products';

async function migrateProducts() {
  for (const product of allProducts) {
    await supabase.from('products').insert([{
      // Transform and insert product
    }]);
  }
}
```

## Deployment

### Frontend Deployment (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables in deployment settings
4. Deploy!

### Database (Supabase)

Supabase handles:
- Database hosting
- Automatic backups
- Scaling
- API endpoints

No separate backend deployment needed!

## Troubleshooting

### Common Issues

**Issue**: "Supabase credentials not found"
- **Solution**: Check that `.env.local` exists and contains valid credentials

**Issue**: Database queries failing
- **Solution**: Ensure schema is properly set up in Supabase SQL Editor

**Issue**: RLS policy errors
- **Solution**: Check that user is authenticated for protected operations

**Issue**: Images not loading
- **Solution**: Set up Supabase Storage buckets (see schema.sql comments)

## Production Checklist

Before going to production:

- [ ] Set up proper Supabase project (not temporary/test)
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Set up Supabase Storage buckets
- [ ] Configure email templates in Supabase Auth
- [ ] Set up custom domain
- [ ] Enable Supabase backups
- [ ] Test all user flows
- [ ] Test admin operations
- [ ] Set up monitoring and error tracking
- [ ] Configure CORS if needed
- [ ] Review and test RLS policies
- [ ] Set up payment gateway (if applicable)

## Support

For issues and questions:
- Check the Supabase documentation: https://supabase.com/docs
- Review the React documentation: https://react.dev
- Open an issue in the GitHub repository

## License

[Your License Here]

---

Built with ❤️ using React, TypeScript, Supabase, and Tailwind CSS
