// Real Store API for connecting admin dashboard to the actual INKEY List store

export interface RealProduct {
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
  adminNotes?: string;
}

export interface StoreConnection {
  type: 'static' | 'api' | 'database';
  endpoint?: string;
  apiKey?: string;
  authenticated: boolean;
  lastSync?: string;
  health: 'healthy' | 'degraded' | 'offline';
}

class RealStoreAPI {
  private connection: StoreConnection;
  private products: RealProduct[] = [];
  private retryCount = 0;
  private maxRetries = 3;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.connection = {
      type: 'static',
      authenticated: false,
      health: 'offline'
    };
    this.initializeConnection();
  }

  // Initialize connection to the actual store with retry logic
  async initializeConnection(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔗 Attempting to connect to main INKEY List store...');

      // Priority order of store URLs to try (only valid URLs)
      const storeUrls = [
        'https://inkey-list-clone2.vercel.app',
        process.env.NEXT_PUBLIC_MAIN_STORE_URL,
      ].filter(Boolean);

      for (const url of storeUrls) {
        try {
          console.log(`Trying connection to: ${url}`);

          // Test basic connectivity first with shorter timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const healthResponse = await fetch(`${url}/api/health`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (healthResponse.ok) {
            // Try to fetch products
            const controller2 = new AbortController();
            const timeoutId2 = setTimeout(() => controller2.abort(), 5000);

            const productsResponse = await fetch(`${url}/api/products`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Admin-Dashboard': 'true',
                'Access-Control-Allow-Origin': '*',
              },
              signal: controller2.signal
            });

            clearTimeout(timeoutId2);

            if (productsResponse.ok) {
              const data = await productsResponse.json();

              this.connection = {
                type: 'api',
                endpoint: url,
                authenticated: true,
                lastSync: new Date().toISOString(),
                health: 'healthy'
              };

              // Load products from the main store
              if (data.products && Array.isArray(data.products)) {
                this.products = this.normalizeProducts(data.products);
              } else if (Array.isArray(data)) {
                this.products = this.normalizeProducts(data);
              }

              this.setupPeriodicSync();
              console.log(`✅ Successfully connected to store at ${url}`);
              console.log(`📦 Loaded ${this.products.length} products from main store`);

              return {
                success: true,
                message: `Connected to main store at ${url}. Loaded ${this.products.length} products.`
              };
            } else {
              console.log(`❌ Products API failed at ${url}: ${productsResponse.status}`);
            }
          } else {
            console.log(`❌ Health check failed at ${url}: ${healthResponse.status}`);
          }
        } catch (error) {
          console.log(`❌ Failed to connect to ${url}:`, error.message || error);
          continue;
        }
      }

      // If all URLs fail, fall back to static data
      console.log('⚠️ All store URLs failed, falling back to static data');
      return this.loadStaticProducts();

    } catch (error) {
      console.error('❌ Failed to initialize store connection:', error);
      return this.loadStaticProducts();
    }
  }

  // Normalize products from different API formats
  private normalizeProducts(rawProducts: any[]): RealProduct[] {
    return rawProducts.map(product => ({
      id: product.id || product.slug || `product-${Date.now()}-${Math.random()}`,
      name: product.name || product.title || 'Unnamed Product',
      shortDescription: product.shortDescription || product.subtitle || '',
      description: product.description || product.content || '',
      price: this.formatPrice(product.price),
      originalPrice: product.originalPrice ? this.formatPrice(product.originalPrice) : undefined,
      image: product.image || product.images?.[0] || product.thumbnail || '/placeholder-product.jpg',
      images: product.images || [product.image].filter(Boolean) || [],
      category: product.category || product.type || 'Uncategorized',
      skinTypes: product.skinTypes || product.skin_types || [],
      concerns: product.concerns || product.skin_concerns || [],
      inStock: product.inStock ?? product.in_stock ?? product.available ?? true,
      featured: product.featured ?? product.is_featured ?? false,
      sizes: product.sizes || product.variants || [],
      createdAt: product.createdAt || product.created_at || new Date().toISOString(),
      updatedAt: product.updatedAt || product.updated_at || new Date().toISOString(),
      adminNotes: product.adminNotes || ''
    }));
  }

  // Format price to consistent format
  private formatPrice(price: any): string {
    if (typeof price === 'string') return price;
    if (typeof price === 'number') return `£${price.toFixed(2)}`;
    return '£0.00';
  }

  // Setup periodic sync with main store
  private setupPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Sync every 5 minutes
    this.syncInterval = setInterval(async () => {
      await this.syncWithMainStore();
    }, 5 * 60 * 1000);
  }

  // Sync data with main store
  async syncWithMainStore(): Promise<void> {
    if (this.connection.type !== 'api' || !this.connection.endpoint) {
      return;
    }

    try {
      console.log('🔄 Syncing with main store...');

      const response = await fetch(`${this.connection.endpoint}/api/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Dashboard': 'true'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const newProducts = this.normalizeProducts(data.products || data);

        // Check for changes
        const hasChanges = this.detectProductChanges(newProducts);

        if (hasChanges) {
          this.products = newProducts;
          this.connection.lastSync = new Date().toISOString();
          this.connection.health = 'healthy';

          // Emit update event
          this.emitStoreUpdate(null, 'sync');
          console.log(`✅ Sync completed - ${this.products.length} products updated`);
        } else {
          console.log('ℹ️ No changes detected during sync');
        }

        this.retryCount = 0; // Reset retry count on successful sync
      } else {
        throw new Error(`Sync failed: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Sync failed:', error);
      this.connection.health = 'degraded';

      // Retry with exponential backoff
      this.retryCount++;
      if (this.retryCount <= this.maxRetries) {
        const retryDelay = Math.pow(2, this.retryCount) * 1000; // 2s, 4s, 8s
        setTimeout(() => this.syncWithMainStore(), retryDelay);
      } else {
        this.connection.health = 'offline';
        console.error('❌ Max sync retries reached, switching to offline mode');
      }
    }
  }

  // Detect changes in products
  private detectProductChanges(newProducts: RealProduct[]): boolean {
    if (newProducts.length !== this.products.length) {
      return true;
    }

    for (let i = 0; i < newProducts.length; i++) {
      const newProduct = newProducts[i];
      const existingProduct = this.products.find(p => p.id === newProduct.id);

      if (!existingProduct || existingProduct.updatedAt !== newProduct.updatedAt) {
        return true;
      }
    }

    return false;
  }

  // Load products from static data (fallback)
  private async loadStaticProducts(): Promise<{ success: boolean; message: string }> {
    // Real INKEY List products based on the actual store
    this.products = [
      {
        id: "hyaluronic-acid-serum",
        name: "Hyaluronic Acid Serum",
        shortDescription: "Plumps & hydrates for smoother skin",
        description: "A lightweight serum that holds up to 1000 times its weight in water, providing instant and long-lasting hydration for all skin types.",
        price: "£7.99",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
          "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=400&fit=crop"
        ],
        category: "Serums",
        skinTypes: ["Dry", "Normal", "Combination", "Oily"],
        concerns: ["Hydration", "Fine Lines", "Dryness"],
        inStock: true,
        featured: true,
        sizes: ["30ml"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        adminNotes: "Best seller - ensure stock levels maintained"
      },
      {
        id: "retinol-eye-cream",
        name: "Retinol Eye Cream",
        shortDescription: "Smooths fine lines around delicate eye area",
        description: "A gentle retinol formula specifically designed for the delicate eye area, helping to reduce fine lines and improve skin texture.",
        price: "£9.99",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
        ],
        category: "Eye Care",
        skinTypes: ["Normal", "Combination", "Dry"],
        concerns: ["Fine Lines", "Dark Circles", "Anti-Aging"],
        inStock: true,
        featured: true,
        sizes: ["15ml"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        adminNotes: "Popular for anti-aging routine"
      },
      {
        id: "niacinamide",
        name: "Niacinamide",
        shortDescription: "Controls oil production & minimizes pores",
        description: "A 10% niacinamide serum that helps control excess oil production and reduce the appearance of enlarged pores.",
        price: "£5.99",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop"
        ],
        category: "Serums",
        skinTypes: ["Oily", "Combination", "Acne-Prone"],
        concerns: ["Excess Oil", "Large Pores", "Acne"],
        inStock: false,
        featured: false,
        sizes: ["30ml"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        adminNotes: "Currently out of stock - reorder needed"
      },
      {
        id: "vitamin-c-serum",
        name: "Vitamin C Serum",
        shortDescription: "Brightens & evens out skin tone",
        description: "A potent vitamin C serum that brightens skin and helps reduce dark spots for a more even complexion.",
        price: "£9.99",
        originalPrice: "£12.99",
        image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop"
        ],
        category: "Serums",
        skinTypes: ["All Skin Types"],
        concerns: ["Dark Spots", "Dullness", "Uneven Tone"],
        inStock: true,
        featured: false,
        sizes: ["30ml"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        adminNotes: "On sale this month"
      },
      {
        id: "caffeine-eye-serum",
        name: "Caffeine Eye Serum",
        shortDescription: "Reduces puffiness & dark circles",
        description: "A caffeine-infused eye serum that helps reduce puffiness and the appearance of dark circles.",
        price: "£6.99",
        image: "https://images.unsplash.com/photo-1594824704818-61db69c33bb3?w=400&h=400&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1594824704818-61db69c33bb3?w=400&h=400&fit=crop"
        ],
        category: "Eye Care",
        skinTypes: ["All Skin Types"],
        concerns: ["Puffiness", "Dark Circles", "Tired Eyes"],
        inStock: true,
        featured: true,
        sizes: ["15ml"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        adminNotes: "Great for morning routine"
      },
      {
        id: "salicylic-acid-cleanser",
        name: "Salicylic Acid Cleanser",
        shortDescription: "Deep cleans & unclogs pores",
        description: "A gentle yet effective cleanser with salicylic acid that deeply cleanses and helps unclog pores.",
        price: "£8.99",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop"
        ],
        category: "Cleansers",
        skinTypes: ["Oily", "Combination", "Acne-Prone"],
        concerns: ["Acne", "Blackheads", "Clogged Pores"],
        inStock: true,
        featured: false,
        sizes: ["150ml"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        adminNotes: "Good for acne-prone skin"
      }
    ];

    this.connection = {
      type: 'static',
      authenticated: true,
      health: 'healthy',
      lastSync: new Date().toISOString()
    };

    console.log('📦 Loaded static product data (fallback mode)');

    return {
      success: true,
      message: `Loaded ${this.products.length} products from static data`
    };
  }

  // Get all products
  async getProducts(filters?: {
    category?: string;
    inStock?: boolean;
    featured?: boolean;
    search?: string;
  }): Promise<RealProduct[]> {
    let filteredProducts = [...this.products];

    if (filters?.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }

    if (filters?.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.inStock === filters.inStock);
    }

    if (filters?.featured !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.featured === filters.featured);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      );
    }

    return filteredProducts;
  }

  // Get single product
  async getProduct(id: string): Promise<RealProduct | null> {
    return this.products.find(p => p.id === id) || null;
  }

  // Create new product
  async createProduct(productData: Omit<RealProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<RealProduct> {
    const newProduct: RealProduct = {
      ...productData,
      id: `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.products.push(newProduct);
    await this.syncToMainStore(newProduct, 'create');

    return newProduct;
  }

  // Update existing product
  async updateProduct(id: string, updates: Partial<RealProduct>): Promise<RealProduct | null> {
    const productIndex = this.products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return null;
    }

    const updatedProduct = {
      ...this.products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.products[productIndex] = updatedProduct;
    await this.syncToMainStore(updatedProduct, 'update');

    return updatedProduct;
  }

  // Delete product
  async deleteProduct(id: string): Promise<boolean> {
    const productIndex = this.products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return false;
    }

    const deletedProduct = this.products[productIndex];
    this.products.splice(productIndex, 1);
    await this.syncToMainStore(deletedProduct, 'delete');

    return true;
  }

  // Toggle product stock status
  async toggleStock(id: string): Promise<RealProduct | null> {
    const product = this.products.find(p => p.id === id);

    if (!product) {
      return null;
    }

    product.inStock = !product.inStock;
    product.updatedAt = new Date().toISOString();

    await this.syncToMainStore(product, 'update');
    return product;
  }

  // Toggle featured status
  async toggleFeatured(id: string): Promise<RealProduct | null> {
    const product = this.products.find(p => p.id === id);

    if (!product) {
      return null;
    }

    product.featured = !product.featured;
    product.updatedAt = new Date().toISOString();

    await this.syncToMainStore(product, 'update');
    return product;
  }

  // Sync changes to main store
  private async syncToMainStore(product: RealProduct, action: 'create' | 'update' | 'delete'): Promise<void> {
    try {
      if (this.connection.type === 'api' && this.connection.endpoint) {
        const url = `${this.connection.endpoint}/api/admin/products`;
        const method = action === 'create' ? 'POST' : action === 'update' ? 'PUT' : 'DELETE';

        const response = await fetch(`${url}${action !== 'create' ? `/${product.id}` : ''}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.connection.apiKey || 'admin-token'}`,
            'X-Admin-Dashboard': 'true'
          },
          body: action !== 'delete' ? JSON.stringify(product) : undefined
        });

        if (!response.ok) {
          console.warn(`Failed to sync ${action} to main store:`, response.statusText);
        } else {
          console.log(`✅ Successfully synced ${action} to main store`);
        }
      } else {
        // For static connection, just emit events
        this.emitStoreUpdate(product, action);
      }
    } catch (error) {
      console.error('Failed to sync to main store:', error);
    }
  }

  // Emit store update events
  private emitStoreUpdate(product: RealProduct | null, action: 'create' | 'update' | 'delete' | 'sync') {
    // Emit custom events that other parts of the app can listen to
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('store-product-updated', {
        detail: { product, action, timestamp: new Date().toISOString() }
      }));
    }
  }

  // Get connection status
  getConnectionStatus(): StoreConnection {
    return this.connection;
  }

  // Test connection health
  async testConnection(): Promise<{ success: boolean; latency: number; message: string }> {
    const startTime = Date.now();

    try {
      if (this.connection.type === 'api' && this.connection.endpoint) {
        const response = await fetch(`${this.connection.endpoint}/api/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const latency = Date.now() - startTime;

        if (response.ok) {
          this.connection.health = 'healthy';
          return {
            success: true,
            latency,
            message: `Connection healthy (${latency}ms)`
          };
        } else {
          this.connection.health = 'degraded';
          return {
            success: false,
            latency,
            message: `Connection degraded: ${response.status}`
          };
        }
      } else {
        return {
          success: true,
          latency: 0,
          message: 'Static mode - no network connection required'
        };
      }
    } catch (error) {
      this.connection.health = 'offline';
      return {
        success: false,
        latency: Date.now() - startTime,
        message: `Connection failed: ${error}`
      };
    }
  }

  // Force reconnection
  async reconnect(): Promise<{ success: boolean; message: string }> {
    this.retryCount = 0;
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    return await this.initializeConnection();
  }

  // Generate static JSON for deployment
  async generateStaticData(): Promise<string> {
    const storeData = {
      products: this.products,
      lastUpdated: new Date().toISOString(),
      totalProducts: this.products.length,
      categories: [...new Set(this.products.map(p => p.category))],
      inStockCount: this.products.filter(p => p.inStock).length,
      featuredCount: this.products.filter(p => p.featured).length,
      connection: this.connection
    };

    return JSON.stringify(storeData, null, 2);
  }

  // Bulk operations
  async bulkUpdateStock(productIds: string[], inStock: boolean): Promise<RealProduct[]> {
    const updatedProducts: RealProduct[] = [];

    for (const id of productIds) {
      const product = await this.updateProduct(id, { inStock });
      if (product) {
        updatedProducts.push(product);
      }
    }

    return updatedProducts;
  }

  async bulkUpdateCategory(productIds: string[], category: string): Promise<RealProduct[]> {
    const updatedProducts: RealProduct[] = [];

    for (const id of productIds) {
      const product = await this.updateProduct(id, { category });
      if (product) {
        updatedProducts.push(product);
      }
    }

    return updatedProducts;
  }

  // Analytics
  getAnalytics() {
    const total = this.products.length;
    const inStock = this.products.filter(p => p.inStock).length;
    const featured = this.products.filter(p => p.featured).length;
    const categories = [...new Set(this.products.map(p => p.category))];

    const categoryBreakdown = categories.reduce((acc, category) => {
      acc[category] = this.products.filter(p => p.category === category).length;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      inStock,
      outOfStock: total - inStock,
      featured,
      categories: categoryBreakdown,
      recentlyUpdated: this.products
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
      connection: this.connection
    };
  }

  // Cleanup
  disconnect() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

// Export singleton instance
export const realStoreAPI = new RealStoreAPI();
export default realStoreAPI;
