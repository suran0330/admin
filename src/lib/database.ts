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
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
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

export interface Category {
  id: string;
  name: string;
  handle: string;
  description: string;
}

export interface SkinConcern {
  id: string;
  name: string;
  handle: string;
}

export interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  skinConcerns: SkinConcern[];
}

class Database {
  private dbPath: string;
  private backupDir: string;
  
  constructor() {
    // Use path relative to the admin directory
    this.dbPath = path.join(process.cwd(), 'data', 'db.json');
    this.backupDir = path.join(process.cwd(), 'data', 'backups');
  }

  private async ensureDbExists(): Promise<void> {
    try {
      await fs.access(this.dbPath);
    } catch (error) {
      // Create directory if it doesn't exist
      const dbDir = path.dirname(this.dbPath);
      await fs.mkdir(dbDir, { recursive: true });
      
      // Create initial empty database
      const initialData: DatabaseSchema = {
        products: [],
        categories: [],
        skinConcerns: []
      };
      await this.atomicWrite(this.dbPath, JSON.stringify(initialData, null, 2));
    }
  }

  private async readDb(): Promise<DatabaseSchema> {
    await this.ensureDbExists();
    const data = await fs.readFile(this.dbPath, 'utf-8');
    return JSON.parse(data);
  }

  // Atomic write operation to prevent corruption
  private async atomicWrite(filePath: string, data: string): Promise<void> {
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    try {
      await fs.writeFile(tempPath, data, 'utf-8');
      await fs.rename(tempPath, filePath);
    } catch (error) {
      // Clean up temp file if it exists
      try {
        await fs.unlink(tempPath);
      } catch {}
      throw error;
    }
  }

  private async writeDb(data: DatabaseSchema): Promise<void> {
    // Create backup before writing
    await this.createAutoBackup();
    await this.atomicWrite(this.dbPath, JSON.stringify(data, null, 2));
  }

  // Auto backup system
  private async createAutoBackup(): Promise<void> {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      const data = await fs.readFile(this.dbPath, 'utf-8');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(this.backupDir, `db-${timestamp}.json`);
      await fs.writeFile(backupPath, data);
      
      // Keep only last 10 backups
      await this.cleanupOldBackups();
    } catch (error) {
      console.warn('Failed to create backup:', error);
    }
  }

  private async cleanupOldBackups(): Promise<void> {
    try {
      const files = await fs.readdir(this.backupDir);
      const backups = files
        .filter(file => file.startsWith('db-') && file.endsWith('.json'))
        .sort()
        .reverse();

      // Remove all but the 10 most recent backups
      for (const backup of backups.slice(10)) {
        await fs.unlink(path.join(this.backupDir, backup));
      }
    } catch (error) {
      console.warn('Failed to cleanup old backups:', error);
    }
  }

  // Product CRUD operations
  async getAllProducts(): Promise<Product[]> {
    const db = await this.readDb();
    return db.products;
  }

  async getProductById(id: string): Promise<Product | null> {
    const db = await this.readDb();
    return db.products.find(p => p.id === id) || null;
  }

  async getProductByHandle(handle: string): Promise<Product | null> {
    const db = await this.readDb();
    return db.products.find(p => p.handle === handle) || null;
  }

  async createProduct(productData: CreateProduct): Promise<Product> {
    // Validate input data with Zod
    const validatedData = CreateProductSchema.parse(productData);
    
    const db = await this.readDb();
    
    // Check for duplicate handle
    const existingProduct = db.products.find(p => p.handle === validatedData.handle);
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

    db.products.push(validatedProduct);
    await this.writeDb(db);
    
    return validatedProduct;
  }

  async updateProduct(id: string, updates: Partial<CreateProduct>): Promise<Product | null> {
    const db = await this.readDb();
    const productIndex = db.products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return null;
    }

    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Validate update data
    const validatedUpdates = UpdateProductSchema.parse(updatedData);

    const updatedProduct = {
      ...db.products[productIndex],
      ...validatedUpdates,
    };

    // Validate final product
    const validatedProduct = ProductSchema.parse(updatedProduct);

    db.products[productIndex] = validatedProduct;
    await this.writeDb(db);
    
    return validatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const db = await this.readDb();
    const productIndex = db.products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return false;
    }

    db.products.splice(productIndex, 1);
    await this.writeDb(db);
    
    return true;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    const db = await this.readDb();
    return db.categories;
  }

  async createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
    const db = await this.readDb();
    
    const category: Category = {
      ...categoryData,
      id: this.generateId()
    };

    db.categories.push(category);
    await this.writeDb(db);
    
    return category;
  }

  // Skin concerns operations
  async getAllSkinConcerns(): Promise<SkinConcern[]> {
    const db = await this.readDb();
    return db.skinConcerns;
  }

  async createSkinConcern(concernData: Omit<SkinConcern, 'id'>): Promise<SkinConcern> {
    const db = await this.readDb();
    
    const concern: SkinConcern = {
      ...concernData,
      id: this.generateId()
    };

    db.skinConcerns.push(concern);
    await this.writeDb(db);
    
    return concern;
  }

  // Utility methods
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  // Generate handle from title
  generateHandle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Search and filter operations
  async searchProducts(filters: {
    search?: string;
    category?: string;
    skinConcerns?: string[];
    inStock?: boolean;
    featured?: boolean;
  }): Promise<Product[]> {
    const products = await this.getAllProducts();
    
    return products.filter(product => {
      // Search in title and description
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Filter by category
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Filter by skin concerns
      if (filters.skinConcerns && filters.skinConcerns.length > 0) {
        const hasMatchingConcern = filters.skinConcerns.some(concern =>
          product.skinConcerns.includes(concern)
        );
        if (!hasMatchingConcern) return false;
      }

      // Filter by stock status
      if (filters.inStock !== undefined && product.inStock !== filters.inStock) {
        return false;
      }

      // Filter by featured status
      if (filters.featured !== undefined && product.featured !== filters.featured) {
        return false;
      }

      return true;
    });
  }

  // Analytics
  async getAnalytics() {
    const products = await this.getAllProducts();
    const categories = await this.getAllCategories();
    
    const total = products.length;
    const inStock = products.filter(p => p.inStock).length;
    const featured = products.filter(p => p.featured).length;
    
    const categoryBreakdown = categories.reduce((acc, category) => {
      acc[category.id] = {
        name: category.name,
        count: products.filter(p => p.category === category.id).length
      };
      return acc;
    }, {} as Record<string, { name: string; count: number }>);

    const recentlyUpdated = products
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);

    return {
      total,
      inStock,
      outOfStock: total - inStock,
      featured,
      categories: categoryBreakdown,
      recentlyUpdated
    };
  }

  // Bulk operations
  async bulkUpdateProducts(ids: string[], updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product[]> {
    const results: Product[] = [];
    
    for (const id of ids) {
      const updated = await this.updateProduct(id, updates);
      if (updated) {
        results.push(updated);
      }
    }
    
    return results;
  }

  // Backup and restore
  async createBackup(): Promise<string> {
    const db = await this.readDb();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(path.dirname(this.dbPath), `backup-${timestamp}.json`);
    
    await fs.writeFile(backupPath, JSON.stringify(db, null, 2));
    return backupPath;
  }

  async restoreFromBackup(backupPath: string): Promise<void> {
    const backupData = await fs.readFile(backupPath, 'utf-8');
    const data = JSON.parse(backupData);
    await this.writeDb(data);
  }
}

// Export singleton instance
export const database = new Database();
export default database;