// Navigation and Routing System for Admin Dashboard
// Similar to Amazon's storefront navigation patterns

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon?: any;
  badge?: string;
  children?: NavigationItem[];
  permission?: {
    resource: string;
    action: string;
  };
  external?: boolean;
  target?: '_blank' | '_self';
}

export interface BreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}

// Admin route patterns
export const ADMIN_ROUTES = {
  // Dashboard
  dashboard: '/',

  // Products
  products: {
    list: '/products',
    create: '/products/new',
    edit: (id: string) => `/products/${id}/edit`,
    view: (id: string) => `/products/${id}`,
    duplicate: (id: string) => `/products/${id}/duplicate`,
    variants: (id: string) => `/products/${id}/variants`,
    inventory: (id: string) => `/products/${id}/inventory`,
    seo: (id: string) => `/products/${id}/seo`,
    media: (id: string) => `/products/${id}/media`,
  },

  // Design & Themes
  design: {
    overview: '/design',
    themes: {
      list: '/design/themes',
      editor: (themeId?: string) => themeId ? `/design/themes/${themeId}/editor` : '/design/themes/editor',
      customize: (themeId: string) => `/design/themes/${themeId}/customize`,
      settings: (themeId: string) => `/design/themes/${themeId}/settings`,
      preview: (themeId: string) => `/design/themes/${themeId}/preview`,
    },
    layouts: {
      list: '/design/layouts',
      editor: (layoutId?: string) => layoutId ? `/design/layouts/${layoutId}/editor` : '/design/layouts/editor',
      sections: '/design/layouts/sections',
    },
    assets: {
      list: '/design/assets',
      upload: '/design/assets/upload',
      library: '/design/assets/library',
      editor: (assetId: string) => `/design/assets/${assetId}/editor`,
    },
    customizer: '/design/customizer',
  },

  // Orders
  orders: {
    list: '/orders',
    view: (id: string) => `/orders/${id}`,
    edit: (id: string) => `/orders/${id}/edit`,
    fulfillment: (id: string) => `/orders/${id}/fulfillment`,
    returns: (id: string) => `/orders/${id}/returns`,
    timeline: (id: string) => `/orders/${id}/timeline`,
  },

  // Customers
  customers: {
    list: '/customers',
    view: (id: string) => `/customers/${id}`,
    edit: (id: string) => `/customers/${id}/edit`,
    orders: (id: string) => `/customers/${id}/orders`,
    segments: '/customers/segments',
  },

  // Analytics
  analytics: {
    overview: '/analytics',
    sales: '/analytics/sales',
    products: '/analytics/products',
    customers: '/analytics/customers',
    reports: '/analytics/reports',
    live: '/analytics/live',
  },

  // Settings
  settings: {
    general: '/settings',
    store: '/settings/store',
    payments: '/settings/payments',
    shipping: '/settings/shipping',
    taxes: '/settings/taxes',
    domains: '/settings/domains',
    users: '/settings/users',
    permissions: '/settings/permissions',
    integrations: '/settings/integrations',
    api: '/settings/api',
    billing: '/settings/billing',
  },

  // Content Management
  content: {
    pages: '/content/pages',
    blogs: '/content/blogs',
    collections: '/content/collections',
    navigation: '/content/navigation',
    redirects: '/content/redirects',
  },

  // Marketing
  marketing: {
    campaigns: '/marketing/campaigns',
    discounts: '/marketing/discounts',
    automations: '/marketing/automations',
    reviews: '/marketing/reviews',
  },

  // Apps & Extensions
  apps: {
    installed: '/apps',
    store: '/apps/store',
    private: '/apps/private',
    webhooks: '/apps/webhooks',
  }
} as const;

// External links (like Shopify admin, live store, etc.)
export const EXTERNAL_LINKS = {
  // Live store
  store: {
    homepage: (domain: string) => `https://${domain}`,
    product: (domain: string, handle: string) => `https://${domain}/products/${handle}`,
    collection: (domain: string, handle: string) => `https://${domain}/collections/${handle}`,
    page: (domain: string, handle: string) => `https://${domain}/pages/${handle}`,
  },

  // Shopify admin (if integrated)
  shopify: {
    admin: (shop: string) => `https://${shop}.myshopify.com/admin`,
    products: (shop: string) => `https://${shop}.myshopify.com/admin/products`,
    product: (shop: string, id: string) => `https://${shop}.myshopify.com/admin/products/${id}`,
    orders: (shop: string) => `https://${shop}.myshopify.com/admin/orders`,
    customers: (shop: string) => `https://${shop}.myshopify.com/admin/customers`,
    themes: (shop: string) => `https://${shop}.myshopify.com/admin/themes`,
    theme: (shop: string, id: string) => `https://${shop}.myshopify.com/admin/themes/${id}`,
    settings: (shop: string) => `https://${shop}.myshopify.com/admin/settings`,
  },

  // Documentation & Help
  docs: {
    getting_started: '/help/getting-started',
    products: '/help/products',
    design: '/help/design',
    orders: '/help/orders',
    api: '/help/api',
    troubleshooting: '/help/troubleshooting',
  }
};

