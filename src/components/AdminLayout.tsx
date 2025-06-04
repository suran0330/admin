"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Package,
  BarChart3,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  Edit,
  Users,
  HelpCircle,
  Bell,
  Search,
  ChevronDown,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import StoreConnectionStatus from '@/components/StoreConnectionStatus';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  permission: {
    resource: string;
    action: string;
  };
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, hasPermission } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation items
  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/',
      icon: BarChart3,
      permission: { resource: 'analytics', action: 'view' }
    },
    {
      name: 'Products',
      href: '/products',
      icon: Package,
      permission: { resource: 'products', action: 'view' }
    },
    {
      name: 'Content',
      href: '/content',
      icon: Edit,
      permission: { resource: 'design', action: 'view' }
    },
    {
      name: 'Design',
      href: '/design',
      icon: Settings,
      permission: { resource: 'design', action: 'view' }
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      permission: { resource: 'users', action: 'view' }
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      permission: { resource: 'settings', action: 'view' }
    },
    {
      name: 'Help',
      href: '/help',
      icon: HelpCircle,
      permission: { resource: 'settings', action: 'view' }
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side */}
              <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>

                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">I</span>
                  </div>
                  <span className="font-bold text-xl text-gray-900 hidden sm:block">
                    INKEY Admin
                  </span>
                </Link>

                {/* Search */}
                <div className="hidden md:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search products, orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                {/* Store Connection Status - Compact */}
                <div className="hidden sm:block">
                  <StoreConnectionStatus showDetails={false} />
                </div>

                {/* Live Store Link */}
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href="https://inkey-list-clone2.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">Live Store</span>
                  </a>
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    2
                  </span>
                </Button>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user?.firstName?.[0] || user?.email?.[0] || 'A'}
                        </span>
                      </div>
                      <span className="hidden md:block text-sm font-medium">
                        {user?.firstName || user?.name || 'Admin'}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user?.name || user?.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/help">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Help & Support
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main layout */}
        <div className="flex">
          {/* Sidebar */}
          <nav className={`
            bg-white border-r border-gray-200
            ${isMobileMenuOpen ? 'block' : 'hidden'}
            md:block w-64 fixed inset-y-0 top-16 z-40 md:relative md:top-0
          `}>
            {/* ... existing sidebar code remains the same ... */}
            <div className="p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                if (!hasPermission(item.permission.resource, item.permission.action)) {
                  return null;
                }

                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`
                        flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Store Connection Status - Mobile */}
            <div className="md:hidden p-4 border-t border-gray-200">
              <StoreConnectionStatus />
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1 md:ml-0">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
