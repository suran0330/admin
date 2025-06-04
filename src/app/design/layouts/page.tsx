"use client";

import { useState, useEffect } from 'react';
import {
  Layout,
  Plus,
  Eye,
  Settings,
  Move,
  Trash2,
  Copy,
  Save,
  ArrowLeft,
  Grid,
  Image,
  Type,
  Star,
  ShoppingBag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { designAPI, type PageLayout, type LayoutSection } from '@/lib/design-api';

export default function LayoutBuilderPage() {
  const [pageLayouts, setPageLayouts] = useState<PageLayout[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('homepage');
  const [draggedSection, setDraggedSection] = useState<LayoutSection | null>(null);
  const [showSectionLibrary, setShowSectionLibrary] = useState(false);

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = async () => {
    try {
      const layouts = await designAPI.getPageLayouts();
      setPageLayouts(layouts);
    } catch (error) {
      console.error('Failed to load layouts:', error);
    }
  };

  const currentLayout = pageLayouts.find(layout => layout.page === selectedPage);

  const handleSectionToggle = async (sectionId: string, visible: boolean) => {
    try {
      await designAPI.updateSection(sectionId, { visible });

      setPageLayouts(layouts =>
        layouts.map(layout => ({
          ...layout,
          sections: layout.sections.map(section =>
            section.id === sectionId ? { ...section, visible } : section
          )
        }))
      );
    } catch (error) {
      console.error('Failed to update section:', error);
    }
  };

  const handleSectionReorder = async (sectionIds: string[]) => {
    if (!currentLayout) return;

    try {
      await designAPI.reorderSections(currentLayout.page, sectionIds);

      setPageLayouts(layouts =>
        layouts.map(layout =>
          layout.page === selectedPage
            ? {
                ...layout,
                sections: sectionIds.map((id, index) => {
                  const section = layout.sections.find(s => s.id === id);
                  return section ? { ...section, position: index } : section;
                }).filter(Boolean) as LayoutSection[]
              }
            : layout
        )
      );
    } catch (error) {
      console.error('Failed to reorder sections:', error);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      await designAPI.deleteSection(sectionId);

      setPageLayouts(layouts =>
        layouts.map(layout => ({
          ...layout,
          sections: layout.sections.filter(section => section.id !== sectionId)
        }))
      );
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };

  const sectionTypes = [
    {
      type: 'hero',
      name: 'Hero Section',
      icon: Image,
      description: 'Large banner with heading, image, and call-to-action',
      preview: 'bg-gradient-to-r from-blue-500 to-purple-600'
    },
    {
      type: 'product-grid',
      name: 'Product Grid',
      icon: Grid,
      description: 'Display products in a responsive grid layout',
      preview: 'bg-white border-2 border-dashed border-gray-300'
    },
    {
      type: 'banner',
      name: 'Banner Section',
      icon: Image,
      description: 'Promotional banner with text and images',
      preview: 'bg-gradient-to-r from-green-400 to-blue-500'
    },
    {
      type: 'testimonials',
      name: 'Testimonials',
      icon: Star,
      description: 'Customer reviews and testimonials',
      preview: 'bg-yellow-50 border border-yellow-200'
    },
    {
      type: 'content-block',
      name: 'Content Block',
      icon: Type,
      description: 'Rich text content with images',
      preview: 'bg-gray-50 border border-gray-200'
    },
    {
      type: 'before-after',
      name: 'Before/After',
      icon: Eye,
      description: 'Before and after comparison grid',
      preview: 'bg-purple-50 border border-purple-200'
    },
    {
      type: 'featured-products',
      name: 'Featured Products',
      icon: ShoppingBag,
      description: 'Highlighted product showcase',
      preview: 'bg-indigo-50 border border-indigo-200'
    }
  ];

  const pages = [
    { id: 'homepage', name: 'Homepage', description: 'Main landing page' },
    { id: 'shop', name: 'Shop Page', description: 'Product listing page' },
    { id: 'product-detail', name: 'Product Detail', description: 'Individual product page' },
    { id: 'cart', name: 'Cart Page', description: 'Shopping cart page' },
    { id: 'checkout', name: 'Checkout', description: 'Checkout process page' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/design">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Design
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Layout Builder</h1>
              <p className="text-gray-600">Design and organize your page sections</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowSectionLibrary(!showSectionLibrary)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>

            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            <Button className="bg-black hover:bg-gray-800">
              <Save className="h-4 w-4 mr-2" />
              Save Layout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Page Selector */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => setSelectedPage(page.id)}
                      className={`w-full p-3 text-left rounded-lg transition-colors ${
                        selectedPage === page.id
                          ? 'bg-black text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <h3 className="font-medium">{page.name}</h3>
                      <p className={`text-sm ${
                        selectedPage === page.id ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {page.description}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Section Library */}
            {showSectionLibrary && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Section Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sectionTypes.map((sectionType) => {
                      const IconComponent = sectionType.icon;
                      return (
                        <div
                          key={sectionType.type}
                          className="p-3 border rounded-lg hover:border-gray-300 cursor-pointer group"
                          draggable
                          onDragStart={() => {
                            // Set drag data for new section
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200">
                              <IconComponent className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{sectionType.name}</h4>
                              <p className="text-xs text-gray-500">{sectionType.description}</p>
                            </div>
                          </div>

                          {/* Mini Preview */}
                          <div className={`mt-2 h-6 rounded ${sectionType.preview}`} />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Layout Editor */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{pages.find(p => p.id === selectedPage)?.name} Layout</span>
                  <Badge variant="outline">
                    {currentLayout?.sections.length || 0} sections
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentLayout ? (
                  <div className="space-y-4">
                    {/* Layout Settings */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-3">Page Settings</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <label className="text-gray-600">Max Width</label>
                          <p className="font-medium">{currentLayout.globalSettings.maxWidth}</p>
                        </div>
                        <div>
                          <label className="text-gray-600">Padding</label>
                          <p className="font-medium">{currentLayout.globalSettings.padding}</p>
                        </div>
                        <div>
                          <label className="text-gray-600">Background</label>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: currentLayout.globalSettings.backgroundColor }}
                            />
                            <p className="font-medium">{currentLayout.globalSettings.backgroundColor}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-3">
                      {currentLayout.sections
                        .sort((a, b) => a.position - b.position)
                        .map((section, index) => (
                          <div
                            key={section.id}
                            className={`group relative p-4 border-2 rounded-lg transition-all ${
                              section.visible
                                ? 'border-gray-200 bg-white hover:border-gray-300'
                                : 'border-gray-100 bg-gray-50 opacity-60'
                            }`}
                            draggable
                            onDragStart={() => setDraggedSection(section)}
                          >
                            {/* Section Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2 cursor-grab">
                                  <Move className="h-4 w-4 text-gray-400" />
                                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">
                                    {index + 1}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium">{section.name}</h4>
                                  <p className="text-sm text-gray-500 capitalize">
                                    {section.type.replace('-', ' ')}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={section.visible}
                                  onCheckedChange={(checked) => handleSectionToggle(section.id, checked)}
                                />

                                <Button variant="ghost" size="sm">
                                  <Copy className="h-4 w-4" />
                                </Button>

                                <Button variant="ghost" size="sm">
                                  <Settings className="h-4 w-4" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteSection(section.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Section Preview */}
                            <div className="relative">
                              {section.type === 'hero' && (
                                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center text-white">
                                  <div className="text-center">
                                    <h3 className="text-lg font-bold">Hero Section</h3>
                                    <p className="text-sm opacity-90">Main banner with CTA</p>
                                  </div>
                                </div>
                              )}

                              {section.type === 'product-grid' && (
                                <div className="h-24 bg-white border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                                  <div className="text-center text-gray-500">
                                    <Grid className="h-8 w-8 mx-auto mb-1" />
                                    <p className="text-sm">Product Grid</p>
                                  </div>
                                </div>
                              )}

                              {section.type === 'before-after' && (
                                <div className="h-20 bg-purple-50 border border-purple-200 rounded flex items-center justify-center">
                                  <div className="text-center text-purple-600">
                                    <Eye className="h-6 w-6 mx-auto mb-1" />
                                    <p className="text-sm">Before/After Results</p>
                                  </div>
                                </div>
                              )}

                              {section.type === 'banner' && (
                                <div className="h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded flex items-center justify-center text-white">
                                  <p className="text-sm font-medium">Promotional Banner</p>
                                </div>
                              )}

                              {!['hero', 'product-grid', 'before-after', 'banner'].includes(section.type) && (
                                <div className="h-16 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                                  <p className="text-sm text-gray-500 capitalize">
                                    {section.type.replace('-', ' ')} Section
                                  </p>
                                </div>
                              )}

                              {/* Settings Overlay */}
                              <div className="absolute inset-0 bg-black bg-opacity-20 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="secondary">
                                    <Settings className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button size="sm" variant="secondary">
                                    <Eye className="h-4 w-4 mr-1" />
                                    Preview
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Section Details */}
                            {Object.keys(section.settings).length > 0 && (
                              <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                <strong>Settings:</strong> {Object.keys(section.settings).join(', ')}
                              </div>
                            )}
                          </div>
                        ))}

                      {/* Drop Zone */}
                      <div className="h-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:border-gray-300 hover:bg-gray-50">
                        <Plus className="h-4 w-4 mr-2" />
                        Drop new section here or click to add
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Layout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No layout found</h3>
                    <p className="text-gray-500 mb-4">Create a layout for this page to get started</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Layout
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
