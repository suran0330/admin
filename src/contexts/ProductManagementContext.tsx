"use client";

import type React from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import { products as initialProducts } from '@/data/products';
import type { Product } from '@/data/products';
import type { ShopifyProductNormalized } from '@/types/shopify';

type CombinedProduct = Product | ShopifyProductNormalized;

interface ProductFilters {
  search: string;
  category: string;
  inStock: boolean | null;
  featured: boolean | null;
  source: 'all' | 'local' | 'shopify';
}

interface ProductManagementContextType {
  // Products
  localProducts: Product[];
  shopifyProducts: ShopifyProductNormalized[];

  // Filters
  filters: ProductFilters;
  setFilters: (filters: Partial<ProductFilters>) => void;

  // Product operations
  createProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  bulkUpdateProducts: (ids: string[], updates: Partial<Product>) => Promise<void>;

  // Categories and concerns
  categories: string[];
  concerns: string[];
  addCategory: (category: string) => void;
  addConcern: (concern: string) => void;

  // Inventory management
  updateStock: (id: string, inStock: boolean) => Promise<void>;
  bulkUpdateStock: (ids: string[], inStock: boolean) => Promise<void>;

  // Analytics
  getProductStats: () => {
    total: number;
    inStock: number;
    outOfStock: number;
    featured: number;
    byCategory: Record<string, number>;
    byConcern: Record<string, number>;
  };
}

const ProductManagementContext = createContext<ProductManagementContextType | undefined>(undefined);

export function ProductManagementProvider({ children }: { children: React.ReactNode }) {
  const [localProducts, setLocalProducts] = useState<Product[]>(initialProducts);
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProductNormalized[]>([]);
  const [filters, setFiltersState] = useState<ProductFilters>({
    search: '',
    category: '',
    inStock: null,
    featured: null,
    source: 'all'
  });

  const setFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Generate unique ID for new products
  const generateId = useCallback(() => {
    return `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Product CRUD operations
  const createProduct = useCallback(async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct: Product = {
      ...productData,
      id: generateId()
    };

    setLocalProducts(prev => [newProduct, ...prev]);
    return newProduct;
  }, [generateId]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>): Promise<Product> => {
    let updatedProduct: Product | null = null;

    setLocalProducts(prev => prev.map(product => {
      if (product.id === id) {
        updatedProduct = { ...product, ...updates };
        return updatedProduct;
      }
      return product;
    }));

    if (!updatedProduct) {
      throw new Error('Product not found');
    }

    return updatedProduct;
  }, []);

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    setLocalProducts(prev => prev.filter(product => product.id !== id));
  }, []);

  const bulkUpdateProducts = useCallback(async (ids: string[], updates: Partial<Product>): Promise<void> => {
    setLocalProducts(prev => prev.map(product =>
      ids.includes(product.id) ? { ...product, ...updates } : product
    ));
  }, []);

  // Inventory management
  const updateStock = useCallback(async (id: string, inStock: boolean): Promise<void> => {
    await updateProduct(id, { inStock });
  }, [updateProduct]);

  const bulkUpdateStock = useCallback(async (ids: string[], inStock: boolean): Promise<void> => {
    await bulkUpdateProducts(ids, { inStock });
  }, [bulkUpdateProducts]);

  // Categories and concerns
  const categories = Array.from(new Set(localProducts.map(p => p.category)));
  const concerns = Array.from(new Set(localProducts.flatMap(p => p.concerns || [])));

  const addCategory = useCallback((category: string) => {
    // In a real app, this would update a categories collection
    console.log('Adding category:', category);
  }, []);

  const addConcern = useCallback((concern: string) => {
    // In a real app, this would update a concerns collection
    console.log('Adding concern:', concern);
  }, []);

  // Analytics
  const getProductStats = useCallback(() => {
    const allProducts = [...localProducts, ...shopifyProducts];

    const stats = {
      total: allProducts.length,
      inStock: allProducts.filter(p => p.inStock).length,
      outOfStock: allProducts.filter(p => !p.inStock).length,
      featured: allProducts.filter(p => 'featured' in p && p.featured).length,
      byCategory: {} as Record<string, number>,
      byConcern: {} as Record<string, number>
    };

    // Count by category
    allProducts.forEach(product => {
      const category = 'category' in product ? product.category : 'productType' in product ? product.productType || 'Other' : 'Other';
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    });

    // Count by concern (only for local products that have concerns)
    localProducts.forEach(product => {
      if (product.concerns) {
        product.concerns.forEach(concern => {
          stats.byConcern[concern] = (stats.byConcern[concern] || 0) + 1;
        });
      }
    });

    return stats;
  }, [localProducts, shopifyProducts]);

  const value: ProductManagementContextType = {
    localProducts,
    shopifyProducts,
    filters,
    setFilters,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateProducts,
    categories,
    concerns,
    addCategory,
    addConcern,
    updateStock,
    bulkUpdateStock,
    getProductStats
  };

  return (
    <ProductManagementContext.Provider value={value}>
      {children}
    </ProductManagementContext.Provider>
  );
}

export function useProductManagement() {
  const context = useContext(ProductManagementContext);
  if (context === undefined) {
    throw new Error('useProductManagement must be used within a ProductManagementProvider');
  }
  return context;
}

export default ProductManagementContext;
