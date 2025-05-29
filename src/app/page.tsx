"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  RefreshCw,
  Zap,
  Settings,
  Activity,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/AdminLayout';
import StoreConnectionStatus from '@/components/StoreConnectionStatus';
import { useAuth } from '@/contexts/AuthContext';
import { realStoreAPI, type RealProduct } from '@/lib/real-store-api';

export default function DashboardPage() {
  const { user, hasPermission } = useAuth();
  const [products, setProducts] = useState<RealProduct[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string>('');

  useEffect(() => {
    loadDashboardData();

    // Listen for store updates
    if (typeof window !== 'undefined') {
      const handleStoreUpdate = () => {
        loadDashboardData();
        setLastSync(new Date().toLocaleTimeString());
      };

      window.addEventListener('store-product-updated', handleStoreUpdate);

      return () => {
        window.removeEventListener('store-product-updated', handleStoreUpdate);
      };
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [productsData, analyticsData] = await Promise.all([
        realStoreAPI.getProducts(),
        Promise.resolve(realStoreAPI.getAnalytics())
      ]);

      setProducts(productsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    await loadDashboardData();
    setLastSync(new Date().toLocaleTimeString());
  };

  const featuredProducts = products.filter(p => p.featured).slice(0, 3);
  const recentProducts = products
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName || user?.name || 'Admin'}
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your INKEY List store today
            </p>
            {lastSync && (
              <p className="text-xs text-gray-500 mt-1">
                Last synced: {lastSync}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleRefreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            {hasPermission('products', 'create') && (
              <Link href="/products/new">
                <Button className="bg-black hover:bg-gray-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Store Connection Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold">{analytics?.total || 0}</p>
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
                      <p className="text-2xl font-bold text-green-600">{analytics?.inStock || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Featured</p>
                      <p className="text-2xl font-bold text-yellow-600">{analytics?.featured || 0}</p>
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
                      <p className="text-2xl font-bold text-red-600">{analytics?.outOfStock || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {hasPermission('products', 'view') && (
                    <Link href="/products">
                      <Button variant="outline" className="w-full justify-start">
                        <Package className="h-4 w-4 mr-2" />
                        Manage Products
                      </Button>
                    </Link>
                  )}

                  {hasPermission('design', 'view') && (
                    <Link href="/design">
                      <Button variant="outline" className="w-full justify-start">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Design
                      </Button>
                    </Link>
                  )}

                  {hasPermission('analytics', 'view') && (
                    <Link href="/analytics">
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                    </Link>
                  )}

                  {hasPermission('settings', 'view') && (
                    <Link href="/settings">
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Connection Status */}
          <div>
            <StoreConnectionStatus className="mb-6" />

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Dashboard</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Store API</span>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Live Preview</span>
                  <Badge className="bg-green-100 text-green-800">Available</Badge>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <Link
                    href="https://inkey-list-clone.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    View Live Store
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Featured Products</span>
                {hasPermission('products', 'view') && (
                  <Link href="/products?filter=featured">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.price}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          {product.inStock ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">In Stock</Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        {recentProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recently Updated Products</span>
                {hasPermission('products', 'view') && (
                  <Link href="/products">
                    <Button variant="outline" size="sm">
                      <Package className="h-4 w-4 mr-2" />
                      Manage All
                    </Button>
                  </Link>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category} • {product.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(product.updatedAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
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

        {/* Category Overview */}
        {analytics?.categories && Object.keys(analytics.categories).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Products by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(analytics.categories).map(([category, count]) => (
                  <div key={category} className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{count as number}</p>
                    <p className="text-sm text-gray-600">{category}</p>
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
