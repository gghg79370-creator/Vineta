# Project Structure

This document provides a comprehensive overview of the Vineta e-commerce project structure.

## Root Directory

```
vineta/
├── src/                    # Source code
├── public/                 # Static assets
├── dist/                   # Build output
├── supabase/              # Database schema and migrations
├── scripts/               # Utility scripts
├── data/                  # Mock data (development)
└── [config files]         # Configuration files
```

## Source Directory Structure

```
src/
├── admin/                 # Admin dashboard
│   ├── components/        # Admin-specific components
│   │   ├── analytics/     # Analytics components
│   │   ├── categories/    # Category management
│   │   ├── content/       # Content management
│   │   ├── customers/     # Customer management
│   │   ├── discounts/     # Discount management
│   │   ├── layout/        # Admin layout components
│   │   ├── marketing/     # Marketing components
│   │   ├── messages/      # Message management
│   │   ├── modals/        # Admin modals
│   │   ├── notifications/ # Notification components
│   │   ├── orders/        # Order management
│   │   ├── products/      # Product management
│   │   ├── settings/      # Settings components
│   │   └── ui/            # Admin UI components
│   ├── data/              # Admin mock data
│   ├── pages/             # Admin pages
│   ├── utils/             # Admin utilities
│   └── AdminDashboard.tsx # Main admin component
│
├── components/            # Frontend components
│   ├── account/           # Account components (future)
│   ├── auth/              # Auth components (future)
│   ├── blog/              # Blog components
│   ├── cart/              # Cart components
│   ├── chatbot/           # Chatbot components
│   ├── checkout/          # Checkout components (future)
│   ├── collection/        # Collection components
│   ├── home/              # Homepage sections
│   ├── icons/             # Icon components
│   ├── layout/            # Layout components
│   ├── modals/            # Modal components
│   ├── product/           # Product components
│   ├── search/            # Search components
│   ├── ui/                # UI components
│   │   └── skeletons/     # Loading skeletons
│   └── wishlist/          # Wishlist components
│
├── config/                # Configuration
│   ├── index.ts           # App configuration
│   └── lazyLoading.tsx    # Lazy loading config
│
├── constants/             # Application constants
│   └── index.ts           # All constants
│
├── data/                  # Mock data
│   ├── products.ts        # Product data
│   ├── orders.ts          # Order data
│   ├── homepage.ts        # Homepage data
│   └── sales.ts           # Sales campaigns
│
├── hooks/                 # Custom React hooks
│   ├── useProducts.ts     # Product fetching
│   ├── useToast.ts        # Toast notifications
│   ├── useCountdown.ts    # Countdown timer
│   └── useQuery.ts        # Query parameters
│
├── lib/                   # External library configurations
│   └── supabase.ts        # Supabase client
│
├── pages/                 # Page components
│   ├── AccountPage.tsx
│   ├── BlogListPage.tsx
│   ├── BlogPostPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── ComparePage.tsx
│   ├── ContactPage.tsx
│   ├── EmailVerificationPage.tsx
│   ├── FaqPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── OrderConfirmationPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── RegisterPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── SearchPage.tsx
│   ├── ShopPage.tsx
│   ├── StyleMePage.tsx
│   ├── WishlistPage.tsx
│   └── WomenPage.tsx
│
├── services/              # Backend services
│   ├── adminService.ts    # Admin operations
│   ├── authService.ts     # Authentication
│   ├── cartService.ts     # Cart operations
│   ├── orderService.ts    # Order operations
│   ├── productService.ts  # Product operations
│   └── wishlistService.ts # Wishlist operations
│
├── state/                 # State management
│   └── AppState.tsx       # Global app state
│
├── types/                 # TypeScript types
│   └── index.ts           # All type definitions
│
├── utils/                 # Utility functions
│   ├── array.ts           # Array utilities
│   ├── formatters.ts      # Formatting utilities
│   ├── validators.ts      # Validation utilities
│   └── index.ts           # Utility exports
│
├── App.tsx                # Main app component
├── Router.tsx             # Route configuration
└── index.tsx              # Entry point
```

## Key Directories Explained

### `/src/admin/`
Complete admin dashboard with:
- **components/**: Reusable admin UI components organized by feature
- **pages/**: Full page views for different admin sections
- **data/**: Mock data for admin development
- **utils/**: Admin-specific helper functions

### `/src/components/`
Frontend UI components organized by feature:
- Each folder contains related components
- Index files provide clean imports
- README.md documents structure and usage

### `/src/config/`
Centralized configuration:
- **index.ts**: Environment variables and app settings
- **lazyLoading.tsx**: Code splitting configuration

### `/src/constants/`
Application-wide constants:
- API configuration
- Validation rules
- UI settings
- Status enums
- Messages (error/success)

### `/src/services/`
Backend service layer:
- Abstracts Supabase operations
- Provides mock mode fallback
- Type-safe operations
- Error handling

### `/src/utils/`
Reusable utility functions:
- **formatters.ts**: Price, date, phone formatting
- **validators.ts**: Input validation
- **array.ts**: Array manipulation helpers

## Import Patterns

### Component Imports
```typescript
// Clean imports using index files
import { Header, Footer } from '@/components/layout';
import { ProductCard } from '@/components/product';
import { BulkActions } from '@/admin/components/ui';
```

### Utility Imports
```typescript
import { formatPrice, formatDate } from '@/utils';
import { isValidEmail } from '@/utils/validators';
```

### Constant Imports
```typescript
import { ROUTES, CURRENCY, ERROR_MESSAGES } from '@/constants';
```

### Config Imports
```typescript
import { config, isFeatureEnabled } from '@/config';
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Utilities**: camelCase (e.g., `formatters.ts`)
- **Constants**: camelCase (e.g., `constants/index.ts`)
- **Types**: PascalCase for interfaces (e.g., `Product`, `User`)
- **Pages**: PascalCase with "Page" suffix (e.g., `HomePage.tsx`)

## Code Organization Principles

1. **Separation of Concerns**: Admin and frontend code are separate
2. **Feature-based Organization**: Components grouped by feature, not type
3. **Centralized Exports**: Index files for clean imports
4. **Type Safety**: TypeScript throughout
5. **Service Layer**: Backend operations abstracted
6. **Utility Functions**: Reusable helpers extracted
7. **Constants**: Magic numbers/strings centralized

## Development Workflow

1. **Component Development**: Create in appropriate feature folder
2. **Add to Index**: Export from folder's index.ts
3. **Use Utilities**: Leverage existing formatters and validators
4. **Type Safety**: Define interfaces for props and data
5. **Service Layer**: Use services for backend operations

## Build Output

```
dist/
├── index.html              # Entry HTML
├── assets/
│   ├── index-[hash].js     # Main bundle
│   └── [lazy chunks].js    # Code-split chunks
└── [static assets]
```

## Best Practices

- **Keep Components Small**: Single responsibility principle
- **Reuse Utilities**: Don't duplicate common logic
- **Use Constants**: Avoid magic numbers/strings
- **Type Everything**: Leverage TypeScript
- **Document Complex Logic**: Add comments when needed
- **Follow Conventions**: Maintain consistent naming and structure

## Future Enhancements

- [ ] Component library with Storybook
- [ ] Unit and integration tests
- [ ] E2E testing with Playwright/Cypress
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics integration
- [ ] Progressive Web App (PWA) features
