import { supabase } from '../lib/supabase';

/**
 * Wishlist Service
 * Handles wishlist operations with Supabase
 */

const isMockMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

export const wishlistService = {
  /**
   * Get user's wishlist
   */
  async getWishlist(userId: string): Promise<any[]> {
    if (isMockMode) {
      return [];
    }

    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Add item to wishlist
   */
  async addToWishlist(userId: string, productId: number, note: string = ''): Promise<boolean> {
    if (isMockMode) {
      return false;
    }

    const { error } = await supabase
      .from('wishlist')
      .insert([{
        user_id: userId,
        product_id: productId,
        note,
      }]);

    if (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }

    return true;
  },

  /**
   * Remove item from wishlist
   */
  async removeFromWishlist(userId: string, productId: number): Promise<boolean> {
    if (isMockMode) {
      return false;
    }

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }

    return true;
  },

  /**
   * Update wishlist item note
   */
  async updateWishlistNote(userId: string, productId: number, note: string): Promise<boolean> {
    if (isMockMode) {
      return false;
    }

    const { error } = await supabase
      .from('wishlist')
      .update({ note })
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Error updating wishlist note:', error);
      return false;
    }

    return true;
  },
};
