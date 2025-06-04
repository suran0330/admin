"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Edit3,
  ExternalLink,
  RefreshCw,
  Palette,
  Save,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VisualEditingProps {
  isPreview?: boolean;
  documentType?: string;
  documentId?: string;
  slug?: string;
}

export default function VisualEditing({
  isPreview = false,
  documentType = 'homepage',
  documentId,
  slug
}: VisualEditingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [previewMode, setPreviewMode] = useState(isPreview);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Toggle preview mode
  const togglePreviewMode = async () => {
    setIsLoading(true);
    try {
      if (previewMode) {
        // Exit preview mode
        router.push('/content');
      } else {
        // Enter preview mode  
        const previewUrl = new URL(window.location.href);
        previewUrl.searchParams.set('preview', 'true');
        if (documentId) previewUrl.searchParams.set('id', documentId);
        router.push(previewUrl.toString());
      }
      setPreviewMode(!previewMode);
    } catch (error) {
      console.error('Error toggling preview mode:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh content
  const refreshContent = () => {
    window.location.reload();
  };

  // Save content (placeholder - would integrate with local data store)
  const saveContent = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date());
      console.log('Content saved successfully');
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Open in new tab
  const openInNewTab = () => {
    const currentUrl = window.location.href;
    window.open(currentUrl, '_blank');
  };

  // Navigate to admin
  const navigateToAdmin = () => {
    router.push('/admin');
  };

  if (!previewMode) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-blue-200 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              Content Preview
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {documentType}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Preview Status */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Preview Mode Active
          </div>

          {/* Last Saved */}
          {lastSaved && (
            <div className="text-xs text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={togglePreviewMode}
              disabled={isLoading}
              className="text-xs"
            >
              {isLoading ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
              Exit Preview
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={refreshContent}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={saveContent}
              disabled={isSaving}
              className="text-xs"
            >
              {isSaving ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <Save className="h-3 w-3" />
              )}
              Save
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={openInNewTab}
              className="text-xs"
            >
              <ExternalLink className="h-3 w-3" />
              New Tab
            </Button>
          </div>

          {/* Navigation */}
          <div className="pt-2 border-t">
            <Button
              size="sm"
              onClick={navigateToAdmin}
              className="w-full text-xs"
            >
              <Settings className="h-3 w-3 mr-1" />
              Back to Admin
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}