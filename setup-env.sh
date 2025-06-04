#!/bin/bash

# Admin Environment Setup Script
echo "Setting up Admin environment variables..."

cat > .env.local << 'EOF'
# Admin Dashboard Configuration
NODE_ENV=development
PORT=3001

# Sanity CMS Configuration (Admin Write Access)
SANITY_PROJECT_ID=7i4b2ni6
SANITY_DATASET=production
SANITY_API_VERSION=2024-06-01
SANITY_API_TOKEN=your_token_here

# Database Configuration
DATABASE_PATH=./data/db.json
BACKUP_RETENTION_DAYS=30

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002,https://inkey-list-clone2.vercel.app

# API Keys (if needed)
ADMIN_API_KEY=your-secure-admin-api-key-here

# Shopify Integration (Optional)
SHOPIFY_STORE_DOMAIN=
SHOPIFY_STOREFRONT_ACCESS_TOKEN=
SHOPIFY_ADMIN_ACCESS_TOKEN=
EOF

echo "✅ Admin .env.local created!"
echo "⚠️  Remember to replace 'your_token_here' with your actual Sanity API token"
echo "📝 Get your token from: https://sanity.io/manage/project/7i4b2ni6/api"
