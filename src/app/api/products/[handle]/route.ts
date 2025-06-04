import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { database, CreateProductSchema } from '@/lib/database';

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

    return NextResponse.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { handle } = await params;
    const body = await request.json();
    
    // First, get the product to get its ID
    const existingProduct = await database.getProductByHandle(handle);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Validate update data with Zod (partial schema)
    const validatedData = CreateProductSchema.partial().parse(body);
    
    const updatedProduct = await database.updateProduct(existingProduct.id, validatedData);
    
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { handle } = await params;
    
    // First, get the product to get its ID
    const existingProduct = await database.getProductByHandle(handle);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    const deleted = await database.deleteProduct(existingProduct.id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}