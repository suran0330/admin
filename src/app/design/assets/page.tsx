"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Copy,
  ArrowLeft,
  Grid,
  List,
  Plus,
  Eye,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { designAPI, type VisualAsset } from '@/lib/design-api';

export default function VisualAssetsPage() {
  const [assets, setAssets] = useState<VisualAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<VisualAsset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const assetsData = await designAPI.getVisualAssets();
      setAssets(assetsData);
    } catch (error) {
      console.error('Failed to load assets:', error);
    }
  };

  const filterAssets = useCallback(() => {
    let filtered = assets;

    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.alt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(asset => asset.type === selectedType);
    }

    setFilteredAssets(filtered);
  }, [assets, searchTerm, selectedType]);

  useEffect(() => {
    filterAssets();
  }, [filterAssets]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const asset = await designAPI.uploadAsset(file, 'image');
        setAssets(prev => [asset, ...prev]);
      }
    } catch (error) {
      console.error('Failed to upload assets:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      // In a real implementation, call API to delete
      setAssets(prev => prev.filter(asset => asset.id !== assetId));
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedAssets.length} selected assets?`)) return;

    try {
      setAssets(prev => prev.filter(asset => !selectedAssets.includes(asset.id)));
      setSelectedAssets([]);
    } catch (error) {
      console.error('Failed to delete assets:', error);
    }
  };

  const copyAssetUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const assetTypes = [
    { value: 'all', label: 'All Assets', count: assets.length },
    { value: 'image', label: 'Images', count: assets.filter(a => a.type === 'image').length },
    { value: 'icon', label: 'Icons', count: assets.filter(a => a.type === 'icon').length },
    { value: 'logo', label: 'Logos', count: assets.filter(a => a.type === 'logo').length },
    { value: 'banner', label: 'Banners', count: assets.filter(a => a.type === 'banner').length }
  ];

  const mockAssets: VisualAsset[] = [
    {
      id: 'asset-1',
      name: 'Hero Background',
      type: 'banner',
      url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop',
      alt: 'Skincare products hero background',
      usage: ['homepage-hero', 'about-banner'],
      dimensions: { width: 1920, height: 1080 }
    },
    {
      id: 'asset-2',
      name: 'Product Showcase',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=600&fit=crop',
      alt: 'Hyaluronic acid serum product',
      usage: ['product-grid', 'featured-section'],
      dimensions: { width: 800, height: 800 }
    },
    {
      id: 'asset-3',
      name: 'Brand Logo',
      type: 'logo',
      url: '/logo.svg',
      alt: 'INKEY List brand logo',
      usage: ['header', 'footer', 'email-templates'],
      dimensions: { width: 200, height: 50 }
    },
    {
      id: 'asset-4',
      name: 'Before After Comparison',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1594824704818-61db69c33bb3?w=400&h=400&fit=crop',
      alt: 'Skin before and after treatment',
      usage: ['results-section'],
      dimensions: { width: 400, height: 400 }
    }
  ];

  // Use mock data if no assets loaded
  const displayAssets = filteredAssets.length > 0 ? filteredAssets :
    (assets.length === 0 ? mockAssets.filter(asset =>
      selectedType === 'all' || asset.type === selectedType
    ).filter(asset =>
      !searchTerm || asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : filteredAssets);

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
              <h1 className="text-3xl font-bold text-gray-900">Visual Assets</h1>
              <p className="text-gray-600">Manage images, icons, and media files</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {selectedAssets.length > 0 && (
              <Button variant="outline" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedAssets.length})
              </Button>
            )}

            <label htmlFor="file-upload">
              <Button disabled={isUploading} className="bg-black hover:bg-gray-800">
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Assets'}
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {assetTypes.map((type) => (
            <Card key={type.value}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{type.label}</p>
                    <p className="text-2xl font-bold">{type.count}</p>
                  </div>
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  {assetTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} ({type.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Assets ({displayAssets.length})</span>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {displayAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="group relative bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors"
                  >
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedAssets.includes(asset.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAssets(prev => [...prev, asset.id]);
                          } else {
                            setSelectedAssets(prev => prev.filter(id => id !== asset.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </div>

                    {/* Asset Preview */}
                    <div className="aspect-square relative">
                      <img
                        src={asset.url}
                        alt={asset.alt}
                        className="w-full h-full object-cover"
                      />

                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex space-x-1">
                          <Button size="sm" variant="secondary">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => copyAssetUrl(asset.url)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="secondary">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Asset Info */}
                    <div className="p-3">
                      <h3 className="font-medium text-sm truncate">{asset.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" className="text-xs">
                          {asset.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {asset.dimensions.width}×{asset.dimensions.height}
                        </span>
                      </div>

                      {asset.usage.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">
                            Used in {asset.usage.length} place{asset.usage.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {displayAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAssets.includes(asset.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAssets(prev => [...prev, asset.id]);
                        } else {
                          setSelectedAssets(prev => prev.filter(id => id !== asset.id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />

                    <img
                      src={asset.url}
                      alt={asset.alt}
                      className="w-16 h-16 object-cover rounded border"
                    />

                    <div className="flex-1">
                      <h3 className="font-medium">{asset.name}</h3>
                      <p className="text-sm text-gray-500">{asset.alt}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <Badge variant="outline">{asset.type}</Badge>
                        <span className="text-xs text-gray-500">
                          {asset.dimensions.width}×{asset.dimensions.height}
                        </span>
                        <span className="text-xs text-gray-500">
                          Used in {asset.usage.length} places
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyAssetUrl(asset.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {displayAssets.length === 0 && (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedType !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Upload your first asset to get started'
                  }
                </p>
                <label htmlFor="file-upload-empty">
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Assets
                  </Button>
                </label>
                <input
                  id="file-upload-empty"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
