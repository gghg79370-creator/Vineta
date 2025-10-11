import { supabase } from '../lib/supabase';
import { Product, Review } from '../types';
import { allProducts } from '../data/products';

/**
 * Product Service
 * Handles all product-related database operations
 * Falls back to mock data if Supabase is not configured
 */

const isMockMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

// Transform database row to Product type
const transformDbProduct = (dbProduct: any): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    brand: dbProduct.brand,
    price: dbProduct.price,
    oldPrice: dbProduct.old_price,
    image: dbProduct.image,
    images: dbProduct.images || [],
    description: dbProduct.description,
    colors: dbProduct.colors || [],
    sizes: dbProduct.sizes || [],
    tags: dbProduct.tags || [],
    category: dbProduct.category,
    badges: dbProduct.badges,
    rating: dbProduct.rating,
    reviewCount: dbProduct.review_count,
    sku: dbProduct.sku,
    availability: dbProduct.availability,
    itemsLeft: dbProduct.items_left,
    soldIn24h: dbProduct.sold_in_24h,
    viewingNow: dbProduct.viewing_now,
    saleEndDate: dbProduct.sale_end_date,
    specifications: dbProduct.specifications,
    materialComposition: dbProduct.material_composition,
    careInstructions: dbProduct.care_instructions,
    weight: dbProduct.weight,
    weightUnit: dbProduct.weight_unit,
  };
};

export const productService = {
  /**
   * Get all products
   */
  async getAllProducts(): Promise<Product[]> {
    if (isMockMode) {
      return allProducts;
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return allProducts; // Fallback to mock data
    }

    return data.map(transformDbProduct);
  },

  /**
   * Get product by ID
   */
  async getProductById(id: number): Promise<Product | null> {
    if (isMockMode) {
      return allProducts.find(p => p.id === id) || null;
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return allProducts.find(p => p.id === id) || null;
    }

    return transformDbProduct(data);
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(category: 'women' | 'men'): Promise<Product[]> {
    if (isMockMode) {
      return allProducts.filter(p => p.category === category);
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by category:', error);
      return allProducts.filter(p => p.category === category);
    }

    return data.map(transformDbProduct);
  },

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<Product[]> {
    if (isMockMode) {
      const lowerQuery = query.toLowerCase();
      return allProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery) ||
        p.brand?.toLowerCase().includes(lowerQuery) ||
        p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching products:', error);
      const lowerQuery = query.toLowerCase();
      return allProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery)
      );
    }

    return data.map(transformDbProduct);
  },

  /**
   * Create a new product (Admin only)
   */
  async createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    if (isMockMode) {
      console.warn('Cannot create product in mock mode');
      return null;
    }

    const dbProduct = {
      name: product.name,
      brand: product.brand,
      price: product.price,
      old_price: product.oldPrice,
      image: product.image,
      images: product.images,
      description: product.description,
      colors: product.colors,
      sizes: product.sizes,
      tags: product.tags,
      category: product.category,
      badges: product.badges,
      rating: product.rating,
      review_count: product.reviewCount,
      sku: product.sku,
      availability: product.availability,
      items_left: product.itemsLeft,
      sold_in_24h: product.soldIn24h,
      viewing_now: product.viewingNow,
      sale_end_date: product.saleEndDate,
      specifications: product.specifications,
      material_composition: product.materialComposition,
      care_instructions: product.careInstructions,
      weight: product.weight,
      weight_unit: product.weightUnit,
    };

    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    return transformDbProduct(data);
  },

  /**
   * Update a product (Admin only)
   */
  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
    if (isMockMode) {
      console.warn('Cannot update product in mock mode');
      return null;
    }

    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.oldPrice !== undefined) dbUpdates.old_price = updates.oldPrice;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.colors !== undefined) dbUpdates.colors = updates.colors;
    if (updates.sizes !== undefined) dbUpdates.sizes = updates.sizes;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.badges !== undefined) dbUpdates.badges = updates.badges;
    if (updates.sku !== undefined) dbUpdates.sku = updates.sku;
    if (updates.availability !== undefined) dbUpdates.availability = updates.availability;
    if (updates.itemsLeft !== undefined) dbUpdates.items_left = updates.itemsLeft;
    if (updates.soldIn24h !== undefined) dbUpdates.sold_in_24h = updates.soldIn24h;
    if (updates.viewingNow !== undefined) dbUpdates.viewing_now = updates.viewingNow;
    if (updates.saleEndDate !== undefined) dbUpdates.sale_end_date = updates.saleEndDate;
    if (updates.specifications !== undefined) dbUpdates.specifications = updates.specifications;
    if (updates.materialComposition !== undefined) dbUpdates.material_composition = updates.materialComposition;
    if (updates.careInstructions !== undefined) dbUpdates.care_instructions = updates.careInstructions;
    if (updates.weight !== undefined) dbUpdates.weight = updates.weight;
    if (updates.weightUnit !== undefined) dbUpdates.weight_unit = updates.weightUnit;

    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return transformDbProduct(data);
  },

  /**
   * Delete a product (Admin only)
   */
  async deleteProduct(id: number): Promise<boolean> {
    if (isMockMode) {
      console.warn('Cannot delete product in mock mode');
      return false;
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  },

  /**
   * Get product reviews
   */
  async getProductReviews(productId: number): Promise<Review[]> {
    if (isMockMode) {
      const product = allProducts.find(p => p.id === productId);
      return product?.reviews || [];
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'Approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      const product = allProducts.find(p => p.id === productId);
      return product?.reviews || [];
    }

    return data.map(review => ({
      id: review.id,
      author: review.author,
      rating: review.rating,
      date: new Date(review.created_at).toLocaleDateString('ar-EG'),
      text: review.text,
      image: review.image || '',
      status: review.status,
    }));
  },

  /**
   * Add a review to a product
   */
  async addReview(productId: number, userId: string, review: Omit<Review, 'id' | 'date'>): Promise<Review | null> {
    if (isMockMode) {
      console.warn('Cannot add review in mock mode');
      return null;
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        product_id: productId,
        user_id: userId,
        author: review.author,
        rating: review.rating,
        text: review.text,
        image: review.image,
        status: 'Pending', // All reviews start as pending
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding review:', error);
      return null;
    }

    return {
      id: data.id,
      author: data.author,
      rating: data.rating,
      date: new Date(data.created_at).toLocaleDateString('ar-EG'),
      text: data.text,
      image: data.image || '',
      status: data.status,
    };
  },
};
