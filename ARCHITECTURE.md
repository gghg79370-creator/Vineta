# Vineta E-commerce Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Customer   │  │    Admin     │  │     Auth     │          │
│  │    Pages     │  │  Dashboard   │  │    Pages     │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                  │
│         └──────────────────┼──────────────────┘                  │
│                            │                                     │
│  ┌─────────────────────────▼───────────────────────────┐        │
│  │           React Hooks & State Management            │        │
│  │  (useProducts, AppState, useToast, etc.)           │        │
│  └─────────────────────────┬───────────────────────────┘        │
│                            │                                     │
├────────────────────────────┼─────────────────────────────────────┤
│                   Service Layer                                  │
├────────────────────────────┼─────────────────────────────────────┤
│                            │                                     │
│  ┌────────────┐  ┌─────────▼───────┐  ┌────────────┐           │
│  │  authService│  │ productService │  │ cartService │           │
│  └─────┬──────┘  └─────────┬───────┘  └─────┬──────┘           │
│        │                   │                  │                  │
│  ┌─────▼──────┐  ┌─────────▼───────┐  ┌─────▼──────┐           │
│  │orderService│  │ wishlistService │  │adminService│           │
│  └─────┬──────┘  └─────────┬───────┘  └─────┬──────┘           │
│        │                   │                  │                  │
│        └───────────────────┼──────────────────┘                  │
│                            │                                     │
│  ┌─────────────────────────▼───────────────────────────┐        │
│  │              Supabase Client (supabase.ts)          │        │
│  │           - Authentication                          │        │
│  │           - Database Operations                     │        │
│  │           - Real-time Subscriptions                 │        │
│  │           - Storage                                 │        │
│  └─────────────────────────┬───────────────────────────┘        │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                   ┌─────────▼──────────┐
                   │  Supabase Backend  │
                   └─────────┬──────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│   PostgreSQL   │  │  Supabase Auth  │  │    Storage     │
│   Database     │  │   (JWT Auth)    │  │   (Images)     │
└────────────────┘  └─────────────────┘  └────────────────┘
```

## Data Flow Example: User Places an Order

```
1. User clicks "Place Order"
   ↓
2. CheckoutPage → calls orderService.createOrder()
   ↓
3. orderService validates data
   ↓
4. Supabase client sends request with JWT token
   ↓
5. Supabase validates token & checks RLS policies
   ↓
6. PostgreSQL inserts order into 'orders' table
   ↓
7. Trigger updates customer stats
   ↓
8. Response flows back to frontend
   ↓
9. UI updates with order confirmation
   ↓
10. Cart is cleared via cartService.clearCart()
```

## Authentication Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Enters email/password
     ▼
┌─────────────┐
│ LoginPage   │
└────┬────────┘
     │ 2. Calls authService.signIn()
     ▼
┌──────────────┐
│ authService  │
└────┬─────────┘
     │ 3. Sends to Supabase Auth
     ▼
┌───────────────┐
│ Supabase Auth │
└────┬──────────┘
     │ 4. Validates credentials
     │ 5. Returns JWT token
     ▼
┌──────────────┐
│ authService  │
└────┬─────────┘
     │ 6. Fetches customer profile
     ▼
┌──────────────┐
│ Database     │
│ 'customers'  │
└────┬─────────┘
     │ 7. Returns user data
     ▼
┌──────────────┐
│ AppState     │ 8. Stores user in state
└────┬─────────┘
     │ 9. Redirects to account
     ▼
┌──────────────┐
│ User is      │
│ Logged In!   │
└──────────────┘
```

## Database Schema Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Core Tables                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  products ──┬─→ product_variants                            │
│             │                                                │
│             └─→ reviews ←── customers                        │
│                                                              │
│  customers ─┬─→ cart                                        │
│             ├─→ wishlist                                    │
│             ├─→ orders                                      │
│             └─→ reviews                                     │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                   Content Tables                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  categories (hierarchical with parent_id)                   │
│  blog_posts                                                 │
│  hero_slides                                                │
│  sale_campaigns                                             │
│  announcements                                              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    Admin Tables                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  discounts                                                  │
│  contact_messages                                           │
│  newsletter_subscribers                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Security Model (RLS Policies)

