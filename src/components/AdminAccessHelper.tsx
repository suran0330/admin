"use client";

import { useState, useEffect } from 'react';
import { Settings, X, ArrowUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminAccessHelper() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the helper before
    const dismissed = localStorage.getItem('admin-helper-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show helper after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const dismissHelper = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('admin-helper-dismissed', 'true');
  };

  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-20 z-40 animate-fade-in" />

      {/* Helper Popup */}
      <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 max-w-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Admin Dashboard</h3>
            </div>
            <button
              onClick={dismissHelper}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Manage your products centrally! Click the settings icon in the header to access your admin dashboard.
          </p>

          {/* Arrow pointing to header */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center text-purple-600">
              <ArrowUp className="h-4 w-4 mr-1 animate-bounce" />
              <span className="text-xs font-medium">Settings icon is up here</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Link
              href="/admin"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-center"
              onClick={dismissHelper}
            >
              Go to Admin
            </Link>
            <button
              onClick={dismissHelper}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
      `}</style>
    </>
  );
}
