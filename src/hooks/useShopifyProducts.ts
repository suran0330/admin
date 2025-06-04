import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/data/products';
import { sampleProducts } from '@/data/products';

interface UseShopifyProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
}

export function useShopifyProducts(): UseShopifyProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real implementation, this would connect to Shopify's API
      // For demo purposes, we'll use the sample data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      setProducts(sampleProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
      setLoading(true);

      const newProduct: Product = {
        ...productData,
        id: `product-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    try {
      setLoading(true);

      const existingProduct = products.find(p => p.id === id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      const updatedProduct: Product = {
        ...existingProduct,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
}

export default useShopifyProducts;
