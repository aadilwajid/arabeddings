# ARA BEDDINGS - Next.js + PostgreSQL Migration

## Overview

Complete Next.js 14 + PostgreSQL migration structure created in `nextjs-migration/` folder.

## What's Included

### Database Schema (20+ models)
- Users & Authentication (User, Account, Session)
- Products (Product, ProductImage, ProductVariant, Option, OptionValue)
- Orders (Order, OrderItem, OrderStatusHistory, Payment)
- Shipping (ShippingZone, ShippingMethod)
- Custom Orders, Reviews, Wishlist, Coupons, Media, SiteSettings

### Server Actions
- `products.ts` - Get products, categories, featured
- `orders.ts` - Create orders, track orders
- `customOrders.ts` - Custom order management
- `admin.ts` - Admin stats, order management, payment verification

### Pages Created
- Home page (Server Component)
- Products listing (Server Component)
- Login page (Client Component with NextAuth)
- Admin dashboard (Server Component)

### Core Libraries
- Prisma client singleton
- NextAuth configuration
- Session helpers (requireAuth, requireAdmin)
- Zod validation schemas

## Quick Start

```bash
cd nextjs-migration
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

## Demo Accounts
- Admin: admin@arabeddings.com / admin123
- Customer: demo@arabeddings.com / customer123

## Key Differences from Vite Version

1. **Server Components** - Faster, SEO-friendly by default
2. **Server Actions** - Replace API routes for mutations
3. **NextAuth** - Built-in authentication
4. **File-based routing** - No React Router needed
5. **Automatic caching** - Better performance

## Next Steps

1. Copy `nextjs-migration/` to a new project
2. Install PostgreSQL
3. Run setup commands
4. Migrate remaining pages incrementally
5. Deploy to Vercel

See `MIGRATION_GUIDE.md` for detailed instructions.
