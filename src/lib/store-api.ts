// Store API for real-time synchronization with the main INKEY List store

export interface StoreConfig {
  baseUrl: string;
  apiKey: string;
  adminToken: string;
}

export interface Product {
  id: string;
  name: string;
  shortDescription?: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  images: string[];
  category: string;
  skinTypes?: string[];
  concerns?: string[];
  inStock: boolean;
  featured?: boolean;
  sizes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: string;
    total: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  skinType?: string;
  skinConcerns?: string[];
  ordersCount: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  createdAt: string;
  isSubscribed: boolean;
  loyaltyPoints: number;
}

export interface Analytics {
  overview: {
    totalViews: number;
    totalSales: number;
    totalRevenue: number;
    conversionRate: number;
    avgOrderValue: number;
    uniqueVisitors: number;
    returningCustomers: number;
  };
  products: {
    topSelling: Array<{
      productId: string;
      name: string;
      sales: number;
      revenue: number;
      views: number;
      conversionRate: number;
    }>;
    lowStock: Array<{
      productId: string;
      name: string;
      stockLevel: number;
      reorderPoint: number;
    }>;
    outOfStock: Array<{
      productId: string;
      name: string;
      lastStockDate: string;
    }>;
  };
  customers: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    customersByRegion: Record<string, number>;
    topCustomers: Array<{
      customerId: string;
      name: string;
      email: string;
      totalSpent: number;
      ordersCount: number;
    }>;
  };
  revenue: {
    dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
    monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
    revenueByCategory: Record<string, number>;
    revenueByRegion: Record<string, number>;
  };
  timeRange: '7d' | '30d' | '90d' | '1y';
}

export interface StoreSettings {
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  currency: string;
  taxRate: number;
  shipping: {
    freeShippingThreshold: number;
    standardRate: number;
    expressRate: number;
  };
  policies: {
    privacyPolicy: string;
    termsOfService: string;
    returnPolicy: string;
  };
  integrations: {
    shopify: {
      enabled: boolean;
      storeUrl: string;
      accessToken: string;
    };
    stripe: {
      enabled: boolean;
      publishableKey: string;
    };
    analytics: {
      googleAnalyticsId: string;
      facebookPixelId: string;
    };
  };
}

export interface WebhookEvent {
  id: string;
  type: 'order.created' | 'order.updated' | 'product.updated' | 'customer.created' | 'payment.completed';
  data: any;
  timestamp: string;
  processed: boolean;
}

