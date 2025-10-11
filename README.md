<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Vineta - Full Stack E-commerce Platform

A complete, professional e-commerce platform built with React, TypeScript, and Supabase.

View your app in AI Studio: https://ai.studio/apps/drive/11-CkPHZ0N4S79DAX0O2zoNfs3I22nofi

## ✨ Features

### Customer Features
- 🛍️ Product browsing and advanced search
- 🛒 Shopping cart with real-time updates
- ❤️ Wishlist and save for later
- 👤 User authentication and profiles
- 📦 Order placement and tracking
- ⭐ Product reviews and ratings
- 📍 Multiple shipping addresses
- 📱 Fully responsive design
- 🌙 Dark/Light theme support
- 🤖 AI-powered shopping assistant

### Admin Dashboard
- 📊 Analytics and reporting
- 📦 Product management (CRUD operations)
- 📋 Order management and tracking
- 👥 Customer management
- 💰 Inventory tracking
- ⚙️ Review moderation
- 📝 Blog post management
- 🏷️ Category management
- 🎫 Discount and coupon system
- 🎨 Theme customization
- 📢 Site announcements
- 💌 Contact message handling

### Technical Features
- ⚡ Built with React 18 + TypeScript + Vite
- 🗄️ Supabase backend (PostgreSQL + Auth + Storage)
- 🔐 Row Level Security (RLS) for data protection
- 🔄 Real-time updates with Supabase subscriptions
- 🎨 Tailwind CSS for styling
- 🌍 RTL support (Arabic)
- 📱 Mobile-first responsive design
- 🚀 Fast build and hot module replacement
- 🤖 Google Gemini AI integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- A Supabase account (free tier available)
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Vineta
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Open your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL script from `supabase/schema.sql`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📚 Documentation

For detailed information, see:
- **[SETUP.md](SETUP.md)** - Complete setup and configuration guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and data flow
- **[STRUCTURE.md](STRUCTURE.md)** - Project structure and organization
- **[INTEGRATION.md](INTEGRATION.md)** - Service integration patterns
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide
- **[components/README.md](src/components/README.md)** - Component documentation
- **[supabase/schema.sql](supabase/schema.sql)** - Database schema and RLS policies

## 🏗️ Project Structure

```
vineta/
├── src/
│   ├── admin/              # Admin dashboard
│   │   ├── components/     # Admin UI components
│   │   ├── pages/          # Admin pages
│   │   ├── data/           # Admin mock data
│   │   └── utils/          # Admin utilities
│   ├── components/         # Frontend components (organized by feature)
│   ├── pages/              # Page components
│   ├── services/           # Backend service layer
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── constants/          # Application constants
│   ├── config/             # Configuration
│   ├── state/              # State management
│   ├── types/              # TypeScript types
│   ├── data/               # Mock data
│   └── lib/                # External libraries
├── supabase/               # Database
│   └── schema.sql          # Schema and policies
└── [config files]
```

**📖 See [STRUCTURE.md](STRUCTURE.md) for detailed structure documentation.**

## 🗄️ Database Schema

The application uses these main tables:
- **products** - Product catalog with variants
- **customers** - User accounts
- **orders** - Customer orders
- **cart** - Shopping carts
- **wishlist** - Saved items
- **reviews** - Product reviews
- **categories** - Product categories
- **blog_posts** - Blog content
- **discounts** - Coupons and promotions
- **announcements** - Site announcements

All tables have Row Level Security enabled with appropriate policies.

## 🔐 Authentication

The application uses Supabase Auth with:
- Email/password authentication
- JWT-based sessions
- Role-based access control (Customer, Administrator, Editor, Support)
- Secure password reset flow
- Email verification (optional)

## 🎨 Customization

### Theme
- Customize colors, fonts, and branding in the admin dashboard
- Edit `src/state/AppState.tsx` for default theme values
- Supports light/dark mode

### Content
- Manage all content through the admin dashboard
- Update hero slides, announcements, and sale campaigns
- Edit product catalog and categories
- Create and publish blog posts

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🚀 Deployment

### Frontend (Vercel/Netlify recommended)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy!

### Backend (Supabase)
Already hosted! Just configure your production environment variables.

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[Your License Here]

## 🙏 Acknowledgments

- Built with [React](https://react.dev)
- Backend powered by [Supabase](https://supabase.com)
- UI styled with [Tailwind CSS](https://tailwindcss.com)
- AI features by [Google Gemini](https://ai.google.dev)

---

**Note**: This is a complete full-stack e-commerce platform. For production use, ensure you:
- Set up proper Supabase project
- Configure payment gateway integration
- Set up email service for transactional emails
- Implement proper error tracking and monitoring
- Review and test all security policies
