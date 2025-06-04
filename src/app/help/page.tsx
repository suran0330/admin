import { Book, Package, Settings, BarChart3, Users, FileText, HelpCircle, Lightbulb, Palette, Layout, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

export default function AdminHelpPage() {
  const helpSections = [
    {
      title: 'Design Management',
      icon: Palette,
      items: [
        {
          title: 'Theme & Color Customization',
          description: 'Learn how to customize your website colors, fonts, and styling',
          topics: [
            'Understanding color schemes and branding',
            'Changing primary and secondary colors',
            'Typography selection and font pairing',
            'Spacing and layout configuration',
            'Live preview and testing changes'
          ]
        },
        {
          title: 'Layout Builder',
          description: 'Design and organize your page sections',
          topics: [
            'Adding and removing page sections',
            'Drag and drop section reordering',
            'Section visibility controls',
            'Page-specific layout customization',
            'Responsive design considerations'
          ]
        },
        {
          title: 'Visual Assets Management',
          description: 'Upload and organize images, icons, and media',
          topics: [
            'Uploading new assets and images',
            'Organizing assets by type and usage',
            'Optimizing images for web performance',
            'Asset search and filtering',
            'Bulk operations and management'
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
            'Required product information and fields',
            'Setting categories and skin concerns',
            'Adding product images and galleries',
            'Configuring pricing and inventory',
            'SEO optimization for products'
          ]
        },
        {
          title: 'Editing Products',
          description: 'Updating existing product information',
          topics: [
            'Bulk editing multiple products',
            'Updating stock status and inventory',
            'Managing featured products',
            'Product categorization best practices'
          ]
        }
      ]
    },
    {
      title: 'Website Analytics',
      icon: BarChart3,
      items: [
        {
          title: 'Performance Metrics',
          description: 'Understanding your website analytics',
          topics: [
            'Reading overview statistics',
            'Design performance tracking',
            'User engagement metrics',
            'Page performance analysis',
            'Conversion rate optimization'
          ]
        },
        {
          title: 'Design Insights',
          description: 'Understanding design effectiveness',
          topics: [
            'A/B testing different layouts',
            'User interaction with design elements',
            'Mobile vs desktop performance',
            'Color scheme effectiveness'
          ]
        }
      ]
    },
    {
      title: 'Settings & Configuration',
      icon: Settings,
      items: [
        {
          title: 'Website Settings',
          description: 'Configuring your website information',
          topics: [
            'Basic site information and branding',
            'SEO settings and optimization',
            'Performance and caching settings',
            'Security and access controls'
          ]
        },
        {
          title: 'Publishing & Deployment',
          description: 'Publishing your design changes',
          topics: [
            'Preview changes before publishing',
            'Publishing design updates live',
            'Rollback and version control',
            'Staging vs production environments'
          ]
        }
      ]
    }
  ];

  const quickTips = [
    {
      title: 'Design Consistency',
      description: 'Maintain consistent colors, fonts, and spacing throughout your website for a professional look.'
    },
    {
      title: 'Mobile-First Design',
      description: 'Always preview and optimize your designs for mobile devices first, then scale up to desktop.'
    },
    {
      title: 'Performance Optimization',
      description: 'Optimize images and assets for faster loading times and better user experience.'
    },
    {
      title: 'User Experience',
      description: 'Keep navigation simple and intuitive. Test your designs with real users when possible.'
    },
    {
      title: 'Regular Backups',
      description: 'Save your design changes regularly and create backups before making major modifications.'
    },
    {
      title: 'Analytics Review',
      description: 'Check your analytics regularly to understand which design elements perform best.'
    }
  ];

  const designWorkflow = [
    {
      step: 1,
      title: 'Plan Your Design',
      description: 'Define your brand colors, typography, and overall aesthetic before making changes.',
      icon: Lightbulb
    },
    {
      step: 2,
      title: 'Customize Theme',
      description: 'Use the theme manager to set your brand colors, fonts, and spacing.',
      icon: Palette
    },
    {
      step: 3,
      title: 'Build Layouts',
      description: 'Organize your page sections and content using the layout builder.',
      icon: Layout
    },
    {
      step: 4,
      title: 'Add Visual Assets',
      description: 'Upload and organize your images, logos, and other media files.',
      icon: Image
    },
    {
      step: 5,
      title: 'Preview & Test',
      description: 'Use the preview feature to test your design on different devices.',
      icon: Settings
    },
    {
      step: 6,
      title: 'Publish Live',
      description: 'Once satisfied with your design, publish the changes to your live website.',
      icon: Package
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Help Center</h1>
          <p className="text-gray-600">Comprehensive guides and documentation for managing your website</p>
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

        {/* Design Workflow */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Design Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {designWorkflow.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.step} className="relative p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {item.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <IconComponent className="h-4 w-4 text-gray-600" />
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                <h4 className="font-medium text-gray-900 mb-1">How do I change my website colors?</h4>
                <p className="text-sm text-gray-600">
                  Go to Design → Themes & Colors. Use the color picker for each color type (primary, secondary, etc.)
                  and save your changes. You can preview the changes before publishing them live.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900 mb-1">How do I add new sections to my homepage?</h4>
                <p className="text-sm text-gray-600">
                  Navigate to Design → Layout Builder, select the homepage, and click "Add Section".
                  Choose from available section types and drag them to your desired position.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-gray-900 mb-1">How do I upload new images?</h4>
                <p className="text-sm text-gray-600">
                  Go to Design → Visual Assets and click "Upload Assets". You can upload multiple images at once
                  and they'll be automatically organized by type.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium text-gray-900 mb-1">Can I preview changes before publishing?</h4>
                <p className="text-sm text-gray-600">
                  Yes! Use the "Preview" button in any design tool to see how your changes will look.
                  You can test on different device sizes before publishing to your live website.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium text-gray-900 mb-1">What if I want to undo my changes?</h4>
                <p className="text-sm text-gray-600">
                  The system keeps track of your design history. You can view recent changes in the Design Studio
                  and revert to previous versions if needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">New to Design Management?</h4>
                <div className="space-y-2">
                  <Link href="/design" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Explore Design Studio</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Start with the main design dashboard</p>
                  </Link>

                  <Link href="/design/themes" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Customize Your Theme</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Set your brand colors and fonts</p>
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Need More Help?</h4>
                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-900">Video Tutorials</h5>
                    <p className="text-sm text-gray-500">Step-by-step video guides for common tasks</p>
                  </div>

                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-900">Community Forum</h5>
                    <p className="text-sm text-gray-500">Get help from other users and share tips</p>
                  </div>

                  <div className="p-3 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-gray-900">Live Support</h5>
                    <p className="text-sm text-gray-500">Chat with our support team for immediate help</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
