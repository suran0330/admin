// Types for Store API
interface StoreConnection {
  id: string;
  type: 'admin' | 'frontend';
  endpoint: string;
  status: 'connected' | 'disconnected' | 'connecting';
  lastPing: string;
}

interface Analytics {
  totalProducts: number;
  totalCategories: number;
  recentActivity: any[];
  performance: {
    uptime: number;
    responseTime: number;
  };
}

export class StoreAPI {
  private baseUrl: string;
  private connection: StoreConnection;
  private analytics: Analytics | null = null;
  private isConnected = false;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_STORE_API_URL || 'http://localhost:3001';
    this.connection = {
      id: `store-${Date.now()}`,
      type: 'admin',
      endpoint: this.baseUrl,
      status: 'disconnected',
      lastPing: new Date().toISOString()
    };

    // Initialize connection check
    this.checkConnection();
  }

  // Simple connection check instead of WebSocket
  private async checkConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        this.isConnected = true;
        this.connection.status = 'connected';
        console.log('🔗 Connected to store API');
      } else {
        this.isConnected = false;
        this.connection.status = 'disconnected';
        console.warn('⚠️ Store API connection failed');
      }
    } catch (error) {
      this.isConnected = false;
      this.connection.status = 'disconnected';
      console.error('Failed to connect to store API:', error);
    }

    this.connection.lastPing = new Date().toISOString();
  }

  // Handle real-time updates through periodic polling if needed
  private async refreshAnalytics() {
    if (this.isConnected) {
      try {
        this.analytics = await this.getAnalytics();
      } catch (error) {
        console.error('Failed to refresh analytics:', error);
      }
    }
  }

  // Get analytics data
  public async getAnalytics(): Promise<Analytics> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analytics`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to fetch analytics');
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Return default analytics
      return {
        totalProducts: 0,
        totalCategories: 0,
        recentActivity: [],
        performance: {
          uptime: 0,
          responseTime: 0
        }
      };
    }
  }

  // Get connection status
  public getConnection(): StoreConnection {
    return { ...this.connection };
  }

  // Check if connected
  public isStoreConnected(): boolean {
    return this.isConnected;
  }

  // Get base URL
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  // Update connection status
  public updateConnectionStatus(status: StoreConnection['status']) {
    this.connection.status = status;
    this.connection.lastPing = new Date().toISOString();
    this.isConnected = status === 'connected';
  }

  // Cleanup method - simplified without WebSocket
  public cleanup() {
    // Clear any intervals if we add periodic polling
    console.log('🧹 Store API cleanup completed');
  }
}

// Default store configuration
export const defaultStoreConfig = {
  baseUrl: process.env.NEXT_PUBLIC_STORE_API_URL || 'http://localhost:3001',
  timeout: 5000,
  retries: 3
};

// Singleton instance
let storeAPIInstance: StoreAPI | null = null;

// Initialize store API
export function initializeStoreAPI(): StoreAPI {
  if (!storeAPIInstance) {
    storeAPIInstance = new StoreAPI();
  }
  return storeAPIInstance;
}

// Get store API instance
export function getStoreAPI(): StoreAPI {
  if (!storeAPIInstance) {
    storeAPIInstance = new StoreAPI();
  }
  return storeAPIInstance;
}

// Export default
export default StoreAPI;
