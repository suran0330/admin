// Authentication and Role-Based Access Control System

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer' | 'designer';

export interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  department?: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  twoFactorEnabled: boolean;
  preferences: UserPreferences;
}

export interface Permission {
  resource: Resource;
  actions: Action[];
  scope?: 'own' | 'department' | 'all';
}

export type Resource =
  | 'products'
  | 'orders'
  | 'customers'
  | 'analytics'
  | 'design'
  | 'settings'
  | 'users'
  | 'integrations'
  | 'assets'
  | 'reports';

export type Action = 'view' | 'create' | 'edit' | 'delete' | 'publish' | 'export' | 'manage';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    slack: boolean;
  };
  dashboard: {
    defaultView: string;
    widgets: string[];
  };
}

export interface AuthSession {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: number;
  permissions: Permission[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  message?: string;
  requiresTwoFactor?: boolean;
}

// Role definitions with default permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    { resource: 'products', actions: ['view', 'create', 'edit', 'delete', 'publish'] },
    { resource: 'orders', actions: ['view', 'create', 'edit', 'delete', 'export'] },
    { resource: 'customers', actions: ['view', 'create', 'edit', 'delete', 'export'] },
    { resource: 'analytics', actions: ['view', 'export'] },
    { resource: 'design', actions: ['view', 'create', 'edit', 'delete', 'publish'] },
    { resource: 'settings', actions: ['view', 'edit', 'manage'] },
    { resource: 'users', actions: ['view', 'create', 'edit', 'delete', 'manage'] },
    { resource: 'integrations', actions: ['view', 'edit', 'manage'] },
    { resource: 'assets', actions: ['view', 'create', 'edit', 'delete'] },
    { resource: 'reports', actions: ['view', 'export'] },
  ],
  admin: [
    { resource: 'products', actions: ['view', 'create', 'edit', 'delete', 'publish'] },
    { resource: 'orders', actions: ['view', 'edit', 'export'] },
    { resource: 'customers', actions: ['view', 'edit', 'export'] },
    { resource: 'analytics', actions: ['view', 'export'] },
    { resource: 'design', actions: ['view', 'create', 'edit', 'publish'] },
    { resource: 'settings', actions: ['view', 'edit'] },
    { resource: 'users', actions: ['view'], scope: 'department' },
    { resource: 'integrations', actions: ['view', 'edit'] },
    { resource: 'assets', actions: ['view', 'create', 'edit', 'delete'] },
    { resource: 'reports', actions: ['view', 'export'] },
  ],
  editor: [
    { resource: 'products', actions: ['view', 'create', 'edit'] },
    { resource: 'orders', actions: ['view'], scope: 'department' },
    { resource: 'customers', actions: ['view'], scope: 'department' },
    { resource: 'analytics', actions: ['view'] },
    { resource: 'design', actions: ['view', 'edit'] },
    { resource: 'assets', actions: ['view', 'create', 'edit'] },
  ],
  designer: [
    { resource: 'design', actions: ['view', 'create', 'edit', 'publish'] },
    { resource: 'assets', actions: ['view', 'create', 'edit', 'delete'] },
    { resource: 'products', actions: ['view'] },
    { resource: 'analytics', actions: ['view'] },
  ],
  viewer: [
    { resource: 'products', actions: ['view'] },
    { resource: 'orders', actions: ['view'], scope: 'own' },
    { resource: 'customers', actions: ['view'], scope: 'own' },
    { resource: 'analytics', actions: ['view'] },
    { resource: 'design', actions: ['view'] },
    { resource: 'assets', actions: ['view'] },
  ],
};

