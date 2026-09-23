# ARA Beddings - Complete E-Commerce Platform

A production-ready e-commerce website for ARA Beddings, a Pakistan-based luxury bedding brand. Built with Next.js 16, TypeScript, and Tailwind CSS. Features a complete admin panel with full CRUD operations, order management, media library, and more.

## 🚀 Features

### 🛍️ Storefront
- **Homepage**: Hero slider with 3 rotating slides, featured products, category grid, trust bar
- **Shop**: Search, category filters (Bed Sheets, Comforters, Quilt Covers, Kids, Accessories, Quilts), price sorting
- **Product Detail**: Step-by-step variant selection (Size → Type), image gallery, wishlist
- **Cart**: Global cart drawer with quantity controls
- **Checkout**: Customer info, shipping address, COD/JazzCash/Easypaisa payment options with optional payment proof
- **Order Confirmation**: Order number display
- **Track Order**: Customers can track orders by order number with visual timeline
- **WhatsApp Integration**: Floating WhatsApp button for customer support (03160143039)
- **Invoice**: Printable invoice page with brand logo, line items, shipping, total

### 🔐 Admin Panel
- **Secure Login**: JWT-based authentication with hashed passwords
- **Dashboard**: Stats overview (products, orders, revenue, pending orders)
- **Products Management**: Full CRUD with multi-variant support (Size + Type)
- **Orders Management**: 
  - Status filters (new, confirmed, processing, shipped, delivered, cancelled)
  - Search by order number or customer name
  - Status updates with history tracking
  - WhatsApp customer (pre-filled message)
  - Invoice PDF link
  - Copy invoice text to clipboard
  - View payment proof
- **Media Library**: 
  - Upload images with URL
  - Tags for organization
  - Search by filename or tag
  - Multi-select delete
  - Usage tracking
- **Reviews Moderation**: Approve/unpublish/delete reviews
- **Users Management**: Create/delete admin users with role-based access (superadmin, admin, manager, support)
- **Menu Manager**: Drag-and-drop menu items for header/footer navigation
- **Site Settings**: 
  - Site name, logo, favicon
  - Contact numbers (WhatsApp, JazzCash, Easypaisa)
  - Shipping fee configuration
  - Homepage hero customization

### 📦 Product Model
- Multi-variant products with step-by-step selection
- **Sizes**: Single, Double, Queen, King
- **Types**: Bed Sheet Set, Comforter Set, Quilt Cover Set, Fitted Sheet Only
- **Categories**: Bed Sheets, Comforters, Quilt Covers, Kids, Accessories, Quilts
- Fields: name, slug, description, priceFrom, compareAt, stock, badge, featured, isNew, customizable

### 💰 Pakistan-Specific Features
- PKR currency formatting (Rs X,XXX)
- Flat shipping fee: Rs 350 (all zones, all sizes)
- COD as primary payment method
- JazzCash/Easypaisa integration (03160143039)
- WhatsApp support button

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd ara-beddings
npm install
```

### 2. Seed the Database

```bash
npm run seed
```

This creates:
- Admin user: `admin@arabeddings.com` / `password`
- 5 sample products with variants
- Default settings

### 3. Environment Variables

Create a `.env.local` file:

```env
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Access

**URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)  
**Email**: `admin@arabeddings.com`  
**Password**: `password`

## 📁 Project Structure

