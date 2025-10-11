import { supabase } from '../lib/supabase';
import { AdminAnnouncement, SaleCampaign, HeroSlide } from '../types';

/**
 * Admin Service
 * Handles admin-specific operations with Supabase
 */

const isMockMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

export const adminService = {
  // =============================================
  // ANNOUNCEMENTS
  // =============================================
  async getAnnouncements(): Promise<AdminAnnouncement[]> {
    if (isMockMode) {
      return [];
    }

    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }

    return data.map(a => ({
      id: a.id,
      content: a.content,
      status: a.status,
      startDate: a.start_date,
      endDate: a.end_date,
    }));
  },

  async createAnnouncement(announcement: Omit<AdminAnnouncement, 'id'>): Promise<AdminAnnouncement | null> {
    if (isMockMode) {
      return null;
    }

    const { data, error } = await supabase
      .from('announcements')
      .insert([{
        content: announcement.content,
        status: announcement.status,
        start_date: announcement.startDate,
        end_date: announcement.endDate,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating announcement:', error);
      return null;
    }

    return {
      id: data.id,
      content: data.content,
      status: data.status,
      startDate: data.start_date,
      endDate: data.end_date,
    };
  },

  async updateAnnouncement(id: number, updates: Partial<AdminAnnouncement>): Promise<boolean> {
    if (isMockMode) {
      return false;
    }

    const dbUpdates: any = {};
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;

    const { error } = await supabase
      .from('announcements')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating announcement:', error);
      return false;
    }

    return true;
  },

  async deleteAnnouncement(id: number): Promise<boolean> {
    if (isMockMode) {
      return false;
    }

    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting announcement:', error);
      return false;
    }

    return true;
  },

  // =============================================
  // HERO SLIDES
  // =============================================
  async getHeroSlides(): Promise<HeroSlide[]> {
    if (isMockMode) {
      return [];
    }

    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching hero slides:', error);
      return [];
    }

    return data.map(h => ({
      id: h.id,
      bgImage: h.bg_image,
      bgVideo: h.bg_video,
      bgVideoType: h.bg_video_type,
      title: h.title,
      subtitle: h.subtitle,
      description: h.description,
      buttonText: h.button_text,
      page: h.page,
      status: h.status,
    }));
  },

  async createHeroSlide(slide: Omit<HeroSlide, 'id'>): Promise<HeroSlide | null> {
    if (isMockMode) {
      return null;
    }

    const { data, error } = await supabase
      .from('hero_slides')
      .insert([{
        bg_image: slide.bgImage,
        bg_video: slide.bgVideo,
        bg_video_type: slide.bgVideoType,
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        button_text: slide.buttonText,
        page: slide.page,
        status: slide.status,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating hero slide:', error);
      return null;
    }

    return {
      id: data.id,
      bgImage: data.bg_image,
      bgVideo: data.bg_video,
      bgVideoType: data.bg_video_type,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      buttonText: data.button_text,
      page: data.page,
      status: data.status,
    };
  },

  async updateHeroSlide(id: number, updates: Partial<HeroSlide>): Promise<boolean> {
    if (isMockMode) {
      return false;
    }

    const dbUpdates: any = {};
    if (updates.bgImage !== undefined) dbUpdates.bg_image = updates.bgImage;
    if (updates.bgVideo !== undefined) dbUpdates.bg_video = updates.bgVideo;
    if (updates.bgVideoType !== undefined) dbUpdates.bg_video_type = updates.bgVideoType;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.subtitle !== undefined) dbUpdates.subtitle = updates.subtitle;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.buttonText !== undefined) dbUpdates.button_text = updates.buttonText;
    if (updates.page !== undefined) dbUpdates.page = updates.page;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    const { error } = await supabase
      .from('hero_slides')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating hero slide:', error);
      return false;
    }

    return true;
  },

  async deleteHeroSlide(id: number): Promise<boolean> {
    if (isMockMode) {
      return false;
    }

    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting hero slide:', error);
      return false;
    }

    return true;
  },

  // =============================================
  // SALE CAMPAIGNS
  // =============================================
  async getSaleCampaigns(): Promise<SaleCampaign[]> {
    if (isMockMode) {
      return [];
    }

    const { data, error } = await supabase
      .from('sale_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sale campaigns:', error);
      return [];
    }

    return data.map(s => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      discountText: s.discount_text,
      couponCode: s.coupon_code,
      buttonText: s.button_text,
      image: s.image,
      saleEndDate: s.sale_end_date,
      page: s.page,
      status: s.status,
    }));
  },

  async createSaleCampaign(campaign: Omit<SaleCampaign, 'id'>): Promise<SaleCampaign | null> {
    if (isMockMode) {
      return null;
    }

    const { data, error } = await supabase
      .from('sale_campaigns')
      .insert([{
        title: campaign.title,
        subtitle: campaign.subtitle,
        discount_text: campaign.discountText,
        coupon_code: campaign.couponCode,
        button_text: campaign.buttonText,
        image: campaign.image,
        sale_end_date: campaign.saleEndDate,
        page: campaign.page,
        status: campaign.status,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating sale campaign:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      discountText: data.discount_text,
      couponCode: data.coupon_code,
      buttonText: data.button_text,
      image: data.image,
      saleEndDate: data.sale_end_date,
      page: data.page,
      status: data.status,
    };
  },

  async updateSaleCampaign(id: number, updates: Partial<SaleCampaign>): Promise<boolean> {
    if (isMockMode) {
      return false;
    }

    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.subtitle !== undefined) dbUpdates.subtitle = updates.subtitle;
    if (updates.discountText !== undefined) dbUpdates.discount_text = updates.discountText;
    if (updates.couponCode !== undefined) dbUpdates.coupon_code = updates.couponCode;
    if (updates.buttonText !== undefined) dbUpdates.button_text = updates.buttonText;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.saleEndDate !== undefined) dbUpdates.sale_end_date = updates.saleEndDate;
    if (updates.page !== undefined) dbUpdates.page = updates.page;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    const { error } = await supabase
      .from('sale_campaigns')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating sale campaign:', error);
      return false;
    }

    return true;
  },

  async deleteSaleCampaign(id: number): Promise<boolean> {
    if (isMockMode) {
      return false;
    }

    const { error } = await supabase
      .from('sale_campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting sale campaign:', error);
      return false;
    }

    return true;
  },

  // =============================================
  // DASHBOARD ANALYTICS
  // =============================================
  async getDashboardStats(): Promise<any> {
    if (isMockMode) {
      return {
        totalOrders: 0,
        totalRevenue: '0',
        totalCustomers: 0,
        totalProducts: 0,
      };
    }

    const [ordersCount, customersCount, productsCount, revenue] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('customers').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total'),
    ]);

    let totalRevenue = 0;
    if (revenue.data) {
      totalRevenue = revenue.data.reduce((sum, order) => {
        const orderTotal = parseFloat(order.total.replace(/[^\d.-]/g, ''));
        return sum + (isNaN(orderTotal) ? 0 : orderTotal);
      }, 0);
    }

    return {
      totalOrders: ordersCount.count || 0,
      totalRevenue: totalRevenue.toFixed(2),
      totalCustomers: customersCount.count || 0,
      totalProducts: productsCount.count || 0,
    };
  },
};
