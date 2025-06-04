import { type NextRequest, NextResponse } from 'next/server';
import { database, type Product } from '@/lib/database';

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

interface RouteParams {
  params: Promise<{
    handle: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { handle } = await params;
    const product = await database.getProductByHandle(handle);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const frontendProduct = convertDatabaseProduct(product);

    // Also get related products (same category, excluding current product)
    const relatedProducts = await database.searchProducts({
      category: product.category
    });
    
    const relatedFrontendProducts = relatedProducts
      .filter(p => p.id !== product.id)
      .slice(0, 4)
      .map(convertDatabaseProduct);

    return NextResponse.json({
      success: true,
      product: frontendProduct,
      relatedProducts: relatedFrontendProducts
    });
  } catch (error) {
    console.error('Error fetching product for frontend:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}