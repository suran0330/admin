import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { products } from '@/data/products';
import DemoGuide from '@/components/admin/DemoGuide';

export default function AdminDashboard() {
  // Calculate stats from mock data
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const featuredProducts = products.filter(p => p.featured).length;
  const lowStockProducts = Math.floor(Math.random() * 5) + 1; // Mock data

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'In Stock',
      value: inStockProducts.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Featured',
      value: featuredProducts.toString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Low Stock',
      value: lowStockProducts.toString(),
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Products</span>
              <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-800">
                View all
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">{product.price}</p>
                  </div>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.inStock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link
                href="/admin/products/new"
                className="flex items-center p-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Package className="h-5 w-5 mr-3" />
                Add New Product
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center p-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <TrendingUp className="h-5 w-5 mr-3" />
                Manage Categories
              </Link>

              <Link
                href="/admin/products"
                className="flex items-center p-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ShoppingCart className="h-5 w-5 mr-3" />
                View All Products
              </Link>

              <Link
                href="/admin/analytics"
                className="flex items-center p-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Users className="h-5 w-5 mr-3" />
                View Analytics
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Guide */}
      <DemoGuide />
    </div>
  );
}
