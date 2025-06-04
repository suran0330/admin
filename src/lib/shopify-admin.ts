// Shopify Admin API Client for Product Management
const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!;
const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-01';

export interface ShopifyAdminProduct {
  id: string;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  handle: string;
  tags: string;
  status: 'active' | 'archived' | 'draft';
  images: Array<{
    id: string;
    src: string;
    alt?: string;
    position: number;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: string;
    compare_at_price?: string;
    sku?: string;
    inventory_quantity: number;
    inventory_management: string;
    weight: number;
    weight_unit: string;
  }>;
  options: Array<{
    id: string;
    name: string;
    values: string[];
    position: number;
  }>;
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface ShopifyInventoryItem {
  id: string;
  sku: string;
  inventory_quantity: number;
  inventory_item_id: string;
}

class ShopifyAdminClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = `https://${shopDomain}/admin/api/${apiVersion}`;
    this.headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminAccessToken,
    };
  }

  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: this.headers,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Shopify Admin API error: ${response.status} ${response.statusText} - ${errorData}`);
    }

    return response.json();
  }

  // Product Management
  async getProducts(params?: {
    limit?: number;
    since_id?: string;
    status?: 'active' | 'archived' | 'draft';
    vendor?: string;
    product_type?: string;
  }): Promise<{ products: ShopifyAdminProduct[] }> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString());
        }
      });
    }

    return this.makeRequest<{ products: ShopifyAdminProduct[] }>
      (`/products.json?${searchParams.toString()}`);
  }

  async getProduct(id: string): Promise<{ product: ShopifyAdminProduct }> {
    return this.makeRequest<{ product: ShopifyAdminProduct }>(`/products/${id}.json`);
  }

  async createProduct(productData: Partial<ShopifyAdminProduct>): Promise<{ product: ShopifyAdminProduct }> {
    return this.makeRequest<{ product: ShopifyAdminProduct }>('/products.json', {
      method: 'POST',
      body: JSON.stringify({ product: productData }),
    });
  }

  async updateProduct(id: string, productData: Partial<ShopifyAdminProduct>): Promise<{ product: ShopifyAdminProduct }> {
    return this.makeRequest<{ product: ShopifyAdminProduct }>(`/products/${id}.json`, {
      method: 'PUT',
      body: JSON.stringify({ product: productData }),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.makeRequest(`/products/${id}.json`, {
      method: 'DELETE',
    });
  }

  // Inventory Management
  async getInventoryLevel(inventoryItemId: string, locationId: string): Promise<{
    inventory_level: {
      inventory_item_id: string;
      location_id: string;
      available: number;
    }
  }> {
    return this.makeRequest(`/inventory_levels.json?inventory_item_ids=${inventoryItemId}&location_ids=${locationId}`);
  }

  async updateInventory(inventoryItemId: string, locationId: string, quantity: number): Promise<{
    inventory_level: {
      inventory_item_id: string;
      location_id: string;
      available: number;
    }
  }> {
    return this.makeRequest('/inventory_levels/set.json', {
      method: 'POST',
      body: JSON.stringify({
        location_id: locationId,
        inventory_item_id: inventoryItemId,
        available: quantity,
      }),
    });
  }

  // Locations
  async getLocations(): Promise<{
    locations: Array<{
      id: string;
      name: string;
      primary: boolean;
      active: boolean;
    }>
  }> {
    return this.makeRequest('/locations.json');
  }

  // Product Images
  async uploadProductImage(productId: string, imageData: {
    src: string;
    alt?: string;
    position?: number;
  }): Promise<{
    image: {
      id: string;
      src: string;
      alt?: string;
      position: number;
    }
  }> {
    return this.makeRequest(`/products/${productId}/images.json`, {
      method: 'POST',
      body: JSON.stringify({ image: imageData }),
    });
  }

  async deleteProductImage(productId: string, imageId: string): Promise<void> {
    await this.makeRequest(`/products/${productId}/images/${imageId}.json`, {
      method: 'DELETE',
    });
  }

  // Orders (read-only for analytics)
  async getOrders(params?: {
    limit?: number;
    status?: 'open' | 'closed' | 'cancelled' | 'any';
    since_id?: string;
    created_at_min?: string;
    created_at_max?: string;
  }): Promise<{
    orders: Array<{
      id: string;
      order_number: number;
      total_price: string;
      subtotal_price: string;
      total_tax: string;
      currency: string;
      created_at: string;
      line_items: Array<{
        id: string;
        product_id: string;
        variant_id: string;
        title: string;
        quantity: number;
        price: string;
      }>;
    }>
  }> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString());
        }
      });
    }

    return this.makeRequest(`/orders.json?${searchParams.toString()}`);
  }

  // Webhooks
  async createWebhook(webhookData: {
    topic: string;
    address: string;
    format?: 'json' | 'xml';
  }): Promise<{
    webhook: {
      id: string;
      topic: string;
      address: string;
      created_at: string;
    }
  }> {
    return this.makeRequest('/webhooks.json', {
      method: 'POST',
      body: JSON.stringify({ webhook: webhookData }),
    });
  }

  async getWebhooks(): Promise<{
    webhooks: Array<{
      id: string;
      topic: string;
      address: string;
      created_at: string;
    }>
  }> {
    return this.makeRequest('/webhooks.json');
  }

  // Health check
  async testConnection(): Promise<{
    shop: {
      id: string;
      name: string;
      domain: string;
      email: string;
      currency: string;
      timezone: string;
    }
  }> {
    return this.makeRequest('/shop.json');
  }
}

// Singleton instance
export const shopifyAdminClient = new ShopifyAdminClient();

// Helper functions for admin dashboard
export async function syncProductToShopify(adminProduct: {
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  sku?: string;
  inventory?: number;
}) {
  try {
    const shopifyProduct = {
      title: adminProduct.title,
      body_html: adminProduct.description,
      vendor: 'INKEY List',
      product_type: adminProduct.category,
      tags: adminProduct.tags.join(', '),
      status: 'active' as const,
      images: adminProduct.images.map((src, index) => ({
        src,
        position: index + 1,
      })),
      variants: [{
        title: 'Default Title',
        price: adminProduct.price.toString(),
        compare_at_price: adminProduct.compareAtPrice?.toString(),
        sku: adminProduct.sku,
        inventory_quantity: adminProduct.inventory || 0,
        inventory_management: 'shopify',
        weight: 0.1,
        weight_unit: 'kg',
      }],
    };

    const result = await shopifyAdminClient.createProduct(shopifyProduct);
    return {
      success: true,
      shopifyProductId: result.product.id,
      shopifyHandle: result.product.handle,
    };
  } catch (error) {
    console.error('Error syncing product to Shopify:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function updateShopifyProduct(shopifyProductId: string, updates: Partial<{
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  inventory?: number;
  status: 'active' | 'archived' | 'draft';
}>) {
  try {
    const updateData: Partial<ShopifyAdminProduct> = {};

    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.body_html = updates.description;
    if (updates.status) updateData.status = updates.status;

    if (updates.price !== undefined || updates.compareAtPrice !== undefined || updates.inventory !== undefined) {
      // Need to update variant
      const { product } = await shopifyAdminClient.getProduct(shopifyProductId);
      const variant = product.variants[0];

      if (variant) {
        updateData.variants = [{
          ...variant,
          price: updates.price?.toString() || variant.price,
          compare_at_price: updates.compareAtPrice?.toString() || variant.compare_at_price,
          inventory_quantity: updates.inventory !== undefined ? updates.inventory : variant.inventory_quantity,
        }];
      }
    }

    const result = await shopifyAdminClient.updateProduct(shopifyProductId, updateData);
    return {
      success: true,
      product: result.product,
    };
  } catch (error) {
    console.error('Error updating Shopify product:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getShopifyProductAnalytics(days = 30) {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { orders } = await shopifyAdminClient.getOrders({
      status: 'any',
      created_at_min: startDate.toISOString(),
      created_at_max: endDate.toISOString(),
      limit: 250,
    });

    const analytics = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + Number.parseFloat(order.total_price), 0),
      averageOrderValue: 0,
      topProducts: {} as Record<string, { title: string; quantity: number; revenue: number }>,
    };

    analytics.averageOrderValue = analytics.totalOrders > 0 ? analytics.totalRevenue / analytics.totalOrders : 0;

    // Analyze top products
    orders.forEach(order => {
      order.line_items.forEach(item => {
        const key = item.product_id;
        if (!analytics.topProducts[key]) {
          analytics.topProducts[key] = {
            title: item.title,
            quantity: 0,
            revenue: 0,
          };
        }
        analytics.topProducts[key].quantity += item.quantity;
        analytics.topProducts[key].revenue += Number.parseFloat(item.price) * item.quantity;
      });
    });

    return analytics;
  } catch (error) {
    console.error('Error getting Shopify analytics:', error);
    return null;
  }
}
