/**
 * Admin Utilities
 * Helper functions for admin dashboard operations
 */

import { AdminProduct, AdminOrder, AdminCustomer } from '../data/adminData';

/**
 * Calculate dashboard statistics
 */
export const calculateDashboardStats = (
  orders: AdminOrder[],
  products: AdminProduct[],
  customers: AdminCustomer[]
) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = customers.length;

  // Calculate revenue growth (mock calculation)
  const revenueGrowth = 12.5;

  // Calculate order growth
  const orderGrowth = 8.3;

  // Low stock products
  const lowStockProducts = products.filter(
    (p) => p.stock !== undefined && p.stock < 10
  ).length;

  // Pending orders
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  return {
    totalRevenue,
    revenueGrowth,
    totalOrders,
    orderGrowth,
    totalProducts,
    totalCustomers,
    lowStockProducts,
    pendingOrders,
  };
};

/**
 * Get top selling products
 */
export const getTopSellingProducts = (
  orders: AdminOrder[],
  products: AdminProduct[],
  limit: number = 5
) => {
  const productSales: Record<string, number> = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
    });
  });

  return products
    .map((product) => ({
      ...product,
      totalSold: productSales[product.id] || 0,
    }))
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, limit);
};

/**
 * Get recent activities
 */
export const getRecentActivities = (
  orders: AdminOrder[],
  customers: AdminCustomer[],
  limit: number = 10
) => {
  const activities: Array<{
    type: 'order' | 'customer';
    message: string;
    timestamp: string;
    id: string;
  }> = [];

  // Add recent orders
  orders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .forEach((order) => {
      activities.push({
        type: 'order',
        message: `طلب جديد #${order.id} من ${order.customer}`,
        timestamp: order.date,
        id: order.id,
      });
    });

  // Add recent customers (mock data based on joinDate if available)
  const recentCustomers = customers
    .filter((c) => c.joinDate)
    .sort((a, b) => new Date(b.joinDate!).getTime() - new Date(a.joinDate!).getTime())
    .slice(0, 5);

  recentCustomers.forEach((customer) => {
    activities.push({
      type: 'customer',
      message: `عميل جديد: ${customer.name}`,
      timestamp: customer.joinDate!,
      id: customer.id,
    });
  });

  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};

/**
 * Filter products by search query
 */
export const filterProducts = (
  products: AdminProduct[],
  searchQuery: string,
  filters?: {
    status?: string;
    category?: string;
    stockStatus?: 'inStock' | 'lowStock' | 'outOfStock';
  }
) => {
  let filtered = [...products];

  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (filters?.status) {
    filtered = filtered.filter((p) => p.status === filters.status);
  }

  // Category filter
  if (filters?.category) {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  // Stock status filter
  if (filters?.stockStatus) {
    filtered = filtered.filter((p) => {
      if (!p.stock) return false;
      
      switch (filters.stockStatus) {
        case 'outOfStock':
          return p.stock === 0;
        case 'lowStock':
          return p.stock > 0 && p.stock < 10;
        case 'inStock':
          return p.stock >= 10;
        default:
          return true;
      }
    });
  }

  return filtered;
};

/**
 * Filter orders by search query
 */
export const filterOrders = (
  orders: AdminOrder[],
  searchQuery: string,
  filters?: {
    status?: string;
    dateRange?: { start: string; end: string };
  }
) => {
  let filtered = [...orders];

  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.id.toLowerCase().includes(query) ||
        o.customer.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (filters?.status) {
    filtered = filtered.filter((o) => o.status === filters.status);
  }

  // Date range filter
  if (filters?.dateRange) {
    const { start, end } = filters.dateRange;
    filtered = filtered.filter((o) => {
      const orderDate = new Date(o.date);
      return orderDate >= new Date(start) && orderDate <= new Date(end);
    });
  }

  return filtered;
};

/**
 * Export data to CSV
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        // Handle values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    ),
  ].join('\n');

  // Create blob and download
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate report data
 */
export const generateSalesReport = (
  orders: AdminOrder[],
  startDate: Date,
  endDate: Date
) => {
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.date);
    return orderDate >= startDate && orderDate <= endDate;
  });

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Group by date
  const dailySales: Record<string, { revenue: number; orders: number }> = {};
  
  filteredOrders.forEach((order) => {
    const date = new Date(order.date).toISOString().split('T')[0];
    if (!dailySales[date]) {
      dailySales[date] = { revenue: 0, orders: 0 };
    }
    dailySales[date].revenue += order.total;
    dailySales[date].orders += 1;
  });

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    dailySales,
    orders: filteredOrders,
  };
};

/**
 * Bulk update products
 */
export const bulkUpdateProducts = (
  products: AdminProduct[],
  updates: Partial<AdminProduct>,
  selectedIds: string[]
) => {
  return products.map((product) => {
    if (selectedIds.includes(product.id)) {
      return { ...product, ...updates };
    }
    return product;
  });
};

/**
 * Validate bulk operations
 */
export const validateBulkOperation = (selectedIds: string[], maxLimit: number = 100) => {
  if (selectedIds.length === 0) {
    return { isValid: false, error: 'لم يتم تحديد أي عناصر' };
  }
  
  if (selectedIds.length > maxLimit) {
    return { isValid: false, error: `لا يمكن تحديد أكثر من ${maxLimit} عنصر` };
  }
  
  return { isValid: true };
};