```
┌────────────────────────────────────────────────────┐
│           Row Level Security (RLS)                  │
├────────────────────────────────────────────────────┤
│                                                     │
│  PRODUCTS                                          │
│  ├─ Read: Everyone (public)                       │
│  └─ Write: Administrators only                    │
│                                                     │
│  CUSTOMERS                                         │
│  ├─ Read: Self + Admins                          │
│  └─ Write: Self only                              │
│                                                     │
│  ORDERS                                            │
│  ├─ Read: Owner + Admins                          │
│  ├─ Create: Owner only                            │
│  └─ Update: Admins only                           │
│                                                     │
│  CART / WISHLIST                                   │
│  ├─ Read: Owner only                              │
│  └─ Write: Owner only                             │
│                                                     │
│  REVIEWS                                           │
│  ├─ Read: Approved (public) + Owner + Admins     │
│  └─ Write: Owner or Admins                        │
│                                                     │
│  BLOG POSTS                                        │
│  ├─ Read: Published (public) + Admins            │
│  └─ Write: Admins only                            │
│                                                     │
│  ADMIN CONTENT (announcements, slides, etc.)      │
│  ├─ Read: Active (public) + Admins               │
│  └─ Write: Admins only                            │
│                                                     │
└────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel/Netlify                        │
│                     (CDN + Static Hosting)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Static Files (HTML, JS, CSS, Images)          │  │
│  │  - Optimized build from /dist                         │  │
│  │  - Served via Global CDN                              │  │
│  │  - Automatic HTTPS                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ API Calls (with JWT)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Cloud                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐ │
│  │   PostgreSQL   │  │ Supabase Auth  │  │   Storage    │ │
│  │    Database    │  │   (JWT Auth)   │  │   Buckets    │ │
│  │  - All tables  │  │  - User mgmt   │  │  - Images    │ │
│  │  - RLS enabled │  │  - Sessions    │  │  - Files     │ │
│  └────────────────┘  └────────────────┘  └──────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Auto-scaling & Backups                     │ │
│  │  - Daily backups                                        │ │
│  │  - Connection pooling                                   │ │
│  │  - Global distribution                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Service Layer Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    Service Module Pattern                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  export const serviceNameService = {                        │
│                                                              │
│    async operation() {                                      │
│      // 1. Check if mock mode                              │
│      if (isMockMode) {                                      │
│        return mockData;                                     │
│      }                                                       │
│                                                              │
│      // 2. Call Supabase                                   │
│      const { data, error } = await supabase                │
│        .from('table')                                       │
│        .operation();                                        │
│                                                              │
│      // 3. Handle errors                                   │
│      if (error) {                                           │
│        console.error('Error:', error);                      │
│        return fallbackData;                                 │
│      }                                                       │
│                                                              │
│      // 4. Transform data                                  │
│      return transformData(data);                            │
│    }                                                         │
│  };                                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Mock Mode vs Production Mode

```
Development Mode (No Supabase)
├─ Uses static data from src/data/
├─ Perfect for UI development
├─ No backend required
├─ Fast iteration
└─ Demo/testing friendly

Production Mode (With Supabase)
├─ Real database operations
├─ Persistent data
├─ Authentication works
├─ Multi-user support
└─ Production ready
```

## Technology Stack

```
Frontend
├─ React 18
├─ TypeScript
├─ Vite (build tool)
├─ Tailwind CSS
└─ React Router (hash-based)

Backend
├─ Supabase
│  ├─ PostgreSQL (database)
│  ├─ PostgREST (API)
│  ├─ GoTrue (auth)
│  └─ Storage (files)

Services
├─ 6 service modules
├─ Type-safe operations
├─ Error handling
└─ Mock mode fallback

Hosting
├─ Vercel/Netlify (frontend)
└─ Supabase Cloud (backend)
```

## File Structure

```
vineta/
├── src/
│   ├── lib/
│   │   └── supabase.ts              # Supabase client
│   ├── services/                     # Backend services
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── cartService.ts
│   │   ├── orderService.ts
│   │   ├── wishlistService.ts
│   │   └── adminService.ts
│   ├── hooks/
│   │   └── useProducts.ts           # Data fetching hooks
│   ├── pages/                        # UI pages
│   ├── components/                   # UI components
│   ├── admin/                        # Admin dashboard
│   ├── data/                         # Mock data (fallback)
│   ├── state/                        # App state
│   └── types/                        # TypeScript types
├── supabase/
│   └── schema.sql                    # Database schema
├── scripts/
│   └── migrate-data.js              # Data seeding
├── SUMMARY.md                        # This file!
├── SETUP.md                          # Setup guide
├── INTEGRATION.md                    # Integration guide
├── DEPLOYMENT.md                     # Deployment guide
└── README.md                         # Overview
```

---

This architecture provides:
- ✅ Scalability (Supabase auto-scales)
- ✅ Security (RLS policies)
- ✅ Performance (CDN + indexes)
- ✅ Developer experience (mock mode)
- ✅ Production ready (complete stack)
