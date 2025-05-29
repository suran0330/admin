"use client";

import { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const categories = [
  'Serums',
  'Cleansers',
  'Moisturizers',
  'Eye Care',
  'Exfoliants',
  'Treatments',
  'Body Care'
];

const skinTypes = [
  'All Skin Types',
  'Normal',
  'Dry',
  'Oily',
  'Combination',
  'Sensitive',
  'Acne-Prone',
  'Mature'
];

const concerns = [
  'Hydration',
  'Dryness',
  'Acne',
  'Blemishes',
  'Fine Lines',
  'Dark Spots',
  'Large Pores',
  'Dullness',
  'Anti-Aging',
  'Sensitivity',
  'Blackheads',
  'Excess Oil',
  'Uneven Tone',
  'Firmness'
];

interface FormData {
  name: string;
  shortDescription: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  skinTypes: string[];
  concerns: string[];
  inStock: boolean;
  featured: boolean;
  sizes: string[];
  images: string[];
}

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    originalPrice: '',
    category: categories[0],
    skinTypes: [],
    concerns: [],
    inStock: true,
    featured: false,
    sizes: [''],
    images: ['']
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: 'skinTypes' | 'concerns', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = value;
    setFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  const addSize = () => {
    setFormData(prev => ({ ...prev, sizes: [...prev.sizes, ''] }));
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImage = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the data to your API
      console.log('Product data:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to products list
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600">Create a new product for your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <Input
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    placeholder="Brief description for product cards"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Textarea
                    required
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed product description"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <Input
                      required
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="£9.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price
                    </label>
                    <Input
                      value={formData.originalPrice}
                      onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                      placeholder="£12.99"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Images */}
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
                      placeholder="Image URL"
                      className="flex-1"
                    />
                    {formData.images.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addImage}>
                  <Upload className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </CardContent>
            </Card>

            {/* Sizes */}
            <Card>
              <CardHeader>
                <CardTitle>Available Sizes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={size}
                      onChange={(e) => handleSizeChange(index, e.target.value)}
                      placeholder="30ml"
                      className="flex-1"
                    />
                    {formData.sizes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSize(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addSize}>
                  Add Size
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category & Status */}
            <Card>
              <CardHeader>
                <CardTitle>Category & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={formData.inStock}
                    onChange={(e) => handleInputChange('inStock', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
                    In Stock
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Featured Product
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Skin Types */}
            <Card>
              <CardHeader>
                <CardTitle>Skin Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {skinTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`skin-${type}`}
                        checked={formData.skinTypes.includes(type)}
                        onChange={() => handleArrayInputChange('skinTypes', type)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={`skin-${type}`} className="text-sm text-gray-700">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skin Concerns */}
            <Card>
              <CardHeader>
                <CardTitle>Skin Concerns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {concerns.map(concern => (
                    <div key={concern} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`concern-${concern}`}
                        checked={formData.concerns.includes(concern)}
                        onChange={() => handleArrayInputChange('concerns', concern)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={`concern-${concern}`} className="text-sm text-gray-700">
                        {concern}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href="/admin/products">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="bg-black hover:bg-gray-800">
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
