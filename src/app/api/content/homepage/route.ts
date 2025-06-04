import { NextResponse } from 'next/server';
import { getHomepageContent, updateHomepageContent } from '@/lib/content-api';

export async function GET() {
  try {
    const content = await getHomepageContent();
    if (!content) {
      return NextResponse.json(
        { error: 'Homepage content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: content,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Homepage content API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch homepage content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updatedContent = await updateHomepageContent(body);
    
    return NextResponse.json({
      success: true,
      data: updatedContent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Homepage content update error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update homepage content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Enable CORS for frontend requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}