"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Zap,
  Database,
  Globe,
  Clock,
  Activity
} from 'lucide-react';
import { realStoreAPI, type StoreConnection } from '@/lib/real-store-api';

interface ConnectionStatusProps {
  showDetails?: boolean;
  className?: string;
}

export default function StoreConnectionStatus({ showDetails = true, className = '' }: ConnectionStatusProps) {
  const [connection, setConnection] = useState<StoreConnection>(realStoreAPI.getConnectionStatus());
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [lastTest, setLastTest] = useState<{ success: boolean; latency: number; message: string } | null>(null);

  useEffect(() => {
    // Listen for store updates
    const handleStoreUpdate = () => {
      setConnection(realStoreAPI.getConnectionStatus());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('store-product-updated', handleStoreUpdate);

      return () => {
        window.removeEventListener('store-product-updated', handleStoreUpdate);
      };
    }
  }, []);

  useEffect(() => {
    // Test connection on mount
    testConnection();

    // Set up periodic health checks (every 30 seconds)
    const healthInterval = setInterval(testConnection, 30000);

    return () => {
      clearInterval(healthInterval);
    };
  }, []);

  const testConnection = async () => {
    try {
      const result = await realStoreAPI.testConnection();
      setLastTest(result);
      setConnection(realStoreAPI.getConnectionStatus());
    } catch (error) {
      setLastTest({
        success: false,
        latency: 0,
        message: 'Connection test failed'
      });
    }
  };

  const handleReconnect = async () => {
    setIsReconnecting(true);
    try {
      await realStoreAPI.reconnect();
      setConnection(realStoreAPI.getConnectionStatus());
      await testConnection();
    } catch (error) {
      console.error('Reconnection failed:', error);
    } finally {
      setIsReconnecting(false);
    }
  };

  const getStatusIcon = () => {
    switch (connection.health) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-600" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (connection.health) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConnectionTypeIcon = () => {
    switch (connection.type) {
      case 'api':
        return <Globe className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'static':
        return <Zap className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (!showDetails) {
    // Compact version for header/nav
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getStatusIcon()}
        <Badge variant="outline" className={getStatusColor()}>
          {connection.health.toUpperCase()}
        </Badge>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4" />
            <span>Store Connection</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReconnect}
            disabled={isReconnecting}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-3 w-3 ${isReconnecting ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">
              {connection.health === 'healthy' ? 'Connected' :
               connection.health === 'degraded' ? 'Degraded' : 'Offline'}
            </span>
          </div>
          <Badge className={getStatusColor()}>
            {connection.health.toUpperCase()}
          </Badge>
        </div>

        {/* Connection Type */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getConnectionTypeIcon()}
            <span className="text-sm text-gray-600">Type</span>
          </div>
          <Badge variant="outline">
            {connection.type.toUpperCase()}
          </Badge>
        </div>

        {/* Endpoint */}
        {connection.endpoint && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Endpoint</span>
            </div>
            <div className="text-xs text-gray-500 text-right">
              <a
                href={connection.endpoint}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 truncate block max-w-32"
              >
                {connection.endpoint.replace('https://', '')}
              </a>
            </div>
          </div>
        )}

        {/* Last Sync */}
        {connection.lastSync && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Last Sync</span>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(connection.lastSync).toLocaleTimeString()}
            </span>
          </div>
        )}

        {/* Latency */}
        {lastTest && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Latency</span>
            </div>
            <span className={`text-xs ${
              lastTest.latency < 200 ? 'text-green-600' :
              lastTest.latency < 500 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {lastTest.latency}ms
            </span>
          </div>
        )}

        {/* Status Message */}
        {lastTest && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {lastTest.message}
            </p>
          </div>
        )}

        {/* Actions */}
        {connection.health !== 'healthy' && (
          <div className="pt-2 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReconnect}
              disabled={isReconnecting}
              className="w-full"
            >
              {isReconnecting ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  Reconnecting...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Reconnect
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
