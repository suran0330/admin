import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle, CheckCircle, ExternalLink, Palette, Layout, Grid, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

export default function AdminDashboard() {
  // Mock data - in a real app, this would come from your API
  const stats = [
    {
      title: 'Design Elements',
      value: '45',
      change: '+5 this week',
      positive: true,
      icon: Palette,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Active Layouts',
      value: '8',
      change: '+2 new layouts',
      positive: true,
      icon: Layout,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Visual Assets',
      value: '127',
      change: '+18 this month',
      positive: true,
      icon: Image,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Components',
      value: '23',
      change: '+3 customized',
      positive: true,
      icon: Grid,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentActivity = [
    { type: 'design', message: 'Updated homepage hero section colors', time: '2 hours ago', user: 'Admin' },
    { type: 'layout', message: 'Added new product showcase section', time: '4 hours ago', user: 'Admin' },
    { type: 'theme', message: 'Published new color theme changes', time: '6 hours ago', user: 'Admin' },
    { type: 'asset', message: 'Uploaded 5 new product images', time: '8 hours ago', user: 'Admin' },
    { type: 'component', message: 'Customized product card styling', time: '1 day ago', user: 'Admin' }
  ];

  const designTools = [
    {
      name: 'Theme Manager',
      href: '/design/themes',
      icon: Palette,
      description: 'Customize colors, fonts, and styling',
      status: 'active'
    },
    {
      name: 'Layout Builder',
      href: '/design/layouts',
      icon: Layout,
      description: 'Design page structures and sections',
      status: 'active'
    },
    {
      name: 'Asset Library',
      href: '/design/assets',
      icon: Image,
      description: 'Manage images, icons, and media',
      status: 'active'
    },
    {
      name: 'Component Studio',
      href: '/design/components',
      icon: Grid,
      description: 'Customize UI components',
      status: 'beta'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Design Dashboard</h1>
            <p className="text-gray-600">Manage your website's appearance and user experience</p>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://inkey-list-clone.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Live Site
            </a>
            <Link href="/design">
              <Button className="bg-black hover:bg-gray-800">
                <Palette className="h-4 w-4 mr-2" />
                Design Studio
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Design Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Design Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {designTools.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="p-2 bg-white rounded-lg mr-4 group-hover:bg-gray-50">
                      <tool.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{tool.name}</h3>
                        {tool.status === 'beta' && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            Beta
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{tool.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Design Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Design Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'design' ? 'bg-purple-100' :
                      activity.type === 'layout' ? 'bg-blue-100' :
                      activity.type === 'theme' ? 'bg-green-100' :
                      activity.type === 'asset' ? 'bg-orange-100' :
                      activity.type === 'component' ? 'bg-pink-100' : 'bg-gray-100'
                    }`}>
                      {activity.type === 'design' && <Palette className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'layout' && <Layout className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'theme' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {activity.type === 'asset' && <Image className="h-4 w-4 text-orange-600" />}
                      {activity.type === 'component' && <Grid className="h-4 w-4 text-pink-600" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">{activity.time}</p>
                        <p className="text-xs text-gray-500">by {activity.user}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Start</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/design/themes" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Palette className="h-4 w-4 mr-2" />
                    Customize Colors
                  </Button>
                </Link>
                <Link href="/design/layouts" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Layout className="h-4 w-4 mr-2" />
                    Edit Page Layout
                  </Button>
                </Link>
                <Link href="/design/assets" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Image className="h-4 w-4 mr-2" />
                    Upload Images
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="font-medium">INKEY Default</h3>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 bg-black rounded border"></div>
                  <div className="w-6 h-6 bg-purple-400 rounded border"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded border"></div>
                  <div className="w-6 h-6 bg-white rounded border border-gray-300"></div>
                </div>
                <Link href="/design/themes">
                  <Button variant="outline" size="sm" className="w-full">
                    Customize Theme
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Design Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Theme</span>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Layouts</span>
                  <span className="text-sm font-medium text-green-600">Published</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assets</span>
                  <span className="text-sm font-medium text-blue-600">Optimized</span>
                </div>
                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  All Systems Good
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
