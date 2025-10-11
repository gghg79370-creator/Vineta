/**
 * Application Configuration
 * Centralized configuration management
 */

/**
 * Environment variables with type safety and defaults
 */
export const config = {
  // API Keys
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '',
  
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },

  // Application Settings
  app: {
    name: 'Vineta',
    version: '1.0.0',
    description: 'Full Stack E-commerce Platform',
    locale: 'ar-SA',
    direction: 'rtl',
    currency: 'SAR',
    currencySymbol: 'ر.س',
  },

  // Feature Flags
  features: {
    enableAI: true,
    enableChatbot: true,
    enableAnalytics: true,
    enableNewsletter: true,
    enableReviews: true,
    enableWishlist: true,
    enableCompare: true,
    enableStyleMe: true,
    enableBlog: true,
    enableDarkMode: true,
  },

  // Mock Mode (for development without backend)
  mockMode: !import.meta.env.VITE_SUPABASE_URL,

  // Development Mode
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  // API Configuration
  api: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // Storage Configuration
  storage: {
    productImagesBucket: 'product-images',
    userAvatarsBucket: 'user-avatars',
    blogImagesBucket: 'blog-images',
  },

  // Pagination
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 100,
  },

  // Security
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 900000, // 15 minutes
    sessionTimeout: 3600000, // 1 hour
  },

  // SEO
  seo: {
    siteName: 'Vineta - متجر الأزياء الإلكتروني',
    siteDescription: 'اكتشف أحدث صيحات الموضة في متجر Vineta الإلكتروني',
    siteUrl: 'https://vineta.com',
    twitterHandle: '@vineta',
    ogImage: '/og-image.jpg',
  },

  // Social Media
  socialMedia: {
    instagram: 'https://instagram.com/vineta',
    facebook: 'https://facebook.com/vineta',
    twitter: 'https://twitter.com/vineta',
    tiktok: 'https://tiktok.com/@vineta',
  },

  // Contact
  contact: {
    email: 'info@vineta.com',
    phone: '+966 XX XXX XXXX',
    address: 'الرياض، المملكة العربية السعودية',
  },

  // Analytics (placeholder for future implementation)
  analytics: {
    googleAnalyticsId: '',
    facebookPixelId: '',
    hotjarId: '',
  },
} as const;

/**
 * Validate configuration
 */
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check required environment variables for production
  if (config.isProduction && !config.mockMode) {
    if (!config.supabase.url) {
      errors.push('VITE_SUPABASE_URL is required in production');
    }
    if (!config.supabase.anonKey) {
      errors.push('VITE_SUPABASE_ANON_KEY is required in production');
    }
  }

  // Check AI features
  if (config.features.enableAI && !config.geminiApiKey) {
    console.warn('Gemini API key not configured. AI features will be disabled.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get feature flag status
 */
export const isFeatureEnabled = (feature: keyof typeof config.features): boolean => {
  return config.features[feature];
};

/**
 * Get environment name
 */
export const getEnvironment = (): 'development' | 'production' => {
  return config.isProduction ? 'production' : 'development';
};

/**
 * Check if running in mock mode
 */
export const isMockMode = (): boolean => {
  return config.mockMode;
};

export default config;
