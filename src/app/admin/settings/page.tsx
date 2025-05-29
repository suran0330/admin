"use client";

import { useState } from 'react';
import { Save, Eye, EyeOff, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SettingsData {
  store: {
    name: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    currency: string;
    taxRate: number;
    shippingRate: number;
    freeShippingThreshold: number;
  };
  shopify: {
    storeUrl: string;
    accessToken: string;
    enabled: boolean;
  };
  stripe: {
    publishableKey: string;
    secretKey: string;
    enabled: boolean;
  };
  email: {
    provider: string;
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    store: {
      name: 'INKEY List Clone',
      description: 'Affordable, effective skincare products',
      email: 'hello@inkeylist.com',
      phone: '+44 20 1234 5678',
      address: '123 Beauty Street, London, UK',
      currency: 'GBP',
      taxRate: 0.20,
      shippingRate: 5.99,
      freeShippingThreshold: 50
    },
    shopify: {
      storeUrl: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
      accessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
      enabled: !!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
    },
    stripe: {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      enabled: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    },
    email: {
      provider: 'SendGrid',
      apiKey: '',
      fromEmail: 'noreply@inkeylist.com',
      fromName: 'INKEY List'
    },
    seo: {
      title: 'INKEY List - Affordable Skincare That Works',
      description: 'Discover effective, affordable skincare products that deliver real results. Shop serums, cleansers, moisturizers and more.',
      keywords: 'skincare, affordable, effective, serums, moisturizers, cleansers',
      ogImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03'
    }
  });

  const [showSecrets, setShowSecrets] = useState({
    shopifyToken: false,
    stripeSecret: false,
    emailApiKey: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'store' | 'integrations' | 'seo'>('store');

  const handleInputChange = (section: keyof SettingsData, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would save settings to your backend/environment
      console.log('Saving settings:', settings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (service: 'shopify' | 'stripe') => {
    console.log(`Testing ${service} connection...`);
    // Implement connection testing logic
    alert(`${service} connection test - this would test the actual connection`);
  };

  const tabs = [
    { id: 'store', name: 'Store Settings' },
    { id: 'integrations', name: 'Integrations' },
    { id: 'seo', name: 'SEO & Marketing' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your store configuration and integrations</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-black hover:bg-gray-800"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Store Settings */}
      {activeTab === 'store' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                <Input
                  value={settings.store.name}
                  onChange={(e) => handleInputChange('store', 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Textarea
                  value={settings.store.description}
                  onChange={(e) => handleInputChange('store', 'description', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <Input
                  type="email"
                  value={settings.store.email}
                  onChange={(e) => handleInputChange('store', 'email', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <Input
                  value={settings.store.phone}
                  onChange={(e) => handleInputChange('store', 'phone', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <Textarea
                  value={settings.store.address}
                  onChange={(e) => handleInputChange('store', 'address', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={settings.store.currency}
                  onChange={(e) => handleInputChange('store', 'currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="GBP">British Pound (£)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={settings.store.taxRate}
                  onChange={(e) => handleInputChange('store', 'taxRate', Number.parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Rate (£)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.store.shippingRate}
                  onChange={(e) => handleInputChange('store', 'shippingRate', Number.parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold (£)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.store.freeShippingThreshold}
                  onChange={(e) => handleInputChange('store', 'freeShippingThreshold', Number.parseFloat(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Integrations */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          {/* Shopify Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Shopify Integration</span>
                <div className="flex items-center space-x-2">
                  {settings.shopify.enabled && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Connected
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testConnection('shopify')}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="shopify-enabled"
                  checked={settings.shopify.enabled}
                  onChange={(e) => handleInputChange('shopify', 'enabled', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="shopify-enabled" className="text-sm font-medium text-gray-700">
                  Enable Shopify Integration
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store URL</label>
                <Input
                  value={settings.shopify.storeUrl}
                  onChange={(e) => handleInputChange('shopify', 'storeUrl', e.target.value)}
                  placeholder="your-store.myshopify.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Storefront Access Token</label>
                <div className="relative">
                  <Input
                    type={showSecrets.shopifyToken ? 'text' : 'password'}
                    value={settings.shopify.accessToken}
                    onChange={(e) => handleInputChange('shopify', 'accessToken', e.target.value)}
                    placeholder="shpat_..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecrets(prev => ({ ...prev, shopifyToken: !prev.shopifyToken }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showSecrets.shopifyToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!settings.shopify.enabled && (
                <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium">Shopify integration is disabled</p>
                    <p>Enable to sync products from your Shopify store</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stripe Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Stripe Payments</span>
                <div className="flex items-center space-x-2">
                  {settings.stripe.enabled && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Connected
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testConnection('stripe')}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="stripe-enabled"
                  checked={settings.stripe.enabled}
                  onChange={(e) => handleInputChange('stripe', 'enabled', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="stripe-enabled" className="text-sm font-medium text-gray-700">
                  Enable Stripe Payments
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Publishable Key</label>
                <Input
                  value={settings.stripe.publishableKey}
                  onChange={(e) => handleInputChange('stripe', 'publishableKey', e.target.value)}
                  placeholder="pk_..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
                <div className="relative">
                  <Input
                    type={showSecrets.stripeSecret ? 'text' : 'password'}
                    value={settings.stripe.secretKey}
                    onChange={(e) => handleInputChange('stripe', 'secretKey', e.target.value)}
                    placeholder="sk_..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecrets(prev => ({ ...prev, stripeSecret: !prev.stripeSecret }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showSecrets.stripeSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Provider</label>
                <select
                  value={settings.email.provider}
                  onChange={(e) => handleInputChange('email', 'provider', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="SendGrid">SendGrid</option>
                  <option value="Mailgun">Mailgun</option>
                  <option value="AWS SES">AWS SES</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <div className="relative">
                  <Input
                    type={showSecrets.emailApiKey ? 'text' : 'password'}
                    value={settings.email.apiKey}
                    onChange={(e) => handleInputChange('email', 'apiKey', e.target.value)}
                    placeholder="API Key"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecrets(prev => ({ ...prev, emailApiKey: !prev.emailApiKey }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showSecrets.emailApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                  <Input
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                  <Input
                    value={settings.email.fromName}
                    onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SEO & Marketing */}
      {activeTab === 'seo' && (
        <Card>
          <CardHeader>
            <CardTitle>SEO & Marketing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
              <Input
                value={settings.seo.title}
                onChange={(e) => handleInputChange('seo', 'title', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <Textarea
                value={settings.seo.description}
                onChange={(e) => handleInputChange('seo', 'description', e.target.value)}
                rows={3}
                placeholder="A brief description of your store for search engines"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <Input
                value={settings.seo.keywords}
                onChange={(e) => handleInputChange('seo', 'keywords', e.target.value)}
                placeholder="skincare, beauty, affordable, effective"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Open Graph Image URL</label>
              <Input
                value={settings.seo.ogImage}
                onChange={(e) => handleInputChange('seo', 'ogImage', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