class StoreAPI {
  private config: StoreConfig;
  private websocket: WebSocket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: StoreConfig) {
    this.config = config;
    this.setupWebSocket();
  }

  // Authentication headers
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.adminToken}`,
      'X-API-Key': this.config.apiKey,
      'X-Admin-Source': 'design-dashboard'
    };
  }

  // Generic API request handler
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}/api${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please check your admin credentials');
        }
        if (response.status === 403) {
          throw new Error('Forbidden: Insufficient permissions');
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // WebSocket setup for real-time updates
  private setupWebSocket() {
    try {
      const wsUrl = this.config.baseUrl.replace('http', 'ws') + '/ws/admin';
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        console.log('🔗 Connected to store WebSocket');
        this.websocket?.send(JSON.stringify({
          type: 'auth',
          token: this.config.adminToken
        }));
      };

      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(data);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };

      this.websocket.onclose = () => {
        console.log('🔌 Store WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.setupWebSocket(), 5000);
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to setup WebSocket:', error);
    }
  }

  // Handle real-time WebSocket messages
  private handleWebSocketMessage(data: any) {
    const { type, payload } = data;

    // Emit events to listeners
    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach(listener => listener(payload));

    // Handle specific event types
    switch (type) {
      case 'order.created':
        this.emit('orderCreated', payload);
        break;
      case 'product.updated':
        this.emit('productUpdated', payload);
        break;
      case 'inventory.low':
        this.emit('lowStock', payload);
        break;
      case 'customer.created':
        this.emit('customerCreated', payload);
        break;
      default:
        this.emit('storeEvent', { type, payload });
    }
  }

  // Event listener management
  public on(event: string, listener: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  public off(event: string, listener: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(listener => listener(data));
  }

  // Product API
  async getProducts(filters?: {
    category?: string;
    inStock?: boolean;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    return this.request<{ products: Product[]; total: number; hasMore: boolean }>(
      `/products?${params.toString()}`
    );
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkUpdateProducts(updates: Array<{ id: string; data: Partial<Product> }>): Promise<Product[]> {
    return this.request<Product[]>('/products/bulk', {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    });
  }

  // Order API
  async getOrders(filters?: {
    status?: string;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ orders: Order[]; total: number; hasMore: boolean }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    return this.request<{ orders: Order[]; total: number; hasMore: boolean }>(
      `/orders?${params.toString()}`
    );
  }

  async getOrder(id: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    return this.request<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async refundOrder(id: string, amount?: number, reason?: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}/refund`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    });
  }

  // Customer API
  async getCustomers(filters?: {
    search?: string;
    segment?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ customers: Customer[]; total: number; hasMore: boolean }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    return this.request<{ customers: Customer[]; total: number; hasMore: boolean }>(
      `/customers?${params.toString()}`
    );
  }

  async getCustomer(id: string): Promise<Customer> {
    return this.request<Customer>(`/customers/${id}`);
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    return this.request<Customer>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Analytics API
  async getAnalytics(timeRange: Analytics['timeRange'] = '30d'): Promise<Analytics> {
    return this.request<Analytics>(`/analytics?timeRange=${timeRange}`);
  }

  async getProductAnalytics(productId: string, timeRange: Analytics['timeRange'] = '30d'): Promise<any> {
    return this.request(`/analytics/products/${productId}?timeRange=${timeRange}`);
  }

  async getCustomerAnalytics(timeRange: Analytics['timeRange'] = '30d'): Promise<any> {
    return this.request(`/analytics/customers?timeRange=${timeRange}`);
  }

  // Settings API
  async getSettings(): Promise<StoreSettings> {
    return this.request<StoreSettings>('/settings');
  }

  async updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
    return this.request<StoreSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Design synchronization
  async syncTheme(theme: any): Promise<{ success: boolean; message: string }> {
    return this.request('/design/theme', {
      method: 'POST',
      body: JSON.stringify(theme),
    });
  }

  async syncLayout(page: string, layout: any): Promise<{ success: boolean; message: string }> {
    return this.request(`/design/layouts/${page}`, {
      method: 'PUT',
      body: JSON.stringify(layout),
    });
  }

  async uploadAsset(file: File, type: string): Promise<{ url: string; id: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${this.config.baseUrl}/api/assets/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.adminToken}`,
        'X-API-Key': this.config.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; services: Record<string, boolean> }> {
    return this.request('/health');
  }

  // Close connections
  public disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.eventListeners.clear();
  }
}

// Export singleton with configuration
let storeAPIInstance: StoreAPI | null = null;

export function initializeStoreAPI(config: StoreConfig): StoreAPI {
  if (storeAPIInstance) {
    storeAPIInstance.disconnect();
  }
  storeAPIInstance = new StoreAPI(config);
  return storeAPIInstance;
}

export function getStoreAPI(): StoreAPI {
  if (!storeAPIInstance) {
    throw new Error('Store API not initialized. Call initializeStoreAPI first.');
  }
  return storeAPIInstance;
}

// Default configuration for development
export const defaultStoreConfig: StoreConfig = {
  baseUrl: process.env.NEXT_PUBLIC_MAIN_STORE_URL || 'https://inkey-list-clone.netlify.app',
  apiKey: process.env.NEXT_PUBLIC_STORE_API_KEY || 'demo-api-key',
  adminToken: process.env.ADMIN_TOKEN || 'demo-admin-token',
};

export default StoreAPI;
