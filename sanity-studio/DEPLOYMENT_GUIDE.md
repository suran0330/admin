# Sanity Studio Deployment Guide

## Prerequisites

- Project ID: `zqetc89y`
- Dataset: `production`
- API Token: Already configured in `.env.local`

## Deployment Steps

### 1. Navigate to Sanity Studio Directory

```bash
cd admin/sanity-studio
```

### 2. Login to Sanity

```bash
npx sanity login
```

This will:
- Open a browser window
- Prompt you to sign in with Google/GitHub/Email
- Authenticate your CLI session

### 3. Verify Authentication

```bash
npx sanity projects list
```

You should see project `zqetc89y` listed if authentication is successful.

### 4. Build the Studio

```bash
npx sanity build
```

This creates a production-ready build in the `dist` folder.

### 5. Deploy to Sanity Hosting

```bash
npx sanity deploy
```

When prompted for a hostname, choose one of:
- `inkey-list-admin`
- `inkey-admin`
- `inkeylist-cms`

## Post-Deployment

### Studio URL
Your deployed Sanity Studio will be available at:
```
https://your-chosen-hostname.sanity.studio
```

### Admin Dashboard Integration
Update the admin dashboard's content management page to link to your deployed studio:

1. Open `admin/src/app/content/page.tsx`
2. Update the studio URL in the quick actions section
3. Replace the placeholder URL with your actual studio URL

### Environment Variables
Ensure these are set in `admin/.env.local`:
```
SANITY_PROJECT_ID=zqetc89y
SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
```

## Troubleshooting

### Login Issues
- Make sure you have a Sanity account
- Try different browsers if authentication fails
- Clear browser cache and cookies for sanity.io

### Build Issues
- Update styled-components version: `bun add styled-components@^6.1.15`
- Clear node_modules and reinstall: `rm -rf node_modules && bun install`

### Deploy Issues
- Ensure you're logged in: `npx sanity whoami`
- Check project permissions in Sanity management interface

## Alternative: Local Development

If deployment issues persist, you can run the studio locally:

```bash
# Development server
npx sanity dev

# Preview production build
npx sanity preview
```

The studio will be available at `http://localhost:3333`

## Next Steps

1. Create initial content in your deployed studio
2. Test the connection from the admin dashboard
3. Configure any additional team member access
4. Set up content publishing workflows