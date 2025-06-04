import { type NextRequest, NextResponse } from 'next/server';
import { database, type Product } from '@/lib/database';

// CORS headers for frontend requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
};

// Convert database product to frontend format
function convertDatabaseProduct(product: Product) {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    shortDescription: product.description.substring(0, 150) + (product.description.length > 150 ? '...' : ''),
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    images: product.images,
    category: {
      id: product.category,
      name: product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' '),
      handle: product.category
    },
    skinConcerns: product.skinConcerns,
    ingredients: product.ingredients,
    inStock: product.inStock,
    featured: product.featured,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract filter parameters for frontend
    const filters = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      skinConcerns: searchParams.get('skinConcerns')?.split(',') || undefined,
      inStock: searchParams.get('inStock') ? searchParams.get('inStock') === 'true' : undefined,
      featured: searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined,
    };

    // Remove undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    );

    let products;
    
    if (Object.keys(cleanFilters).length > 0) {
      products = await database.searchProducts(cleanFilters);
    } else {
      products = await database.getAllProducts();
    }

    // Convert to frontend format
    const frontendProducts = products.map(convertDatabaseProduct);

    // Also get categories and skin concerns for frontend
    const categories = await database.getAllCategories();
    const skinConcerns = await database.getAllSkinConcerns();

    return NextResponse.json({
      success: true,
      products: frontendProducts,
      categories,
      skinConcerns,
      count: frontendProducts.length
    }, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error fetching products for frontend:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}