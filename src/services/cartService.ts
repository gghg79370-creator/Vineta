import { supabase } from '../lib/supabase';
import { Product } from '../types';

/**
 * Cart Service
 * Handles cart operations with Supabase
 * Falls back to local storage if Supabase is not configured
 */

const isMockMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  selected_size: string;
  selected_color: string;
  product?: Product; // Joined product data
}

export const cartService = {
  /**
   * Get user's cart items
   */
  async getCart(userId: string): Promise<CartItem[]> {
    if (isMockMode) {
      console.warn('Running in mock mode - using local storage cart');
      return [];
    }

    const { data, error } = await supabase
      .from('cart')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching cart:', error);
      return [];
    }

    return data as CartItem[];
  },

  /**
   * Add item to cart
   */
  async addToCart(
    userId: string,
    productId: number,
    quantity: number,
    selectedSize: string,
    selectedColor: string
  ): Promise<CartItem | null> {
    if (isMockMode) {
      console.warn('Running in mock mode - cart not synced to database');
      return null;
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('selected_size', selectedSize)
      .eq('selected_color', selectedColor)
      .single();

    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating cart item:', error);
        return null;
      }

      return data;
    }

    // Add new item
    const { data, error } = await supabase
      .from('cart')
      .insert([{
        user_id: userId,
        product_id: productId,
        quantity,
        selected_size: selectedSize,
        selected_color: selectedColor,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding to cart:', error);
      return null;
    }

    return data;
  },

  /**
   * Update cart item quantity
   */
  async updateCartItem(cartItemId: number, quantity: number): Promise<boolean> {
    if (isMockMode) {
      return false;
    }

    if (quantity <= 0) {
      return this.removeFromCart(cartItemId);
    }

    const { error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', cartItemId);

    if (error) {
      console.error('Error updating cart item:', error);
      return false;
    }

    return true;
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(cartItemId: number): Promise<boolean> {
    if (isMockMode) {
      return false;
    }

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      console.error('Error removing from cart:', error);
      return false;
    }

    return true;
  },

  /**
   * Clear entire cart
   */
  async clearCart(userId: string): Promise<boolean> {
    if (isMockMode) {
      return false;
    }

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing cart:', error);
      return false;
    }

    return true;
  },

  /**
   * Sync local cart to database (after login)
   */
  async syncCartToDatabase(userId: string, localCartItems: any[]): Promise<boolean> {
    if (isMockMode) {
      return false;
    }

    try {
      for (const item of localCartItems) {
        await this.addToCart(
          userId,
          item.id,
          item.quantity,
          item.selectedSize,
          item.selectedColor
        );
      }
      return true;
    } catch (error) {
      console.error('Error syncing cart:', error);
      return false;
    }
  },
};
