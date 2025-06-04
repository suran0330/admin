import { type NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET() {
  try {
    const skinConcerns = await database.getAllSkinConcerns();

    return NextResponse.json({
      success: true,
      skinConcerns
    });
  } catch (error) {
    console.error('Error fetching skin concerns:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skin concerns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    // Generate handle if not provided
    if (!body.handle) {
      body.handle = database.generateHandle(body.name);
    }

    const skinConcern = await database.createSkinConcern(body);

    return NextResponse.json({
      success: true,
      skinConcern
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating skin concern:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create skin concern' },
      { status: 500 }
    );
  }
}