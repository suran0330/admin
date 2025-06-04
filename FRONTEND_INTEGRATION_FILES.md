# 📁 Frontend Repository Integration Files
## Files to create in inkey-list-clone2 repository

## 🔧 Configuration Files

### 1. Environment Variables (`.env.local`)
```bash
# Shopify Storefront (Read-Only)
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-shop.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token

# Sanity CMS (Content Management)
NEXT_PUBLIC_SANITY_PROJECT_ID=zqetc89y
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-sanity-token

# Admin Dashboard Connection
NEXT_PUBLIC_ADMIN_API_URL=https://inkey-admin.vercel.app/api/frontend

# Preview and Visual Editing
SANITY_PREVIEW_SECRET=your-preview-secret
SANITY_WEBHOOK_SECRET=your-webhook-secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://inkeylist.com
```

### 2. Vercel Configuration (`vercel.json`)
```json
{
  "name": "inkey-list-frontend",
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "NEXT_PUBLIC_SHOPIFY_DOMAIN": "your-shop.myshopify.com",
    "NEXT_PUBLIC_SANITY_PROJECT_ID": "zqetc89y",
    "NEXT_PUBLIC_SANITY_DATASET": "production",
    "NEXT_PUBLIC_ADMIN_API_URL": "https://inkey-admin.vercel.app/api/frontend"
  },
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "rewrites": [
    {
      "source": "/studio/:path*",
      "destination": "https://inkey-list-studio.sanity.studio/:path*"
    }
  ]
}
```

## 📚 API Integration Files

### 1. Admin API Client (`lib/admin-api.ts`)
```typescript
// Connect to your deployed admin dashboard
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001/api/frontend';

export interface AdminProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: {
    id: string;
    name: string;
    handle: string;
  };
  tags: string[];
  ingredients?: Array<{
    name: string;
    percentage: string;
    benefit: string;
  }>;
  skinTypes: string[];
  howToUse?: string;
  variants: Array<{
    id: string;
    title: string;
    price: number;
    inventory: number;
    available: boolean;
    shopifyVariantId: string;
  }>;
  available: boolean;
  featured: boolean;
  shopifyProductId: string;
  shopifyHandle: string;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  reviews?: {
    average: number;
    count: number;
  };
}

export async function getProductsFromAdmin(params?: {
  limit?: number;
  category?: string;
  featured?: boolean;
  handles?: string[];
}): Promise<{ products: AdminProduct[]; total: number }> {
  try {
    const searchParams = new URLSearchParams();

    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.category) searchParams.set('category', params.category);
    if (params?.featured) searchParams.set('featured', 'true');
    if (params?.handles) searchParams.set('handles', params.handles.join(','));

    const response = await fetch(`${ADMIN_API_URL}/products?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error(`Admin API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch products');
    }

    return {
      products: data.products,
      total: data.total
    };
  } catch (error) {
    console.error('Error fetching products from admin:', error);
    return { products: [], total: 0 };
  }
}

export async function getProductFromAdmin(handle: string): Promise<AdminProduct | null> {
  try {
    const response = await fetch(`${ADMIN_API_URL}/products/${handle}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Admin API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch product');
    }

    return data.product;
  } catch (error) {
    console.error('Error fetching product from admin:', error);
    return null;
  }
}

export async function getFeaturedProducts(): Promise<AdminProduct[]> {
  const { products } = await getProductsFromAdmin({ featured: true });
  return products;
}

export async function getProductsByCategory(category: string): Promise<AdminProduct[]> {
  const { products } = await getProductsFromAdmin({ category });
  return products;
}
```

### 2. Sanity Client (`lib/sanity.ts`)
```typescript
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);
export function urlFor(source: any) {
  return builder.image(source);
}

// Fetch homepage content
export async function getHomepageContent() {
  try {
    const query = `*[_type == "homepage"][0]{
      title,
      metaDescription,
      heroSection{
        headline,
        subheadline,
        backgroundImage{
          asset->{
            url
          },
          alt
        },
        ctaButton,
        overlay
      },
      featuredProductsSection{
        enabled,
        title,
        subtitle,
        productIds,
        layout,
        backgroundColor
      },
      contentSections[]{
        _type,
        _key,
        title,
        subtitle,
        content,
        image{
          asset->{
            url
          },
          alt
        },
        layout,
        backgroundColor,
        textColor,
        ctaButton
      },
      seo{
        openGraphImage{
          asset->{
            url
          }
        },
        twitterCard
      }
    }`;

    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return null;
  }
}

// Fetch global content (navigation, footer, etc.)
export async function getGlobalContent() {
  try {
    const query = `*[_type == "globalContent"][0]{
      navigation{
        logo{
          asset->{
            url
          },
          alt
        },
        menuItems[]{
          title,
          link,
          hasDropdown,
          dropdownItems[]{
            title,
            link,
            categoryId
          }
        }
      },
      announcementBar,
      footer{
        logo{
          asset->{
            url
          }
        },
        description,
        sections[]{
          title,
          links[]{
            title,
            url
          }
        },
        socialMedia,
        newsletter,
        copyrightText
      },
      contactInfo,
      seoDefaults,
      brandSettings
    }`;

    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching global content:', error);
    return null;
  }
}