```
ara-beddings/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Main storefront
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Global styles
│   │   ├── admin/
│   │   │   ├── layout.tsx              # Admin layout with sidebar
│   │   │   ├── page.tsx                # Redirect to dashboard
│   │   │   ├── login/
│   │   │   │   ├── page.tsx            # Login page
│   │   │   │   └── layout.tsx          # Standalone layout
│   │   │   ├── dashboard/page.tsx      # Dashboard
│   │   │   ├── products/page.tsx       # Products CRUD
│   │   │   ├── orders/page.tsx         # Orders management
│   │   │   ├── media/page.tsx          # Media library
│   │   │   ├── reviews/page.tsx        # Reviews moderation
│   │   │   ├── users/page.tsx          # Users management
│   │   │   ├── menu/page.tsx           # Menu manager
│   │   │   └── settings/page.tsx       # Site settings
│   │   ├── api/
│   │   │   ├── products/route.ts       # Products API
│   │   │   ├── orders/route.ts         # Orders API
│   │   │   ├── media/route.ts          # Media API
│   │   │   ├── reviews/route.ts        # Reviews API
│   │   │   ├── users/route.ts          # Users API
│   │   │   ├── menu/route.ts           # Menu API
│   │   │   ├── settings/route.ts       # Settings API
│   │   │   └── auth/login/route.ts     # Auth API
│   │   ├── invoice/[id]/page.tsx       # Printable invoice
│   │   └── track-order/page.tsx        # Order tracking
│   ├── components/                     # Shared components
│   ├── lib/
│   │   └── store.ts                    # JSON data store
│   └── types/
│       └── index.ts                    # TypeScript types
├── data/                               # JSON data files
│   ├── products.json
│   ├── orders.json
│   ├── users.json
│   ├── reviews.json
│   ├── media.json
│   └── settings.json
├── scripts/
│   └── seed-data.js                    # Database seeder
├── Dockerfile
├── docker-compose.yml
├── next.config.mjs
├── postcss.config.mjs
├── tsconfig.json
└── vercel.json
```

## 🗄️ API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products` - Update product
- `DELETE /api/products` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders` - Update order status

### Media
- `GET /api/media` - Get all media
- `POST /api/media` - Upload media
- `DELETE /api/media` - Delete media

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews` - Update review (approve/unpublish)
- `DELETE /api/reviews` - Delete review

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `DELETE /api/users` - Delete user

### Menu
- `GET /api/menu` - Get menu
- `PUT /api/menu` - Update menu

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

### Auth
- `POST /api/auth/login` - Admin login

## 🚢 Deployment

### Option 1: Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Option 2: Docker

```bash
docker-compose up -d
```

### Option 3: Traditional

```bash
npm run build
npm start
```

## 🔄 End-to-End Flow

1. **Admin creates product** → `/admin/products` → Add Product form
2. **Customer browses shop** → `/` → Click "Shop Collection"
3. **Customer selects variant** → Product modal → Size → Type → Add to Cart
4. **Customer checks out** → Cart drawer → Checkout → Enter details → Place Order
5. **Order confirmation** → Order number displayed
6. **Customer tracks order** → `/track-order` → Enter order number → View status timeline
7. **Admin updates status** → `/admin/orders` → Click eye icon → Update status
8. **Admin sends WhatsApp** → Click WhatsApp icon → Pre-filled message opens
9. **Admin views invoice** → Click invoice icon → Printable invoice page
10. **Customer receives delivery** → Status updated to "delivered"

## 🎨 Design System

### Colors
- **Primary Background**: `#FDF8F3` (Cream)
- **Accent**: `#C4A265` (Gold)
- **Primary Text**: `#2D2A26` (Charcoal)
- **Secondary Text**: `#5C4A32` (Warm Brown)
- **Borders**: `#E8DFD5` (Sand)

### Typography
- **Headings**: Georgia (serif)
- **Body**: System fonts (sans-serif)

## 📊 Data Models

### Product
```typescript
{
  id: string;
  name: string;
  slug: string;
  category: Category;
  description: string;
  mainImage: string;
  galleryImages: string[];
  priceFrom: number;
  compareAt?: number;
  stock: number;
  badge?: string;
  featured: boolean;
  isNew: boolean;
  customizable: boolean;
  variants: ProductVariant[];
}
```

### Order
```typescript
{
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentProof?: string;
  statusHistory: StatusUpdate[];
}
```

## 🔧 Future Enhancements

- [ ] PostgreSQL database migration
- [ ] Customer accounts and order history
- [ ] Email notifications (order confirmation, status updates)
- [ ] Advanced inventory management
- [ ] Bulk product import/export
- [ ] Discount codes and promotions
- [ ] Multi-language support (Urdu)
- [ ] Dark mode
- [ ] Product reviews on storefront
- [ ] Wishlist persistence (database)
- [ ] Advanced analytics dashboard
- [ ] Courier integration (TCS, Leopard, etc.)

## 📞 Support

**WhatsApp**: 03160143039  
**Email**: admin@arabeddings.com

## 📄 License

© 2026 ARA Beddings. All rights reserved.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Authentication**: JWT + bcrypt
- **Data Storage**: JSON files (migration path to PostgreSQL)
- **Deployment**: Vercel / Docker

---

**Built with ❤️ for ARA Beddings**
