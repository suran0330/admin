# 🚀 Complete Sanity CMS Setup Guide

## ✅ Current Status
- ✅ Sanity project created (Project ID: zqetc89y)
- ✅ API token configured
- ✅ Environment variables set
- ✅ Content schemas prepared
- ✅ Admin dashboard integration ready
- ⏳ **Next Step: Deploy Sanity Studio**

## 🎯 Deploy Your Content Studio (5 minutes)

### Option 1: Deploy via Sanity.io Dashboard (Recommended)

1. **Visit Sanity Management Console**
   ```
   https://sanity.io/manage/personal/project/zqetc89y
   ```

2. **Go to the "Studio" tab**
   - Click on "Studio" in the left sidebar
   - Click "Deploy Studio" button

3. **Choose a studio URL**
   - Enter hostname: `inkey-list-admin` or `inkey-admin`
   - Click "Deploy"

4. **Access your Studio**
   - Your content studio will be available at:
   - `https://inkey-list-admin.sanity.studio`

### Option 2: Deploy via Command Line

If you prefer using the command line:

```bash
# Navigate to studio directory
cd admin/sanity-studio

# Login to Sanity (if not already logged in)
npx sanity login

# Deploy the studio
npx sanity deploy
# Choose hostname when prompted: inkey-list-admin
```

## 🎨 Start Creating Content

Once your studio is deployed:

### 1. Homepage Content
- Click "Homepage" in your studio
- Update hero section headline and subheadline
- Upload a hero background image
- Set call-to-action button text and link

### 2. Product Categories
- Click "Categories" to create product categories
- Add categories like:
  - Serums
  - Cleansers
  - Moisturizers
  - Eye Care
  - Treatments

### 3. Add Products
- Click "Products" to create your first products
- Fill in product details:
  - Name and description
  - Price and images
  - Skin types and concerns
  - Key ingredients

### 4. Site Settings
- Click "Site Settings" to configure:
  - Site name and logo
  - Navigation menu
  - Social media links
  - Footer content

## 🔄 Real-time Sync

Your admin dashboard will automatically sync with Sanity:
- Changes in Sanity Studio appear instantly in the admin
- Content status shows live connection
- No manual refresh needed

## 📱 Content Editing Workflow

### For Content Editors:
1. **Login to Sanity Studio** (bookmark the URL)
2. **Edit content visually** with rich text editor
3. **Upload images** with drag-and-drop
4. **Preview changes** before publishing
5. **Collaborate in real-time** with team members

### For Admin Users:
1. **Monitor content** in admin dashboard `/content`
2. **View connection status** and sync health
3. **Quick access** to Sanity Studio via admin
4. **Track content changes** and publishing status

## 🛠️ Advanced Features

### Image Management
- Automatic image optimization
- Multiple format support (WebP, JPEG, PNG)
- Responsive image generation
- Alt text for accessibility

### SEO Optimization
- Meta titles and descriptions
- Character count helpers
- Social media preview cards
- Structured data support

### Content Scheduling
- Publish dates for blog posts
- Draft/published status
- Content approval workflows
- Version history

## 🔧 Customization Options

### Studio Customization
Edit `admin/sanity-studio/sanity.config.ts` to:
- Add custom branding
- Create custom input components
- Set up content validation rules
- Configure user roles and permissions

### Schema Modifications
Modify files in `admin/sanity-studio/schemaTypes/` to:
- Add new content types
- Customize field options
- Set up content relationships
- Create custom field validations

## 🚨 Troubleshooting

### Studio Won't Load
- Check Project ID in environment variables
- Verify API token permissions
- Clear browser cache
- Check network connectivity

### Content Not Syncing
- Verify API token in admin dashboard
- Check connection status in `/content`
- Refresh connection in admin dashboard
- Check browser console for errors

### Deploy Errors
- Ensure you're logged into Sanity CLI
- Check internet connection
- Verify project permissions
- Try different studio hostname

## 📞 Support Resources

- **Sanity Documentation**: https://sanity.io/docs
- **Community Slack**: https://slack.sanity.io
- **Admin Dashboard**: `/content` page shows connection status
- **Project Management**: https://sanity.io/manage/personal/project/zqetc89y

## 🎊 Next Steps After Setup

1. **Deploy your studio** using one of the methods above
2. **Create your first homepage** content
3. **Add product categories** and products
4. **Configure site settings** and branding
5. **Train your team** on using Sanity Studio
6. **Set up content workflows** for your organization

---

## ⚡ Quick Start Commands

```bash
# For immediate setup:
1. Visit: https://sanity.io/manage/personal/project/zqetc89y
2. Click "Studio" → "Deploy Studio"
3. Choose hostname: inkey-list-admin
4. Start editing content!

# Your studio will be live at:
# https://inkey-list-admin.sanity.studio
```

**🎯 Bottom Line**: Your content management system is ready! Just deploy the studio and start creating amazing content with a professional visual editor.
