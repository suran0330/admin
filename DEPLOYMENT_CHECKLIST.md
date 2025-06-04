# ✅ Deployment Checklist
## Dual Repository Setup: Frontend + Admin

## 🎯 Overview

This checklist ensures both repositories are deployed correctly and all integrations work seamlessly.

## 📋 Pre-Deployment Setup

### 1. Shopify Configuration ✅

**Create Shopify App:**
1. Go to Shopify Partners Dashboard
2. Create new app for your store
3. Get Storefront API access token (public)
4. Get Admin API access token (private)

**Required Shopify Permissions:**
- **Storefront API**: `unauthenticated_read_product_listings`, `unauthenticated_read_products`
- **Admin API**: `read_products`, `write_products`, `read_orders`, `write_orders`

**Shopify URLs to Configure:**
- Store domain: `your-shop.myshopify.com`
- Storefront URL: `https://your-shop.myshopify.com`

### 2. Sanity CMS Setup ✅

**Project Configuration:**
- Project ID: `zqetc89y` (already configured)
- Dataset: `production`
- API token with editor permissions

**CORS Configuration:**
1. Go to https://sanity.io/manage/personal/project/zqetc89y
2. Navigate to Settings → API → CORS origins
3. Add these domains:
   ```
   https://inkeylist.com
   https://inkey-admin.vercel.app
   https://inkey-list-studio.sanity.studio
   http://localhost:3000
   http://localhost:3001
   ```

### 3. Environment Variables ✅

**Create these files:**

**Admin Repository (`.env.local`):**
```bash
# Shopify Admin (Full Access)
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxx
SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com
SHOPIFY_API_VERSION=2024-01

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=zqetc89y
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk_xxxxxxxx

# Admin Configuration
ADMIN_TOKEN=demo-admin-token
NEXT_PUBLIC_ADMIN_NAME=INKEY List Admin
NEXT_PUBLIC_FRONTEND_URL=https://inkeylist.com

# Webhooks
SANITY_WEBHOOK_SECRET=webhook-secret-123
```

**Frontend Repository (`.env.local`):**
```bash
# Shopify Storefront (Read-Only)
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-shop.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=zqetc89y
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk_xxxxxxxx

# Admin Connection
NEXT_PUBLIC_ADMIN_API_URL=https://inkey-admin.vercel.app/api/frontend

# Preview
SANITY_PREVIEW_SECRET=preview-secret-123
SANITY_WEBHOOK_SECRET=webhook-secret-123

# Site
NEXT_PUBLIC_SITE_URL=https://inkeylist.com
```

## 🚀 Deployment Steps

### Step 1: Deploy Admin Dashboard ✅

1. **Connect Repository to Vercel:**
   ```bash
   cd admin
   vercel --prod
   ```
   Or connect via Vercel Dashboard → Import Git Repository

2. **Configure Environment Variables:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all admin environment variables
   - Set for: Production, Preview, Development

3. **Verify Deployment:**
   - URL: `https://inkey-admin.vercel.app`
   - Test login with demo credentials
   - Check admin dashboard loads correctly

### Step 2: Deploy Sanity Studio ✅

1. **Deploy Studio:**
   ```bash
   cd admin/sanity-studio
   npx sanity login
   npx sanity deploy
   # Choose hostname: inkey-list-studio
   ```

2. **Verify Studio:**
   - URL: `https://inkey-list-studio.sanity.studio`
   - Test content creation/editing
   - Verify schemas load correctly

### Step 3: Deploy Frontend Website ✅

1. **Create Frontend Files:**
   - Follow `FRONTEND_INTEGRATION_FILES.md`
   - Create all necessary API integration files
   - Add components for content display

2. **Connect Repository to Vercel:**
   ```bash
   cd inkey-list-clone2
   vercel --prod
   ```

3. **Configure Environment Variables:**
   - Add all frontend environment variables
   - Ensure admin API URL is correct

4. **Set Production Domain:**
   - Custom domain: `inkeylist.com`
   - Or use Vercel URL: `inkey-list-clone2.vercel.app`

### Step 4: Configure Webhooks ✅

1. **Sanity Webhooks:**
   ```
   Go to: https://sanity.io/manage/personal/project/zqetc89y
   Settings → API → Webhooks

   Add webhook:
   - Name: Frontend Content Updates
   - URL: https://inkeylist.com/api/sanity/webhook
   - Trigger: Create, Update, Delete
   - Secret: webhook-secret-123
   ```

2. **Admin Webhook (Optional):**
   ```
   Add webhook:
   - Name: Admin Content Updates
   - URL: https://inkey-admin.vercel.app/api/sanity/webhook
   - Trigger: Create, Update, Delete
   - Secret: webhook-secret-123
   ```

## 🧪 Testing & Verification

### Test 1: Admin Dashboard ✅

**Access Admin:**
1. Go to `https://inkey-admin.vercel.app`
2. Login with: `admin@inkeylist.com` / `admin123`
3. Verify all sections load correctly

