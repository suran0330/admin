"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Palette,
  Layout,
  Image,
  Type,
  Eye,
  Save,
  RefreshCw,
  Monitor,
  Tablet,
  Smartphone,
  Settings,
  Upload,
  Grid,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/AdminLayout';
import { designAPI, type DesignTheme, type PageLayout, type LayoutSection } from '@/lib/design-api';

export default function DesignManagementPage() {
  const [activeTheme, setActiveTheme] = useState<DesignTheme | null>(null);
  const [pageLayouts, setPageLayouts] = useState<PageLayout[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('homepage');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    loadDesignData();
  }, []);

  const loadDesignData = async () => {
    try {
      const [theme, layouts] = await Promise.all([
        designAPI.getActiveTheme(),
        designAPI.getPageLayouts()
      ]);

      setActiveTheme(theme);
      setPageLayouts(layouts);
    } catch (error) {
      console.error('Failed to load design data:', error);
    }
  };

  const handlePreview = async () => {
    try {
      setIsPreviewMode(true);
      const previewUrl = await designAPI.previewChanges({ theme: activeTheme, layouts: pageLayouts });
      window.open(previewUrl, '_blank');
    } catch (error) {
      console.error('Failed to generate preview:', error);
    } finally {
      setIsPreviewMode(false);
    }
  };

  const handleSave = async () => {
    try {
      if (activeTheme) {
        await designAPI.updateTheme(activeTheme.id, activeTheme);
      }

      for (const layout of pageLayouts) {
        await designAPI.updatePageLayout(layout.page, layout);
      }

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  const handlePublish = async () => {
    try {
      await designAPI.publishChanges({ theme: activeTheme, layouts: pageLayouts });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to publish changes:', error);
    }
  };

  const currentLayout = pageLayouts.find(layout => layout.page === selectedPage);

  const designTools = [
    {
      id: 'themes',
      name: 'Themes & Colors',
      icon: Palette,
      description: 'Manage color schemes and branding',
      href: '/design/themes'
    },
    {
      id: 'layouts',
      name: 'Page Layouts',
      icon: Layout,
      description: 'Design page structures and sections',
      href: '/design/layouts'
    },
    {
      id: 'components',
      name: 'Components',
      icon: Grid,
      description: 'Customize UI components and styling',
      href: '/design/components'
    },
    {
      id: 'typography',
      name: 'Typography',
      icon: Type,
      description: 'Font styles and text formatting',
      href: '/design/typography'
    },
    {
      id: 'assets',
      name: 'Visual Assets',
      icon: Image,
      description: 'Manage images, icons, and media',
      href: '/design/assets'
    },
    {
      id: 'sections',
      name: 'Section Builder',
      icon: Layers,
      description: 'Create and edit page sections',
      href: '/design/sections'
    }
  ];

  const deviceIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Design Studio</h1>
            <p className="text-gray-600">Control your website's appearance and layout</p>
          </div>

          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Unsaved Changes
              </Badge>
            )}

            <Link href="/design/themes/inkey-default/editor">
              <Button variant="outline">
                <Palette className="h-4 w-4 mr-2" />
                Theme Editor
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={isPreviewMode}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? 'Generating...' : 'Preview'}
            </Button>

            <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>

            <Button
              onClick={handlePublish}
              className="bg-green-600 hover:bg-green-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Publish Live
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Active Theme</p>
                  <p className="text-lg font-bold">{activeTheme?.name || 'Loading...'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Layout className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Page Layouts</p>
                  <p className="text-lg font-bold">{pageLayouts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Layers className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Total Sections</p>
                  <p className="text-lg font-bold">
                    {pageLayouts.reduce((total, layout) => total + layout.sections.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Preview Device</p>
                  <p className="text-lg font-bold capitalize">{previewDevice}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Design Tools */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Design Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {designTools.map((tool) => {
                    const IconComponent = tool.icon;
                    return (
                      <a
                        key={tool.id}
                        href={tool.href}
                        className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <div className="p-2 bg-white rounded-lg mr-3 group-hover:bg-gray-50">
                          <IconComponent className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{tool.name}</h3>
                          <p className="text-sm text-gray-500">{tool.description}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Page Layout Editor */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Page Layout Editor</CardTitle>

                  {/* Device Toggle */}
                  <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                    {Object.entries(deviceIcons).map(([device, Icon]) => (
                      <button
                        key={device}
                        onClick={() => setPreviewDevice(device as any)}
                        className={`p-2 rounded-md transition-colors ${
                          previewDevice === device
                            ? 'bg-white text-black shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title={`Preview on ${device}`}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedPage} onValueChange={setSelectedPage}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="homepage">Home</TabsTrigger>
                    <TabsTrigger value="shop">Shop</TabsTrigger>
                    <TabsTrigger value="product-detail">Product</TabsTrigger>
                    <TabsTrigger value="cart">Cart</TabsTrigger>
                    <TabsTrigger value="checkout">Checkout</TabsTrigger>
                  </TabsList>

                  <TabsContent value={selectedPage} className="mt-6">
                    {currentLayout ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)} Layout
                          </h3>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Page Settings
                          </Button>
                        </div>

                        {/* Sections List */}
                        <div className="space-y-2">
                          {currentLayout.sections
                            .sort((a, b) => a.position - b.position)
                            .map((section, index) => (
                              <div
                                key={section.id}
                                className={`p-4 border rounded-lg ${
                                  section.visible
                                    ? 'border-gray-200 bg-white'
                                    : 'border-gray-100 bg-gray-50 opacity-60'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium">
                                      {index + 1}
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{section.name}</h4>
                                      <p className="text-sm text-gray-500 capitalize">
                                        {section.type.replace('-', ' ')}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      variant={section.visible ? "default" : "secondary"}
                                      className={section.visible ? "bg-green-100 text-green-800" : ""}
                                    >
                                      {section.visible ? 'Visible' : 'Hidden'}
                                    </Badge>
                                    <Button variant="ghost" size="sm">
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>

                        <Button variant="outline" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Add New Section
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Layout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No layout found</h3>
                        <p className="text-gray-500">Create a layout for this page to get started</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Design Changes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Design Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'Updated homepage hero section', time: '2 hours ago', user: 'Admin' },
                { action: 'Modified product card styling', time: '4 hours ago', user: 'Admin' },
                { action: 'Changed primary color theme', time: '1 day ago', user: 'Admin' },
                { action: 'Added new banner section', time: '2 days ago', user: 'Admin' }
              ].map((change, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{change.action}</p>
                    <p className="text-xs text-gray-500">by {change.user}</p>
                  </div>
                  <span className="text-xs text-gray-500">{change.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
