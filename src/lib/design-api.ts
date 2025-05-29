// Design Management API for controlling website appearance and layouts

export interface DesignTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface LayoutSection {
  id: string;
  name: string;
  type: 'hero' | 'product-grid' | 'banner' | 'testimonials' | 'content-block' | 'before-after' | 'featured-products';
  position: number;
  visible: boolean;
  settings: Record<string, unknown>;
  customCSS?: string;
}

export interface PageLayout {
  id: string;
  page: 'homepage' | 'shop' | 'product-detail' | 'cart' | 'checkout';
  sections: LayoutSection[];
  globalSettings: {
    maxWidth: string;
    padding: string;
    backgroundColor: string;
  };
}

export interface ComponentSettings {
  id: string;
  component: string;
  props: Record<string, unknown>;
  styling: {
    className: string;
    customCSS: string;
  };
  responsive: {
    mobile: Record<string, unknown>;
    tablet: Record<string, unknown>;
    desktop: Record<string, unknown>;
  };
}

export interface VisualAsset {
  id: string;
  name: string;
  type: 'image' | 'icon' | 'logo' | 'banner';
  url: string;
  alt: string;
  usage: string[];
  dimensions: {
    width: number;
    height: number;
  };
}

// Design Management API Class
class DesignAPI {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_MAIN_STORE_URL || '') {
    this.baseUrl = baseUrl;
  }

  // Theme Management
  async getThemes(): Promise<DesignTheme[]> {
    return mockThemes;
  }

  async getActiveTheme(): Promise<DesignTheme> {
    return mockThemes[0]; // Default theme
  }

  async updateTheme(themeId: string, updates: Partial<DesignTheme>): Promise<DesignTheme> {
    const theme = mockThemes.find(t => t.id === themeId);
    if (!theme) throw new Error('Theme not found');
    return { ...theme, ...updates };
  }

  async createTheme(theme: Omit<DesignTheme, 'id'>): Promise<DesignTheme> {
    const newTheme: DesignTheme = {
      ...theme,
      id: `theme-${Date.now()}`
    };
    return newTheme;
  }

  // Layout Management
  async getPageLayouts(): Promise<PageLayout[]> {
    return mockPageLayouts;
  }

  async getPageLayout(page: string): Promise<PageLayout | null> {
    return mockPageLayouts.find(layout => layout.page === page) || null;
  }

  async updatePageLayout(page: string, layout: Partial<PageLayout>): Promise<PageLayout> {
    const existingLayout = mockPageLayouts.find(l => l.page === page);
    if (!existingLayout) throw new Error('Layout not found');
    return { ...existingLayout, ...layout };
  }

  async reorderSections(page: string, sectionIds: string[]): Promise<PageLayout> {
    const layout = await this.getPageLayout(page);
    if (!layout) throw new Error('Layout not found');

    const reorderedSections = sectionIds.map((id, index) => {
      const section = layout.sections.find(s => s.id === id);
      if (!section) throw new Error(`Section ${id} not found`);
      return { ...section, position: index };
    });

    return { ...layout, sections: reorderedSections };
  }

  // Section Management
  async updateSection(sectionId: string, updates: Partial<LayoutSection>): Promise<LayoutSection> {
    // Find section across all layouts
    for (const layout of mockPageLayouts) {
      const section = layout.sections.find(s => s.id === sectionId);
      if (section) {
        return { ...section, ...updates };
      }
    }
    throw new Error('Section not found');
  }

  async addSection(page: string, section: Omit<LayoutSection, 'id' | 'position'>): Promise<LayoutSection> {
    const layout = await this.getPageLayout(page);
    if (!layout) throw new Error('Layout not found');

    const newSection: LayoutSection = {
      ...section,
      id: `section-${Date.now()}`,
      position: layout.sections.length
    };

    return newSection;
  }

  async deleteSection(sectionId: string): Promise<boolean> {
    return true; // Mock implementation
  }

  // Component Management
  async getComponentSettings(): Promise<ComponentSettings[]> {
    return mockComponentSettings;
  }

  async updateComponentSettings(componentId: string, settings: Partial<ComponentSettings>): Promise<ComponentSettings> {
    const component = mockComponentSettings.find(c => c.id === componentId);
    if (!component) throw new Error('Component not found');
    return { ...component, ...settings };
  }

  // Asset Management
  async getVisualAssets(): Promise<VisualAsset[]> {
    return mockVisualAssets;
  }

  async uploadAsset(file: File, type: VisualAsset['type']): Promise<VisualAsset> {
    // Mock file upload
    const newAsset: VisualAsset = {
      id: `asset-${Date.now()}`,
      name: file.name,
      type,
      url: URL.createObjectURL(file),
      alt: file.name,
      usage: [],
      dimensions: { width: 800, height: 600 }
    };
    return newAsset;
  }

  async updateAsset(assetId: string, updates: Partial<VisualAsset>): Promise<VisualAsset> {
    const asset = mockVisualAssets.find(a => a.id === assetId);
    if (!asset) throw new Error('Asset not found');
    return { ...asset, ...updates };
  }

  // CSS Generation
  async generateCSS(theme: DesignTheme): Promise<string> {
    return `
      :root {
        --color-primary: ${theme.colors.primary};
        --color-secondary: ${theme.colors.secondary};
        --color-accent: ${theme.colors.accent};
        --color-background: ${theme.colors.background};
        --color-text: ${theme.colors.text};
        --color-muted: ${theme.colors.muted};

        --font-heading: ${theme.fonts.heading};
        --font-body: ${theme.fonts.body};
        --font-accent: ${theme.fonts.accent};

        --spacing-xs: ${theme.spacing.xs};
        --spacing-sm: ${theme.spacing.sm};
        --spacing-md: ${theme.spacing.md};
        --spacing-lg: ${theme.spacing.lg};
        --spacing-xl: ${theme.spacing.xl};

        --border-radius-sm: ${theme.borderRadius.sm};
        --border-radius-md: ${theme.borderRadius.md};
        --border-radius-lg: ${theme.borderRadius.lg};
      }
    `;
  }

  // Preview Management
  async previewChanges(changes: Record<string, unknown>): Promise<string> {
    // Generate preview URL with changes
    return `${this.baseUrl}/preview?changes=${encodeURIComponent(JSON.stringify(changes))}`;
  }

  async publishChanges(changes: Record<string, unknown>): Promise<boolean> {
    // Publish changes to live site
    console.log('Publishing changes:', changes);
    return true;
  }
}

