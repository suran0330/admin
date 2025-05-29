"use client";

import { useState } from 'react';
import { ChevronRight, Play, CheckCircle, Settings, Package, BarChart3, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Step {
  id: number;
  title: string;
  description: string;
  action: string;
  link?: string;
  completed?: boolean;
}

interface Demo {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  steps: Step[];
  estimatedTime: string;
}

export default function DemoGuide() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const demos: Demo[] = [
    {
      id: 'access-admin',
      title: 'Access Admin Dashboard',
      description: 'Learn how to navigate to your admin panel',
      icon: Settings,
      estimatedTime: '2 min',
      steps: [
        {
          id: 1,
          title: 'Click Settings Icon',
          description: 'Look for the gear (⚙️) icon in the main site header',
          action: 'Click the settings icon in the header',
          link: '/'
        },
        {
          id: 2,
          title: 'Enable Admin Mode',
          description: 'Toggle admin mode to reveal the admin button',
          action: 'Click the settings icon to toggle admin mode'
        },
        {
          id: 3,
          title: 'Enter Dashboard',
          description: 'Click the "Admin" button to access your dashboard',
          action: 'Click "Admin" button',
          link: '/admin'
        },
        {
          id: 4,
          title: 'Explore Navigation',
          description: 'Use the sidebar to navigate between different admin sections',
          action: 'Explore the sidebar navigation menu'
        }
      ]
    },
    {
      id: 'manage-products',
      title: 'Manage Products',
      description: 'View, edit, and organize your product catalog',
      icon: Package,
      estimatedTime: '5 min',
      steps: [
        {
          id: 1,
          title: 'Open Products Page',
          description: 'Navigate to the main products management interface',
          action: 'Click "Products" in the sidebar',
          link: '/admin/products'
        },
        {
          id: 2,
          title: 'Use Search & Filters',
          description: 'Find products using search bar and category filters',
          action: 'Try searching for a product name or filtering by category'
        },
        {
          id: 3,
          title: 'Select Multiple Products',
          description: 'Use checkboxes to select products for bulk operations',
          action: 'Check the boxes next to several products'
        },
        {
          id: 4,
          title: 'Bulk Update',
          description: 'Use bulk actions to update multiple products at once',
          action: 'Try the bulk edit or stock update buttons'
        },
        {
          id: 5,
          title: 'Edit Individual Product',
          description: 'Click edit button to modify a single product',
          action: 'Click the edit (✏️) icon on any product'
        }
      ]
    },
    {
      id: 'organize-categories',
      title: 'Organize Categories',
      description: 'Manage product categories and skin concerns',
      icon: FileText,
      estimatedTime: '3 min',
      steps: [
        {
          id: 1,
          title: 'Open Categories Page',
          description: 'Navigate to category management',
          action: 'Click "Categories" in the sidebar',
          link: '/admin/categories'
        },
        {
          id: 2,
          title: 'Switch Between Types',
          description: 'Toggle between Product Categories and Skin Concerns',
          action: 'Click the tabs to switch between category types'
        },
        {
          id: 3,
          title: 'Add New Category',
          description: 'Create a new category or concern',
          action: 'Click "Add Category/Concern" button'
        },
        {
          id: 4,
          title: 'Edit Existing',
          description: 'Modify category names and descriptions',
          action: 'Click the edit (✏️) icon on any category card'
        }
      ]
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Monitor performance and track insights',
      icon: BarChart3,
      estimatedTime: '4 min',
      steps: [
        {
          id: 1,
          title: 'Open Analytics Dashboard',
          description: 'Access your store performance metrics',
          action: 'Click "Analytics" in the sidebar',
          link: '/admin/analytics'
        },
        {
          id: 2,
          title: 'Review Overview Stats',
          description: 'Check total views, sales, and conversion rates',
          action: 'Review the overview statistics cards'
        },
        {
          id: 3,
          title: 'Check Top Products',
          description: 'See which products are performing best',
          action: 'Scroll to "Top Performing Products" section'
        },
        {
          id: 4,
          title: 'Analyze Categories',
          description: 'Compare performance across different categories',
          action: 'Review "Category Performance" data'
        },
        {
          id: 5,
          title: 'Monitor Activity',
          description: 'See recent customer activity and sales',
          action: 'Check the "Recent Activity" feed'
        }
      ]
    }
  ];

  const markStepCompleted = (demoId: string, stepId: number) => {
    const stepKey = `${demoId}-${stepId}`;
    setCompletedSteps(prev => new Set([...prev, stepKey]));
  };

  const isStepCompleted = (demoId: string, stepId: number) => {
    const stepKey = `${demoId}-${stepId}`;
    return completedSteps.has(stepKey);
  };

  const getDemoProgress = (demoId: string) => {
    const demo = demos.find(d => d.id === demoId);
    if (!demo) return 0;

    const completedCount = demo.steps.filter(step =>
      isStepCompleted(demoId, step.id)
    ).length;

    return Math.round((completedCount / demo.steps.length) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Play className="h-5 w-5 mr-2 text-blue-600" />
          Interactive Admin Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Demo List */}
          {demos.map((demo) => {
            const progress = getDemoProgress(demo.id);
            const IconComponent = demo.icon;

            return (
              <div key={demo.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setActiveDemo(activeDemo === demo.id ? null : demo.id)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{demo.title}</h3>
                        <p className="text-sm text-gray-500">{demo.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500">{demo.estimatedTime}</span>
                      {progress > 0 && (
                        <div className="flex items-center space-x-1">
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-green-500 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-green-600">{progress}%</span>
                        </div>
                      )}
                      <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
                        activeDemo === demo.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                </button>

                {/* Demo Steps */}
                {activeDemo === demo.id && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="space-y-3">
                      {demo.steps.map((step) => (
                        <div key={step.id} className="flex items-start space-x-3">
                          <button
                            onClick={() => markStepCompleted(demo.id, step.id)}
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isStepCompleted(demo.id, step.id)
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 hover:border-green-500'
                            }`}
                          >
                            {isStepCompleted(demo.id, step.id) && (
                              <CheckCircle className="h-3 w-3" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-medium ${
                              isStepCompleted(demo.id, step.id)
                                ? 'text-gray-500 line-through'
                                : 'text-gray-900'
                            }`}>
                              {step.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {step.description}
                            </p>
                            <p className="text-xs text-blue-600 mt-1 font-medium">
                              👉 {step.action}
                            </p>

                            {step.link && (
                              <Link
                                href={step.link}
                                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-1"
                              >
                                Go to page →
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {progress === 100 && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-sm font-medium text-green-800">
                            Great job! You've completed this guide.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Help Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <Link
              href="/admin/help"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Need more help? View complete documentation →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
