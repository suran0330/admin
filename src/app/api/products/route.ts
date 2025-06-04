import { type NextRequest, NextResponse } from 'next/server';
import { adminSanityService } from '@/lib/sanity-products';

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

// GET - List all products from Sanity
export async function GET(request: NextRequest) {
  try {
    console.log('📥 GET /api/products - Fetching products from Sanity for admin...');
    const { searchParams } = new URL(request.url);

    // Extract filter parameters
    const filters = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      inStock: searchParams.get('inStock') ? searchParams.get('inStock') === 'true' : undefined,
      featured: searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined,
    };

    // Remove undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    );

    console.log('🔍 Applied filters:', cleanFilters);

    // Fetch products from Sanity
    const sanityProducts = await adminSanityService.getProducts(cleanFilters);

    // Convert to admin format for compatibility
    const products = sanityProducts.map(product => adminSanityService.convertToAdminFormat(product));

    console.log(`✅ Returning ${products.length} products from Sanity for admin`);

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
      source: 'sanity',
      timestamp: new Date().toISOString()
    }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('❌ Error fetching products from Sanity:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products from Sanity',
      details: errorMessage,
      source: 'sanity',
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// POST - Create new product in Sanity
export async function POST(request: NextRequest) {
  try {
    console.log('📥 POST /api/products - Creating new product in Sanity...');

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in request body',
        timestamp: new Date().toISOString()
      }, {
        status: 400,
        headers: corsHeaders,
      });
    }

    console.log('📋 Product data received:', {
      name: body.name || body.title,
      price: body.price,
      category: body.category
    });

    // Convert admin format to Sanity format
    const productData = {
      name: body.name || body.title || 'Untitled Product',
      slug: {
        current: body.handle || adminSanityService.generateSlug(body.name || body.title || 'untitled')
      },
      description: body.description || 'No description provided',
      price: typeof body.price === 'number' ? body.price : 0,
      inStock: typeof body.inStock === 'boolean' ? body.inStock : true,
      featured: typeof body.featured === 'boolean' ? body.featured : false,
      skinConcerns: Array.isArray(body.skinConcerns) ? body.skinConcerns : [],
      ingredients: Array.isArray(body.ingredients) ? body.ingredients : [],
      benefits: Array.isArray(body.benefits) ? body.benefits : [],
      howToUse: body.howToUse || '',
    };

    console.log('💾 Creating product in Sanity...');
    const sanityProduct = await adminSanityService.createProduct(productData);

    // Convert back to admin format
    const product = adminSanityService.convertToAdminFormat(sanityProduct);

    console.log('✅ Product created successfully in Sanity:', {
      id: product.id,
      title: product.title,
      handle: product.handle
    });

    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully in Sanity',
      source: 'sanity',
      timestamp: new Date().toISOString()
    }, {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('❌ Error creating product in Sanity:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({
      success: false,
      error: 'Failed to create product in Sanity',
      details: errorMessage,
      source: 'sanity',
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// PUT - Update existing product in Sanity
export async function PUT(request: NextRequest) {
  try {
    console.log('📥 PUT /api/products - Updating product in Sanity...');

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

    // Convert admin format updates to Sanity format
    const sanityUpdates: any = {};
    if (updates.name || updates.title) {
      sanityUpdates.name = updates.name || updates.title;
    }
    if (updates.description) {
      sanityUpdates.description = updates.description;
    }
    if (updates.price !== undefined) {
      sanityUpdates.price = updates.price;
    }
    if (updates.inStock !== undefined) {
      sanityUpdates.inStock = updates.inStock;
    }
    if (updates.featured !== undefined) {
      sanityUpdates.featured = updates.featured;
    }
    if (updates.skinConcerns) {
      sanityUpdates.skinConcerns = updates.skinConcerns;
    }
    if (updates.ingredients) {
      sanityUpdates.ingredients = updates.ingredients;
    }
    if (updates.benefits) {
      sanityUpdates.benefits = updates.benefits;
    }
    if (updates.howToUse) {
      sanityUpdates.howToUse = updates.howToUse;
    }
    if (updates.handle) {
      sanityUpdates.slug = { current: updates.handle };
    }

    console.log('💾 Updating product in Sanity...');
    const updatedSanityProduct = await adminSanityService.updateProduct(id, sanityUpdates);

    // Convert back to admin format
    const updatedProduct = adminSanityService.convertToAdminFormat(updatedSanityProduct);

    console.log('✅ Product updated successfully in Sanity:', id);

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully in Sanity',
      source: 'sanity',
      timestamp: new Date().toISOString()
    }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('❌ Error updating product in Sanity:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({
      success: false,
      error: 'Failed to update product in Sanity',
      details: errorMessage,
      source: 'sanity',
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// DELETE - Remove product from Sanity
export async function DELETE(request: NextRequest) {
  try {
    console.log('📥 DELETE /api/products - Deleting product from Sanity...');

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

    console.log('🗑️ Deleting product from Sanity:', id);
    await adminSanityService.deleteProduct(id);

    console.log('✅ Product deleted successfully from Sanity:', id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully from Sanity',
      source: 'sanity',
      timestamp: new Date().toISOString()
    }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('❌ Error deleting product from Sanity:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({
      success: false,
      error: 'Failed to delete product from Sanity',
      details: errorMessage,
      source: 'sanity',
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}
