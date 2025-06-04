// Content API - Local data implementation (without Sanity dependencies)

// Types for content
export interface HomepageContent {
  _id: string;
  title: string;
  metaDescription?: string;
  heroSection: {
    headline: string;
    subheadline: string;
    backgroundImage?: {
      asset: {
        url: string;
      };
      alt?: string;
    };
    ctaButton: {
      text: string;
      link: string;
    };
    overlay?: {
      enabled: boolean;
      opacity: number;
      color: { hex: string };
    };
  };
  featuredProductsSection: {
    enabled: boolean;
    title: string;
    subtitle?: string;
    productTags: string[];
    limit: number;
  };
  categoriesSection: {
    enabled: boolean;
    title: string;
    subtitle?: string;
    featuredCategories: string[];
  };
  testimonialsSection: {
    enabled: boolean;
    title: string;
    testimonials: Array<{
      name: string;
      text: string;
      rating: number;
      verified: boolean;
    }>;
  };
  seo: {
    title: string;
    description: string;
    ogImage?: {
      asset: {
        url: string;
      };
    };
  };
}

export interface Banner {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  link?: {
    text: string;
    url: string;
  };
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  targetPages: string[];
}

export interface GlobalContent {
  _id: string;
  siteTitle: string;
  siteDescription: string;
  logo?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  favicon?: {
    asset: {
      url: string;
    };
  };
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  contactInfo: {
    email: string;
    phone?: string;
    address?: string;
  };
  footerText: string;
  cookiePolicy?: {
    enabled: boolean;
    message: string;
    policyLink: string;
  };
}

// Mock data
const mockHomepageContent: HomepageContent = {
  _id: 'homepage-1',
  title: 'INKEY List Admin - Homepage',
  metaDescription: 'Discover effective skincare with INKEY List. Shop our range of affordable, high-quality products.',
  heroSection: {
    headline: 'Effective Skincare Made Simple',
    subheadline: 'Discover the power of simple, effective ingredients with our range of affordable skincare products.',
    backgroundImage: {
      asset: {
        url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=600&fit=crop'
      },
      alt: 'Skincare products'
    },
    ctaButton: {
      text: 'Shop Now',
      link: '/products'
    },
    overlay: {
      enabled: true,
      opacity: 0.4,
      color: { hex: '#000000' }
    }
  },
  featuredProductsSection: {
    enabled: true,
    title: 'Featured Products',
    subtitle: 'Our most popular and effective skincare solutions',
    productTags: ['bestseller', 'featured'],
    limit: 8
  },
  categoriesSection: {
    enabled: true,
    title: 'Shop by Category',
    subtitle: 'Find the right products for your skincare routine',
    featuredCategories: ['cleansers', 'serums', 'moisturizers', 'treatments']
  },
  testimonialsSection: {
    enabled: true,
    title: 'What Our Customers Say',
    testimonials: [
      {
        name: 'Sarah M.',
        text: 'The Niacinamide serum has completely transformed my skin. Highly recommend!',
        rating: 5,
        verified: true
      },
      {
        name: 'Emma L.',
        text: 'Great quality products at amazing prices. My go-to skincare brand now.',
        rating: 5,
        verified: true
      }
    ]
  },
  seo: {
    title: 'INKEY List - Effective Skincare Made Simple',
    description: 'Shop affordable, effective skincare products with simple ingredients. Transform your routine with INKEY List.',
    ogImage: {
      asset: {
        url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=630&fit=crop'
      }
    }
  }
};

const mockBanners: Banner[] = [
  {
    _id: 'banner-1',
    title: 'Free Shipping',
    message: 'Free shipping on orders over $25!',
    type: 'info',
    link: {
      text: 'Shop Now',
      url: '/products'
    },
    isActive: true,
    targetPages: ['homepage', 'products']
  }
];

const mockGlobalContent: GlobalContent = {
  _id: 'global-1',
  siteTitle: 'INKEY List',
  siteDescription: 'Effective skincare made simple',
  logo: {
    asset: {
      url: 'https://images.unsplash.com/photo-1618677366787-ca0f2d40bcc0?w=200&h=60&fit=crop'
    },
    alt: 'INKEY List Logo'
  },
  socialLinks: {
    instagram: 'https://instagram.com/theinkeylist',
    facebook: 'https://facebook.com/theinkeylist',
    twitter: 'https://twitter.com/theinkeylist'
  },
  contactInfo: {
    email: 'hello@theinkeylist.com',
    phone: '+1 (555) 123-4567'
  },
  footerText: '© 2024 INKEY List. All rights reserved.',
  cookiePolicy: {
    enabled: true,
    message: 'We use cookies to enhance your browsing experience.',
    policyLink: '/privacy-policy'
  }
};

// API Functions
export async function getHomepageContent(): Promise<HomepageContent> {
  // Return mock data instead of Sanity query
  return mockHomepageContent;
}

export async function getBanners(targetPage?: string): Promise<Banner[]> {
  // Filter banners by target page if specified
  if (targetPage) {
    return mockBanners.filter(banner => 
      banner.isActive && banner.targetPages.includes(targetPage)
    );
  }
  return mockBanners.filter(banner => banner.isActive);
}

export async function getGlobalContent(): Promise<GlobalContent> {
  return mockGlobalContent;
}

export async function updateHomepageContent(content: Partial<HomepageContent>): Promise<HomepageContent> {
  // In a real implementation, this would update the local data store
  // For now, just return the merged content
  return { ...mockHomepageContent, ...content };
}

export async function updateBanner(id: string, banner: Partial<Banner>): Promise<Banner> {
  // In a real implementation, this would update the local data store
  const existingBanner = mockBanners.find(b => b._id === id);
  if (!existingBanner) {
    throw new Error('Banner not found');
  }
  return { ...existingBanner, ...banner };
}

export async function updateGlobalContent(content: Partial<GlobalContent>): Promise<GlobalContent> {
  // In a real implementation, this would update the local data store
  return { ...mockGlobalContent, ...content };
}