// Mock Data
const mockThemes: DesignTheme[] = [
  {
    id: 'inkey-default',
    name: 'INKEY Default',
    colors: {
      primary: '#000000',
      secondary: '#746cad',
      accent: '#efeff0',
      background: '#ffffff',
      text: '#1c1c22',
      muted: '#747474'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      accent: 'Lato, sans-serif'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '2rem',
      xl: '4rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem'
    }
  },
  {
    id: 'minimalist',
    name: 'Minimalist Clean',
    colors: {
      primary: '#2d3748',
      secondary: '#4a5568',
      accent: '#edf2f7',
      background: '#f7fafc',
      text: '#1a202c',
      muted: '#718096'
    },
    fonts: {
      heading: 'Source Sans Pro, sans-serif',
      body: 'Source Sans Pro, sans-serif',
      accent: 'Playfair Display, serif'
    },
    spacing: {
      xs: '0.125rem',
      sm: '0.375rem',
      md: '0.875rem',
      lg: '1.5rem',
      xl: '3rem'
    },
    borderRadius: {
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.75rem'
    }
  }
];

const mockPageLayouts: PageLayout[] = [
  {
    id: 'homepage-layout',
    page: 'homepage',
    sections: [
      {
        id: 'hero-section',
        name: 'Hero Section',
        type: 'hero',
        position: 0,
        visible: true,
        settings: {
          title: 'Affordable, effective skincare',
          subtitle: 'From The INKEY List',
          backgroundImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03',
          buttonText: 'Shop Now',
          buttonLink: '/shop'
        }
      },
      {
        id: 'product-grid-section',
        name: 'Product Grid',
        type: 'product-grid',
        position: 1,
        visible: true,
        settings: {
          title: 'Shop bestsellers',
          showFilters: true,
          columns: 4,
          maxProducts: 8
        }
      },
      {
        id: 'before-after-section',
        name: 'Before/After Results',
        type: 'before-after',
        position: 2,
        visible: true,
        settings: {
          title: 'INKEY delivers real results',
          gridColumns: 6,
          showReviews: true
        }
      }
    ],
    globalSettings: {
      maxWidth: '7xl',
      padding: '4',
      backgroundColor: '#ffffff'
    }
  }
];

const mockComponentSettings: ComponentSettings[] = [
  {
    id: 'product-card',
    component: 'ProductCard',
    props: {
      showRating: true,
      showQuickAdd: true,
      imageAspectRatio: 'square'
    },
    styling: {
      className: 'bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow',
      customCSS: '.product-card:hover { transform: translateY(-2px); }'
    },
    responsive: {
      mobile: { columns: 2 },
      tablet: { columns: 3 },
      desktop: { columns: 4 }
    }
  }
];

const mockVisualAssets: VisualAsset[] = [
  {
    id: 'hero-bg',
    name: 'Hero Background',
    type: 'banner',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03',
    alt: 'Skincare products background',
    usage: ['homepage-hero'],
    dimensions: { width: 1920, height: 1080 }
  },
  {
    id: 'logo-main',
    name: 'Main Logo',
    type: 'logo',
    url: '/logo.svg',
    alt: 'INKEY List Logo',
    usage: ['header', 'footer'],
    dimensions: { width: 200, height: 50 }
  }
];

// Export singleton instance
export const designAPI = new DesignAPI();

export default designAPI;
