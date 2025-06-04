"use client";

import { useState } from 'react';
import { TrendingUp, Package, ShoppingCart, Users, Eye, Heart, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { products } from '@/data/products';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data - in a real app, this would come from your analytics service
  const analyticsData = {
    overview: {
      totalViews: 12450,
      totalSales: 325,
      conversionRate: 2.6,
      avgOrderValue: 28.50,
      topProducts: [
        { id: 'hyaluronic-acid-serum', name: 'Hyaluronic Acid Serum', views: 2340, sales: 89, revenue: 710.11 },
        { id: 'niacinamide', name: 'Niacinamide', views: 1980, sales: 76, revenue: 455.24 },
        { id: 'vitamin-c-serum', name: 'Vitamin C Serum', views: 1750, sales: 62, revenue: 619.38 },
        { id: 'retinol-eye-cream', name: 'Retinol Eye Cream', views: 1520, sales: 45, revenue: 449.55 },
        { id: 'bha-beta-hydroxy-acid', name: 'BHA Exfoliant', views: 1340, sales: 53, revenue: 475.47 }
      ]
    },
    categoryPerformance: [
      { category: 'Serums', products: 6, totalSales: 285, revenue: 2140.50, avgRating: 4.6 },
      { category: 'Moisturizers', products: 2, totalSales: 120, revenue: 1548.00, avgRating: 4.4 },
      { category: 'Eye Care', products: 2, totalSales: 78, revenue: 623.22, avgRating: 4.3 },
      { category: 'Cleansers', products: 2, totalSales: 95, revenue: 940.50, avgRating: 4.5 },
      { category: 'Exfoliants', products: 1, totalSales: 53, revenue: 475.47, avgRating: 4.7 }
    ],
    recentActivity: [
      { type: 'sale', product: 'Hyaluronic Acid Serum', amount: '£7.99', time: '2 hours ago' },
      { type: 'view', product: 'Niacinamide', time: '3 hours ago' },
      { type: 'sale', product: 'Vitamin C Serum', amount: '£9.99', time: '4 hours ago' },
      { type: 'review', product: 'Retinol Eye Cream', rating: 5, time: '5 hours ago' },
      { type: 'sale', product: 'BHA Exfoliant', amount: '£8.99', time: '6 hours ago' }
    ]
  };

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  const overviewStats = [
    {
      title: 'Total Views',
      value: analyticsData.overview.totalViews.toLocaleString(),
      change: '+12.5%',
      positive: true,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Sales',
      value: analyticsData.overview.totalSales.toString(),
      change: '+8.2%',
      positive: true,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Conversion Rate',
      value: `${analyticsData.overview.conversionRate}%`,
      change: '+0.4%',
      positive: true,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Avg Order Value',
      value: `£${analyticsData.overview.avgOrderValue}`,
      change: '-2.1%',
      positive: false,
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your store performance and product insights</p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        >
          {timeRanges.map(range => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last period
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.overview.topProducts.map((product, index) => {
                const productData = products.find(p => p.id === product.id);
                return (
                  <div key={product.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    </div>

                    {productData && (
                      <img
                        src={productData.image}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{product.views.toLocaleString()} views</span>
                        <span>{product.sales} sales</span>
                        <span>£{product.revenue.toFixed(2)} revenue</span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.categoryPerformance.map((category) => (
                <div key={category.category} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{category.category}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{category.avgRating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Products</p>
                      <p className="font-medium">{category.products}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Sales</p>
                      <p className="font-medium">{category.totalSales}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Revenue</p>
                      <p className="font-medium">£{category.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  activity.type === 'sale' ? 'bg-green-100' :
                  activity.type === 'view' ? 'bg-blue-100' :
                  activity.type === 'review' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  {activity.type === 'sale' && <ShoppingCart className="h-4 w-4 text-green-600" />}
                  {activity.type === 'view' && <Eye className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'review' && <Star className="h-4 w-4 text-yellow-600" />}
                </div>

                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {activity.type === 'sale' && `Sale: ${activity.product}`}
                    {activity.type === 'view' && `Product viewed: ${activity.product}`}
                    {activity.type === 'review' && `New review for ${activity.product}`}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>

                <div className="text-right">
                  {activity.type === 'sale' && (
                    <p className="text-sm font-medium text-green-600">{activity.amount}</p>
                  )}
                  {activity.type === 'review' && (
                    <div className="flex items-center">
                      {[...Array(activity.rating || 0)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">In Stock</span>
                <span className="text-sm font-medium text-green-600">
                  {products.filter(p => p.inStock).length} products
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Low Stock</span>
                <span className="text-sm font-medium text-orange-600">2 products</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Out of Stock</span>
                <span className="text-sm font-medium text-red-600">
                  {products.filter(p => !p.inStock).length} products
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Currently Featured</span>
                <span className="text-sm font-medium">
                  {products.filter(p => p.featured).length} products
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Performance</span>
                <span className="text-sm font-medium text-green-600">+15% sales</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Rating</span>
                <span className="text-sm font-medium">4.6 ⭐</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Return Customers</span>
                <span className="text-sm font-medium">68%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Reviews</span>
                <span className="text-sm font-medium">4.5 ⭐</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Top Concern</span>
                <span className="text-sm font-medium">Hydration</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
