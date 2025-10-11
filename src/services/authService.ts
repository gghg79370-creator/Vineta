import { supabase } from '../lib/supabase';
import { User } from '../types';

/**
 * Authentication Service
 * Handles user authentication with Supabase Auth
 * Falls back to mock authentication if Supabase is not configured
 */

const isMockMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

export const authService = {
  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, name: string): Promise<{ user: User | null; error: string | null }> {
    if (isMockMode) {
      console.warn('Running in mock mode - user not actually created');
      return {
        user: {
          id: 'mock-' + Date.now(),
          email,
          name,
          isAdmin: false,
          role: 'Customer',
          addresses: [],
        },
        error: null,
      };
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: 'Failed to create user' };
    }

    // Create customer profile
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert([{
        id: authData.user.id,
        email,
        name,
        role: 'Customer',
        addresses: [],
      }])
      .select()
      .single();

    if (customerError) {
      console.error('Error creating customer profile:', customerError);
      return { user: null, error: 'Failed to create user profile' };
    }

    return {
      user: {
        id: customerData.id,
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        isAdmin: customerData.role === 'Administrator',
        role: customerData.role,
        addresses: customerData.addresses || [],
      },
      error: null,
    };
  },

  /**
   * Sign in an existing user
   */
  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    if (isMockMode) {
      console.warn('Running in mock mode - using mock authentication');
      // Mock admin user
      if (email === 'admin@example.com') {
        return {
          user: {
            id: '1',
            email: 'admin@example.com',
            name: 'فينيتا فام',
            phone: '01234567890',
            isAdmin: true,
            role: 'Administrator',
            addresses: [],
          },
          error: null,
        };
      }
      // Mock regular user
      return {
        user: {
          id: 'mock-user',
          email,
          name: 'مستخدم تجريبي',
          isAdmin: false,
          role: 'Customer',
          addresses: [],
        },
        error: null,
      };
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: 'Failed to sign in' };
    }

    // Get customer profile
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (customerError) {
      console.error('Error fetching customer profile:', customerError);
      return { user: null, error: 'Failed to fetch user profile' };
    }

    return {
      user: {
        id: customerData.id,
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        isAdmin: customerData.role === 'Administrator',
        role: customerData.role,
        addresses: customerData.addresses || [],
      },
      error: null,
    };
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: string | null }> {
    if (isMockMode) {
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { error: error.message };
    }

    return { error: null };
  },

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    if (isMockMode) {
      return null;
    }

    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return null;
    }

    // Get customer profile
    const { data: customerData, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error('Error fetching customer profile:', error);
      return null;
    }

    return {
      id: customerData.id,
      email: customerData.email,
      name: customerData.name,
      phone: customerData.phone,
      isAdmin: customerData.role === 'Administrator',
      role: customerData.role,
      addresses: customerData.addresses || [],
    };
  },

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<{ error: string | null }> {
    if (isMockMode) {
      console.warn('Running in mock mode - password reset email not sent');
      return { error: null };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  },

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    if (isMockMode) {
      console.warn('Running in mock mode - password not updated');
      return { error: null };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<User>): Promise<{ user: User | null; error: string | null }> {
    if (isMockMode) {
      console.warn('Running in mock mode - profile not updated');
      return { user: null, error: null };
    }

    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.addresses !== undefined) dbUpdates.addresses = updates.addresses;

    const { data, error } = await supabase
      .from('customers')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return { user: null, error: error.message };
    }

    return {
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        isAdmin: data.role === 'Administrator',
        role: data.role,
        addresses: data.addresses || [],
      },
      error: null,
    };
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    if (isMockMode) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  },
};
