# 🔗 Sanity + Shopify + Next.js Integration Guide

## 🎯 System Overview

Your content management system is now architected as follows:

- **Shopify**: Handles all product management, pricing, inventory, and checkout
- **Sanity CMS**: Manages visual content (homepage, banners, pages, blog)
- **Next.js Frontend**: Combines both data sources for the customer experience
- **Admin Dashboard**: Provides oversight and analytics

## 📋 Content Structure

### 🏠 Homepage Content (`homepage`)
- Hero section with headline, subheadline, background image
- Featured products section (references Shopify product handles)
- Flexible content sections (text+image, banners, newsletters)
- SEO settings and social media optimization

### 🌐 Global Content (`globalContent`)
- Navigation menu with dropdowns
- Announcement bars
- Footer content and social links
- Contact information
- SEO defaults and brand colors

### 📄 Content Pages (`page`)
- About, FAQ, Contact, Policy pages
- Rich text content with embedded images
- FAQ sections with expandable answers
- Contact forms with customizable fields
- Featured product sections

### 📝 Blog Posts (`blogPost`)
- Rich content with product links
- Author information and publishing
- Categories and tags
- Related products (Shopify handles)
- SEO optimization

### 📢 Banners (`banner`)
- Announcement bars, promotional banners
- Page targeting and scheduling
- Visual customization
- User behavior tracking

## 🔌 API Integration

### Content API Endpoints

Your admin dashboard now provides these API endpoints:

```typescript
// Homepage content
GET /api/content/homepage

// Global content (navigation, footer)
GET /api/content/global

// Active banners for a page
GET /api/content/banners?page=/products

// Blog posts
GET /api/content/blog
GET /api/content/blog/[slug]

// Content pages
GET /api/content/pages/[slug]

// Search content
GET /api/content/search?q=skincare
```

## 🏗️ Frontend Implementation

### 1. Homepage Implementation

```typescript
// pages/index.tsx or app/page.tsx
import { contentAPI } from '@/lib/content-api';
import { HomepageContent } from '@/lib/content-api';

interface HomePageProps {
  content: HomepageContent;
  featuredProducts: ShopifyProduct[];
}

export default function HomePage({ content, featuredProducts }: HomePageProps) {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        headline={content.heroSection.headline}
        subheadline={content.heroSection.subheadline}
        backgroundImage={content.heroSection.backgroundImage?.asset.url}
        ctaButton={content.heroSection.ctaButton}
      />

      {/* Featured Products */}
      {content.featuredProductsSection.enabled && (
        <FeaturedProductsSection
          title={content.featuredProductsSection.title}
          products={featuredProducts}
          layout={content.featuredProductsSection.layout}
        />
      )}

      {/* Dynamic Content Sections */}
      {content.contentSections.map((section) => (
        <ContentSection key={section._key} section={section} />
      ))}
    </div>
  );
}

export async function getStaticProps() {
  // Get Sanity content
  const content = await contentAPI.getHomepageContent();

  // Get featured products from Shopify
  const productHandles = content?.featuredProductsSection.productHandles || [];
  const featuredProducts = await Promise.all(
    productHandles.map(handle => shopifyAPI.getProductByHandle(handle))
  );

  return {
    props: {
      content,
      featuredProducts: featuredProducts.filter(Boolean)
    },
    revalidate: 60 // ISR - revalidate every minute
  };
}
```

### 2. Product Pages with Content

```typescript
// pages/products/[slug].tsx
export default function ProductPage({ product, relatedContent }: ProductPageProps) {
  return (
    <div>
      {/* Product details from Shopify */}
      <ProductDetails product={product} />

      {/* Related blog posts from Sanity */}
      {relatedContent.blogPosts.length > 0 && (
        <RelatedContent posts={relatedContent.blogPosts} />
      )}

      {/* How-to-use content from Sanity */}
      {relatedContent.howToUse && (
        <HowToUseSection content={relatedContent.howToUse} />
      )}
    </div>
  );
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  // Get product from Shopify
  const product = await shopifyAPI.getProductByHandle(params.slug);

  // Get related content from Sanity
  const relatedContent = await contentAPI.searchContent(product.title);

  return {
    props: { product, relatedContent },
    revalidate: 300 // 5 minutes
  };
}
```

### 3. Dynamic Content Components

```typescript
// components/ContentSection.tsx
import { ContentSection } from '@/lib/content-api';

interface ContentSectionProps {
  section: ContentSection;
}

export function ContentSection({ section }: ContentSectionProps) {
  switch (section._type) {
    case 'textImageSection':
      return (
        <TextImageSection
          title={section.title}
          content={section.content}
          image={section.image}
          layout={section.layout}
        />
      );

    case 'bannerSection':
      return (
        <BannerSection
          title={section.title}
          subtitle={section.subtitle}
          backgroundImage={section.backgroundImage}
          ctaButton={section.ctaButton}
        />
      );

    case 'productCategorySection':
      return (
        <ProductCategorySection
          title={section.title}
          categoryId={section.categoryId}
          productsToShow={section.productsToShow}
          layout={section.layout}
        />
      );

    case 'newsletterSection':
      return (
        <NewsletterSection
          title={section.title}
          subtitle={section.subtitle}
          buttonText={section.buttonText}
        />
      );

    default:
      return null;
  }
}
```

### 4. Global Layout with Sanity Content

