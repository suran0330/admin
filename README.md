# 🎨 INKEY List Admin Dashboard

A comprehensive design management dashboard for controlling website appearance, layouts, and visual components. Built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

### 🎯 Design Management
- **Theme Customization**: Complete control over colors, fonts, and spacing
- **Layout Builder**: Drag-and-drop page section management
- **Visual Assets**: Upload and organize images, icons, and media
- **Component Styling**: Customize UI components and their appearance
- **Live Preview**: See changes before publishing to live site

### 🚀 Professional Workflow
- **Real-time Changes**: Instant preview of design modifications
- **Device Testing**: Preview on desktop, tablet, and mobile
- **Asset Organization**: Smart categorization and search
- **Design History**: Track and revert changes
- **Publishing Control**: Save drafts and publish when ready

### 📊 Analytics & Insights
- **Design Performance**: Track how design changes affect user behavior
- **Asset Usage**: See where images and assets are being used
- **Activity Tracking**: Monitor recent design changes
- **User Engagement**: Understand how users interact with your design

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **Package Manager**: Bun
- **Development**: Hot reloading with Turbopack

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admin
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the development server**
   ```bash
   bun run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Building for Production

```bash
# Build the application
bun run build

# Start production server
bun run start
```

## 📱 Admin Interface Overview

### Main Dashboard (`/`)
- Design metrics and activity overview
- Quick access to design tools
- Recent changes and activity feed
- Direct links to main store

### Design Studio (`/design`)
- Central hub for all design tools
- Device preview controls
- Save and publish workflow
- Design change tracking

### Theme Management (`/design/themes`)
- Color palette customization
- Typography controls
- Spacing and layout settings
- Live preview and CSS export

### Layout Builder (`/design/layouts`)
- Page structure management
- Section drag-and-drop
- Visibility controls
- Responsive design tools

### Visual Assets (`/design/assets`)
- File upload and management
- Asset categorization
- Usage tracking
- Bulk operations

### Product Management (`/products`)
- Product catalog overview
- Inventory management
- Category organization
- Store integration

### Help & Documentation (`/help`)
- Complete user guides
- Workflow documentation
- FAQ and troubleshooting
- Best practices

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Main store connection
NEXT_PUBLIC_MAIN_STORE_URL=https://your-main-store.com

# Admin settings
NEXT_PUBLIC_ADMIN_NAME="Your Store Admin"
NEXT_PUBLIC_ADMIN_VERSION="1.0.0"

# Optional: Analytics and monitoring
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Theme Configuration

The admin dashboard uses a design system that can be customized in `src/lib/design-api.ts`:

```typescript
// Default theme configuration
const defaultTheme = {
  colors: {
    primary: '#000000',
    secondary: '#746cad',
    accent: '#efeff0',
    background: '#ffffff',
    text: '#1c1c22',
    muted: '#747474'
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    accent: 'Lato, sans-serif'
  },
  // ... more configuration
};
```

## 🎨 Design Workflow

### 1. Plan Your Design
- Define brand colors and typography
- Plan page layouts and sections
- Gather visual assets (images, logos)

### 2. Customize Theme
- Set brand colors using color picker
- Choose fonts and typography
- Configure spacing and borders

### 3. Build Layouts
- Add sections to pages
- Organize content structure
- Set section visibility and order

### 4. Upload Assets
- Add images, logos, and media
- Organize by type and usage
- Optimize for web performance

### 5. Preview & Test
- Test on different devices
- Check responsive behavior
- Verify design consistency

### 6. Publish Changes
- Save changes as drafts
- Preview before publishing
- Publish to live website

## 📁 Project Structure

```
admin/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── design/            # Design management pages
│   │   ├── products/          # Product management
│   │   ├── help/              # Documentation
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   └── AdminLayout.tsx    # Main admin layout
│   └── lib/                   # Utilities and APIs
│       ├── design-api.ts      # Design management API
│       └── utils.ts           # Helper functions
├── public/                    # Static assets
├── .same/                     # Project documentation
└── package.json              # Dependencies and scripts
```

## 🛠️ Development

### Adding New Components

```bash
# Add shadcn/ui components
npx shadcn@latest add -y -o <component-name>
```

### Code Quality

The project uses ESLint and Biome for code quality:

```bash
# Run linting
bun run lint

# Format code
bun run format
```

### Building New Features

1. Create new pages in `src/app/`
2. Add navigation links in `AdminLayout.tsx`
3. Implement API functions in `src/lib/`
4. Add documentation in help pages

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel**
2. **Set environment variables**
3. **Deploy automatically on push**

### Netlify

1. **Build command**: `bun run build`
2. **Output directory**: `.next`
3. **Node version**: 18+

### Self-hosted

1. **Build the application**
   ```bash
   bun run build
   ```

2. **Start with PM2 or similar**
   ```bash
   pm2 start bun --name "admin-dashboard" -- run start
   ```

## 🔒 Security

### Admin Access
- This admin dashboard should be deployed separately from your main store
- Use authentication middleware to protect admin routes
- Implement role-based access control as needed

### Environment Security
- Never commit environment variables to version control
- Use secure environment variable storage
- Regularly rotate API keys and secrets

## 📈 Performance

### Optimization
- Images are optimized using Next.js Image component
- Code splitting for efficient loading
- Minimal bundle size with tree shaking
- Responsive design for all devices

### Monitoring
- Built-in performance tracking
- Design change analytics
- User interaction monitoring
- Asset usage statistics

## 🆘 Support & Help

### Built-in Help
- Navigate to `/help` in the admin dashboard
- Comprehensive guides and documentation
- FAQ and troubleshooting section
- Best practices and workflows

### Community
- GitHub Issues for bug reports
- Feature requests welcome
- Community contributions encouraged

## 📝 License

This project is part of the INKEY List clone implementation and follows the same licensing terms as the main project.

## 🎯 Next Steps

1. **Explore the Design Studio** - Start with `/design`
2. **Customize Your Theme** - Set brand colors at `/design/themes`
3. **Build Your Layouts** - Organize sections at `/design/layouts`
4. **Upload Assets** - Add images at `/design/assets`
5. **Read the Help** - Get guidance at `/help`

---

Built with ❤️ for modern design management and professional website administration.
