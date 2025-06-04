import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';

// Zod validation schemas
export const ProductSchema = z.object({
  id: z.string(),
  handle: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  compareAtPrice: z.number().positive().optional(),
  images: z.array(z.string()).default([]),
  category: z.string().min(1, 'Category is required'),
  skinConcerns: z.array(z.string()).default([]),
  ingredients: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  howToUse: z.string().optional(),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  variants: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    image: z.string().optional(),
  })).default([]),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
  }).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
}).partial().extend({
  updatedAt: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;

class ProductsDatabase {
  private dbPath: string;
  private backupDir: string;

  constructor() {
    // Use src/data/products.json for the products file
    this.dbPath = path.join(process.cwd(), 'src', 'data', 'products.json');
    this.backupDir = path.join(process.cwd(), 'src', 'data', 'backups');
  }

  private async ensureDbExists(): Promise<void> {
    try {
      await fs.access(this.dbPath);
      console.log('✅ Products database exists at:', this.dbPath);
    } catch (error) {
      console.log('📁 Creating products database directory and file...');

      // Create directory if it doesn't exist
      const dbDir = path.dirname(this.dbPath);
      await fs.mkdir(dbDir, { recursive: true });

      // Create initial products array
      const initialData: Product[] = [];
      await this.atomicWrite(this.dbPath, JSON.stringify(initialData, null, 2));

      console.log('✅ Products database created at:', this.dbPath);
    }
  }

  private async readProducts(): Promise<Product[]> {
    await this.ensureDbExists();
    try {
      const data = await fs.readFile(this.dbPath, 'utf-8');
      const products = JSON.parse(data);

      // Validate that it's an array
      if (!Array.isArray(products)) {
        console.warn('⚠️ Products file is not an array, resetting...');
        return [];
      }

      // Validate each product with Zod
      const validatedProducts = products.map(product => {
        try {
          return ProductSchema.parse(product);
        } catch (error) {
          console.warn('⚠️ Invalid product found, skipping:', product.id || 'unknown');
          return null;
        }
      }).filter(Boolean) as Product[];

      console.log(`📦 Loaded ${validatedProducts.length} products from database`);
      return validatedProducts;
    } catch (error) {
      console.error('❌ Error reading products file:', error);
      return [];
    }
  }

  // Atomic write operation to prevent corruption
  private async atomicWrite(filePath: string, data: string): Promise<void> {
    const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).substr(2, 9)}`;
    try {
      console.log('💾 Writing products to temporary file:', tempPath);
      await fs.writeFile(tempPath, data, 'utf-8');

      console.log('🔄 Atomically moving to final location:', filePath);
      await fs.rename(tempPath, filePath);

      console.log('✅ Products database written successfully');
    } catch (error) {
      console.error('❌ Error during atomic write:', error);

      // Clean up temp file if it exists
      try {
        await fs.unlink(tempPath);
      } catch {}
      throw error;
    }
  }

  private async writeProducts(products: Product[]): Promise<void> {
    // Create backup before writing
    await this.createAutoBackup();

    // Validate all products before writing
    const validatedProducts = products.map(product => ProductSchema.parse(product));

    console.log(`💾 Writing ${validatedProducts.length} products to database`);
    await this.atomicWrite(this.dbPath, JSON.stringify(validatedProducts, null, 2));
  }

  // Auto backup system
  private async createAutoBackup(): Promise<void> {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      const data = await fs.readFile(this.dbPath, 'utf-8');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(this.backupDir, `products-${timestamp}.json`);
      await fs.writeFile(backupPath, data);

      console.log('📋 Backup created:', backupPath);

      // Keep only last 5 backups
      await this.cleanupOldBackups();
    } catch (error) {
      console.warn('⚠️ Failed to create backup:', error);
    }
  }

  private async cleanupOldBackups(): Promise<void> {
    try {
      const files = await fs.readdir(this.backupDir);
      const backups = files
        .filter(file => file.startsWith('products-') && file.endsWith('.json'))
        .sort()
        .reverse();

      // Remove all but the 5 most recent backups
      for (const backup of backups.slice(5)) {
        await fs.unlink(path.join(this.backupDir, backup));
        console.log('🗑️ Removed old backup:', backup);
      }
    } catch (error) {
      console.warn('⚠️ Failed to cleanup old backups:', error);
    }
  }

  // Product CRUD operations
  async getAllProducts(): Promise<Product[]> {
    return await this.readProducts();
  }

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.readProducts();
    return products.find(p => p.id === id) || null;
  }

  async getProductByHandle(handle: string): Promise<Product | null> {
    const products = await this.readProducts();
    return products.find(p => p.handle === handle) || null;
  }

  async createProduct(productData: CreateProduct): Promise<Product> {
    console.log('🆕 Creating new product:', productData.title);

    // Validate input data with Zod
    const validatedData = CreateProductSchema.parse(productData);

    const products = await this.readProducts();

    // Check for duplicate handle
    const existingProduct = products.find(p => p.handle === validatedData.handle);
    if (existingProduct) {
      throw new Error(`Product with handle "${validatedData.handle}" already exists`);
    }

    const now = new Date().toISOString();
    const product: Product = {
      ...validatedData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    };

    // Validate final product
    const validatedProduct = ProductSchema.parse(product);

    products.push(validatedProduct);
    await this.writeProducts(products);

    console.log('✅ Product created successfully:', validatedProduct.id);
    return validatedProduct;
  }

  async updateProduct(id: string, updates: Partial<CreateProduct>): Promise<Product | null> {
    console.log('✏️ Updating product:', id);

    const products = await this.readProducts();
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      console.log('❌ Product not found:', id);
      return null;
    }

    const updatedData = {
      ...products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Validate updated product
    const validatedProduct = ProductSchema.parse(updatedData);

    products[productIndex] = validatedProduct;
    await this.writeProducts(products);

    console.log('✅ Product updated successfully:', id);
    return validatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    console.log('🗑️ Deleting product:', id);

    const products = await this.readProducts();
    const initialLength = products.length;
    const filteredProducts = products.filter(p => p.id !== id);

    if (filteredProducts.length === initialLength) {
      console.log('❌ Product not found:', id);
      return false;
    }

    await this.writeProducts(filteredProducts);
    console.log('✅ Product deleted successfully:', id);
    return true;
  }

  // Utility methods
  generateId(): string {
    return `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  generateHandle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Search and filter
  async searchProducts(filters: {
    search?: string;
    category?: string;
    skinConcerns?: string[];
    inStock?: boolean;
    featured?: boolean;
  }): Promise<Product[]> {
    const products = await this.readProducts();

    return products.filter(product => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = `${product.title} ${product.description} ${product.category} ${product.skinConcerns.join(' ')} ${product.ingredients.join(' ')}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) return false;
      }

      if (filters.category && product.category !== filters.category) return false;
      if (filters.inStock !== undefined && product.inStock !== filters.inStock) return false;
      if (filters.featured !== undefined && product.featured !== filters.featured) return false;

      if (filters.skinConcerns && filters.skinConcerns.length > 0) {
        const hasMatchingSkinConcern = filters.skinConcerns.some(concern =>
          product.skinConcerns.includes(concern)
        );
        if (!hasMatchingSkinConcern) return false;
      }

      return true;
    });
  }
}

// Export singleton instance
export const productsDatabase = new ProductsDatabase();
