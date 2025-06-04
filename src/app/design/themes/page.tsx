"use client";

import { useState, useEffect } from 'react';
import {
  Palette,
  Save,
  Eye,
  Copy,
  Plus,
  Download,
  Upload,
  RefreshCw,
  ArrowLeft,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { designAPI, type DesignTheme } from '@/lib/design-api';

export default function ThemeManagementPage() {
  const [themes, setThemes] = useState<DesignTheme[]>([]);
  const [activeTheme, setActiveTheme] = useState<DesignTheme | null>(null);
  const [editingTheme, setEditingTheme] = useState<DesignTheme | null>(null);
  const [isCreatingTheme, setIsCreatingTheme] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      const [themesData, activeThemeData] = await Promise.all([
        designAPI.getThemes(),
        designAPI.getActiveTheme()
      ]);
      setThemes(themesData);
      setActiveTheme(activeThemeData);
      setEditingTheme(activeThemeData);
    } catch (error) {
      console.error('Failed to load themes:', error);
    }
  };

  const handleColorChange = (colorType: keyof DesignTheme['colors'], value: string) => {
    if (!editingTheme) return;

    setEditingTheme({
      ...editingTheme,
      colors: {
        ...editingTheme.colors,
        [colorType]: value
      }
    });
  };

  const handleFontChange = (fontType: keyof DesignTheme['fonts'], value: string) => {
    if (!editingTheme) return;

    setEditingTheme({
      ...editingTheme,
      fonts: {
        ...editingTheme.fonts,
        [fontType]: value
      }
    });
  };

  const handleSpacingChange = (spacingType: keyof DesignTheme['spacing'], value: string) => {
    if (!editingTheme) return;

    setEditingTheme({
      ...editingTheme,
      spacing: {
        ...editingTheme.spacing,
        [spacingType]: value
      }
    });
  };

  const handleSaveTheme = async () => {
    if (!editingTheme) return;

    try {
      await designAPI.updateTheme(editingTheme.id, editingTheme);
      setActiveTheme(editingTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const handlePreview = async () => {
    if (!editingTheme) return;

    try {
      setPreviewMode(true);
      const previewUrl = await designAPI.previewChanges({ theme: editingTheme });
      window.open(previewUrl, '_blank');
    } catch (error) {
      console.error('Failed to generate preview:', error);
    } finally {
      setPreviewMode(false);
    }
  };

  const handleCopyTheme = () => {
    if (!editingTheme) return;

    const themeCSS = `
      :root {
        --color-primary: ${editingTheme.colors.primary};
        --color-secondary: ${editingTheme.colors.secondary};
        --color-accent: ${editingTheme.colors.accent};
        --color-background: ${editingTheme.colors.background};
        --color-text: ${editingTheme.colors.text};
        --color-muted: ${editingTheme.colors.muted};
      }
    `;

    navigator.clipboard.writeText(themeCSS);
  };

  const colorPairs = [
    { key: 'primary', label: 'Primary Color', description: 'Main brand color for buttons and accents' },
    { key: 'secondary', label: 'Secondary Color', description: 'Supporting brand color' },
    { key: 'accent', label: 'Accent Color', description: 'Highlight and emphasis color' },
    { key: 'background', label: 'Background', description: 'Main background color' },
    { key: 'text', label: 'Text Color', description: 'Primary text color' },
    { key: 'muted', label: 'Muted Text', description: 'Secondary text and descriptions' }
  ] as const;

  const fontOptions = [
    'Inter, sans-serif',
    'Roboto, sans-serif',
    'Open Sans, sans-serif',
    'Lato, sans-serif',
    'Source Sans Pro, sans-serif',
    'Nunito Sans, sans-serif',
    'Playfair Display, serif',
    'Merriweather, serif',
    'Lora, serif'
  ];

  const spacingSizes = [
    { key: 'xs', label: 'Extra Small', description: 'Tight spacing (0.25rem)' },
    { key: 'sm', label: 'Small', description: 'Small spacing (0.5rem)' },
    { key: 'md', label: 'Medium', description: 'Medium spacing (1rem)' },
    { key: 'lg', label: 'Large', description: 'Large spacing (2rem)' },
    { key: 'xl', label: 'Extra Large', description: 'Extra large spacing (4rem)' }
  ] as const;

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
              <h1 className="text-3xl font-bold text-gray-900">Theme Management</h1>
              <p className="text-gray-600">Customize colors, fonts, and styling</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleCopyTheme}>
              <Copy className="h-4 w-4 mr-2" />
              Copy CSS
            </Button>

            <Button variant="outline" onClick={handlePreview} disabled={previewMode}>
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Generating...' : 'Preview'}
            </Button>

            <Button onClick={handleSaveTheme} className="bg-black hover:bg-gray-800">
              <Save className="h-4 w-4 mr-2" />
              Save Theme
            </Button>
          </div>
        </div>

        {/* Theme Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Available Themes</span>
              <Button variant="outline" onClick={() => setIsCreatingTheme(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Theme
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    editingTheme?.id === theme.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setEditingTheme(theme)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{theme.name}</h3>
                    {activeTheme?.id === theme.id && (
                      <Badge className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>

                  {/* Color Preview */}
                  <div className="flex space-x-1 mb-2">
                    {Object.values(theme.colors).slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-gray-500">{theme.fonts.heading}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Theme Editor */}
        {editingTheme && (
          <Tabs defaultValue="colors" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="spacing">Spacing</TabsTrigger>
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors">
              <Card>
                <CardHeader>
                  <CardTitle>Color Palette</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {colorPairs.map((colorPair) => (
                      <div key={colorPair.key} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          {colorPair.label}
                        </label>
                        <p className="text-xs text-gray-500">{colorPair.description}</p>

                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={editingTheme.colors[colorPair.key]}
                            onChange={(e) => handleColorChange(colorPair.key, e.target.value)}
                            className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                          />
                          <Input
                            value={editingTheme.colors[colorPair.key]}
                            onChange={(e) => handleColorChange(colorPair.key, e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                          />
                        </div>

                        {/* Color Preview */}
                        <div
                          className="w-full h-8 rounded border"
                          style={{ backgroundColor: editingTheme.colors[colorPair.key] }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography">
              <Card>
                <CardHeader>
                  <CardTitle>Typography Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(editingTheme.fonts).map(([fontType, fontValue]) => (
                      <div key={fontType} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 capitalize">
                          {fontType} Font
                        </label>

                        <select
                          value={fontValue}
                          onChange={(e) => handleFontChange(fontType as keyof DesignTheme['fonts'], e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                          {fontOptions.map((font) => (
                            <option key={font} value={font}>
                              {font.split(',')[0]}
                            </option>
                          ))}
                        </select>

                        {/* Font Preview */}
                        <div
                          className="p-3 border rounded bg-gray-50"
                          style={{ fontFamily: fontValue }}
                        >
                          <p className="text-lg">
                            The quick brown fox jumps over the lazy dog
                          </p>
                          <p className="text-sm text-gray-600">
                            Sample text in {fontType} font
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Spacing Tab */}
            <TabsContent value="spacing">
              <Card>
                <CardHeader>
                  <CardTitle>Spacing & Layout</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {spacingSizes.map((spacing) => (
                      <div key={spacing.key} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          {spacing.label}
                        </label>
                        <p className="text-xs text-gray-500">{spacing.description}</p>

                        <div className="flex items-center space-x-3">
                          <Input
                            value={editingTheme.spacing[spacing.key]}
                            onChange={(e) => handleSpacingChange(spacing.key, e.target.value)}
                            placeholder="1rem"
                            className="w-32"
                          />

                          {/* Spacing Preview */}
                          <div className="flex items-center space-x-2">
                            <div
                              className="bg-blue-200 rounded"
                              style={{
                                width: editingTheme.spacing[spacing.key],
                                height: '1rem'
                              }}
                            />
                            <span className="text-xs text-gray-500">
                              Visual representation
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Border Radius */}
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-medium mb-4">Border Radius</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(editingTheme.borderRadius).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 capitalize">
                              {key}
                            </label>
                            <Input
                              value={value}
                              onChange={(e) => {
                                setEditingTheme({
                                  ...editingTheme,
                                  borderRadius: {
                                    ...editingTheme.borderRadius,
                                    [key]: e.target.value
                                  }
                                });
                              }}
                              placeholder="0.5rem"
                            />
                            <div
                              className="w-full h-8 bg-gray-200"
                              style={{ borderRadius: value }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Live Preview Tab */}
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Component Previews */}
                    <div
                      className="p-6 border rounded-lg"
                      style={{
                        backgroundColor: editingTheme.colors.background,
                        color: editingTheme.colors.text,
                        fontFamily: editingTheme.fonts.body
                      }}
                    >
                      <h2
                        className="text-2xl font-bold mb-4"
                        style={{
                          color: editingTheme.colors.primary,
                          fontFamily: editingTheme.fonts.heading
                        }}
                      >
                        Sample Heading
                      </h2>

                      <p className="mb-4">
                        This is sample body text that shows how your typography and colors will look.
                      </p>

                      <div className="flex space-x-3">
                        <button
                          className="px-4 py-2 rounded font-medium"
                          style={{
                            backgroundColor: editingTheme.colors.primary,
                            color: editingTheme.colors.background,
                            borderRadius: editingTheme.borderRadius.md
                          }}
                        >
                          Primary Button
                        </button>

                        <button
                          className="px-4 py-2 rounded font-medium border"
                          style={{
                            backgroundColor: editingTheme.colors.background,
                            color: editingTheme.colors.primary,
                            borderColor: editingTheme.colors.primary,
                            borderRadius: editingTheme.borderRadius.md
                          }}
                        >
                          Secondary Button
                        </button>
                      </div>

                      <div
                        className="mt-4 p-4 rounded"
                        style={{
                          backgroundColor: editingTheme.colors.accent,
                          borderRadius: editingTheme.borderRadius.lg
                        }}
                      >
                        <p style={{ color: editingTheme.colors.muted }}>
                          This is a sample card or section with accent background.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button onClick={handlePreview} disabled={previewMode}>
                        <Eye className="h-4 w-4 mr-2" />
                        {previewMode ? 'Generating Full Preview...' : 'Preview Full Site'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
}