class AuthService {
  private session: AuthSession | null = null;
  private refreshTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.loadSessionFromStorage();
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.user && data.token) {
        await this.setSession({
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken || '',
          expiresAt: Date.now() + (8 * 60 * 60 * 1000), // 8 hours
          permissions: this.getUserPermissions(data.user),
        });
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.session?.token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.session.token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  async refreshToken(): Promise<boolean> {
    if (!this.session?.refreshToken) {
      return false;
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.session.refreshToken,
        }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        this.session.token = data.token;
        this.session.expiresAt = Date.now() + (8 * 60 * 60 * 1000);
        this.saveSessionToStorage();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    if (!this.session?.token) {
      return { success: false, message: 'Not authenticated' };
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.session.token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: 'Failed to change password' };
    }
  }

  // Session management
  private async setSession(session: AuthSession): Promise<void> {
    this.session = session;
    this.saveSessionToStorage();
    this.setupTokenRefresh();
  }

  private clearSession(): void {
    this.session = null;
    this.clearSessionFromStorage();
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  private saveSessionToStorage(): void {
    if (this.session) {
      localStorage.setItem('auth_session', JSON.stringify(this.session));
    }
  }

  private loadSessionFromStorage(): void {
    try {
      const stored = localStorage.getItem('auth_session');
      if (stored) {
        const session: AuthSession = JSON.parse(stored);

        // Check if session is still valid
        if (session.expiresAt > Date.now()) {
          this.session = session;
          this.setupTokenRefresh();
        } else {
          this.clearSessionFromStorage();
        }
      }
    } catch (error) {
      console.error('Failed to load session from storage:', error);
      this.clearSessionFromStorage();
    }
  }

  private clearSessionFromStorage(): void {
    localStorage.removeItem('auth_session');
  }

  private setupTokenRefresh(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    if (this.session) {
      // Refresh token 5 minutes before expiry
      const refreshTime = this.session.expiresAt - Date.now() - (5 * 60 * 1000);

      if (refreshTime > 0) {
        this.refreshTimeout = setTimeout(() => {
          this.refreshToken();
        }, refreshTime);
      }
    }
  }

  // Permission system
  private getUserPermissions(user: User): Permission[] {
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    return [...rolePermissions, ...user.permissions];
  }

  public hasPermission(resource: Resource, action: Action): boolean {
    if (!this.session) return false;

    return this.session.permissions.some(permission =>
      permission.resource === resource &&
      permission.actions.includes(action)
    );
  }

  public canAccess(resource: Resource): boolean {
    if (!this.session) return false;

    return this.session.permissions.some(permission =>
      permission.resource === resource &&
      permission.actions.includes('view')
    );
  }

  public getAccessibleResources(): Resource[] {
    if (!this.session) return [];

    return Array.from(new Set(
      this.session.permissions
        .filter(p => p.actions.includes('view'))
        .map(p => p.resource)
    ));
  }

  public isSuperAdmin(): boolean {
    return this.session?.user.role === 'super_admin';
  }

  public isAdmin(): boolean {
    return this.session?.user.role === 'super_admin' || this.session?.user.role === 'admin';
  }

  // Getters
  public getSession(): AuthSession | null {
    return this.session;
  }

  public getUser(): User | null {
    return this.session?.user || null;
  }

  public getToken(): string | null {
    return this.session?.token || null;
  }

  public isAuthenticated(): boolean {
    return this.session !== null && this.session.expiresAt > Date.now();
  }

  public getAuthHeaders(): HeadersInit {
    if (!this.session?.token) {
      throw new Error('No authentication token available');
    }

    return {
      'Authorization': `Bearer ${this.session.token}`,
      'Content-Type': 'application/json',
    };
  }

  // User preferences
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<{ success: boolean; message: string }> {
    if (!this.session?.token) {
      return { success: false, message: 'Not authenticated' };
    }

    try {
      const response = await fetch('/api/auth/preferences', {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      if (data.success && this.session.user) {
        this.session.user.preferences = { ...this.session.user.preferences, ...preferences };
        this.saveSessionToStorage();
      }

      return data;
    } catch (error) {
      console.error('Update preferences error:', error);
      return { success: false, message: 'Failed to update preferences' };
    }
  }

  // Two-factor authentication
  async enableTwoFactor(): Promise<{ success: boolean; qrCode?: string; backupCodes?: string[]; message: string }> {
    if (!this.session?.token) {
      return { success: false, message: 'Not authenticated' };
    }

    try {
      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Enable 2FA error:', error);
      return { success: false, message: 'Failed to enable two-factor authentication' };
    }
  }

  async disableTwoFactor(code: string): Promise<{ success: boolean; message: string }> {
    if (!this.session?.token) {
      return { success: false, message: 'Not authenticated' };
    }

    try {
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ code }),
      });

      return await response.json();
    } catch (error) {
      console.error('Disable 2FA error:', error);
      return { success: false, message: 'Failed to disable two-factor authentication' };
    }
  }
}

// Permission checking utilities
export function requirePermission(resource: Resource, action: Action) {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const auth = getAuthService();

      if (!auth.isAuthenticated()) {
        throw new Error('Authentication required');
      }

      if (!auth.hasPermission(resource, action)) {
        throw new Error(`Insufficient permissions: ${action} ${resource}`);
      }

      return method.apply(this, args);
    };
  };
}

export function requireRole(role: UserRole) {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const auth = getAuthService();
      const user = auth.getUser();

      if (!user || user.role !== role) {
        throw new Error(`Role ${role} required`);
      }

      return method.apply(this, args);
    };
  };
}

// Export singleton instance
let authServiceInstance: AuthService | null = null;

export function getAuthService(): AuthService {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService();
  }
  return authServiceInstance;
}

export default AuthService;
