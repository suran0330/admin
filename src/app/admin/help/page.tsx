import { Book, Package, Settings, BarChart3, Users, FileText, HelpCircle, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminHelpPage() {
  const helpSections = [
    {
      title: 'Getting Started',
      icon: Lightbulb,
      items: [
        {
          title: 'Admin Dashboard Overview',
          description: 'Learn about the main dashboard and navigation',
          topics: [
            'Understanding the sidebar navigation',
            'Reading overview statistics',
            'Quick actions and shortcuts',
            'Accessing different admin sections'
          ]
        },
        {
          title: 'First Steps',
          description: 'Essential setup tasks for new administrators',
          topics: [
            'Configure store settings',
            'Set up payment integration',
            'Connect Shopify store (optional)',
            'Create your first product'
          ]
        }
      ]
    },
    {
      title: 'Product Management',
      icon: Package,
      items: [
        {
          title: 'Adding Products',
          description: 'How to create and configure new products',
          topics: [
            'Required product information',
            'Setting categories and concerns',
            'Adding product images',
            'Configuring pricing and inventory',
            'Setting skin types and concerns'
          ]
        },
        {
          title: 'Editing Products',
          description: 'Updating existing product information',
          topics: [
            'Bulk editing multiple products',
            'Updating stock status',
            'Managing featured products',
            'Organizing product categories'
          ]
        },
        {
          title: 'Shopify Integration',
          description: 'Working with Shopify products',
          topics: [
            'Viewing Shopify products in admin',
            'Understanding sync limitations',
            'Managing mixed product catalogs',
            'Troubleshooting connection issues'
          ]
        }
      ]
    },
    {
      title: 'Categories & Organization',
      icon: FileText,
      items: [
        {
          title: 'Product Categories',
          description: 'Managing product categories and types',
          topics: [
            'Creating new categories',
            'Editing category descriptions',
            'Organizing products by type',
            'Category performance insights'
          ]
        },
        {
          title: 'Skin Concerns',
          description: 'Managing skin concern tags',
          topics: [
            'Adding new skin concerns',
            'Mapping products to concerns',
            'Understanding concern analytics',
            'Customer concern trends'
          ]
        }
      ]
    },
    {
      title: 'Analytics & Insights',
      icon: BarChart3,
      items: [
        {
          title: 'Performance Metrics',
          description: 'Understanding your store analytics',
          topics: [
            'Reading overview statistics',
            'Product performance tracking',
            'Category analysis',
            'Time-based comparisons'
          ]
        },
        {
          title: 'Customer Insights',
          description: 'Understanding customer behavior',
          topics: [
            'Customer preferences',
            'Popular skin concerns',
            'Purchase patterns',
            'Review and rating trends'
          ]
        }
      ]
    },
    {
      title: 'Settings & Configuration',
      icon: Settings,
      items: [
        {
          title: 'Store Settings',
          description: 'Configuring your store information',
          topics: [
            'Basic store information',
            'Pricing and shipping settings',
            'Tax configuration',
            'Contact details'
          ]
        },
        {
          title: 'Integrations',
          description: 'Setting up third-party services',
          topics: [
            'Shopify connection setup',
            'Stripe payment configuration',
            'Email service integration',
            'Testing connections'
          ]
        },
        {
          title: 'SEO & Marketing',
          description: 'Optimizing for search engines',
          topics: [
            'Meta titles and descriptions',
            'Keyword optimization',
            'Open Graph settings',
            'Marketing configuration'
          ]
        }
      ]
    }
  ];

  const quickTips = [
    {
      title: 'Bulk Operations',
      description: 'Select multiple products to update stock status, categories, or other properties in one action.'
    },
    {
      title: 'Featured Products',
      description: 'Mark products as featured to highlight them on the homepage and increase visibility.'
    },
    {
      title: 'Stock Management',
      description: 'Keep inventory updated to prevent overselling and maintain customer satisfaction.'
    },
    {
      title: 'SEO Optimization',
      description: 'Use descriptive product names and descriptions to improve search engine rankings.'
    },
    {
      title: 'Analytics Review',
      description: 'Check analytics regularly to understand which products perform best and why.'
    },
    {
      title: 'Category Organization',
      description: 'Well-organized categories help customers find products faster and improve conversions.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Help Center</h1>
        <p className="text-gray-600">Comprehensive guides and documentation for managing your store</p>
      </div>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickTips.map((tip, index) => (
              <div key={index} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-gray-900 mb-2">{tip.title}</h4>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Sections */}
      <div className="space-y-8">
        {helpSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <section.icon className="h-5 w-5 mr-2" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {section.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <ul className="space-y-1">
                      {item.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="text-sm text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Common Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-1">How do I connect my Shopify store?</h4>
              <p className="text-sm text-gray-600">
                Go to Settings → Integrations → Shopify Integration. Enter your store URL and Storefront Access Token,
                then enable the integration. Test the connection to ensure it's working properly.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-1">Can I edit Shopify products through the admin?</h4>
              <p className="text-sm text-gray-600">
                You can view Shopify products in the admin interface, but editing capabilities are limited.
                Make changes to Shopify products through your Shopify admin panel for the changes to sync properly.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-1">How do I feature products on the homepage?</h4>
              <p className="text-sm text-gray-600">
                Edit any product and check the "Featured Product" checkbox. Featured products appear in special
                sections on the homepage and have increased visibility to customers.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-1">What are skin concerns and how do they work?</h4>
              <p className="text-sm text-gray-600">
                Skin concerns are tags that help customers find products for their specific needs (like acne, dryness, etc.).
                You can assign multiple concerns to each product to improve discoverability.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-1">How do I bulk update multiple products?</h4>
              <p className="text-sm text-gray-600">
                In the Products page, use the checkboxes to select multiple products, then use the bulk action buttons
                that appear to update stock status, categories, or other properties for all selected items.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Documentation</h4>
              <p className="text-sm text-gray-600 mb-3">
                Check out our comprehensive documentation for detailed guides and API references.
              </p>
              <Link href="/docs" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Documentation →
              </Link>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Community Support</h4>
              <p className="text-sm text-gray-600 mb-3">
                Join our community forum to get help from other users and share your experiences.
              </p>
              <Link href="/community" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Join Community →
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
