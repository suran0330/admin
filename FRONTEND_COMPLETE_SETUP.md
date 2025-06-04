# 🌐 Complete Frontend Repository Setup
## Files to create in `inkey-list-clone2` repository

## 📋 Environment Variables

Create `.env.local` in root of `inkey-list-clone2`:

```bash
# Shopify Integration (Live Store)
NEXT_PUBLIC_SHOPIFY_DOMAIN=evmxpp-pz.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=96b6920545b23376b888ff1cb002d5df

# Sanity CMS Integration
NEXT_PUBLIC_SANITY_PROJECT_ID=zqetc89y
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skOgdVyih7UfpZxrm0PmeVhkFbzM2trJ4xzVxl6wdi4w0R3L7o6AtivkClLocFAyHUXS3yNDOauW8zHS17FrSjpWpe84xgfAQx8F5IJZVVB2hiD2ONi7nVOM7YKZoriggYg4v35wzgjtKI2MBHg75HWW6ADnoq4SIhwb3RNmHSumh9wB1Lgf

# Admin Dashboard Connection
NEXT_PUBLIC_ADMIN_API_URL=https://inkey-admin.vercel.app/api/frontend

# Visual Editing & Webhooks
SANITY_PREVIEW_SECRET=inkey-preview-secret-2024
SANITY_WEBHOOK_SECRET=inkey-webhook-secret-2024

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://inkeylist.com
```

## 📁 Required Files

### 1. Shopify Integration (`lib/shopify.ts`)

```typescript
// Shopify Storefront API Client
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
      };
    }>;
  };
  tags: string[];
  availableForSale: boolean;
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

export async function getShopifyProducts(): Promise<ShopifyProduct[]> {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            handle
            title
            description
            featuredImage {
              url
              altText
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
            tags
            availableForSale
          }
        }
      }
    }
  `;

  const data = await shopifyFetch(query, { first: 50 });
  return data.products.edges.map((edge: any) => edge.node);
}

export async function getShopifyProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        handle
        title
        description
        featuredImage {
          url
          altText
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
        tags
        availableForSale
      }
    }
  `;

  const data = await shopifyFetch(query, { handle });
  return data.productByHandle;
}

export async function createShopifyCheckout(lineItems: Array<{
  variantId: string;
  quantity: number;
}>) {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          totalPrice {
            amount
            currencyCode
          }
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch(query, {
    input: { lineItems }
  });

  if (data.checkoutCreate.checkoutUserErrors.length > 0) {
    throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
  }

  return data.checkoutCreate.checkout;
}

export function formatPrice(price: { amount: string; currencyCode: string }): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  });
  return formatter.format(parseFloat(price.amount));
}
```

### 2. Admin API Integration (`lib/admin-api.ts`)

```typescript
// Admin Dashboard API Client
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL!;

export interface AdminProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: {
    id: string;
    name: string;
    handle: string;
  };
  tags: string[];
  available: boolean;
  featured: boolean;
}

export async function getProductsFromAdmin(params?: {
  limit?: number;
  featured?: boolean;
  handles?: string[];
}): Promise<{ products: AdminProduct[]; total: number }> {
  try {
    const searchParams = new URLSearchParams();

    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.featured) searchParams.set('featured', 'true');
    if (params?.handles) searchParams.set('handles', params.handles.join(','));

    const response = await fetch(`${ADMIN_API_URL}/products?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error(`Admin API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      products: data.products || [],
      total: data.total || 0
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
      return null;
    }

    const data = await response.json();
    return data.success ? data.product : null;
  } catch (error) {
    console.error('Error fetching product from admin:', error);
    return null;
  }
}
```

### 3. Sanity Integration (`lib/sanity.ts`)

```typescript
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);
export function urlFor(source: any) {
  return builder.image(source);
}

export async function getHomepageContent() {
  try {
    const query = `*[_type == "homepage"][0]{
      title,
      heroSection{
        headline,
        subheadline,
        backgroundImage{
          asset->{
            url
          },
          alt
        },
        ctaButton
      },
      featuredProductsSection{
        enabled,
        title,
        productIds
      },
      contentSections[]{
        _type,
        _key,
        title,
        content,
        image{
          asset->{
            url
          },
          alt
        }
      }
    }`;

    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return null;
  }
}

export async function getActiveBanners(pageUrl = '/') {
  try {
    const query = `*[_type == "banner" && displaySettings.active == true]{
      _id,
      content{
        headline,
        subtext,
        ctaButton
      },
      styling,
      displaySettings
    }`;

    const banners = await sanityClient.fetch(query);

    return banners.filter((banner: any) => {
      const { showOnPages } = banner.displaySettings;
      return showOnPages === 'all' ||
             (showOnPages === 'homepage' && pageUrl === '/') ||
             (showOnPages === 'products' && pageUrl.startsWith('/products'));
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
}
```

### 4. Visual Editing Component (`components/VisualEditing.tsx`)

```typescript
"use client";

import { useEffect } from 'react';

export default function VisualEditing() {
  useEffect(() => {
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

### 5. Homepage Component (`app/page.tsx`)

```typescript
import { getHomepageContent, getActiveBanners } from '@/lib/sanity';
import { getProductsFromAdmin } from '@/lib/admin-api';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import BannerDisplay from '@/components/BannerDisplay';

export default async function HomePage() {
  // Get content from Sanity
  const [content, banners] = await Promise.all([
    getHomepageContent(),
    getActiveBanners('/')
  ]);

  // Get featured products
  const { products: featuredProducts } = await getProductsFromAdmin({
    featured: true,
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
          products={featuredProducts}
        />
      )}
    </main>
  );
}

