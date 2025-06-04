# INKEY List Admin Dashboard - Deployment Guide

A comprehensive admin dashboard for managing the INKEY List skincare store with real-time synchronization capabilities.

## 🏗️ Architecture Overview

This project consists of two connected sites:

1. **Main Store** (`https://inkey-list-clone2.vercel.app`) - The customer-facing e-commerce site
2. **Admin Dashboard** (this repository) - The admin management interface

The admin dashboard connects to the main store via API to provide real-time product management, analytics, and content control.

## 🚀 Quick Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/suran0330/admin)

1. Click the Deploy button above
2. Connect your GitHub account
3. Configure environment variables (see below)
4. Deploy!

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/suran0330/admin)

1. Click the Deploy button above
2. Connect your GitHub account
3. Set build command: `bun run build`
4. Set publish directory: `out` or `.next`
5. Configure environment variables
6. Deploy!

## ⚙️ Environment Variables

Create a `.env.local` file in your project root:

```bash
# Main store connection
NEXT_PUBLIC_MAIN_STORE_URL=https://inkey-list-clone2.vercel.app

# Admin settings
NEXT_PUBLIC_ADMIN_NAME="INKEY List Admin"
NEXT_PUBLIC_ADMIN_VERSION="1.0.0"

# Store API configuration
NEXT_PUBLIC_STORE_API_KEY=demo-api-key
ADMIN_TOKEN=demo-admin-token

# Optional: Analytics and monitoring
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ or Bun 1.0+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/suran0330/admin.git
cd admin

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
bun dev
```

The admin dashboard will be available at `http://localhost:3000`

## 🏪 Store Connection Setup

### Connecting to Your Store

The admin dashboard can connect to different types of stores:

#### 1. Live API Connection (Recommended)
```bash
NEXT_PUBLIC_MAIN_STORE_URL=https://your-store.netlify.app
NEXT_PUBLIC_STORE_API_KEY=your-api-key
ADMIN_TOKEN=your-admin-token
```

#### 2. Static Data Mode (Fallback)
If no API connection is available, the dashboard automatically falls back to static product data for demo purposes.

### API Endpoints Expected

Your main store should provide these API endpoints:

```
GET  /api/health              - Health check
GET  /api/products            - List products
POST /api/admin/products      - Create product
PUT  /api/admin/products/:id  - Update product
DELETE /api/admin/products/:id - Delete product
```

## 👤 Demo Accounts

The dashboard includes demo authentication with different role levels:

- **Admin**: `admin@inkey.com` / `admin123`
- **Designer**: `designer@inkey.com` / `design123`
- **Viewer**: `viewer@inkey.com` / `view123`

Each role has different permissions for managing products, design, and settings.

## 🎨 Features Overview

### 📊 Dashboard
- Real-time store connection status
- Product analytics and metrics
- Quick action shortcuts
- Recent activity feed

### 📦 Product Management
- Full CRUD operations for products
- Real-time stock management
- Featured product controls
- Category organization
- Bulk operations support

### 🎨 Design System
- Theme customization
- Layout management
- Visual asset library
- Component styling
- Responsive design tools

### 📈 Analytics
- Sales performance metrics
- Product popularity tracking
- Customer behavior insights
- Revenue analytics

### 👥 User Management
- Role-based access control
- Permission management
- User activity tracking
- Authentication system

## 🔐 Security & Permissions

### Role-Based Access Control

The dashboard implements a comprehensive permission system:

- **Super Admin**: Full system access
- **Admin**: Product and order management
- **Editor**: Content and product editing
- **Designer**: Design and asset management
- **Viewer**: Read-only access

### Security Features

- JWT-based authentication
- Session management
- CSRF protection
- Input validation
- Secure API communication

## 🔄 Real-time Synchronization

### Connection Monitoring
- Live connection health checks
- Automatic retry with exponential backoff
- Latency monitoring
- Connection status indicators

### Data Sync
- Real-time product updates
- Automatic conflict resolution
- Periodic data synchronization
- Event-driven updates

### Fallback Strategies
- Offline mode support
- Static data fallback
- Local data persistence
- Graceful degradation

## 🛠️ Build Configuration

### Next.js Configuration
```javascript
// next.config.js
module.exports = {
  typescript: {
    ignoreBuildErrors: true, // For deployment flexibility
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'source.unsplash.com'],
  },
}
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev -H 0.0.0.0 --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "bunx biome lint --write && bunx tsc --noEmit"
  }
}
```

## 📱 Mobile Support

The admin dashboard is fully responsive and includes:
- Mobile-first design approach
- Touch-friendly interfaces
- Responsive navigation
- Optimized mobile layouts
- Progressive Web App features

## 🔍 Monitoring & Analytics

### Built-in Monitoring
- Connection health tracking
- API response time monitoring
- Error tracking and reporting
- User activity logging

### External Integrations
- Google Analytics support
- Sentry error monitoring
- Custom analytics endpoints
- Performance monitoring

## 🆘 Troubleshooting

### Common Issues

#### Connection Problems
```bash
# Check if main store is accessible
curl https://your-store.netlify.app/api/health

# Verify environment variables
echo $NEXT_PUBLIC_MAIN_STORE_URL
```

#### Build Issues
```bash
# Clear cache and rebuild
rm -rf .next node_modules
bun install
bun build
```

#### Permission Errors
- Verify user roles are correctly assigned
- Check API token permissions
- Review access control settings

### Debug Mode
Set `NODE_ENV=development` to enable:
- Detailed error messages
- Connection logging
- Debug information
- Development tools

## 🚀 Production Considerations

### Performance Optimization
- Static generation for faster loading
- Image optimization
- Code splitting
- Bundle optimization
- Caching strategies

### Security Hardening
- Environment variable protection
- API rate limiting
- Input sanitization
- HTTPS enforcement
- CSP headers

### Monitoring
- Uptime monitoring
- Performance tracking
- Error alerting
- Usage analytics

## 📞 Support

### Documentation
- API documentation included
- Component library docs
- User guide available
- Video tutorials

### Community
- GitHub Issues: [Report bugs or request features](https://github.com/suran0330/admin/issues)
- Discussions: [Ask questions or share ideas](https://github.com/suran0330/admin/discussions)

## 📄 License

This project is MIT licensed. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Built with Next.js 15 and TypeScript
- UI components by shadcn/ui
- Icons by Lucide React
- Styling with Tailwind CSS
- Package management with Bun

---

**Need help?** Open an issue on GitHub or check the documentation for detailed guides on specific features.
