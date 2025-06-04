// Admin API Client - Connects Next.js frontend to your internal admin system

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  sku: string;
  inventory: {
    quantity: number;
    inStock: boolean;
    lowStockThreshold: number;
  };
  variants?: ProductVariant[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;

  // Shopify sync data
  shopifyProductId?: string;
  shopifyVariantId?: string;
  lastSyncedAt?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  weight?: number;
  options: Record<string, string>; // e.g., { size: "30ml", color: "clear" }
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  sortOrder: number;
  productCount: number;
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface AdminCollection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  rules?: CollectionRule[];
  productIds: string[];
  productCount: number;
  featured: boolean;
}

export interface CollectionRule {
  field: string; // e.g., 'category', 'tags', 'price'
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number;
}

class AdminAPIClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.ADMIN_API_URL || 'http://localhost:3001/api';
    this.apiKey = process.env.ADMIN_API_KEY || '';
  }

  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Admin API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Product Methods
  async getProducts(params?: {
    category?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
    sortBy?: 'name' | 'price' | 'created' | 'updated';
    sortOrder?: 'asc' | 'desc';
    status?: 'active' | 'draft' | 'archived';
    inStock?: boolean;
  }): Promise<{ products: AdminProduct[]; total: number; hasMore: boolean }> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else {
            searchParams.set(key, value.toString());
          }
        }
      });
    }

    return this.makeRequest<{ products: AdminProduct[]; total: number; hasMore: boolean }>
      (`/products?${searchParams.toString()}`);
  }

  async getProduct(id: string): Promise<AdminProduct> {
    return this.makeRequest<AdminProduct>(`/products/${id}`);
  }

  async getProductBySlug(slug: string): Promise<AdminProduct> {
    return this.makeRequest<AdminProduct>(`/products/slug/${slug}`);
  }

  async getProductsByIds(ids: string[]): Promise<AdminProduct[]> {
    const searchParams = new URLSearchParams();
    ids.forEach(id => searchParams.append('ids', id));

    const response = await this.makeRequest<{ products: AdminProduct[] }>
      (`/products/batch?${searchParams.toString()}`);
    return response.products;
  }

  async searchProducts(query: string, params?: {
    limit?: number;
    category?: string;
    priceMin?: number;
    priceMax?: number;
  }): Promise<{ products: AdminProduct[]; total: number }> {
    const searchParams = new URLSearchParams({ q: query });

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString());
        }
      });
    }

    return this.makeRequest<{ products: AdminProduct[]; total: number }>
      (`/products/search?${searchParams.toString()}`);
  }

  // Category Methods
  async getCategories(): Promise<AdminCategory[]> {
    const response = await this.makeRequest<{ categories: AdminCategory[] }>('/categories');
    return response.categories;
  }

  async getCategory(id: string): Promise<AdminCategory> {
    return this.makeRequest<AdminCategory>(`/categories/${id}`);
  }

  async getCategoryBySlug(slug: string): Promise<AdminCategory> {
    return this.makeRequest<AdminCategory>(`/categories/slug/${slug}`);
  }

  async getCategoryProducts(categoryId: string, params?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ products: AdminProduct[]; total: number }> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString());
        }
      });
    }

    return this.makeRequest<{ products: AdminProduct[]; total: number }>
      (`/categories/${categoryId}/products?${searchParams.toString()}`);
  }

  // Collection Methods
  async getCollections(): Promise<AdminCollection[]> {
    const response = await this.makeRequest<{ collections: AdminCollection[] }>('/collections');
    return response.collections;
  }

  async getCollection(id: string): Promise<AdminCollection> {
    return this.makeRequest<AdminCollection>(`/collections/${id}`);
  }

  async getCollectionProducts(collectionId: string): Promise<AdminProduct[]> {
    const response = await this.makeRequest<{ products: AdminProduct[] }>
      (`/collections/${collectionId}/products`);
    return response.products;
  }

  // Inventory Methods
  async getInventoryStatus(productId: string): Promise<{
    quantity: number;
    inStock: boolean;
    lowStock: boolean;
    lastUpdated: string;
  }> {
    return this.makeRequest<{
      quantity: number;
      inStock: boolean;
      lowStock: boolean;
      lastUpdated: string;
    }>(`/inventory/${productId}`);
  }

  async updateInventory(productId: string, quantity: number): Promise<void> {
    await this.makeRequest(`/inventory/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  // Analytics Methods
  async getProductAnalytics(productId: string, days = 30): Promise<{
    views: number;
    addToCarts: number;
    purchases: number;
    revenue: number;
    conversionRate: number;
  }> {
    return this.makeRequest<{
      views: number;
      addToCarts: number;
      purchases: number;
      revenue: number;
      conversionRate: number;
    }>(`/analytics/products/${productId}?days=${days}`);
  }

  // Shopify Sync Methods
  async syncToShopify(productId: string): Promise<{
    success: boolean;
    shopifyProductId?: string;
    shopifyVariantId?: string;
    message: string;
  }> {
    return this.makeRequest<{
      success: boolean;
      shopifyProductId?: string;
      shopifyVariantId?: string;
      message: string;
    }>(`/sync/shopify/products/${productId}`, {
      method: 'POST',
    });
  }

  async getSyncStatus(productId: string): Promise<{
    synced: boolean;
    lastSyncedAt?: string;
    shopifyProductId?: string;
    shopifyVariantId?: string;
    pendingChanges: string[];
  }> {
    return this.makeRequest<{
      synced: boolean;
      lastSyncedAt?: string;
      shopifyProductId?: string;
      shopifyVariantId?: string;
      pendingChanges: string[];
    }>(`/sync/shopify/products/${productId}/status`);
  }
}

// Singleton instance
export const adminAPI = new AdminAPIClient();

// Helper functions for Next.js integration
export async function getStaticProductPaths(): Promise<{ params: { slug: string } }[]> {
  try {
    const { products } = await adminAPI.getProducts({ status: 'active', limit: 1000 });
    return products.map(product => ({
      params: { slug: product.slug }
    }));
  } catch (error) {
    console.error('Error fetching product paths:', error);
    return [];
  }
}

export async function getStaticCategoryPaths(): Promise<{ params: { slug: string } }[]> {
  try {
    const categories = await adminAPI.getCategories();
    return categories.map(category => ({
      params: { slug: category.slug }
    }));
  } catch (error) {
    console.error('Error fetching category paths:', error);
    return [];
  }
}

// Cache helpers for better performance
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getCachedProducts(cacheKey: string, fetcher: () => Promise<any>) {
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(cacheKey, { data, timestamp: Date.now() });

  return data;
}

// Type guards
export function isAdminProduct(obj: any): obj is AdminProduct {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
}

export function isAdminCategory(obj: any): obj is AdminCategory {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
}
