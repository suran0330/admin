import type { Product } from '@/lib/database';

export interface AdminProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  skinConcerns: string[];
  ingredients: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  handle: string;
  description: string;
}

export interface AdminSkinConcern {
  id: string;
  name: string;
  handle: string;
}

export interface AdminAnalytics {
  total: number;
  inStock: number;
  outOfStock: number;
  featured: number;
  categories: Record<string, { name: string; count: number }>;
  recentlyUpdated: AdminProduct[];
}

class AdminDatabaseAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  // Product operations
  async getProducts(filters?: {
    search?: string;
    category?: string;
    skinConcerns?: string[];
    inStock?: boolean;
    featured?: boolean;
  }): Promise<AdminProduct[]> {
    try {
      const searchParams = new URLSearchParams();
      
      if (filters?.search) searchParams.set('search', filters.search);
      if (filters?.category) searchParams.set('category', filters.category);
      if (filters?.skinConcerns) searchParams.set('skinConcerns', filters.skinConcerns.join(','));
      if (filters?.inStock !== undefined) searchParams.set('inStock', filters.inStock.toString());
      if (filters?.featured !== undefined) searchParams.set('featured', filters.featured.toString());

      const url = `${this.baseUrl}/api/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProduct(handle: string): Promise<AdminProduct | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/products/${handle}`);
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }

      const data = await response.json();
      return data.product || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async createProduct(productData: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminProduct | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.statusText}`);
      }

      const data = await response.json();
      return data.product || null;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  }

  async updateProduct(handle: string, updates: Partial<AdminProduct>): Promise<AdminProduct | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/products/${handle}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.statusText}`);
      }

      const data = await response.json();
      return data.product || null;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  }

  async deleteProduct(handle: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/products/${handle}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  async toggleStock(handle: string): Promise<AdminProduct | null> {
    const product = await this.getProduct(handle);
    if (!product) return null;

    return await this.updateProduct(handle, {
      inStock: !product.inStock
    });
  }

  async toggleFeatured(handle: string): Promise<AdminProduct | null> {
    const product = await this.getProduct(handle);
    if (!product) return null;

    return await this.updateProduct(handle, {
      featured: !product.featured
    });
  }

  // Category operations
  async getCategories(): Promise<AdminCategory[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/categories`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async createCategory(categoryData: Omit<AdminCategory, 'id'>): Promise<AdminCategory | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create category: ${response.statusText}`);
      }

      const data = await response.json();
      return data.category || null;
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  }

  // Skin concerns operations
  async getSkinConcerns(): Promise<AdminSkinConcern[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/skin-concerns`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch skin concerns: ${response.statusText}`);
      }

      const data = await response.json();
      return data.skinConcerns || [];
    } catch (error) {
      console.error('Error fetching skin concerns:', error);
      return [];
    }
  }

  async createSkinConcern(concernData: Omit<AdminSkinConcern, 'id'>): Promise<AdminSkinConcern | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/skin-concerns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(concernData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create skin concern: ${response.statusText}`);
      }

      const data = await response.json();
      return data.skinConcern || null;
    } catch (error) {
      console.error('Error creating skin concern:', error);
      return null;
    }
  }

  // Analytics
  async getAnalytics(): Promise<AdminAnalytics> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analytics`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      const data = await response.json();
      return data.analytics || {
        total: 0,
        inStock: 0,
        outOfStock: 0,
        featured: 0,
        categories: {},
        recentlyUpdated: []
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        total: 0,
        inStock: 0,
        outOfStock: 0,
        featured: 0,
        categories: {},
        recentlyUpdated: []
      };
    }
  }

  // Utility methods
  generateHandle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Test connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/products?limit=1`);
      if (response.ok) {
        return { success: true, message: 'Database connection successful' };
      } else {
        return { success: false, message: `Connection failed: ${response.statusText}` };
      }
    } catch (error) {
      return { success: false, message: `Connection error: ${error}` };
    }
  }
}

// Export singleton instance
export const adminDatabaseAPI = new AdminDatabaseAPI();
export default adminDatabaseAPI;