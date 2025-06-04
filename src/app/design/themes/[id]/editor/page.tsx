"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Eye,
  Undo,
  Redo,
  Smartphone,
  Tablet,
  Monitor,
  Settings,
  Palette,
  Type,
  Layout,
  Globe,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import AdminLayout from '@/components/AdminLayout';
import { designAPI, type DesignTheme } from '@/lib/design-api';
import { NavigationHelper } from '@/lib/navigation';

interface ThemeSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    accentFont: string;
    baseFontSize: number;
    lineHeight: number;
  };
  layout: {
    maxWidth: string;
    padding: number;
    borderRadius: number;
    spacing: number;
  };
  components: {
    headerStyle: 'minimal' | 'classic' | 'modern';
    buttonStyle: 'rounded' | 'square' | 'pill';
    cardStyle: 'flat' | 'shadow' | 'border';
  };
}

export default function ThemeEditorPage() {
  const params = useParams();
  const router = useRouter();
  const themeId = params.id as string;

  const [theme, setTheme] = useState<DesignTheme | null>(null);
  const [settings, setSettings] = useState<ThemeSettings>({
    colors: {
      primary: '#000000',
      secondary: '#746cad',
      accent: '#efeff0',
      background: '#ffffff',
      text: '#1c1c22',
      muted: '#747474'
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      accentFont: 'Lato',
      baseFontSize: 16,
      lineHeight: 1.6
    },
    layout: {
      maxWidth: '1200px',
      padding: 16,
      borderRadius: 8,
      spacing: 16
    },
    components: {
      headerStyle: 'modern',
      buttonStyle: 'rounded',
      cardStyle: 'shadow'
    }
  });

  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePanel, setActivePanel] = useState('colors');

  useEffect(() => {
    loadTheme();
  }, [themeId]);

  const loadTheme = async () => {
    try {
      const themes = await designAPI.getThemes();
      const currentTheme = themes.find(t => t.id === themeId) || themes[0];
      setTheme(currentTheme);

      if (currentTheme) {
        setSettings({
          colors: currentTheme.colors,
          typography: {
            headingFont: currentTheme.fonts.heading.split(',')[0],
            bodyFont: currentTheme.fonts.body.split(',')[0],
            accentFont: currentTheme.fonts.accent.split(',')[0],
            baseFontSize: 16,
            lineHeight: 1.6
          },
          layout: {
            maxWidth: '1200px',
            padding: Number.parseInt(currentTheme.spacing.md) * 4,
            borderRadius: Number.parseInt(currentTheme.borderRadius.md) * 4,
            spacing: Number.parseInt(currentTheme.spacing.md) * 4
          },
          components: {
            headerStyle: 'modern',
            buttonStyle: 'rounded',
            cardStyle: 'shadow'
          }
        });
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const handleSettingChange = (category: keyof ThemeSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!theme) return;

    setIsSaving(true);
    try {
      const updatedTheme: Partial<DesignTheme> = {
        colors: settings.colors,
        fonts: {
          heading: `${settings.typography.headingFont}, sans-serif`,
          body: `${settings.typography.bodyFont}, sans-serif`,
          accent: `${settings.typography.accentFont}, sans-serif`
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: `${settings.layout.spacing / 16}rem`,
          lg: `${settings.layout.spacing / 8}rem`,
          xl: `${settings.layout.spacing / 4}rem`
        },
        borderRadius: {
          sm: `${settings.layout.borderRadius / 32}rem`,
          md: `${settings.layout.borderRadius / 16}rem`,
          lg: `${settings.layout.borderRadius / 8}rem`
        }
      };

      await designAPI.updateTheme(theme.id, updatedTheme);
      setHasUnsavedChanges(false);

      // Generate and apply CSS
      const css = await designAPI.generateCSS({
        ...theme,
        ...updatedTheme
      } as DesignTheme);

      console.log('Theme updated successfully');
    } catch (error) {
      console.error('Failed to save theme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const previewUrl = NavigationHelper.getLiveUrl('product', 'hyaluronic-acid-serum');

  const fontOptions = [
    'Inter', 'Helvetica', 'Arial', 'Georgia', 'Times New Roman',
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display'
  ];

  if (!theme) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4" />
            <p className="text-gray-600">Loading theme editor...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/design/themes">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Themes
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Theme Editor</h1>
                <p className="text-gray-600">{theme.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {hasUnsavedChanges && (
                <Badge variant="outline" className="text-amber-600 border-amber-300">
                  Unsaved changes
                </Badge>
              )}

              {/* Device Preview Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewDevice('mobile')}
                  className="h-8 w-8 p-0"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewDevice('tablet')}
                  className="h-8 w-8 p-0"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewDevice('desktop')}
                  className="h-8 w-8 p-0"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => window.open(previewUrl, '_blank')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                className="bg-black hover:bg-gray-800"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Theme
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 flex">
          {/* Settings Panel */}
          <div className="w-80 border-r bg-white overflow-y-auto">
            <div className="p-4">
              <Tabs value={activePanel} onValueChange={setActivePanel}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="colors" className="text-xs">
                    <Palette className="h-3 w-3 mr-1" />
                    Colors
                  </TabsTrigger>
                  <TabsTrigger value="typography" className="text-xs">
                    <Type className="h-3 w-3 mr-1" />
                    Type
                  </TabsTrigger>
                  <TabsTrigger value="layout" className="text-xs">
                    <Layout className="h-3 w-3 mr-1" />
                    Layout
                  </TabsTrigger>
                  <TabsTrigger value="components" className="text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    Elements
                  </TabsTrigger>
                </TabsList>

                {/* Colors Panel */}
                <TabsContent value="colors" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Brand Colors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(settings.colors).map(([key, value]) => (
                        <div key={key}>
                          <Label className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <input
                              type="color"
                              value={value}
                              onChange={(e) => handleSettingChange('colors', key, e.target.value)}
                              className="w-8 h-8 rounded border cursor-pointer"
                            />
                            <Input
                              value={value}
                              onChange={(e) => handleSettingChange('colors', key, e.target.value)}
                              placeholder="#000000"
                              className="text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Typography Panel */}
                <TabsContent value="typography" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Fonts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-xs">Heading Font</Label>
                        <select
                          value={settings.typography.headingFont}
                          onChange={(e) => handleSettingChange('typography', 'headingFont', e.target.value)}
                          className="w-full mt-1 p-2 border rounded text-xs"
                        >
                          {fontOptions.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs">Body Font</Label>
                        <select
                          value={settings.typography.bodyFont}
                          onChange={(e) => handleSettingChange('typography', 'bodyFont', e.target.value)}
                          className="w-full mt-1 p-2 border rounded text-xs"
                        >
                          {fontOptions.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs">Base Font Size: {settings.typography.baseFontSize}px</Label>
                        <Slider
                          value={[settings.typography.baseFontSize]}
                          onValueChange={([value]) => handleSettingChange('typography', 'baseFontSize', value)}
                          min={12}
                          max={24}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Line Height: {settings.typography.lineHeight}</Label>
                        <Slider
                          value={[settings.typography.lineHeight]}
                          onValueChange={([value]) => handleSettingChange('typography', 'lineHeight', value)}
                          min={1.2}
                          max={2.0}
                          step={0.1}
                          className="mt-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Layout Panel */}
                <TabsContent value="layout" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Layout Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-xs">Max Width</Label>
                        <select
                          value={settings.layout.maxWidth}
                          onChange={(e) => handleSettingChange('layout', 'maxWidth', e.target.value)}
                          className="w-full mt-1 p-2 border rounded text-xs"
                        >
                          <option value="1024px">1024px</option>
                          <option value="1200px">1200px</option>
                          <option value="1400px">1400px</option>
                          <option value="100%">Full Width</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs">Padding: {settings.layout.padding}px</Label>
                        <Slider
                          value={[settings.layout.padding]}
                          onValueChange={([value]) => handleSettingChange('layout', 'padding', value)}
                          min={8}
                          max={48}
                          step={4}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Border Radius: {settings.layout.borderRadius}px</Label>
                        <Slider
                          value={[settings.layout.borderRadius]}
                          onValueChange={([value]) => handleSettingChange('layout', 'borderRadius', value)}
                          min={0}
                          max={24}
                          step={2}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Spacing: {settings.layout.spacing}px</Label>
                        <Slider
                          value={[settings.layout.spacing]}
                          onValueChange={([value]) => handleSettingChange('layout', 'spacing', value)}
                          min={8}
                          max={32}
                          step={4}
                          className="mt-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Components Panel */}
                <TabsContent value="components" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Component Styles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-xs">Header Style</Label>
                        <select
                          value={settings.components.headerStyle}
                          onChange={(e) => handleSettingChange('components', 'headerStyle', e.target.value)}
                          className="w-full mt-1 p-2 border rounded text-xs"
                        >
                          <option value="minimal">Minimal</option>
                          <option value="classic">Classic</option>
                          <option value="modern">Modern</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs">Button Style</Label>
                        <select
                          value={settings.components.buttonStyle}
                          onChange={(e) => handleSettingChange('components', 'buttonStyle', e.target.value)}
                          className="w-full mt-1 p-2 border rounded text-xs"
                        >
                          <option value="rounded">Rounded</option>
                          <option value="square">Square</option>
                          <option value="pill">Pill</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-xs">Card Style</Label>
                        <select
                          value={settings.components.cardStyle}
                          onChange={(e) => handleSettingChange('components', 'cardStyle', e.target.value)}
                          className="w-full mt-1 p-2 border rounded text-xs"
                        >
                          <option value="flat">Flat</option>
                          <option value="shadow">Shadow</option>
                          <option value="border">Border</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 bg-gray-100 p-4">
            <div className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${
              previewDevice === 'mobile' ? 'w-[375px] h-[667px]' :
              previewDevice === 'tablet' ? 'w-[768px] h-[1024px]' :
              'w-full h-full'
            }`}>
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="Theme Preview"
                style={{
                  '--color-primary': settings.colors.primary,
                  '--color-secondary': settings.colors.secondary,
                  '--color-accent': settings.colors.accent,
                  '--color-background': settings.colors.background,
                  '--color-text': settings.colors.text,
                  '--font-heading': `${settings.typography.headingFont}, sans-serif`,
                  '--font-body': `${settings.typography.bodyFont}, sans-serif`
                } as any}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