// Fetch active banners
export async function getActiveBanners(pageUrl: string = '/') {
  try {
    const query = `*[_type == "banner" && displaySettings.active == true] | order(displaySettings.priority desc){
      _id,
      title,
      bannerType,
      displaySettings,
      content{
        headline,
        subtext,
        ctaButton,
        backgroundImage{
          asset->{
            url
          },
          alt
        }
      },
      styling,
      behaviorSettings,
      targeting
    }`;

    const banners = await sanityClient.fetch(query);

    // Filter banners based on page targeting
    return banners.filter((banner: any) => {
      const { showOnPages, specificPages } = banner.displaySettings;

      switch (showOnPages) {
        case 'all':
          return true;
        case 'homepage':
          return pageUrl === '/' || pageUrl === '';
        case 'products':
          return pageUrl.startsWith('/products');
        case 'specific':
          return specificPages?.includes(pageUrl) || false;
        default:
          return false;
      }
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
}
```

### 3. Shopify Client (`lib/shopify.ts`)
```typescript
// For checkout functionality only
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        available: boolean;
      };
    }>;
  };
}

async function shopifyFetch(query: string, variables = {}) {
  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

export async function createCheckout(lineItems: Array<{
  variantId: string;
  quantity: number;
}>) {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems,
    },
  };

  const data = await shopifyFetch(query, variables);
  return data.checkoutCreate.checkout;
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        handle
        title
        description
        variants(first: 1) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              available
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch(query, { handle });
  return data.productByHandle;
}
```

## 🎨 Component Files

### 1. Visual Editing Component (`components/VisualEditing.tsx`)
```typescript
"use client";

import { useEffect } from 'react';

export default function VisualEditing() {
  useEffect(() => {
    // Only enable in development or when preview=true
    const isPreview = new URLSearchParams(window.location.search).has('preview');

    if (process.env.NODE_ENV === 'development' || isPreview) {
      import('@sanity/visual-editing').then(({ enableOverlays }) => {
        enableOverlays({
          zIndex: 999999,
        });
      });
    }
  }, []);

  return null;
}
```

### 2. Homepage Component (`app/page.tsx`)
```typescript
import { getHomepageContent, getActiveBanners } from '@/lib/sanity';
import { getProductsFromAdmin } from '@/lib/admin-api';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import ContentSections from '@/components/ContentSections';
import BannerDisplay from '@/components/BannerDisplay';

export default async function HomePage() {
  // Fetch content from Sanity
  const content = await getHomepageContent();
  const banners = await getActiveBanners('/');

  // Get featured product handles from Sanity content
  const productHandles = content?.featuredProductsSection?.productIds || [];

  // Fetch featured products from admin API
  const { products: featuredProducts } = await getProductsFromAdmin({
    handles: productHandles,
    limit: 6
  });

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      {/* Active Banners */}
      <BannerDisplay banners={banners} />

      {/* Hero Section */}
      <HeroSection content={content.heroSection} />

      {/* Featured Products */}
      {content.featuredProductsSection?.enabled && (
        <FeaturedProducts
          title={content.featuredProductsSection.title}
          subtitle={content.featuredProductsSection.subtitle}
          products={featuredProducts}
          layout={content.featuredProductsSection.layout}
        />
      )}

      {/* Content Sections */}
      <ContentSections sections={content.contentSections} />
    </main>
  );
}

// Enable ISR
export const revalidate = 60;
```

### 3. Product Page Component (`app/products/[handle]/page.tsx`)
```typescript
import { getProductFromAdmin } from '@/lib/admin-api';
import { getProductByHandle } from '@/lib/shopify';
import ProductDisplay from '@/components/ProductDisplay';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: {
    handle: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = params;

  // Get product data from admin
  const adminProduct = await getProductFromAdmin(handle);

  if (!adminProduct) {
    notFound();
  }

  // Get Shopify data for checkout
  const shopifyProduct = await getProductByHandle(adminProduct.shopifyHandle);

  return (
    <main>
      <ProductDisplay
        product={adminProduct}
        shopifyProduct={shopifyProduct}
      />
    </main>
  );
}

export async function generateStaticParams() {
  // Get all product handles from admin
  const { products } = await getProductsFromAdmin({ limit: 100 });

  return products.map((product) => ({
    handle: product.handle,
  }));
}

export const revalidate = 300; // 5 minutes
```

### 4. Layout with Visual Editing (`app/layout.tsx`)
```typescript
import { Inter } from 'next/font/google';
import { getGlobalContent } from '@/lib/sanity';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VisualEditing from '@/components/VisualEditing';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalContent = await getGlobalContent();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation content={globalContent?.navigation} />
        {children}
        <Footer content={globalContent?.footer} />
        <VisualEditing />
      </body>
    </html>
  );
}
```

## 🔄 API Routes for Frontend

### 1. Sanity Webhook Handler (`app/api/sanity/webhook/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { _type, slug } = body;

    // Revalidate based on content type
    switch (_type) {
      case 'homepage':
        revalidatePath('/');
        break;
      case 'globalContent':
        revalidateTag('global');
        break;
      case 'banner':
        revalidateTag('banners');
        break;
      case 'page':
        if (slug?.current) {
          revalidatePath(`/${slug.current}`);
        }
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
```

### 2. Preview Mode Handler (`app/api/preview/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug') || '/';

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new NextResponse('Invalid secret', { status: 401 });
  }

  draftMode().enable();
  redirect(`${slug}?preview=true`);
}
```

## 📦 Package.json Dependencies

Add these to your frontend `package.json`:

```json
{
  "dependencies": {
    "@sanity/client": "^6.0.0",
    "@sanity/image-url": "^1.0.0",
    "@sanity/visual-editing": "^1.0.0",
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

## 🚀 Deployment Checklist

1. **Create these files** in your `inkey-list-clone2` repository
2. **Set environment variables** in Vercel dashboard
3. **Deploy to Vercel** and verify integration
4. **Test content editing** in Sanity Studio
5. **Verify products load** from admin API
6. **Test checkout flow** with Shopify

Your frontend will now be fully integrated with both your admin dashboard and Sanity CMS! 🎉
