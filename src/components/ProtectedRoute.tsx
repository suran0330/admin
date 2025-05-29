"use client";

import { type ReactNode, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, AlertTriangle, Eye, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth, useRequireAuth, useRequirePermission } from '@/contexts/AuthContext';
import type { Resource, Action, UserRole } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requirePermission?: {
    resource: Resource;
    action: Action;
  };
  requireRole?: UserRole;
  fallback?: ReactNode;
  showFallback?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requirePermission,
  requireRole,
  fallback,
  showFallback = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, hasPermission, logout } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [denialReason, setDenialReason] = useState('');

  const checkAccess = useCallback(() => {
    setIsChecking(true);
    setAccessDenied(false);

    // Check authentication
    if (requireAuth && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check role requirement
    if (requireRole && user?.role !== requireRole) {
      setAccessDenied(true);
      setDenialReason(`This page requires ${requireRole} role. You have ${user?.role || 'no'} role.`);
      setIsChecking(false);
      return;
    }

    // Check permission requirement
    if (requirePermission && !hasPermission(requirePermission.resource, requirePermission.action)) {
      setAccessDenied(true);
      setDenialReason(
        `You don't have permission to ${requirePermission.action} ${requirePermission.resource}.`
      );
      setIsChecking(false);
      return;
    }

    setIsChecking(false);
  }, [requireAuth, isAuthenticated, requireRole, user, requirePermission, hasPermission, router]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  if (isChecking) {
    return <LoadingFallback />;
  }

  if (accessDenied) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showFallback) {
      return (
        <AccessDeniedFallback
          reason={denialReason}
          user={user}
          onLogout={logout}
          onGoBack={() => router.back()}
        />
      );
    }

    return null;
  }

  return <>{children}</>;
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4" />
        <p className="text-gray-600">Checking permissions...</p>
      </div>
    </div>
  );
}

// Access denied fallback component
interface AccessDeniedFallbackProps {
  reason: string;
  user: any;
  onLogout: () => void;
  onGoBack: () => void;
}

function AccessDeniedFallback({ reason, user, onLogout, onGoBack }: AccessDeniedFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <p className="text-sm text-red-700">{reason}</p>
            </div>
          </div>

          {user && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Currently signed in as:</p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">
                    {user.firstName?.[0] || user.email?.[0] || '?'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Button onClick={onGoBack} variant="outline" className="w-full">
              Go Back
            </Button>
            <Button onClick={onLogout} variant="default" className="w-full bg-black hover:bg-gray-800">
              Sign Out
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            Contact your administrator if you believe you should have access to this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Specific permission wrappers for common use cases
export function RequireDesignPermission({ children, action = 'view' }: { children: ReactNode; action?: Action }) {
  return (
    <ProtectedRoute requirePermission={{ resource: 'design', action }}>
      {children}
    </ProtectedRoute>
  );
}

export function RequireProductPermission({ children, action = 'view' }: { children: ReactNode; action?: Action }) {
  return (
    <ProtectedRoute requirePermission={{ resource: 'products', action }}>
      {children}
    </ProtectedRoute>
  );
}

export function RequireAdminRole({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireRole="admin">
      {children}
    </ProtectedRoute>
  );
}

export function RequireSuperAdminRole({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireRole="super_admin">
      {children}
    </ProtectedRoute>
  );
}

// Component to show/hide content based on permissions
interface ConditionalRenderProps {
  children: ReactNode;
  requirePermission?: {
    resource: Resource;
    action: Action;
  };
  requireRole?: UserRole;
  fallback?: ReactNode;
}

export function ConditionalRender({
  children,
  requirePermission,
  requireRole,
  fallback = null,
}: ConditionalRenderProps) {
  const { user, hasPermission } = useAuth();

  // Check role requirement
  if (requireRole && user?.role !== requireRole) {
    return <>{fallback}</>;
  }

  // Check permission requirement
  if (requirePermission && !hasPermission(requirePermission.resource, requirePermission.action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Permission indicator component
interface PermissionIndicatorProps {
  resource: Resource;
  action: Action;
  className?: string;
}

export function PermissionIndicator({ resource, action, className = '' }: PermissionIndicatorProps) {
  const { hasPermission } = useAuth();
  const canAccess = hasPermission(resource, action);

  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      {canAccess ? (
        <>
          <Eye className="h-3 w-3 text-green-600" />
          <span className="text-xs text-green-600">Allowed</span>
        </>
      ) : (
        <>
          <Lock className="h-3 w-3 text-red-600" />
          <span className="text-xs text-red-600">Restricted</span>
        </>
      )}
    </div>
  );
}
