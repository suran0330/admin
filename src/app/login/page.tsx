"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();

  // Handle SSR gracefully
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { login, isAuthenticated, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorCode: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [success, setSuccess] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear errors when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        twoFactorCode: formData.twoFactorCode,
        rememberMe: formData.rememberMe,
      });

      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else if (result.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setError('Please enter your two-factor authentication code.');
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (role: 'admin' | 'designer' | 'viewer') => {
    const demoCredentials = {
      admin: { email: 'admin@inkey.com', password: 'admin123' },
      designer: { email: 'designer@inkey.com', password: 'design123' },
      viewer: { email: 'viewer@inkey.com', password: 'view123' },
    };

    const credentials = demoCredentials[role];
    setFormData(prev => ({
      ...prev,
      email: credentials.email,
      password: credentials.password,
    }));
  };

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">INKEY Admin</h1>
          </div>
          <h2 className="text-xl text-gray-600">
            Sign in to your admin dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Manage your website design and content
          </p>
        </div>

        {/* Demo Accounts */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-800">Demo Accounts</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('admin')}
                className="text-xs"
              >
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('designer')}
                className="text-xs"
              >
                Designer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('viewer')}
                className="text-xs"
              >
                Viewer
              </Button>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Click to auto-fill credentials for different role types
            </p>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="admin@inkey.com"
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Two-Factor Code */}
              {requiresTwoFactor && (
                <div className="space-y-2">
                  <Label htmlFor="twoFactorCode">Two-Factor Authentication Code</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="twoFactorCode"
                      type="text"
                      value={formData.twoFactorCode}
                      onChange={(e) => handleInputChange('twoFactorCode', e.target.value)}
                      placeholder="123456"
                      className="pl-10"
                      maxLength={6}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>
              )}

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                  Remember me for 30 days
                </Label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Links */}
              <div className="text-center space-y-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot your password?
                </Link>
                <div className="text-xs text-gray-500">
                  Need help? Contact your administrator
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-xs text-yellow-700">
                <p className="font-medium">Security Notice</p>
                <p>
                  Your session will expire after 8 hours of inactivity.
                  Always log out when using shared computers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>
            &copy; 2024 INKEY List Admin Dashboard. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-700">Terms of Service</Link>
            <Link href="/support" className="hover:text-gray-700">Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
