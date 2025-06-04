// ... existing code ... <original imports>

"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Star, Package, RefreshCw, Wifi, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { realStoreAPI, type RealProduct } from '@/lib/real-store-api';

export default function ProductsPage() {
  const [products, setProducts] = useState<RealProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<RealProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(realStoreAPI.getConnectionStatus());
  const [analytics, setAnalytics] = useState(realStoreAPI.getAnalytics());
  const [lastSync, setLastSync] = useState<string>('');

  // Load products from real store API
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const storeProducts = await realStoreAPI.getProducts();
      setProducts(storeProducts);
      setAnalytics(realStoreAPI.getAnalytics());
      setConnectionStatus(realStoreAPI.getConnectionStatus());
      setLastSync(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();

    // Listen for real-time store updates
    if (typeof window !== 'undefined') {
      const handleStoreUpdate = (event: any) => {
        console.log('Products page: Store update received', event.detail);
        loadProducts();
      };

      window.addEventListener('store-product-updated', handleStoreUpdate);

      return () => {
        window.removeEventListener('store-product-updated', handleStoreUpdate);
      };
    }
  }, [loadProducts]);

  // Filter products based on search and filters
  const filterProducts = useCallback(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Stock filter
    if (stockFilter !== 'all') {
      filtered = filtered.filter(product =>
        stockFilter === 'inStock' ? product.inStock : !product.inStock
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, stockFilter]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const success = await realStoreAPI.deleteProduct(productId);
        if (success) {
          await loadProducts(); // Reload to reflect changes
        }
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleToggleStock = async (productId: string) => {
    try {
      await realStoreAPI.toggleStock(productId);
      // Products will update via real-time event listener
    } catch (error) {
      console.error('Failed to toggle stock:', error);
    }
  };

  const handleToggleFeatured = async (productId: string) => {
    try {
      await realStoreAPI.toggleFeatured(productId);
      // Products will update via real-time event listener
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Test connection and refresh data
      await realStoreAPI.testConnection();
      await loadProducts();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReconnect = async () => {
    setIsRefreshing(true);
    try {
      await realStoreAPI.reconnect();
      await loadProducts();
    } catch (error) {
      console.error('Reconnection failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products from store...</p>
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Manage your product catalog and inventory</p>
            {lastSync && (
              <p className="text-xs text-gray-500 mt-1">
                Last synced: {lastSync}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Syncing...' : 'Sync Store'}
            </Button>
            <Link href="/products/new">
              <Button className="bg-black hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Connection Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  connectionStatus.health === 'healthy' ? 'bg-green-500' :
                  connectionStatus.health === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div>
                  <p className="font-medium">
                    Store Connection: {connectionStatus.type.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {connectionStatus.health === 'healthy'
                      ? `Connected - Changes sync to main store`
                      : connectionStatus.health === 'degraded'
                      ? 'Connection degraded - Limited sync capabilities'
                      : 'Offline - Using local data only'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {connectionStatus.endpoint && (
                  <Badge variant="outline">
                    {connectionStatus.endpoint.replace('https://', '')}
                  </Badge>
                )}
                {connectionStatus.health !== 'healthy' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReconnect}
                    disabled={isRefreshing}
                  >
                    <Wifi className="h-3 w-3 mr-1" />
                    Reconnect
                  </Button>
                )}
              </div>
            </div>

            {connectionStatus.health === 'offline' && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium">Limited functionality</p>
                    <p>
                      You can still manage products locally, but changes won't sync to the main store until connection is restored.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold">{analytics.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">In Stock</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.inStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{analytics.outOfStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Star className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-2xl font-bold text-yellow-600">{analytics.featured}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
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
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Products ({filteredProducts.length})</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {connectionStatus.type === 'api' ? 'Live Data' : 'Static Data'}
                </Badge>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {product.shortDescription || product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <span>{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through ml-2">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggleStock(product.id)}
                        className="flex items-center space-x-2 hover:bg-gray-50 p-1 rounded"
                      >
                        {product.inStock ? (
                          <ToggleRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-gray-400" />
                        )}
                        <Badge
                          variant={product.inStock ? "default" : "destructive"}
                          className={product.inStock ? "bg-green-100 text-green-800" : ""}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleToggleFeatured(product.id)}
                        className="flex items-center space-x-1 hover:bg-gray-50 p-1 rounded"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            product.featured
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                        {product.featured && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            Featured
                          </Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a
                              href={`${connectionStatus.endpoint || 'https://inkey-list-clone2.vercel.app'}/products/${product.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View in Store
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Product
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStock(product.id)}
                          >
                            <ToggleLeft className="h-4 w-4 mr-2" />
                            Toggle Stock
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleFeatured(product.id)}
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Toggle Featured
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Get started by adding your first product'
                  }
                </p>
                <Link href="/products/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Updates */}
        {analytics.recentlyUpdated.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recently Updated Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.recentlyUpdated.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-8 w-8 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(product.updatedAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-1">
                        {product.inStock && (
                          <Badge variant="outline" className="text-xs">In Stock</Badge>
                        )}
                        {product.featured && (
                          <Badge variant="outline" className="text-xs text-yellow-600">Featured</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
