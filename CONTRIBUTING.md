# Contributing to Vineta

Thank you for your interest in contributing to Vineta! This guide will help you get started.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Component Guidelines](#component-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Getting Started

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Initial Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Vineta.git
   cd Vineta
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your credentials
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/feature-name` - Feature branches
- `fix/bug-name` - Bug fix branches

### Creating a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### Making Changes
1. Make your changes
2. Test your changes locally
3. Build to ensure no errors:
   ```bash
   npm run build
   ```
4. Commit your changes (see commit guidelines below)

## Project Structure

```
src/
├── admin/              # Admin dashboard
├── components/         # Reusable components
├── pages/              # Page components
├── services/           # Backend services
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── constants/          # Constants
├── config/             # Configuration
├── types/              # TypeScript types
└── ...
```

For detailed structure documentation, see [STRUCTURE.md](STRUCTURE.md).

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define interfaces for component props
- Use type inference where possible
- Avoid `any` type

Example:
```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart,
  className 
}) => {
  // Component implementation
};
```

### Naming Conventions
- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useProducts.ts`)
- **Utilities**: camelCase (e.g., `formatters.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_PAGE_SIZE`)
- **Variables**: camelCase (e.g., `productList`)
- **Types/Interfaces**: PascalCase (e.g., `Product`, `UserProfile`)

### File Organization
- One component per file
- Export from index files for cleaner imports
- Group related components in folders
- Keep files under 300 lines when possible

### Imports
Use the established import order:
```typescript
// 1. External libraries
import React, { useState } from 'react';

// 2. Types
import { Product, User } from '../types';

// 3. Services/Hooks
import { useProducts } from '../hooks';
import { productService } from '../services';

// 4. Components
import { ProductCard } from '../components/product';

// 5. Utilities/Constants
import { formatPrice } from '../utils';
import { ROUTES } from '../constants';

// 6. Styles (if any)
import './styles.css';
```

## Component Guidelines

### Component Structure
```typescript
import React from 'react';

interface ComponentProps {
  // Props definition
}

/**
 * Component description
 * @param props - Component props
 */
export const Component: React.FC<ComponentProps> = ({ props }) => {
  // 1. Hooks
  const [state, setState] = useState();
  
  // 2. Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // 3. Effects
  React.useEffect(() => {
    // Effect logic
  }, []);
  
  // 4. Render helpers (if needed)
  const renderContent = () => {
    // Render logic
  };
  
  // 5. Return JSX
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default Component;
```

### Component Best Practices
- Keep components small and focused
- Use composition over complex props
- Memoize expensive computations
- Use meaningful prop names
- Add PropTypes or TypeScript interfaces
- Include JSDoc comments for complex components

### Hooks Usage
- Follow the Rules of Hooks
- Create custom hooks for reusable logic
- Use built-in hooks appropriately
- Clean up side effects in useEffect

Example custom hook:
```typescript
export const useProductData = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await productService.getProduct(productId);
      setProduct(data);
      setLoading(false);
    };
    
    fetchProduct();
  }, [productId]);

  return { product, loading };
};
```

## Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(products): add product filtering functionality

Add ability to filter products by category, price, and rating.
Includes new FilterPanel component and filter state management.

Closes #123
```

```
fix(cart): resolve quantity update issue

Fixed bug where cart quantity wouldn't update when changing
product quantity in cart drawer.
```

## Pull Request Process

### Before Submitting
1. ✅ Code builds without errors
2. ✅ All tests pass (if applicable)
3. ✅ Code follows style guidelines
4. ✅ Documentation is updated
5. ✅ Commit messages follow guidelines

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code builds without errors
- [ ] Follows code style guidelines
- [ ] Documentation updated
- [ ] Tested locally
```

### Review Process
1. Submit PR with clear description
2. Address reviewer comments
3. Update PR based on feedback
4. Wait for approval
5. Squash and merge when approved

## Questions?

If you have questions or need help:
1. Check existing documentation
2. Search through issues
3. Open a new issue with the `question` label

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

Thank you for contributing to Vineta! 🎉
