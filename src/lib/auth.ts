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
      // Mock authentication for demo purposes
      const demoUsers = {
        'admin@inkey.com': {
          id: 'admin-1',
          email: 'admin@inkey.com',
          name: 'Admin User',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin' as UserRole,
          permissions: ROLE_PERMISSIONS.admin,
          department: 'Administration',
          createdAt: '2024-01-01T00:00:00Z',
          lastLoginAt: new Date().toISOString(),
          isActive: true,
          twoFactorEnabled: false,
          preferences: {
            theme: 'light' as const,
            language: 'en',
            timezone: 'UTC',
            notifications: {
              email: true,
              push: true,
              slack: false
            },
            dashboard: {
              defaultView: 'overview',
              widgets: ['products', 'analytics', 'orders']
            }
          }
        },
        'designer@inkey.com': {
          id: 'designer-1',
          email: 'designer@inkey.com',
          name: 'Design User',
          firstName: 'Design',
          lastName: 'User',
          role: 'designer' as UserRole,
          permissions: ROLE_PERMISSIONS.designer,
          department: 'Design',
          createdAt: '2024-01-01T00:00:00Z',
          lastLoginAt: new Date().toISOString(),
          isActive: true,
          twoFactorEnabled: false,
          preferences: {
            theme: 'light' as const,
            language: 'en',
            timezone: 'UTC',
            notifications: {
              email: true,
              push: true,
              slack: false
            },
            dashboard: {
              defaultView: 'design',
              widgets: ['design', 'assets', 'themes']
            }
          }
        },
        'viewer@inkey.com': {
          id: 'viewer-1',
          email: 'viewer@inkey.com',
          name: 'Viewer User',
          firstName: 'Viewer',
          lastName: 'User',
          role: 'viewer' as UserRole,
          permissions: ROLE_PERMISSIONS.viewer,
          department: 'General',
          createdAt: '2024-01-01T00:00:00Z',
          lastLoginAt: new Date().toISOString(),
          isActive: true,
          twoFactorEnabled: false,
          preferences: {
            theme: 'light' as const,
            language: 'en',
            timezone: 'UTC',
            notifications: {
              email: true,
              push: false,
              slack: false
            },
            dashboard: {
              defaultView: 'overview',
              widgets: ['products', 'analytics']
            }
          }
        }
      };

      const demoPasswords = {
        'admin@inkey.com': 'admin123',
        'designer@inkey.com': 'design123',
        'viewer@inkey.com': 'view123'
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check credentials
      const user = demoUsers[credentials.email as keyof typeof demoUsers];
      const expectedPassword = demoPasswords[credentials.email as keyof typeof demoPasswords];

      if (!user || credentials.password !== expectedPassword) {
        return {
          success: false,
          message: 'Invalid email or password. Please check your credentials and try again.',
        };
      }

      // Check 2FA if required
      if (credentials.twoFactorCode && !user.twoFactorEnabled) {
        return {
          success: false,
          message: 'Two-factor authentication code not required for this account.',
        };
      }

      if (user.twoFactorEnabled && !credentials.twoFactorCode) {
        return {
          success: false,
          requiresTwoFactor: true,
          message: 'Please enter your two-factor authentication code.',
        };
      }

      // Create session
      const sessionData = {
        user,
        token: `demo-token-${Date.now()}`,
        refreshToken: `demo-refresh-${Date.now()}`,
        expiresAt: Date.now() + (8 * 60 * 60 * 1000), // 8 hours
        permissions: this.getUserPermissions(user),
      };

      await this.setSession(sessionData);

      return {
        success: true,
        user,
        token: sessionData.token,
        refreshToken: sessionData.refreshToken,
        message: 'Login successful!',
      };

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
      // For demo, just clear the session
      this.clearSession();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async refreshToken(): Promise<boolean> {
    // For demo, just extend the current session
    if (this.session) {
      this.session.expiresAt = Date.now() + (8 * 60 * 60 * 1000);
      this.saveSessionToStorage();
      return true;
    }
    return false;
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
    // Skip during SSR
    if (typeof window === 'undefined') return;

    if (this.session) {
      localStorage.setItem('auth_session', JSON.stringify(this.session));
    }
  }

  private loadSessionFromStorage(): void {
    // Skip during SSR
    if (typeof window === 'undefined') return;

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
    // Skip during SSR
    if (typeof window === 'undefined') return;

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

  // User preferences (mock implementation)
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<{ success: boolean; message: string }> {
    if (!this.session?.user) {
      return { success: false, message: 'Not authenticated' };
    }

    // Update preferences locally for demo
    this.session.user.preferences = { ...this.session.user.preferences, ...preferences };
    this.saveSessionToStorage();

    return { success: true, message: 'Preferences updated successfully' };
  }

  // Two-factor authentication (mock implementation)
  async enableTwoFactor(): Promise<{ success: boolean; qrCode?: string; backupCodes?: string[]; message: string }> {
    return {
      success: true,
      qrCode: 'demo-qr-code',
      backupCodes: ['123456', '234567', '345678'],
      message: 'Two-factor authentication enabled'
    };
  }

  async disableTwoFactor(code: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: 'Two-factor authentication disabled' };
  }
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
