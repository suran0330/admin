"use client";

import { useState, useMemo } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { products } from '@/data/products';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { isShopifyProduct, getProductDisplayName, formatPrice } from '@/lib/utils/productUtils';
import type { Product } from '@/data/products';
import type { ShopifyProductNormalized } from '@/types/shopify';

type CombinedProduct = Product | ShopifyProductNormalized;

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Get Shopify products
  const { data: shopifyData } = useShopifyProducts('all', 50);
  const shopifyProducts = shopifyData?.products || [];

  // Combine mock and Shopify products
  const allProducts: CombinedProduct[] = [...products, ...shopifyProducts];

  // Get unique categories
  const categories = Array.from(new Set([
    ...products.map(p => p.category),
    ...shopifyProducts.map(p => p.productType || 'Other')
  ]));

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesSearch = getProductDisplayName(product)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const productCategory = isShopifyProduct(product)
        ? product.productType || 'Other'
        : product.category;
      const matchesCategory = categoryFilter === 'all' || productCategory === categoryFilter;

      const matchesStock = stockFilter === 'all' ||
        (stockFilter === 'inStock' && product.inStock) ||
        (stockFilter === 'outOfStock' && !product.inStock);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [allProducts, searchTerm, categoryFilter, stockFilter]);

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const getProductPrice = (product: CombinedProduct): string => {
    if (isShopifyProduct(product) && product.variants && product.variants.length > 0) {
      return formatPrice(Number.parseFloat(product.variants[0].price.amount));
    }
    return product.price;
  };

  const getProductImage = (product: CombinedProduct): string => {
    if (isShopifyProduct(product)) {
      return product.images[0] || "/placeholder-product.jpg";
    }
    return product.images?.[0] || product.image || "/placeholder-product.jpg";
  };

  const getProductLink = (product: CombinedProduct): string => {
    if (isShopifyProduct(product)) {
      return `/admin/products/shopify/${product.handle}`;
    }
    return `/admin/products/${product.id}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-black hover:bg-gray-800">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Stock Status</option>
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">
                {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
              </span>
              <Button variant="outline" size="sm">
                Bulk Edit
              </Button>
              <Button variant="outline" size="sm">
                Update Stock
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                Delete Selected
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Products ({filteredProducts.length})</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Product</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Category</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Price</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Stock</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Source</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={getProductImage(product)}
                          alt={getProductDisplayName(product)}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {getProductDisplayName(product)}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {isShopifyProduct(product) ? product.description : product.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {isShopifyProduct(product) ? product.productType || 'Other' : product.category}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {getProductPrice(product)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isShopifyProduct(product)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {isShopifyProduct(product) ? 'Shopify' : 'Local'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Link href={`/products/${isShopifyProduct(product) ? product.handle : product.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={getProductLink(product)}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        {!isShopifyProduct(product) && (
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
