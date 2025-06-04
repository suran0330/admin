import { type NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get('token');
  const slug = searchParams.get('slug');
  const type = searchParams.get('type');

  // Check for secret token
  if (!token || token !== process.env.SANITY_PREVIEW_SECRET) {
    return new NextResponse('Invalid token', { status: 401 });
  }

  // Enable draft mode
  draftMode().enable();

  // Determine redirect URL
  let redirectUrl = '/';

  if (type && slug) {
    switch (type) {
      case 'product':
        redirectUrl = `/products/${slug}`;
        break;
      case 'blogPost':
        redirectUrl = `/blog/${slug}`;
        break;
      case 'category':
        redirectUrl = `/categories/${slug}`;
        break;
    }
  }

  // Add preview parameter
  const url = new URL(redirectUrl, request.url);
  url.searchParams.set('preview', 'true');

  // Redirect to the preview URL
  return NextResponse.redirect(url);
}

export async function DELETE() {
  draftMode().disable();

  return NextResponse.json({
    message: 'Draft mode disabled',
    enabled: false,
    timestamp: new Date().toISOString(),
  });
}
