"use client";

import { useState, useEffect } from 'react';
import {
  Eye,
  Edit3,
  ExternalLink,
  RefreshCw,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Zap,
  Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VisualEditingDashboardProps {
  isConnected?: boolean;
  onRefresh?: () => void;
}

export default function VisualEditingDashboard({
  isConnected = false,
  onRefresh
}: VisualEditingDashboardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Mock data for demonstration
  const [stats] = useState({
    totalPages: 12,
    draftChanges: 3,
    publishedToday: 2,
    activeCollaborators: 1
  });

  const [recentActivity] = useState([
    {
      id: 1,
      action: 'Homepage content updated',
      user: 'Admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      type: 'edit'
    },
    {
      id: 2,
      action: 'Product banner published',
      user: 'Admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      type: 'publish'
    },
    {
      id: 3,
      action: 'Category layout updated',
      user: 'Admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      type: 'edit'
    }
  ]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Simulate refresh operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSync(new Date());
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openPreview = (device = 'desktop') => {
    const url = previewUrl || '/';
    let params = '?preview=true';
    
    if (device === 'mobile') {
      params += '&device=mobile';
    } else if (device === 'tablet') {
      params += '&device=tablet';
    }
    
    window.open(url + params, '_blank');
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Content Management Status
            </CardTitle>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Offline Mode
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                {isConnected 
                  ? 'Content management system is running normally'
                  : 'Working with local content data'
                }
              </p>
              {lastSync && (
                <p className="text-xs text-gray-500">
                  Last sync: {lastSync.toLocaleTimeString()}
                </p>
              )}
            </div>
            <Button onClick={handleRefresh} disabled={isLoading} size="sm">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Total Pages</p>
                <p className="text-lg font-semibold">{stats.totalPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit3 className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-xs text-gray-600">Draft Changes</p>
                <p className="text-lg font-semibold">{stats.draftChanges}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Published Today</p>
                <p className="text-lg font-semibold">{stats.publishedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Active Users</p>
                <p className="text-lg font-semibold">{stats.activeCollaborators}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preview">Preview & Edit</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Content Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Enter page path (e.g., /products)"
                    value={previewUrl}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => openPreview('desktop')} size="sm" variant="outline">
                    <Monitor className="h-4 w-4 mr-1" />
                    Desktop
                  </Button>
                  <Button onClick={() => openPreview('tablet')} size="sm" variant="outline">
                    <Tablet className="h-4 w-4 mr-1" />
                    Tablet
                  </Button>
                  <Button onClick={() => openPreview('mobile')} size="sm" variant="outline">
                    <Smartphone className="h-4 w-4 mr-1" />
                    Mobile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'edit' ? 'bg-blue-500' :
                      activity.type === 'publish' ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500">
                        by {activity.user} • {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}