// Quick actions for Amazon-style efficiency
export const QUICK_ACTIONS = {
  product: {
    create: ADMIN_ROUTES.products.create,
    bulkEdit: '/products/bulk-edit',
    import: '/products/import',
    export: '/products/export',
  },
  design: {
    themeEditor: ADMIN_ROUTES.design.themes.editor(),
    customizer: ADMIN_ROUTES.design.customizer,
    uploadAsset: ADMIN_ROUTES.design.assets.upload,
  },
  orders: {
    create: '/orders/new',
    pending: '/orders?status=pending',
    fulfillment: '/orders?needs_fulfillment=true',
  },
  marketing: {
    createDiscount: '/marketing/discounts/new',
    createCampaign: '/marketing/campaigns/new',
  }
};

// Utility functions for navigation
export class NavigationHelper {
  private static storeUrl = process.env.NEXT_PUBLIC_MAIN_STORE_URL || 'https://inkey-list-clone2.vercel.app';
  private static shopDomain = 'your-store'; // This would come from settings

  // Get breadcrumbs for current path
  static getBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Dashboard', href: '/' }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      breadcrumbs.push({
        name: this.formatSegmentName(segment),
        href: isLast ? undefined : currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  }

  // Format segment names for breadcrumbs
  private static formatSegmentName(segment: string): string {
    // Handle special cases
    const specialNames: Record<string, string> = {
      'products': 'Products',
      'design': 'Design',
      'orders': 'Orders',
      'customers': 'Customers',
      'analytics': 'Analytics',
      'settings': 'Settings',
      'themes': 'Themes',
      'layouts': 'Layouts',
      'assets': 'Assets',
      'new': 'New',
      'edit': 'Edit',
      'editor': 'Editor',
    };

    if (specialNames[segment]) {
      return specialNames[segment];
    }

    // Format as title case
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
  }

  // Get edit URL for a resource
  static getEditUrl(type: 'product' | 'design' | 'order' | 'customer', id: string): string {
    switch (type) {
      case 'product':
        return ADMIN_ROUTES.products.edit(id);
      case 'design':
        return ADMIN_ROUTES.design.themes.editor(id);
      case 'order':
        return ADMIN_ROUTES.orders.edit(id);
      case 'customer':
        return ADMIN_ROUTES.customers.edit(id);
      default:
        return '/';
    }
  }

  // Get view URL for a resource
  static getViewUrl(type: 'product' | 'order' | 'customer', id: string): string {
    switch (type) {
      case 'product':
        return ADMIN_ROUTES.products.view(id);
      case 'order':
        return ADMIN_ROUTES.orders.view(id);
      case 'customer':
        return ADMIN_ROUTES.customers.view(id);
      default:
        return '/';
    }
  }

  // Get live store URL for a resource
  static getLiveUrl(type: 'product' | 'page' | 'collection', handle: string): string {
    const domain = this.storeUrl.replace('https://', '');

    switch (type) {
      case 'product':
        return `${this.storeUrl}/products/${handle}`;
      case 'page':
        return `${this.storeUrl}/pages/${handle}`;
      case 'collection':
        return `${this.storeUrl}/collections/${handle}`;
      default:
        return this.storeUrl;
    }
  }

  // Get Shopify admin URL (if integrated)
  static getShopifyUrl(type: string, id?: string): string {
    const baseUrl = EXTERNAL_LINKS.shopify.admin(this.shopDomain);

    switch (type) {
      case 'product':
        return id ? EXTERNAL_LINKS.shopify.product(this.shopDomain, id) : EXTERNAL_LINKS.shopify.products(this.shopDomain);
      case 'theme':
        return id ? EXTERNAL_LINKS.shopify.theme(this.shopDomain, id) : EXTERNAL_LINKS.shopify.themes(this.shopDomain);
      default:
        return baseUrl;
    }
  }

  // Check if user can access a route
  static canAccess(route: string, userPermissions: any[]): boolean {
    // This would integrate with the auth system
    // For now, return true for demo
    return true;
  }

  // Get contextual actions for current page
  static getContextualActions(pathname: string): Array<{
    name: string;
    href: string;
    icon?: any;
    variant?: 'primary' | 'secondary' | 'outline';
  }> {
    const actions = [];

    if (pathname.includes('/products')) {
      actions.push(
        { name: 'Add Product', href: ADMIN_ROUTES.products.create, variant: 'primary' as const },
        { name: 'Import Products', href: QUICK_ACTIONS.product.import, variant: 'outline' as const },
        { name: 'Export Products', href: QUICK_ACTIONS.product.export, variant: 'outline' as const }
      );
    }

    if (pathname.includes('/design')) {
      actions.push(
        { name: 'Theme Editor', href: ADMIN_ROUTES.design.themes.editor(), variant: 'primary' as const },
        { name: 'Upload Asset', href: ADMIN_ROUTES.design.assets.upload, variant: 'outline' as const },
        { name: 'Customize', href: ADMIN_ROUTES.design.customizer, variant: 'outline' as const }
      );
    }

    if (pathname.includes('/orders')) {
      actions.push(
        { name: 'Create Order', href: QUICK_ACTIONS.orders.create, variant: 'primary' as const },
        { name: 'Pending Orders', href: QUICK_ACTIONS.orders.pending, variant: 'outline' as const }
      );
    }

    return actions;
  }
}

export default NavigationHelper;
