import { type NextRequest, NextResponse } from 'next/server';
import { getBanners } from '@/lib/content-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const pageUrl = searchParams.get('page') || '/';
    const banners = await getBanners(pageUrl);
    
    return NextResponse.json({
      success: true,
      data: banners,
      page: pageUrl,
      count: banners.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Banners API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch banners',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

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