import type { Product } from '@/data/products';

// Product utility functions for the admin dashboard

export function formatPrice(price: string | number): string {
  const numericPrice = typeof price === 'string' ? Number.parseFloat(price) : price;
  return `£${numericPrice.toFixed(2)}`;
}

export function formatPriceRange(minPrice: string | number, maxPrice: string | number): string {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}

export function calculateDiscountPercentage(originalPrice: string | number, salePrice: string | number): number {
  const original = typeof originalPrice === 'string' ? Number.parseFloat(originalPrice) : originalPrice;
  const sale = typeof salePrice === 'string' ? Number.parseFloat(salePrice) : salePrice;

  if (original <= sale) return 0;

  return Math.round(((original - sale) / original) * 100);
}

export function getProductStatus(product: Product): 'in-stock' | 'out-of-stock' | 'low-stock' {
  if (!product.available) return 'out-of-stock';

  // Check if any variant is available
  const hasAvailableVariants = product.variants.some(variant => variant.available);
  if (!hasAvailableVariants) return 'out-of-stock';

  // For demo purposes, randomly assign low-stock status
  const lowStockProducts = ['niacinamide', 'vitamin-c-serum'];
  if (lowStockProducts.includes(product.id)) return 'low-stock';

  return 'in-stock';
}

export function getProductTags(product: Product): string[] {
  return product.tags || [];
}

export function filterProductsByCategory(products: Product[], category: string): Product[] {
  if (category === 'all') return products;
  return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
}

export function filterProductsByAvailability(products: Product[], available: boolean): Product[] {
  return products.filter(product => product.available === available);
}

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;

  const lowercaseQuery = query.toLowerCase();

  return products.filter(product =>
    product.title.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    product.handle.toLowerCase().includes(lowercaseQuery)
  );
}

export function sortProducts(products: Product[], sortBy: string): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'price-asc':
      return sorted.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price));
    case 'price-desc':
      return sorted.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price));
    case 'created-asc':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'created-desc':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'updated-desc':
      return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    default:
      return sorted;
  }
}

export function getProductVariantPrice(product: Product): { min: number; max: number } {
  if (product.variants.length === 0) {
    const price = Number.parseFloat(product.price);
    return { min: price, max: price };
  }

  const prices = product.variants.map(variant => Number.parseFloat(variant.price));
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

export function isProductOnSale(product: Product): boolean {
  return Boolean(product.compareAtPrice && Number.parseFloat(product.compareAtPrice) > Number.parseFloat(product.price));
}

export function getProductImageUrl(product: Product, size: 'small' | 'medium' | 'large' = 'medium'): string {
  if (!product.image) {
    return '/placeholder-product.jpg';
  }

  // For Unsplash images, we can modify the size parameters
  if (product.image.includes('unsplash.com')) {
    const sizeParams = {
      small: 'w=200&h=200',
      medium: 'w=400&h=400',
      large: 'w=800&h=800'
    };

    const url = new URL(product.image);
    const params = new URLSearchParams(url.search);
    const [width, height] = sizeParams[size].split('&').map(p => p.split('=')[1]);

    params.set('w', width);
    params.set('h', height);
    params.set('fit', 'crop');

    url.search = params.toString();
    return url.toString();
  }

  return product.image;
}

export function generateProductHandle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateProduct(product: Partial<Product>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!product.title?.trim()) {
    errors.push('Product title is required');
  }

  if (!product.description?.trim()) {
    errors.push('Product description is required');
  }

  if (!product.price || Number.parseFloat(product.price) <= 0) {
    errors.push('Valid product price is required');
  }

  if (!product.category?.trim()) {
    errors.push('Product category is required');
  }

  if (!product.image?.trim()) {
    errors.push('Product image is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function getProductDisplayName(product: Product): string {
  return product.title;
}

export function isShopifyProduct(product: any): product is Product {
  return (
    typeof product === 'object' &&
    product !== null &&
    typeof product.id === 'string' &&
    typeof product.title === 'string' &&
    typeof product.price === 'string'
  );
}

export function getProductAnalytics(products: Product[]) {
  const total = products.length;
  const available = products.filter(p => p.available).length;
  const featured = products.filter(p => p.featured).length;
  const onSale = products.filter(p => isProductOnSale(p)).length;

  const categories = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgPrice = products.reduce((sum, product) => sum + Number.parseFloat(product.price), 0) / total;

  return {
    total,
    available,
    unavailable: total - available,
    featured,
    onSale,
    categories,
    avgPrice: isNaN(avgPrice) ? 0 : avgPrice
  };
}

export default {
  formatPrice,
  formatPriceRange,
  calculateDiscountPercentage,
  getProductStatus,
  getProductTags,
  filterProductsByCategory,
  filterProductsByAvailability,
  searchProducts,
  sortProducts,
  getProductVariantPrice,
  isProductOnSale,
  getProductImageUrl,
  generateProductHandle,
  validateProduct,
  getProductAnalytics,
  getProductDisplayName,
  isShopifyProduct
};
