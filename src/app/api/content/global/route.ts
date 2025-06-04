import { NextResponse } from 'next/server';
import { getGlobalContent, updateGlobalContent } from '@/lib/content-api';

export async function GET() {
  try {
    const content = await getGlobalContent();
    if (!content) {
      return NextResponse.json(
        { error: 'Global content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: content,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Global content API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch global content',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updatedContent = await updateGlobalContent(body);
    
    return NextResponse.json({
      success: true,
      data: updatedContent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Global content update error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update global content',
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