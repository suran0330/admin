#!/bin/bash

# INKEY List Admin Dashboard - Vercel Deployment Script
# This script prepares and deploys the admin dashboard to Vercel

set -e

echo "🚀 INKEY List Admin Dashboard - Vercel Deployment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the admin directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔍 Pre-deployment checks..."

# Check if all required environment variables are set
ENV_VARS=(
    "NEXT_PUBLIC_ADMIN_NAME"
    "ADMIN_TOKEN"
    "NEXT_PUBLIC_SANITY_PROJECT_ID"
    "NEXT_PUBLIC_SANITY_DATASET"
    "SANITY_API_TOKEN"
    "NEXT_PUBLIC_MAIN_STORE_URL"
)

echo "✅ Checking environment variables..."
for var in "${ENV_VARS[@]}"; do
    if [ -z "${!var}" ] && ! grep -q "^$var=" .env.local 2>/dev/null; then
        echo "⚠️  Warning: $var not found in environment or .env.local"
    else
        echo "   ✓ $var configured"
    fi
done

# Test build locally
echo "🔨 Testing build locally..."
if ! bun run build; then
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment Complete!"
echo "========================"
echo ""
echo "Your admin dashboard should be available at:"
echo "https://inkey-list-admin.vercel.app"
echo ""
echo "Next steps:"
echo "1. Test the deployment at the URL above"
echo "2. Login with demo credentials:"
echo "   - Admin: admin@inkeylist.com / admin123"
echo "   - Editor: editor@inkeylist.com / editor123"
echo "3. Check content management at /content"
echo "4. Deploy Sanity Studio (see SANITY_SETUP_COMPLETE.md)"
echo ""
echo "For troubleshooting, see VERCEL_DEPLOYMENT.md"