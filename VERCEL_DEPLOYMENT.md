# INKEY List Admin Dashboard - Vercel Deployment Guide

## Project Overview
- **Repository**: https://github.com/suran0330/admin
- **Framework**: Next.js 15 with TypeScript
- **Package Manager**: Bun
- **Build Output**: .next directory

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Connect GitHub Repository
1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import from GitHub: `suran0330/admin`
4. Select the repository and click "Import"

### Step 2: Configure Project Settings
- **Project Name**: `inkey-list-admin`
- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave as default)
- **Build Command**: `bun run build`
- **Install Command**: `bun install`
- **Output Directory**: `.next` (should auto-detect)
- **Node.js Version**: 18.x or higher

### Step 3: Environment Variables
Add these environment variables in the Vercel project settings:

```env
NEXT_PUBLIC_ADMIN_NAME=INKEY List Admin
ADMIN_TOKEN=demo-admin-token
NEXT_PUBLIC_SANITY_PROJECT_ID=zqetc89y
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skxinHRiqxxappxzZDg1856QT3nxvDoj2F39pkmC8ifCT1eCCxtXEXNxNGS2HhkIE74QH9DOM9sOuM6aOayq4JrseShQJtTDJ5xMLT587xg6CE2CB5JE7VGXVhjv7N0j7hjk0HGqnFB8jM9bKVidxcTlu46vQTbvcvEiaKLbaFF8O0DnKmqf
NEXT_PUBLIC_MAIN_STORE_URL=https://inkey-list-clone2.vercel.app
```

**Important**: Enable these variables for all environments (Production, Preview, Development).

### Step 4: Deploy
1. Click "Deploy" to start the deployment
2. Wait for the build to complete (typically 2-3 minutes)
3. Your app will be available at `https://inkey-list-admin.vercel.app`

## Method 2: Deploy via Vercel CLI

### Prerequisites
```bash
npm install -g vercel
```

### Deployment Steps
```bash
cd admin
vercel login  # Login to your Vercel account
vercel        # Follow the prompts
```

When prompted:
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: inkey-list-admin
- **Directory**: ./ (current directory)

The CLI will automatically use the `vercel.json` configuration.

## Method 3: One-Click Deploy Button

Add this to your repository README for easy deployment:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsuran0330%2Fadmin&env=NEXT_PUBLIC_ADMIN_NAME,ADMIN_TOKEN,NEXT_PUBLIC_SANITY_PROJECT_ID,NEXT_PUBLIC_SANITY_DATASET,SANITY_API_TOKEN,NEXT_PUBLIC_MAIN_STORE_URL)
```

## Post-Deployment Verification

### 1. Basic Functionality
- [ ] Admin dashboard loads at `/`
- [ ] Login page accessible at `/login`
- [ ] Authentication works with demo credentials
- [ ] Navigation between sections works

### 2. Demo Login Credentials
Test these accounts after deployment:
- **Admin**: `admin@inkeylist.com` / `admin123`
- **Editor**: `editor@inkeylist.com` / `editor123`

### 3. Key Features to Test
- [ ] Products page loads and displays data
- [ ] Content management page at `/content` works
- [ ] Sanity CMS integration status shows correctly
- [ ] Design section accessible
- [ ] Settings page loads
- [ ] All API routes respond correctly

### 4. Sanity CMS Integration
- [ ] Content page shows connection status
- [ ] "Open Sanity Studio" button works
- [ ] Content statistics display correctly
- [ ] No console errors related to Sanity

## Expected URLs After Deployment

- **Admin Dashboard**: `https://inkey-list-admin.vercel.app`
- **Login**: `https://inkey-list-admin.vercel.app/login`
- **Content Management**: `https://inkey-list-admin.vercel.app/content`
- **Products**: `https://inkey-list-admin.vercel.app/products`
- **Design Tools**: `https://inkey-list-admin.vercel.app/design`

## Environment Variables Reference

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `NEXT_PUBLIC_ADMIN_NAME` | Dashboard branding | `INKEY List Admin` |
| `ADMIN_TOKEN` | Demo authentication | `demo-admin-token` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | `zqetc89y` |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset | `production` |
| `SANITY_API_TOKEN` | Sanity write token | `sk...` (full token) |
| `NEXT_PUBLIC_MAIN_STORE_URL` | Main store URL | `https://inkey-list-clone2.vercel.app` |

## Troubleshooting

### Build Failures
1. Check that all environment variables are set
2. Ensure Bun is supported in the Vercel build environment
3. Verify no TypeScript errors in the build output

### Runtime Issues
1. Check browser console for JavaScript errors
2. Verify all environment variables are properly set
3. Test Sanity CMS connection in the `/content` page

### Performance
- Enable Vercel Analytics for performance monitoring
- Monitor Core Web Vitals in the dashboard
- Set up error tracking with Vercel's built-in monitoring

## Custom Domain Setup (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS according to Vercel's instructions
4. Enable SSL (automatic with Vercel)

## Continuous Deployment

The project is configured for automatic deployments:
- **Production**: Deploys from `main` branch
- **Preview**: Deploys from pull requests
- **Development**: Available for branch deployments

Any push to the main branch will trigger a new deployment automatically.

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Verify all environment variables are correctly set
3. Test the build locally with `bun run build`
4. Review the Vercel documentation for Next.js projects