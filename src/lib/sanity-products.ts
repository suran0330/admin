import { createClient } from '@sanity/client';

// Sanity client configuration for admin
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '7i4b2ni6',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
  useCdn: false, // Use fresh data for admin
  token: process.env.SANITY_API_TOKEN // Write token for admin operations
});

export interface AdminProduct {
  _id: string;
  _type: 'product';
  name: string;
  slug: {
    current: string;
  };
  description: string;
  price: number;
  inStock: boolean;
  featured?: boolean;
  skinConcerns: string[];
  ingredients: string[];
  benefits: string[];
  howToUse?: string;
  category?: {
    _id: string;
    name: string;
    slug: {
      current: string;
    };
  };
  images?: Array<{
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  }>;
  _createdAt: string;
  _updatedAt: string;
}

export interface AdminCategory {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description?: string;
}

class AdminSanityService {
  // Get all products with optional filtering
  async getProducts(filters: {
    search?: string;
    category?: string;
    inStock?: boolean;
    featured?: boolean;
  } = {}): Promise<AdminProduct[]> {
    try {
      console.log('📡 Fetching products from Sanity for admin dashboard...');

      let query = `*[_type == "product"`;
      const params: any = {};

      // Add filters
      if (filters.search) {
        query += ` && (name match $search || description match $search)`;
        params.search = `*${filters.search}*`;
      }

      if (filters.category) {
        query += ` && category->slug.current == $category`;
        params.category = filters.category;
      }

      if (filters.inStock !== undefined) {
        query += ` && inStock == $inStock`;
        params.inStock = filters.inStock;
      }

      if (filters.featured !== undefined) {
        query += ` && featured == $featured`;
        params.featured = filters.featured;
      }

      query += `] | order(_createdAt desc) {
        _id,
        _type,
        name,
        slug,
        description,
        price,
        inStock,
        featured,
        skinConcerns,
        ingredients,
        benefits,
        howToUse,
        category->{
          _id,
          name,
          slug
        },
        images[]{
          asset->{
            _id,
            url
          },
          alt
        },
        _createdAt,
        _updatedAt
      }`;

      const products = await sanityClient.fetch(query, params);
      console.log(`✅ Fetched ${products.length} products from Sanity for admin`);
      return products;
    } catch (error) {
      console.error('❌ Error fetching products from Sanity:', error);
      throw error;
    }
  }

  // Get single product by ID
  async getProductById(productId: string): Promise<AdminProduct | null> {
    try {
      console.log('📡 Fetching product by ID from Sanity:', productId);

      const query = `*[_type == "product" && _id == $productId][0] {
        _id,
        _type,
        name,
        slug,
        description,
        price,
        inStock,
        featured,
        skinConcerns,
        ingredients,
        benefits,
        howToUse,
        category->{
          _id,
          name,
          slug
        },
        images[]{
          asset->{
            _id,
            url
          },
          alt
        },
        _createdAt,
        _updatedAt
      }`;

      const product = await sanityClient.fetch(query, { productId });
      console.log(`✅ Fetched product: ${product?.name || 'not found'}`);
      return product;
    } catch (error) {
      console.error('❌ Error fetching product by ID from Sanity:', error);
      throw error;
    }
  }

  // Create new product
  async createProduct(productData: Omit<AdminProduct, '_id' | '_type' | '_createdAt' | '_updatedAt'>): Promise<AdminProduct> {
    try {
      console.log('📡 Creating product in Sanity:', productData.name);

      const result = await sanityClient.create({
        _type: 'product',
        ...productData
      });

      console.log('✅ Product created in Sanity:', result._id);
      return result as AdminProduct;
    } catch (error) {
      console.error('❌ Error creating product in Sanity:', error);
      throw error;
    }
  }

  // Update existing product
  async updateProduct(productId: string, updates: Partial<Omit<AdminProduct, '_id' | '_type' | '_createdAt'>>): Promise<AdminProduct> {
    try {
      console.log('📡 Updating product in Sanity:', productId);

      const result = await sanityClient
        .patch(productId)
        .set(updates)
        .commit();

      console.log('✅ Product updated in Sanity:', result._id);
      return result as AdminProduct;
    } catch (error) {
      console.error('❌ Error updating product in Sanity:', error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(productId: string): Promise<void> {
    try {
      console.log('📡 Deleting product from Sanity:', productId);

      await sanityClient.delete(productId);
      console.log('✅ Product deleted from Sanity:', productId);
    } catch (error) {
      console.error('❌ Error deleting product from Sanity:', error);
      throw error;
    }
  }

  // Get categories
  async getCategories(): Promise<AdminCategory[]> {
    try {
      console.log('📡 Fetching categories from Sanity...');

      const query = `*[_type == "category"] | order(name asc) {
        _id,
        name,
        slug,
        description
      }`;

      const categories = await sanityClient.fetch(query);
      console.log(`✅ Fetched ${categories.length} categories from Sanity`);
      return categories;
    } catch (error) {
      console.error('❌ Error fetching categories from Sanity:', error);
      throw error;
    }
  }

  // Convert Sanity product to admin format
  convertToAdminFormat(sanityProduct: AdminProduct) {
    return {
      id: sanityProduct._id,
      handle: sanityProduct.slug.current,
      title: sanityProduct.name,
      description: sanityProduct.description,
      price: sanityProduct.price,
      images: sanityProduct.images?.map(img => img.asset.url) || [],
      category: sanityProduct.category?.name || 'Uncategorized',
      skinConcerns: sanityProduct.skinConcerns || [],
      ingredients: sanityProduct.ingredients || [],
      benefits: sanityProduct.benefits || [],
      howToUse: sanityProduct.howToUse || '',
      inStock: sanityProduct.inStock,
      featured: sanityProduct.featured || false,
      createdAt: sanityProduct._createdAt,
      updatedAt: sanityProduct._updatedAt
    };
  }

  // Generate slug from name
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}

// Export singleton instance
export const adminSanityService = new AdminSanityService();
