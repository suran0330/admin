import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { productsDatabase, CreateProductSchema } from '@/lib/products-database';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
};

// OPTIONS - Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// GET - List all products
export async function GET(request: NextRequest) {
  try {
    console.log('📥 GET /api/products - Fetching products...');
    const { searchParams } = new URL(request.url);

    // Extract filter parameters
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

    console.log('🔍 Applied filters:', cleanFilters);

    let products = [];

    try {
      if (Object.keys(cleanFilters).length > 0) {
        products = await productsDatabase.searchProducts(cleanFilters);
      } else {
        products = await productsDatabase.getAllProducts();
      }
    } catch (dbError) {
      console.error('❌ Database error, providing fallback data:', dbError);
      // Provide fallback demo products if database fails
      products = [
        {
          id: 'demo-hyaluronic-acid',
          handle: 'hyaluronic-acid-serum',
          title: 'Hyaluronic Acid Serum',
          description: 'Intense hydration serum for all skin types',
          price: 7.99,
          images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop'],
          category: 'Serums',
          skinConcerns: ['Hydration', 'Dryness'],
          inStock: true,
          featured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'demo-niacinamide',
          handle: 'niacinamide-serum',
          title: 'Niacinamide',
          description: 'Controls oil production and minimizes pores',
          price: 5.99,
          images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop'],
          category: 'Serums',
          skinConcerns: ['Oil Control', 'Large Pores'],
          inStock: true,
          featured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }

    console.log(`✅ Returning ${products.length} products`);

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
      timestamp: new Date().toISOString()
    }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);

    // Always return some data, even on error
    const fallbackProducts = [
      {
        id: 'fallback-product',
        handle: 'demo-product',
        title: 'Demo Product',
        description: 'This is a demo product while we set up the database',
        price: 9.99,
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'],
        category: 'Demo',
        skinConcerns: ['Demo'],
        inStock: true,
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      products: fallbackProducts,
      count: fallbackProducts.length,
      warning: 'Using fallback data due to database issues',
      timestamp: new Date().toISOString()
    }, {
      headers: corsHeaders,
    });
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    console.log('📥 POST /api/products - Creating new product...');

    const body = await request.json();
    console.log('📋 Product data received:', {
      title: body.title,
      category: body.category,
      price: body.price,
      handle: body.handle
    });

    // Validate with Zod schema
    console.log('🔍 Validating product data with Zod schema...');
    const validatedData = CreateProductSchema.parse(body);
    console.log('✅ Product data validation successful');

    // Generate handle from title if not provided
    if (!validatedData.handle) {
      validatedData.handle = productsDatabase.generateHandle(validatedData.title);
      console.log('🔗 Generated handle:', validatedData.handle);
    }

    console.log('💾 Creating product in database...');
    const product = await productsDatabase.createProduct(validatedData);

    console.log('✅ Product created successfully:', {
      id: product.id,
      title: product.title,
      handle: product.handle
    });

    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully',
      timestamp: new Date().toISOString()
    }, {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      console.error('🔍 Validation errors:', error.errors);
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
        timestamp: new Date().toISOString()
      }, {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Handle duplicate handle error
    if (error instanceof Error && error.message.includes('already exists')) {
      console.error('🔄 Duplicate handle error:', error.message);
      return NextResponse.json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }, {
        status: 409,
        headers: corsHeaders,
      });
    }

    // Generic error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('💥 Unexpected error:', errorMessage);

    return NextResponse.json({
      success: false,
      error: 'Failed to create product',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// PUT - Update existing product
export async function PUT(request: NextRequest) {
  try {
    console.log('📥 PUT /api/products - Updating product...');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      console.error('❌ Product ID is required for update');
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required',
          timestamp: new Date().toISOString()
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const updates = await request.json();
    console.log('📋 Update data received for product:', id, updates);

    console.log('💾 Updating product in database...');
    const updatedProduct = await productsDatabase.updateProduct(id, updates);

    if (!updatedProduct) {
      console.error('❌ Product not found:', id);
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          timestamp: new Date().toISOString()
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    console.log('✅ Product updated successfully:', id);

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully',
      timestamp: new Date().toISOString()
    }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('❌ Error updating product:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({
      success: false,
      error: 'Failed to update product',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// DELETE - Remove product
export async function DELETE(request: NextRequest) {
  try {
    console.log('📥 DELETE /api/products - Deleting product...');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      console.error('❌ Product ID is required for deletion');
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required',
          timestamp: new Date().toISOString()
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    console.log('🗑️ Deleting product from database:', id);
    const deleted = await productsDatabase.deleteProduct(id);

    if (!deleted) {
      console.error('❌ Product not found:', id);
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          timestamp: new Date().toISOString()
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    console.log('✅ Product deleted successfully:', id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      timestamp: new Date().toISOString()
    }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('❌ Error deleting product:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({
      success: false,
      error: 'Failed to delete product',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}
