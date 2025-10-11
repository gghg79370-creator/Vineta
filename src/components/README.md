# Component Structure Documentation

This document describes the organization and structure of components in the Vineta e-commerce application.

## Directory Structure

```
src/components/
├── account/          # Account-related components (future)
├── auth/            # Authentication components (future)
├── blog/            # Blog components
├── cart/            # Shopping cart components
├── chatbot/         # AI chatbot components
├── checkout/        # Checkout flow components (future)
├── collection/      # Product collection components
├── home/            # Homepage sections
├── icons/           # Icon components
├── layout/          # Layout components (header, footer, etc.)
├── modals/          # Modal dialog components
├── product/         # Product display components
├── search/          # Search functionality components
├── ui/              # Reusable UI components
│   └── skeletons/   # Loading skeleton components
└── wishlist/        # Wishlist components
```

## Component Categories

### 1. Layout Components (`layout/`)
Core layout components that structure the application:
- `Header.tsx` - Main navigation header
- `Footer.tsx` - Footer with links and information
- `MobileBottomNav.tsx` - Mobile navigation bar
- `MobileMenu.tsx` - Mobile hamburger menu
- `AnnouncementBar.tsx` - Top announcement banner
- `AuthLayout.tsx` - Layout wrapper for auth pages

**Import Example:**
```tsx
import { Header, Footer, MobileBottomNav } from '@/components/layout';
```

### 2. Product Components (`product/`)
Components for displaying products:
- `ProductCard.tsx` - Standard product card
- `CollectionProductCard.tsx` - Product card for collections
- `CollectionProductListCard.tsx` - List view product card
- `MobileProductCard.tsx` - Mobile-optimized product card
- `WishlistProductCard.tsx` - Product card in wishlist
- `ReviewsSection.tsx` - Product reviews section
- `FrequentlyBoughtTogether.tsx` - Related products section
- `RecentlyViewedSection.tsx` - Recently viewed products
- `TrendingProductsSection.tsx` - Trending products section

**Import Example:**
```tsx
import { ProductCard, ReviewsSection } from '@/components/product';
```

### 3. Home Components (`home/`)
Homepage section components:
- `HeroSection.tsx` - Hero slider/banner
- `FeaturedProductSection.tsx` - Featured products
- `FeaturedCategories.tsx` - Category grid
- `CountdownSaleSection.tsx` - Sale countdown timer
- `TabbedProductSection.tsx` - Tabbed product display
- `TestimonialsSection.tsx` - Customer testimonials
- `BrandLogos.tsx` - Brand partner logos
- `InstagramSection.tsx` - Instagram feed
- `ShopByLookSection.tsx` - Complete outfit section
- `AiRecommendationsSection.tsx` - AI-powered recommendations
- Plus more specialized sections...

**Import Example:**
```tsx
import { HeroSection, FeaturedProductSection } from '@/components/home';
```

### 4. UI Components (`ui/`)
Reusable UI building blocks:
- `Spinner.tsx` - Loading spinner
- `Toast.tsx` - Toast notification
- `ToastContainer.tsx` - Toast container
- `Breadcrumb.tsx` - Breadcrumb navigation
- `Carousel.tsx` - Image carousel
- `OrderTracker.tsx` - Order status tracker
- `ProductCardSkeleton.tsx` - Loading skeleton
- `PasswordStrengthIndicator.tsx` - Password strength meter
- `NewsletterPopup.tsx` - Newsletter signup popup
- `GoToTopButton.tsx` - Scroll to top button

**Import Example:**
```tsx
import { Spinner, Toast, Breadcrumb } from '@/components/ui';
```

### 5. Modal Components (`modals/`)
Dialog and modal components:
- `QuickViewModal.tsx` - Product quick view
- `AskQuestionModal.tsx` - Product inquiry modal
- `CompareModal.tsx` - Product comparison
- `WriteReviewModal.tsx` - Review submission
- `SizeGuideModal.tsx` - Size guide
- `AddressModal.tsx` - Address management
- `OrderDetailModal.tsx` - Order details

**Import Example:**
```tsx
import { QuickViewModal, WriteReviewModal } from '@/components/modals';
```

### 6. Cart Components (`cart/`)
Shopping cart related components:
- `CartDrawer.tsx` - Slide-out cart drawer
- `FloatingCartBubble.tsx` - Floating cart icon with badge

**Import Example:**
```tsx
import { CartDrawer, FloatingCartBubble } from '@/components/cart';
```

### 7. Search Components (`search/`)
Search functionality:
- `SearchOverlay.tsx` - Full-screen search overlay
- `SearchDrawer.tsx` - Search drawer (alternative)

**Import Example:**
```tsx
import { SearchOverlay } from '@/components/search';
```

### 8. Wishlist Components (`wishlist/`)
Wishlist functionality:
- `WishlistGrid.tsx` - Grid display of wishlist items
- `WishlistProductCard.tsx` - Wishlist item card

**Import Example:**
```tsx
import { WishlistGrid } from '@/components/wishlist';
```

### 9. Blog Components (`blog/`)
Blog-related components:
- `BlogPostCard.tsx` - Blog post preview card

**Import Example:**
```tsx
import { BlogPostCard } from '@/components/blog';
```

### 10. Chatbot Components (`chatbot/`)
AI chatbot functionality:
- `Chatbot.tsx` - Main chatbot component
- `ProductCardInChat.tsx` - Product card in chat

**Import Example:**
```tsx
import Chatbot from '@/components/chatbot/Chatbot';
```

## Component Design Guidelines

### Naming Conventions
- Use PascalCase for component files (e.g., `ProductCard.tsx`)
- Use descriptive names that clearly indicate purpose
- Suffix modal components with "Modal"
- Suffix section components with "Section" for homepage sections

### Component Structure
```tsx
import React from 'react';
import { ComponentProps } from './types'; // if needed

interface MyComponentProps {
  // Props definition
}

export const MyComponent: React.FC<MyComponentProps> = ({ props }) => {
  // Component logic
  
  return (
    // JSX
  );
};

export default MyComponent; // Default export if needed
```

### Index Files
Each component folder has an `index.ts` file for centralized exports:
```tsx
// components/product/index.ts
export { ProductCard } from './ProductCard';
export { ReviewsSection } from './ReviewsSection';
// ... other exports
```

This allows clean imports:
```tsx
// Instead of:
import { ProductCard } from '@/components/product/ProductCard';
import { ReviewsSection } from '@/components/product/ReviewsSection';

// Use:
import { ProductCard, ReviewsSection } from '@/components/product';
```

## Future Enhancements
- `account/` - Move account-specific components here
- `auth/` - Move authentication components here
- `checkout/` - Move checkout flow components here
- More specialized component categories as needed

## Best Practices
1. **Single Responsibility** - Each component should do one thing well
2. **Reusability** - Build components that can be reused across the app
3. **Props Over Context** - Prefer explicit props over context for clarity
4. **Type Safety** - Always define TypeScript interfaces for props
5. **Composition** - Build complex UIs by composing simple components
6. **Performance** - Use React.memo for expensive components
7. **Accessibility** - Include proper ARIA labels and semantic HTML

## Component Testing
- Components should be testable in isolation
- Use Storybook or similar for component development (future)
- Write unit tests for complex logic within components (future)
