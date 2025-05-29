"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Users,
  FileText,
  Home,
  Plus,
  Menu,
  X,
  HelpCircle,
  ExternalLink,
  Store,
  Palette,
  Layout,
  Grid,
  Image,
  Type,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Design Studio', href: '/design', icon: Palette },
  { name: 'Themes & Colors', href: '/design/themes', icon: Palette },
  { name: 'Layout Builder', href: '/design/layouts', icon: Layout },
  { name: 'Components', href: '/design/components', icon: Grid },
  { name: 'Visual Assets', href: '/design/assets', icon: Image },
  { name: 'Typography', href: '/design/typography', icon: Type },
  { name: 'Section Library', href: '/design/sections', icon: Layers },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Categories', href: '/categories', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-0`}>

        {/* Logo/Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="text-lg font-bold text-black">INKEY Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 space-y-1 px-3 max-h-[calc(100vh-160px)] overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Store Link */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <a
            href="https://inkey-list-clone.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <Store className="mr-3 h-5 w-5" />
            View Store
            <ExternalLink className="ml-auto h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar for mobile */}
        <div className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white px-4 shadow-sm lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">I</span>
            </div>
            <span className="text-sm font-medium">INKEY Admin</span>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
