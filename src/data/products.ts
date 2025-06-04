// Product data for the INKEY List admin dashboard

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  image: string;
  images: string[];
  category: string;
  handle: string;
  tags: string[];
  variants: ProductVariant[];
  available: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  available: boolean;
  sku?: string;
  weight?: number;
  weightUnit?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  handle: string;
  description?: string;
  image?: string;
  productCount: number;
}

// Sample product data for the INKEY List store
export const sampleProducts: Product[] = [
  {
    id: 'hyaluronic-acid-serum',
    title: 'Hyaluronic Acid Serum',
    description: 'A lightweight serum that holds up to 1000 times its weight in water, providing instant and long-lasting hydration for all skin types.',
    price: '7.99',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=400&fit=crop'
    ],
    category: 'Serums',
    handle: 'hyaluronic-acid-serum',
    tags: ['hydrating', 'all-skin-types', 'plumping'],
    variants: [
      {
        id: 'hyaluronic-acid-serum-30ml',
        title: '30ml',
        price: '7.99',
        available: true,
        sku: 'INKEY-HA-30ML',
        weight: 30,
        weightUnit: 'ml'
      }
    ],
    available: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'retinol-eye-cream',
    title: 'Retinol Eye Cream',
    description: 'A gentle retinol formula specifically designed for the delicate eye area, helping to reduce fine lines and improve skin texture.',
    price: '9.99',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
    ],
    category: 'Eye Care',
    handle: 'retinol-eye-cream',
    tags: ['anti-aging', 'eye-care', 'retinol'],
    variants: [
      {
        id: 'retinol-eye-cream-15ml',
        title: '15ml',
        price: '9.99',
        available: true,
        sku: 'INKEY-RET-EYE-15ML',
        weight: 15,
        weightUnit: 'ml'
      }
    ],
    available: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'niacinamide',
    title: 'Niacinamide',
    description: 'A 10% niacinamide serum that helps control excess oil production and reduce the appearance of enlarged pores.',
    price: '5.99',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop'
    ],
    category: 'Serums',
    handle: 'niacinamide',
    tags: ['oil-control', 'pore-minimizing', 'oily-skin'],
    variants: [
      {
        id: 'niacinamide-30ml',
        title: '30ml',
        price: '5.99',
        available: false,
        sku: 'INKEY-NIA-30ML',
        weight: 30,
        weightUnit: 'ml'
      }
    ],
    available: false,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'vitamin-c-serum',
    title: 'Vitamin C Serum',
    description: 'A potent vitamin C serum that brightens skin and helps reduce dark spots for a more even complexion.',
    price: '9.99',
    compareAtPrice: '12.99',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop'
    ],
    category: 'Serums',
    handle: 'vitamin-c-serum',
    tags: ['brightening', 'vitamin-c', 'dark-spots'],
    variants: [
      {
        id: 'vitamin-c-serum-30ml',
        title: '30ml',
        price: '9.99',
        compareAtPrice: '12.99',
        available: true,
        sku: 'INKEY-VIT-C-30ML',
        weight: 30,
        weightUnit: 'ml'
      }
    ],
    available: true,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'caffeine-eye-serum',
    title: 'Caffeine Eye Serum',
    description: 'A caffeine-infused eye serum that helps reduce puffiness and the appearance of dark circles.',
    price: '6.99',
    image: 'https://images.unsplash.com/photo-1594824704818-61db69c33bb3?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594824704818-61db69c33bb3?w=400&h=400&fit=crop'
    ],
    category: 'Eye Care',
    handle: 'caffeine-eye-serum',
    tags: ['caffeine', 'eye-care', 'depuffing'],
    variants: [
      {
        id: 'caffeine-eye-serum-15ml',
        title: '15ml',
        price: '6.99',
        available: true,
        sku: 'INKEY-CAFF-EYE-15ML',
        weight: 15,
        weightUnit: 'ml'
      }
    ],
    available: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'salicylic-acid-cleanser',
    title: 'Salicylic Acid Cleanser',
    description: 'A gentle yet effective cleanser with salicylic acid that deeply cleanses and helps unclog pores.',
    price: '8.99',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    ],
    category: 'Cleansers',
    handle: 'salicylic-acid-cleanser',
    tags: ['salicylic-acid', 'cleansing', 'acne-prone'],
    variants: [
      {
        id: 'salicylic-acid-cleanser-150ml',
        title: '150ml',
        price: '8.99',
        available: true,
        sku: 'INKEY-SA-CLEAN-150ML',
        weight: 150,
        weightUnit: 'ml'
      }
    ],
    available: true,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const productCategories: ProductCategory[] = [
  {
    id: 'serums',
    name: 'Serums',
    handle: 'serums',
    description: 'Targeted treatment serums for specific skin concerns',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=300&fit=crop',
    productCount: sampleProducts.filter(p => p.category === 'Serums').length
  },
  {
    id: 'eye-care',
    name: 'Eye Care',
    handle: 'eye-care',
    description: 'Specialized products for the delicate eye area',
    image: 'https://images.unsplash.com/photo-1594824704818-61db69c33bb3?w=400&h=300&fit=crop',
    productCount: sampleProducts.filter(p => p.category === 'Eye Care').length
  },
  {
    id: 'cleansers',
    name: 'Cleansers',
    handle: 'cleansers',
    description: 'Gentle yet effective facial cleansers',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    productCount: sampleProducts.filter(p => p.category === 'Cleansers').length
  }
];

// Helper functions
export function getProductById(id: string): Product | undefined {
  return sampleProducts.find(product => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return sampleProducts.filter(product => product.category === category);
}

export function getFeaturedProducts(): Product[] {
  return sampleProducts.filter(product => product.featured);
}

export function getAvailableProducts(): Product[] {
  return sampleProducts.filter(product => product.available);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return sampleProducts.filter(product =>
    product.title.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// Export for backward compatibility
export const products = sampleProducts;

export default sampleProducts;
