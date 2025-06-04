# 🛠️ INKEY List Admin Dashboard - Complete User Guide

## 🚀 Getting Started

### Accessing the Admin Dashboard

1. **On the main website**, look for the **settings icon (⚙️)** in the top navigation bar
2. **Click the settings icon** to reveal the admin toggle
3. **Click "Admin"** button to enter the dashboard
4. You'll be redirected to `/admin` - your central command center

---

## 📊 Main Dashboard Overview (`/admin`)

Your dashboard provides an at-a-glance view of your store performance:

### Key Statistics
- **Total Products**: Shows count of all products (local + Shopify)
- **In Stock**: Number of available products
- **Featured**: Products marked for homepage promotion
- **Low Stock**: Products needing attention

### Quick Actions
- **Add New Product**: Direct link to product creation
- **Manage Categories**: Organize your catalog
- **View All Products**: Access full product list
- **View Analytics**: See performance metrics

### Recent Products
- Last 5 products added/updated
- Quick status overview (In Stock/Out of Stock)
- Direct links to edit each product

---

## 📦 Products Management (`/admin/products`)

### Unified Product View

**What You'll See:**
- **Combined list** of local products AND Shopify products
- **Source indicator**: "Local" vs "Shopify" badges
- **Real-time stock status**: Green (In Stock) / Red (Out of Stock)
- **Product images** with names and descriptions
- **Pricing information** for all products

### Search & Filtering

**Search Bar:**
- Type product names to find specific items
- Searches across both local and Shopify products

**Category Filter:**
- Drop-down with all available categories
- Includes both local categories and Shopify product types

**Stock Filter:**
- All Stock Status
- In Stock only
- Out of Stock only

### Bulk Operations

**How to Use:**
1. **Select products** using checkboxes (individual or select all)
2. **Bulk action buttons appear** when products are selected
3. **Available actions:**
   - Bulk Edit (update multiple products)
   - Update Stock (mark as in/out of stock)
   - Delete Selected (local products only)

### Individual Product Actions

**For each product, you can:**
- **👁️ View**: See the product on your live site
- **✏️ Edit**: Modify product details
- **🗑️ Delete**: Remove product (local products only)

**Note**: Shopify products show view/edit only (editing redirects to Shopify admin)

---

## ➕ Adding New Products (`/admin/products/new`)

### Product Information Form

**Basic Information:**
- **Product Name**: Required, appears on your site
- **Short Description**: Brief text for product cards
- **Full Description**: Detailed product information

**Pricing:**
- **Price**: Current selling price (£9.99 format)
- **Original Price**: Optional, shows as crossed out

**Product Images:**
- **Multiple image URLs**: Add as many as needed
- **First image**: Used as main product image
- **Remove/Add**: Dynamic image field management

**Available Sizes:**
- **Size options**: 30ml, 50ml, etc.
- **Multiple sizes**: Add various size options

### Product Organization

**Category Selection:**
- Choose from: Serums, Cleansers, Moisturizers, Eye Care, etc.
- **Required field** for proper organization

**Skin Types:** (Select multiple)
- All Skin Types, Normal, Dry, Oily, Combination, Sensitive, Acne-Prone, Mature

**Skin Concerns:** (Select multiple)
- Hydration, Acne, Fine Lines, Dark Spots, Large Pores, etc.

**Status Options:**
- **In Stock**: ✅ Product available for purchase
- **Featured**: ⭐ Show on homepage and special sections

---

## 🏷️ Categories Management (`/admin/categories`)

### Two Types of Categories

**Product Categories:**
- Physical product types (Serums, Cleansers, Moisturizers)
- Used for shop organization
- Shows product count per category

**Skin Concerns:**
- Customer needs (Acne, Hydration, Anti-Aging)
- Used for concern-based shopping
- Helps customers find solutions

### Managing Categories

**View Categories:**
- Switch between "Product Categories" and "Skin Concerns" tabs
- See product count for each category
- View category descriptions

**Add New Categories:**
1. Click **"Add Category/Concern"** button
2. Enter **name and description**
3. Click **"Create"**

**Edit Existing:**
1. Click **edit icon (✏️)** on any category
2. Modify **name and description**
3. Click **"Save Changes"**

**Delete Categories:**
1. Click **delete icon (🗑️)**
2. **Confirm deletion** in popup
3. Products will need reassignment

### Category Performance

Each category card shows:
- **Product count**: How many products in category
- **Category type**: Product Category vs Skin Concern
- **Description**: Helpful text for organization

---

## 📈 Analytics Dashboard (`/admin/analytics`)

### Performance Overview

**Key Metrics:**
- **Total Views**: All product page visits
- **Total Sales**: Number of completed purchases
- **Conversion Rate**: Views → Sales percentage
- **Average Order Value**: Revenue per sale

**Time Range Selection:**
- Last 7 days, 30 days, 90 days, 1 year
- All metrics update based on selection

### Top Performing Products

**Product Rankings:**
1. **View count**: Most viewed products
2. **Sales count**: Best selling items
3. **Revenue**: Highest earning products
4. **Performance trends**: Growth indicators

