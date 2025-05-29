"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Eye,
  Copy,
  Trash2,
  Upload,
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Settings,
  Globe,
  Package,
  Tag,
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/components/AdminLayout';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { NavigationHelper } from '@/lib/navigation';
import type { Product } from '@/data/products';

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  compareAtPrice: string;
  images: string[];
  category: string;
  handle: string;
  tags: string[];
  available: boolean;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  variants: Array<{
    title: string;
    price: string;
    sku: string;
    inventory: number;
    weight: string;
  }>;
}

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { products, updateProduct, loading } = useShopifyProducts();

  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: '',
    compareAtPrice: '',
    images: [''],
    category: '',
    handle: '',
    tags: [],
    available: true,
    featured: false,
    seoTitle: '',
    seoDescription: '',
    variants: []
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setFormData({
        title: foundProduct.title,
        description: foundProduct.description,
        price: foundProduct.price,
        compareAtPrice: foundProduct.compareAtPrice || '',
        images: foundProduct.images.length > 0 ? foundProduct.images : [''],
        category: foundProduct.category,
        handle: foundProduct.handle,
        tags: foundProduct.tags || [],
        available: foundProduct.available,
        featured: foundProduct.featured || false,
        seoTitle: foundProduct.title,
        seoDescription: foundProduct.description.substring(0, 160),
        variants: foundProduct.variants || []
      });
    }
  }, [products, productId]);

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
    setHasUnsavedChanges(true);
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
    setHasUnsavedChanges(true);
  };

  const removeImage = (index: number) => {
    if (formData.images.length > 1) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
      setHasUnsavedChanges(true);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
      setHasUnsavedChanges(true);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!product) return;

    setIsSaving(true);
    try {
      const updatedProduct: Partial<Product> = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        compareAtPrice: formData.compareAtPrice || undefined,
        images: formData.images.filter(img => img.trim() !== ''),
        category: formData.category,
        handle: formData.handle,
        tags: formData.tags,
        available: formData.available,
        featured: formData.featured,
        variants: formData.variants
      };

      await updateProduct(product.id, updatedProduct);
      setHasUnsavedChanges(false);

      // Show success message (you could add a toast here)
      console.log('Product updated successfully');

    } catch (error) {
      console.error('Failed to update product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = () => {
    router.push(`/products/new?duplicate=${productId}`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      // Implement delete functionality
      console.log('Delete product:', productId);
      router.push('/products');
    }
  };

  if (loading || !product) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4" />
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/products">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Products
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600">{product.title}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Unsaved changes</span>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => window.open(NavigationHelper.getLiveUrl('product', product.handle), '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            <Button variant="outline" onClick={handleDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>

            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
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
                  Save Product
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Product Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.available}
                    onCheckedChange={(checked) => handleInputChange('available', checked)}
                  />
                  <Label>Product is active</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                  <Label>Featured product</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant={formData.available ? "default" : "secondary"}>
                  {formData.available ? 'Active' : 'Draft'}
                </Badge>
                {formData.featured && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Editor Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4" />
              <span>Media</span>
            </TabsTrigger>
            <TabsTrigger value="organization" className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Organization</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>SEO</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Product Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter product title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your product"
                    rows={6}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.description.length} characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="handle">URL Handle</Label>
                  <Input
                    id="handle"
                    value={formData.handle}
                    onChange={(e) => handleInputChange('handle', e.target.value)}
                    placeholder="product-url-handle"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    URL: {NavigationHelper.getLiveUrl('product', formData.handle)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="compareAtPrice">Compare at Price</Label>
                    <Input
                      id="compareAtPrice"
                      type="number"
                      step="0.01"
                      value={formData.compareAtPrice}
                      onChange={(e) => handleInputChange('compareAtPrice', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {formData.compareAtPrice && Number.parseFloat(formData.compareAtPrice) > Number.parseFloat(formData.price) && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">
                        Sale price active - {Math.round(((Number.parseFloat(formData.compareAtPrice) - Number.parseFloat(formData.price)) / Number.parseFloat(formData.compareAtPrice)) * 100)}% off
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1"
                    />
                    {image && (
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-12 h-12 object-cover rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage(index)}
                      disabled={formData.images.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button onClick={addImage} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organization Tab */}
          <TabsContent value="organization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g., Serums, Cleansers, Eye Care"
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} variant="outline">
                      Add Tag
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Engine Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    placeholder="SEO-optimized title"
                    maxLength={60}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.seoTitle.length}/60 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    placeholder="SEO-optimized description"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.seoDescription.length}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Product Status</Label>
                    <p className="text-sm text-gray-500">Control product visibility</p>
                  </div>
                  <Switch
                    checked={formData.available}
                    onCheckedChange={(checked) => handleInputChange('available', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Featured Product</Label>
                    <p className="text-sm text-gray-500">Show in featured collections</p>
                  </div>
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
