import { supabase } from '../lib/supabase';
import { Order, OrderItem } from '../types';

/**
 * Order Service
 * Handles order operations with Supabase
 * Falls back to mock data if Supabase is not configured
 */

const isMockMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

export const orderService = {
  /**
   * Get all orders for a user
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    if (isMockMode) {
      console.warn('Running in mock mode - returning empty orders');
      return [];
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data.map(order => ({
      id: order.id,
      date: new Date(order.created_at).toLocaleDateString('ar-EG'),
      status: order.status,
      total: order.total,
      items: order.items,
      estimatedDelivery: order.estimated_delivery,
      trackingHistory: order.tracking_history,
    }));
  },

  /**
   * Get a specific order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    if (isMockMode) {
      console.warn('Running in mock mode');
      return null;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return {
      id: data.id,
      date: new Date(data.created_at).toLocaleDateString('ar-EG'),
      status: data.status,
      total: data.total,
      items: data.items,
      estimatedDelivery: data.estimated_delivery,
      trackingHistory: data.tracking_history,
    };
  },

  /**
   * Create a new order
   */
  async createOrder(
    userId: string,
    items: OrderItem[],
    total: string,
    shippingAddress: any,
    billingAddress: any,
    paymentMethod: string
  ): Promise<Order | null> {
    if (isMockMode) {
      console.warn('Running in mock mode - order not created');
      return null;
    }

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7); // 7 days from now

    const { data, error } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        status: 'Processing',
        total,
        items,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        payment_method: paymentMethod,
        estimated_delivery: estimatedDelivery.toISOString(),
        tracking_history: [{
          status: 'تم الطلب',
          date: new Date().toISOString(),
          location: 'القاهرة، مصر',
        }],
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return null;
    }

    return {
      id: data.id,
      date: new Date(data.created_at).toLocaleDateString('ar-EG'),
      status: data.status,
      total: data.total,
      items: data.items,
      estimatedDelivery: data.estimated_delivery,
      trackingHistory: data.tracking_history,
    };
  },

  /**
   * Update order status (Admin only)
   */
  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    if (isMockMode) {
      return false;
    }

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }

    return true;
  },

  /**
   * Get all orders (Admin only)
   */
  async getAllOrders(): Promise<any[]> {
    if (isMockMode) {
      console.warn('Running in mock mode');
      return [];
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }

    return data;
  },

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<boolean> {
    if (isMockMode) {
      return false;
    }

    const { error } = await supabase
      .from('orders')
      .update({ status: 'Cancelled' })
      .eq('id', orderId);

    if (error) {
      console.error('Error cancelling order:', error);
      return false;
    }

    return true;
  },
};
