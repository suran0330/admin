#!/bin/bash

echo "🚀 Sanity Studio Deployment Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "sanity.config.ts" ]; then
    echo "❌ Error: Not in Sanity Studio directory"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "📋 Project ID: zqetc89y"
echo "🗄️ Dataset: production"

echo ""
echo "Step 1: Login to Sanity"
echo "----------------------"
echo "Run: npx sanity login"
echo "This will open a browser window for authentication"

echo ""
echo "Step 2: Verify login"
echo "-------------------"
echo "Run: npx sanity projects list"
echo "This should show your projects if logged in successfully"

echo ""
echo "Step 3: Build the studio"
echo "-----------------------"
echo "Run: npx sanity build"
echo "This creates the production build"

echo ""
echo "Step 4: Deploy to Sanity hosting"
echo "--------------------------------"
echo "Run: npx sanity deploy"
echo "Suggested hostnames:"
echo "  - inkey-list-admin"
echo "  - inkey-admin"
echo "  - inkeylist-cms"

echo ""
echo "🎉 After successful deployment, your Sanity Studio will be available at:"
echo "https://your-chosen-hostname.sanity.studio"

echo ""
echo "📝 Manual execution steps:"
echo "1. cd admin/sanity-studio"
echo "2. npx sanity login"
echo "3. npx sanity build"
echo "4. npx sanity deploy"