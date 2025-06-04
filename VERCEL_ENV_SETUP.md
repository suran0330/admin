# 🚨 CRITICAL: Vercel Environment Variables Setup

## Required Environment Variables for Admin Repository

When deploying the admin repository to Vercel, you **MUST** add these environment variables in the Vercel dashboard:

### ⚠️ CRITICAL - Sanity CMS Configuration
```bash
SANITY_PROJECT_ID=7i4b2ni6
SANITY_DATASET=production
SANITY_API_VERSION=2024-06-01
SANITY_API_TOKEN=skOgdVyih7UfpZxrm0PmeVhkFbzM2trJ4xzVxl6wdi4w0R3L7o6AtivkClLocFAyHUXS3yNDOauW8zHS17FrSjpWpe84xgfAQx8F5IJZVVB2hiD2ONi7nVOM7YKZoriggYg4v35wzgjtKI2MBHg75HWW6ADnoq4SIhwb3RNmHSumh9wB1Lgf
```

### Additional Sanity Variables (for compatibility)
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=7i4b2ni6
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-06-01
```

### System Configuration
```bash
NODE_ENV=production
PORT=3001
DATABASE_PATH=./data/db.json
BACKUP_RETENTION_DAYS=30
```

### CORS Configuration
```bash
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002,https://inkey-list-clone2.vercel.app
```

### API Keys
```bash
ADMIN_API_KEY=your-secure-admin-api-key-here
```

### Store Connection
```bash
NEXT_PUBLIC_MAIN_STORE_URL=https://inkey-list-clone2.vercel.app
NEXT_PUBLIC_ADMIN_NAME=INKEY List Admin
NEXT_PUBLIC_ADMIN_VERSION=1.0.0
NEXT_PUBLIC_STORE_API_KEY=demo-api-key
ADMIN_TOKEN=demo-admin-token
```

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select the `admin` project
3. Go to Settings → Environment Variables
4. Add each variable one by one:
   - Variable Name: `SANITY_PROJECT_ID`
   - Value: `7i4b2ni6`
   - Environment: Production, Preview, Development (select all)
5. Click "Save"
6. Repeat for all variables above

## ⚠️ WARNING: Build Will Fail Without These Variables

If you don't set the Sanity environment variables, you will get:
- "Sanity projectId is missing" error
- Build failures
- Runtime errors in production

## Verification

After setting the environment variables:
1. Trigger a new deployment
2. Check the build logs for "Environments: .env.local"
3. Ensure no "missing projectId" errors
4. Test the Sanity integration in production

## Quick Copy-Paste for Vercel

Copy this block and paste each line as separate environment variables:

```
SANITY_PROJECT_ID=7i4b2ni6
SANITY_DATASET=production
SANITY_API_VERSION=2024-06-01
SANITY_API_TOKEN=skOgdVyih7UfpZxrm0PmeVhkFbzM2trJ4xzVxl6wdi4w0R3L7o6AtivkClLocFAyHUXS3yNDOauW8zHS17FrSjpWpe84xgfAQx8F5IJZVVB2hiD2ONi7nVOM7YKZoriggYg4v35wzgjtKI2MBHg75HWW6ADnoq4SIhwb3RNmHSumh9wB1Lgf
NEXT_PUBLIC_SANITY_PROJECT_ID=7i4b2ni6
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-06-01
NODE_ENV=production
DATABASE_PATH=./data/db.json
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002,https://inkey-list-clone2.vercel.app
ADMIN_API_KEY=secure-admin-api-key
NEXT_PUBLIC_MAIN_STORE_URL=https://inkey-list-clone2.vercel.app
NEXT_PUBLIC_STORE_API_URL=https://inkey-list-clone2.vercel.app
NEXT_PUBLIC_ADMIN_NAME=INKEY List Admin
ADMIN_TOKEN=demo-admin-token
```