**Product Details:**
- Product images and names
- View/sales/revenue numbers
- Direct links to product pages

### Category Performance

**Category Analytics:**
- **Product count** per category
- **Total sales** by category
- **Revenue** by category
- **Average rating** per category

### Recent Activity Feed

**Activity Types:**
- 🛒 **Sales**: Recent purchases with amounts
- 👁️ **Views**: Product page visits
- ⭐ **Reviews**: New customer reviews
- Real-time timestamps for all activity

---

## ⚙️ Settings & Configuration (`/admin/settings`)

### Store Settings Tab

**Store Information:**
- Store name, description, contact details
- Physical address and phone
- Contact email for customers

**Pricing & Shipping:**
- **Currency**: GBP, USD, EUR
- **Tax Rate**: Percentage (0.20 = 20%)
- **Shipping Rate**: Flat rate shipping cost
- **Free Shipping Threshold**: Minimum order for free shipping

### Integrations Tab

**Shopify Integration:**
- **Enable/Disable**: Toggle Shopify connection
- **Store URL**: your-store.myshopify.com
- **Access Token**: Storefront API token
- **Test Connection**: Verify setup works

**Stripe Payments:**
- **Enable/Disable**: Toggle payment processing
- **Publishable Key**: Client-side Stripe key
- **Secret Key**: Server-side Stripe key (hidden)
- **Test Connection**: Verify payment setup

**Email Settings:**
- **Provider**: SendGrid, Mailgun, AWS SES
- **API Key**: Email service credentials
- **From Email**: Sender email address
- **From Name**: Sender display name

### SEO & Marketing Tab

**Search Engine Optimization:**
- **Site Title**: Appears in browser tabs
- **Meta Description**: Search result descriptions
- **Keywords**: SEO keyword targeting
- **Open Graph Image**: Social media preview image

---

## 📚 Help & Documentation (`/admin/help`)

### Quick Tips Section

**Best Practices:**
- Use bulk operations for efficiency
- Mark bestsellers as featured
- Keep inventory updated
- Optimize product descriptions for SEO
- Review analytics regularly
- Organize categories logically

### Comprehensive Guides

**Getting Started:**
- Dashboard navigation
- Essential setup tasks
- First product creation

**Product Management:**
- Adding products step-by-step
- Bulk editing workflows
- Shopify integration details

**Categories & Organization:**
- Category best practices
- Skin concern mapping
- Customer journey optimization

**Analytics & Insights:**
- Reading performance metrics
- Understanding customer behavior
- Making data-driven decisions

**Settings & Configuration:**
- Store setup checklist
- Integration troubleshooting
- SEO optimization tips

### FAQ Section

**Common Questions:**
- How to connect Shopify store
- Editing Shopify vs local products
- Featuring products on homepage
- Understanding skin concerns
- Bulk updating products

---

## 🎯 Workflow Examples

### Daily Management Routine

1. **Check Dashboard** → Review overnight sales and activity
2. **Update Stock** → Mark out-of-stock items
3. **Review Analytics** → Check top performers
4. **Process Orders** → Handle customer inquiries

### Weekly Organization

1. **Category Review** → Ensure proper organization
2. **Featured Products** → Rotate homepage highlights
3. **Analytics Deep Dive** → Identify trends
4. **Content Updates** → Refresh descriptions

### Monthly Planning

1. **Performance Analysis** → Full analytics review
2. **Category Optimization** → Reorganize based on data
3. **New Product Planning** → Add seasonal items
4. **SEO Updates** → Refresh meta descriptions

---

## 🔧 Troubleshooting

### Common Issues

**Shopify Products Not Showing:**
- Check connection in Settings
- Verify access token
- Test connection button

**Images Not Loading:**
- Verify image URLs are accessible
- Check image permissions
- Use HTTPS URLs

**Categories Not Updating:**
- Refresh browser
- Check for save confirmation
- Verify category names

### Getting Help

**Built-in Support:**
- Help page with guides
- FAQ section
- Quick tips

**Additional Resources:**
- Documentation links
- Community forum access
- Support contact options

---

## ✨ Pro Tips

### Efficiency Shortcuts

1. **Use bulk operations** instead of editing one by one
2. **Filter before selecting** to target specific products
3. **Use search** to quickly find products
4. **Bookmark admin pages** you use frequently

### Organization Best Practices

1. **Consistent naming** for easy searching
2. **Detailed descriptions** for better SEO
3. **Proper categorization** for customer experience
4. **Regular inventory updates** for accuracy

### Performance Optimization

1. **Monitor analytics weekly** for trends
2. **Feature top performers** on homepage
3. **Organize by customer needs** not just product types
4. **Use concern-based categories** for better discovery

---

## 🚀 Next Steps

Now that you have your complete admin system:

1. **Explore each section** to familiarize yourself
2. **Add/edit some products** to test functionality
3. **Organize your categories** for better customer experience
4. **Set up integrations** (Shopify, Stripe) if needed
5. **Check analytics regularly** to understand performance

Your centralized product management system is ready to help you efficiently manage your entire catalog!
