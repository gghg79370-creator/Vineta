import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Running in mock mode.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types (will be generated from Supabase later)
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          brand: string | null;
          price: string;
          old_price: string | null;
          image: string;
          images: string[] | null;
          description: string | null;
          colors: string[];
          sizes: string[];
          tags: string[];
          category: 'women' | 'men';
          badges: any | null;
          rating: number | null;
          review_count: number | null;
          sku: string | null;
          availability: string | null;
          items_left: number | null;
          sold_in_24h: number | null;
          viewing_now: number | null;
          sale_end_date: string | null;
          specifications: string[] | null;
          material_composition: string | null;
          care_instructions: string[] | null;
          weight: number | null;
          weight_unit: 'kg' | 'g' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: 'Delivered' | 'On the way' | 'Cancelled' | 'Processing';
          total: string;
          items: any;
          shipping_address: any;
          billing_address: any;
          payment_method: string | null;
          tracking_number: string | null;
          estimated_delivery: string | null;
          tracking_history: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      customers: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          avatar: string | null;
          role: 'Administrator' | 'Editor' | 'Support' | 'Customer';
          addresses: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      reviews: {
        Row: {
          id: number;
          product_id: number;
          user_id: string;
          author: string;
          rating: number;
          text: string;
          image: string | null;
          status: 'Pending' | 'Approved' | 'Hidden';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      cart: {
        Row: {
          id: number;
          user_id: string;
          product_id: number;
          quantity: number;
          selected_size: string;
          selected_color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cart']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['cart']['Insert']>;
      };
      wishlist: {
        Row: {
          id: number;
          user_id: string;
          product_id: number;
          note: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['wishlist']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['wishlist']['Insert']>;
      };
      categories: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          parent_id: number | null;
          status: 'Visible' | 'Hidden';
          image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      blog_posts: {
        Row: {
          id: number;
          title: string;
          author: string;
          status: 'Published' | 'Draft';
          content: string;
          featured_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
      };
      discounts: {
        Row: {
          id: number;
          code: string;
          type: 'percentage' | 'fixed';
          value: number;
          status: 'Active' | 'Expired';
          min_purchase: number | null;
          max_discount: number | null;
          usage_limit: number | null;
          used_count: number;
          valid_from: string;
          valid_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['discounts']['Row'], 'id' | 'used_count' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['discounts']['Insert']>;
      };
      announcements: {
        Row: {
          id: number;
          content: string;
          status: 'Active' | 'Inactive';
          start_date: string;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['announcements']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['announcements']['Insert']>;
      };
    };
  };
}
