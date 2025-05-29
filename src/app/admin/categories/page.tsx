"use client";

import { useState } from 'react';
import { Plus, Edit, Trash2, Tag, Target, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { products } from '@/data/products';

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  type: 'product' | 'concern';
}

export default function CategoriesPage() {
  // Extract categories from products
  const productCategories = Array.from(new Set(products.map(p => p.category))).map(cat => ({
    id: cat.toLowerCase().replace(/\s+/g, '-'),
    name: cat,
    description: `Products in the ${cat} category`,
    productCount: products.filter(p => p.category === cat).length,
    type: 'product' as const
  }));

  const skinConcerns = Array.from(
    new Set(products.flatMap(p => p.concerns || []))
  ).map(concern => ({
    id: concern.toLowerCase().replace(/\s+/g, '-'),
    name: concern,
    description: `Products addressing ${concern}`,
    productCount: products.filter(p => p.concerns?.includes(concern)).length,
    type: 'concern' as const
  }));

  const [categories, setCategories] = useState<Category[]>([...productCategories, ...skinConcerns]);
  const [activeTab, setActiveTab] = useState<'product' | 'concern'>('product');
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    type: 'product' as 'product' | 'concern'
  });

  const filteredCategories = categories.filter(cat => cat.type === activeTab);

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) return;

    const category: Category = {
      id: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
      name: newCategory.name,
      description: newCategory.description,
      productCount: 0,
      type: newCategory.type
    };

    setCategories(prev => [...prev, category]);
    setNewCategory({ name: '', description: '', type: 'product' });
    setIsCreating(false);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;

    setCategories(prev => prev.map(cat =>
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage product categories and skin concerns</p>
        </div>
        <Button
          onClick={() => {
            setIsCreating(true);
            setNewCategory(prev => ({ ...prev, type: activeTab }));
          }}
          className="bg-black hover:bg-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {activeTab === 'product' ? 'Category' : 'Concern'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('product')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'product'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          <Package className="h-4 w-4 mr-2 inline" />
          Product Categories
        </button>
        <button
          onClick={() => setActiveTab('concern')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'concern'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          <Target className="h-4 w-4 mr-2 inline" />
          Skin Concerns
        </button>
      </div>

      {/* Create New Category Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Add New {activeTab === 'product' ? 'Category' : 'Concern'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder={activeTab === 'product' ? 'Enter category name' : 'Enter concern name'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleCreateCategory} className="bg-black hover:bg-gray-800">
                Create
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Category Form */}
      {editingCategory && (
        <Card>
          <CardHeader>
            <CardTitle>Edit {editingCategory.type === 'product' ? 'Category' : 'Concern'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <Input
                value={editingCategory.name}
                onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={editingCategory.description}
                onChange={(e) => setEditingCategory(prev => prev ? { ...prev, description: e.target.value } : null)}
                placeholder="Enter description"
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleUpdateCategory} className="bg-black hover:bg-gray-800">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    category.type === 'product' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {category.type === 'product' ? (
                      <Tag className={`h-5 w-5 ${
                        category.type === 'product' ? 'text-blue-600' : 'text-green-600'
                      }`} />
                    ) : (
                      <Target className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.productCount} products</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {category.description}
              </p>

              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  category.type === 'product'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {category.type === 'product' ? 'Product Category' : 'Skin Concern'}
                </span>

                <Button variant="outline" size="sm">
                  View Products
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            {activeTab === 'product' ? (
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            ) : (
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            )}
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab === 'product' ? 'categories' : 'concerns'} found
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first {activeTab === 'product' ? 'category' : 'concern'} to organize your products
            </p>
            <Button
              onClick={() => {
                setIsCreating(true);
                setNewCategory(prev => ({ ...prev, type: activeTab }));
              }}
              className="bg-black hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab === 'product' ? 'Category' : 'Concern'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
