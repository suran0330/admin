"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { getAuthService, type User, type AuthSession, type LoginCredentials, type UserRole, type Resource, type Action } from '@/lib/auth';
import { initializeStoreAPI, getStoreAPI, defaultStoreConfig } from '@/lib/store-api';

interface AuthContextType {
  // Auth state
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Auth methods
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string; requiresTwoFactor?: boolean }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;

  // Permission methods
  hasPermission: (resource: Resource, action: Action) => boolean;
  canAccess: (resource: Resource) => boolean;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;

  // User management
  updatePreferences: (preferences: Record<string, unknown>) => Promise<{ success: boolean; message: string }>;
  enableTwoFactor: () => Promise<{ success: boolean; qrCode?: string; backupCodes?: string[]; message: string }>;
  disableTwoFactor: (code: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authService = getAuthService();

  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check for existing session
      const existingSession = authService.getSession();

      if (existingSession && authService.isAuthenticated()) {
        setSession(existingSession);
        setUser(existingSession.user);

        // Initialize Store API with user's credentials
        initializeStoreAPI({
          ...defaultStoreConfig,
          adminToken: existingSession.token,
        });

        // Set up real-time connection
        setupStoreConnection();
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initialize authentication on mount
    initializeAuth();
  }, [initializeAuth]);

  const setupStoreConnection = () => {
    const storeAPI = getStoreAPI();

    // Set up event listeners for real-time updates
    storeAPI.on('orderCreated', (order) => {
      console.log('📦 New order received:', order);
      // You can trigger notifications here
    });

    storeAPI.on('productUpdated', (product) => {
      console.log('📝 Product updated:', product);
    });

    storeAPI.on('lowStock', (product) => {
      console.log('⚠️ Low stock alert:', product);
      // You can show alerts here
    });

    storeAPI.on('customerCreated', (customer) => {
      console.log('👤 New customer registered:', customer);
    });
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const result = await authService.login(credentials);

      if (result.success && result.user) {
        const newSession = authService.getSession();
        setSession(newSession);
        setUser(result.user);

        // Initialize Store API with new credentials
        initializeStoreAPI({
          ...defaultStoreConfig,
          adminToken: newSession?.token || '',
        });

        setupStoreConnection();
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Disconnect from store
      try {
        getStoreAPI().disconnect();
      } catch (e) {
        // Store API might not be initialized
      }

      await authService.logout();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const success = await authService.refreshToken();

      if (success) {
        const refreshedSession = authService.getSession();
        setSession(refreshedSession);

        if (refreshedSession) {
          // Update Store API token
          initializeStoreAPI({
            ...defaultStoreConfig,
            adminToken: refreshedSession.token,
          });
        }
      } else {
        // Token refresh failed, log out user
        await logout();
      }

      return success;
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      return false;
    }
  };

  const hasPermission = (resource: Resource, action: Action): boolean => {
    return authService.hasPermission(resource, action);
  };

  const canAccess = (resource: Resource): boolean => {
    return authService.canAccess(resource);
  };

  const isSuperAdmin = (): boolean => {
    return authService.isSuperAdmin();
  };

  const isAdmin = (): boolean => {
    return authService.isAdmin();
  };

  const updatePreferences = async (preferences: Record<string, unknown>) => {
    const result = await authService.updatePreferences(preferences);

    if (result.success && session) {
      setSession({ ...session });
      setUser({ ...session.user });
    }

    return result;
  };

  const enableTwoFactor = async () => {
    return await authService.enableTwoFactor();
  };

  const disableTwoFactor = async (code: string) => {
    return await authService.disableTwoFactor(code);
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: authService.isAuthenticated(),
    isLoading,
    login,
    logout,
    refreshToken,
    hasPermission,
    canAccess,
    isSuperAdmin,
    isAdmin,
    updatePreferences,
    enableTwoFactor,
    disableTwoFactor,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Permission hooks
export function usePermission(resource: Resource, action: Action): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(resource, action);
}

export function useCanAccess(resource: Resource): boolean {
  const { canAccess } = useAuth();
  return canAccess(resource);
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login page
      window.location.href = '/login';
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
}

export function useRequirePermission(resource: Resource, action: Action) {
  const { hasPermission, isAuthenticated, isLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        window.location.href = '/login';
        return;
      }

      if (!hasPermission(resource, action)) {
        setHasAccess(false);
        // You could redirect to an unauthorized page here
        console.warn(`Access denied: ${action} ${resource}`);
      } else {
        setHasAccess(true);
      }
    }
  }, [isAuthenticated, isLoading, hasPermission, resource, action]);

  return { hasAccess, isLoading };
}

export function useRole(): UserRole | null {
  const { user } = useAuth();
  return user?.role || null;
}

export default AuthContext;