export const revalidate = 60;
```

### 6. Product Page (`app/products/[handle]/page.tsx`)

```typescript
import { getShopifyProduct } from '@/lib/shopify';
import { getProductFromAdmin } from '@/lib/admin-api';
import ProductDisplay from '@/components/ProductDisplay';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: {
    handle: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = params;

  // Get product from both sources
  const [shopifyProduct, adminProduct] = await Promise.all([
    getShopifyProduct(handle),
    getProductFromAdmin(handle)
  ]);

  if (!shopifyProduct && !adminProduct) {
    notFound();
  }

  return (
    <main>
      <ProductDisplay
        shopifyProduct={shopifyProduct}
        adminProduct={adminProduct}
      />
    </main>
  );
}

export async function generateStaticParams() {
  const { products } = await getProductsFromAdmin({ limit: 100 });

  return products.map((product) => ({
    handle: product.handle,
  }));
}

export const revalidate = 300;
```

### 7. Layout with Visual Editing (`app/layout.tsx`)

```typescript
import { Inter } from 'next/font/google';
import VisualEditing from '@/components/VisualEditing';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'INKEY List - Science-Backed Skincare',
  description: 'Effective ingredients. Honest prices. Real results.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <VisualEditing />
      </body>
    </html>
  );
}
```

### 8. API Routes

#### Webhook Handler (`app/api/sanity/webhook/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { _type } = body;

    switch (_type) {
      case 'homepage':
        revalidatePath('/');
        break;
      case 'banner':
        revalidatePath('/');
        break;
      default:
        revalidatePath('/');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
```

#### Preview Handler (`app/api/preview/route.ts`)
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

## 📦 Package Dependencies

Add to your `package.json`:

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

## 🚀 Deployment Configuration

### Vercel Configuration (`vercel.json`)

```json
{
  "name": "inkey-list-frontend",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "env": {
    "NEXT_PUBLIC_SHOPIFY_DOMAIN": "evmxpp-pz.myshopify.com",
    "NEXT_PUBLIC_SANITY_PROJECT_ID": "zqetc89y",
    "NEXT_PUBLIC_SANITY_DATASET": "production"
  },
  "rewrites": [
    {
      "source": "/studio/:path*",
      "destination": "https://inkey-list-studio.sanity.studio/:path*"
    }
  ]
}
```

## ✅ Setup Checklist

1. **Create all files above** in your `inkey-list-clone2` repository
2. **Add environment variables** to `.env.local`
3. **Install dependencies** with `npm install`
4. **Test locally** with `npm run dev`
5. **Deploy to Vercel**
6. **Configure environment variables** in Vercel dashboard
7. **Test live integration**

## 🧪 Testing Integration

After setup, test these flows:

1. **Homepage**: Visit `/` → Should show Sanity content + featured products
2. **Products**: Visit `/products/[handle]` → Should show live Shopify product
3. **Visual Editing**: Add `?preview=true` → Should enable click-to-edit
4. **Checkout**: Add to cart → Should redirect to Shopify checkout

Your frontend will now be fully integrated with both Shopify and Sanity! 🎉
