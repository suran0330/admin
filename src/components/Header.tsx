"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, User, ShoppingBag, Settings } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { items } = useCart();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const navigation = [
    { name: "Shop", href: "/shop" },
    { name: "Skin Concerns", href: "/concerns" },
    { name: "Routines", href: "/routines" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="font-bold text-xl text-black">THE INKEY LIST</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-black transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Admin Access Indicator */}
            {!isAdminMode && (
              <div className="hidden md:block text-xs text-gray-500 mr-2">
                <span className="flex items-center">
                  <Settings className="w-3 h-3 mr-1" />
                  Admin →
                </span>
              </div>
            )}
            {/* Admin Toggle - Settings Icon */}
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`p-2 rounded-lg transition-all duration-200 border-2 ${
                isAdminMode
                  ? 'bg-black text-white border-black'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100 border-transparent hover:border-gray-200'
              }`}
              title="Click to access admin dashboard"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Admin Link (shown when admin mode is enabled) */}
            {isAdminMode && (
              <Link
                href="/admin"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Dashboard
              </Link>
            )}

            {/* Search */}
            <button className="p-2 text-gray-600 hover:text-black transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Account */}
            <button className="p-2 text-gray-600 hover:text-black transition-colors">
              <User className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-black transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-black transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-black transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Admin Link */}
              {isAdminMode && (
                <Link
                  href="/admin"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg w-fit"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Link>
              )}

              {/* Mobile Admin Toggle */}
              {!isAdminMode && (
                <button
                  onClick={() => setIsAdminMode(true)}
                  className="inline-flex items-center px-4 py-2 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 w-fit"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Access Admin
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