```typescript
// components/Layout.tsx
import { useEffect, useState } from 'react';
import { GlobalContent, Banner } from '@/lib/content-api';

interface LayoutProps {
  children: React.ReactNode;
  globalContent: GlobalContent;
}

export function Layout({ children, globalContent }: LayoutProps) {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    // Fetch banners for current page
    const fetchBanners = async () => {
      const response = await fetch(`/api/content/banners?page=${window.location.pathname}`);
      const data = await response.json();
      if (data.success) {
        setBanners(data.data);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div>
      {/* Announcement Bar */}
      {globalContent.announcementBar.enabled && (
        <AnnouncementBar content={globalContent.announcementBar} />
      )}

      {/* Active Banners */}
      {banners.map(banner => (
        <Banner key={banner._id} banner={banner} />
      ))}

      {/* Navigation */}
      <Navigation content={globalContent.navigation} />

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <Footer content={globalContent.footer} />
    </div>
  );
}
```

## 🔄 Real-time Updates

### Webhook Integration

Your system supports real-time content updates:

```typescript
// Webhook endpoint already configured at /api/sanity/webhook
// When content changes in Sanity Studio:
// 1. Webhook triggers
// 2. Next.js revalidates affected pages
// 3. CDN cache is purged
// 4. Users see updates within seconds
```

### Live Preview

For content editors:

```typescript
// Enable preview mode for content editors
// Add ?preview=true to any URL to see draft content
// Visual editing overlays appear for direct editing
```

## 🎨 Styling Integration

### Using Sanity Colors in Components

```typescript
// components/Section.tsx
interface SectionProps {
  backgroundColor?: { hex: string };
  textColor?: { hex: string };
  children: React.ReactNode;
}

export function Section({ backgroundColor, textColor, children }: SectionProps) {
  const styles = {
    backgroundColor: backgroundColor?.hex,
    color: textColor?.hex,
  };

  return (
    <div style={styles} className="py-16 px-4">
      {children}
    </div>
  );
}
```

### Brand Colors from Sanity

```typescript
// Use brand colors from global content
const brandColors = globalContent.brandSettings;

// Apply to Tailwind CSS classes
<div className="bg-brand-primary text-brand-secondary">
  {/* Content */}
</div>
```

## 📱 Product Integration Examples

### Featured Products on Homepage

```typescript
// Get product handles from Sanity
const productHandles = content.featuredProductsSection.productHandles;

// Fetch products from Shopify
const products = await Promise.all(
  productHandles.map(async (handle) => {
    const product = await shopifyAPI.getProductByHandle(handle);
    return product;
  })
);

// Render with layout from Sanity
<ProductGrid products={products} layout={content.featuredProductsSection.layout} />
```

### Blog Post Product Links

```typescript
// In blog post content, product links are automatically converted
// From: {productHandle: "hyaluronic-acid-serum"}
// To: <a href="/products/hyaluronic-acid-serum">Product Name</a>

// Custom serializer for rich text
const serializers = {
  marks: {
    productLink: ({ mark, children }) => {
      const product = getProductByHandle(mark.productHandle);
      return (
        <Link href={`/products/${mark.productHandle}`} className="product-link">
          {mark.text || product.title}
        </Link>
      );
    }
  }
};
```

## 🚀 Deployment Checklist

### 1. Environment Variables

```bash
# Required for Sanity integration
NEXT_PUBLIC_SANITY_PROJECT_ID=zqetc89y
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token

# Required for Shopify integration
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-shop.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-token

# Preview and webhook secrets
SANITY_PREVIEW_SECRET=your-preview-secret
SANITY_WEBHOOK_SECRET=your-webhook-secret
```

### 2. Sanity Studio Deployment

```bash
cd admin/sanity-studio
sanity deploy
# Choose hostname: inkey-list-studio
```

### 3. Configure Webhooks

1. Go to Sanity project settings
2. Add webhook: `https://your-site.vercel.app/api/sanity/webhook`
3. Enable for Create, Update, Delete events

### 4. Configure Preview URLs

In Sanity Studio:
- Homepage: `https://your-site.vercel.app/?preview=true`
- Products: `https://your-site.vercel.app/products/{slug}?preview=true`
- Blog: `https://your-site.vercel.app/blog/{slug}?preview=true`

## 📊 Content Management Workflow

### For Content Editors

1. **Login to Sanity Studio**: `https://inkey-list-studio.sanity.studio`
2. **Edit Homepage**: Update hero, featured products, content sections
3. **Manage Banners**: Create promotional banners with targeting
4. **Write Blog Posts**: Add content with product links
5. **Update Pages**: Modify about, FAQ, contact pages
6. **Global Settings**: Update navigation, footer, SEO

### For Developers

1. **Content API**: Use `contentAPI` to fetch Sanity content
2. **Product API**: Use `shopifyAPI` for product data
3. **Combine Data**: Merge content and products in getStaticProps
4. **Handle Updates**: Webhook automatically triggers revalidation
5. **Preview Mode**: Test changes before publishing

## 🎯 Best Practices

### Performance

- Use ISR (Incremental Static Regeneration) for content pages
- Cache Shopify product data with appropriate TTL
- Optimize images through Sanity's image processing
- Implement lazy loading for below-fold content

### SEO

- Use Sanity SEO fields for meta tags
- Generate structured data from product and blog content
- Implement proper heading hierarchy
- Use alt text from Sanity for images

### Content Strategy

- Reference Shopify products by handle (not ID) for stability
- Use content sections for maximum flexibility
- Keep global content separate from page-specific content
- Plan banner campaigns with proper targeting

Your system is now ready for production! Content editors can manage the visual experience while Shopify handles the commerce functionality seamlessly.