**Test Product Management:**
1. Go to Products section
2. Create/edit a test product
3. Verify product appears in mock data

**Test Content Integration:**
1. Go to Content section
2. Click "Open Sanity Studio"
3. Verify studio opens correctly

### Test 2: Sanity Studio ✅

**Content Creation:**
1. Go to `https://inkey-list-studio.sanity.studio`
2. Create homepage content
3. Add featured product handles
4. Create a test banner

**Visual Editing:**
1. Go to Presentation tab in studio
2. Verify preview URLs work
3. Test click-to-edit functionality

### Test 3: Frontend Website ✅

**Homepage:**
1. Go to `https://inkeylist.com`
2. Verify hero section loads from Sanity
3. Check featured products load from admin API
4. Test banner display

**Product Pages:**
1. Navigate to `/products/hyaluronic-acid`
2. Verify product data loads from admin
3. Test add to cart with Shopify

**Content Updates:**
1. Edit content in Sanity Studio
2. Verify changes appear on frontend (within 60 seconds)
3. Test real-time updates

### Test 4: Integration Flow ✅

**Content Flow:**
```
Sanity Studio → Edit content → Webhook → Frontend updates
```

**Product Flow:**
```
Admin Dashboard → Manage products → API → Frontend display
```

**Checkout Flow:**
```
Frontend → Add to cart → Shopify → Checkout → Payment
```

## 🔍 Health Check Endpoints

### Admin Dashboard
```bash
# Health check
curl https://inkey-admin.vercel.app/api/health

# Sanity connection
curl https://inkey-admin.vercel.app/api/sanity/status

# Product API
curl https://inkey-admin.vercel.app/api/frontend/products
```

### Frontend Website
```bash
# Homepage content
curl https://inkeylist.com/api/content/homepage

# Product data
curl https://inkeylist.com/api/products/hyaluronic-acid

# Sanity webhook
curl -X POST https://inkeylist.com/api/sanity/webhook
```

## 🚨 Troubleshooting

### Common Issues & Solutions

**1. Admin API not connecting to frontend:**
- Check `NEXT_PUBLIC_ADMIN_API_URL` in frontend env vars
- Verify admin API endpoints are accessible
- Check CORS configuration

**2. Sanity content not loading:**
- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
- Check API token permissions
- Verify CORS settings in Sanity dashboard

**3. Products not displaying:**
- Check admin API endpoints return data
- Verify product handles match between admin and frontend
- Test API endpoints directly

**4. Visual editing not working:**
- Verify `@sanity/visual-editing` is installed in frontend
- Check preview mode is enabled
- Ensure studio URL is configured

**5. Checkout not working:**
- Verify Shopify Storefront API token
- Check product variant IDs match
- Test Shopify API connection

### Debug Commands

```bash
# Test admin API
curl -H "Content-Type: application/json" \
  https://inkey-admin.vercel.app/api/frontend/products

# Test Sanity connection
curl -H "Content-Type: application/json" \
  https://inkeylist.com/api/sanity/status

# Test webhook
curl -X POST -H "Content-Type: application/json" \
  -d '{"_type":"homepage"}' \
  https://inkeylist.com/api/sanity/webhook
```

## ✅ Final Verification Checklist

**Admin Dashboard:**
- [ ] Deployed to Vercel successfully
- [ ] Environment variables configured
- [ ] Login working with demo credentials
- [ ] Product management interface functional
- [ ] Content management page accessible
- [ ] Sanity Studio link working

**Sanity Studio:**
- [ ] Deployed to sanity.studio
- [ ] All schemas loading correctly
- [ ] Content creation/editing working
- [ ] Preview URLs configured
- [ ] Visual editing enabled
- [ ] Webhooks configured

**Frontend Website:**
- [ ] Deployed to production domain
- [ ] Homepage loading with Sanity content
- [ ] Featured products displaying from admin API
- [ ] Product pages working
- [ ] Checkout flow functional
- [ ] Visual editing enabled
- [ ] Real-time content updates working

**Integration:**
- [ ] Admin → Frontend API connection working
- [ ] Sanity → Frontend content loading
- [ ] Webhooks triggering correctly
- [ ] CORS configured properly
- [ ] All environment variables set

**Performance:**
- [ ] Page load times under 3 seconds
- [ ] Images optimized and loading
- [ ] ISR working correctly
- [ ] API responses fast (<500ms)

## 🎉 Success Metrics

Once deployed successfully, you should have:

✅ **Professional Content Management**: Visual editing via Sanity Studio
✅ **Product Management**: Admin dashboard for inventory and pricing
✅ **Customer Experience**: Fast, SEO-optimized frontend
✅ **Secure Checkout**: Shopify-powered payment processing
✅ **Real-time Updates**: Content changes reflect immediately
✅ **Scalable Architecture**: Separate admin and customer interfaces

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Sanity Docs**: https://sanity.io/docs
- **Shopify API**: https://shopify.dev/docs
- **Next.js Docs**: https://nextjs.org/docs

Your dual-repository architecture is now production-ready! 🚀
