# ARA Beddings - E-Commerce Platform

A complete, production-ready e-commerce website for ARA Beddings, a Pakistan-based luxury bedding brand. Built with Next.js 16, TypeScript, and Tailwind CSS.

## 🚀 Features

### Storefront
- **Homepage**: Hero slider, featured products, category browsing, trust bar
- **Shop**: Search, category filters, sorting, product grid
- **Product Detail**: Step-by-step variant selection (Size → Type), image gallery, wishlist
- **Cart**: Global cart drawer with quantity controls
- **Checkout**: Customer info, shipping address, payment methods (COD, JazzCash, Easypaisa)
- **Order Confirmation**: Order number and summary
- **WhatsApp Integration**: Floating WhatsApp button for customer support

### Admin Panel
- **Dashboard**: Stats overview (products, orders, revenue, pending orders)
- **Products Management**: View all products with details
- **Orders Management**: View orders with status tracking
- **Authentication**: Secure login with JWT tokens

### Technical Features
- Multi-variant products (Size: Single/Double/Queen/King, Type: Bed Sheet Set/Comforter Set/Quilt Cover Set/Fitted Sheet Only)
- PKR currency formatting
- Flat shipping fee (Rs 350)
- JSON file-based data storage (easy migration path to PostgreSQL)
- Session-based authentication with hashed passwords
- Responsive design (mobile-first)
- SEO-friendly structure

## 📋 Prerequisites

- Node.js 20+ 
- npm or yarn

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd ara-beddings

# Install dependencies
npm install
```

### 2. Seed the Database

```bash
# This creates initial data including admin user and sample products
npm run seed
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Admin Login

**Email:** `admin@arabeddings.com`  
**Password:** `password`

Access the admin panel at: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## 📦 Project Structure

```
ara-beddings/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main storefront
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   ├── admin/
│   │   │   ├── login/page.tsx    # Admin login
│   │   │   └── dashboard/page.tsx # Admin dashboard
│   │   └── api/
│   │       ├── products/route.ts # Products API
│   │       ├── orders/route.ts   # Orders API
│   │       └── auth/login/route.ts # Auth API
│   ├── components/               # React components
│   ├── lib/
│   │   └── store.ts              # JSON data store
│   └── types/
│       └── index.ts              # TypeScript types
├── data/                         # JSON data files (created after seed)
│   ├── products.json
│   ├── orders.json
│   ├── users.json
│   ├── reviews.json
│   ├── media.json
│   └── settings.json
├── scripts/
│   └── seed-data.js              # Database seeder
├── Dockerfile                    # Docker configuration
├── docker-compose.yml            # Docker Compose
├── next.config.mjs               # Next.js config
├── postcss.config.mjs            # PostCSS config
├── tsconfig.json                 # TypeScript config
└── vercel.json                   # Vercel deployment config
```

## 🗄️ Data Models

### Product
- Multi-variant support (Size + Type combinations)
- Categories: Bed Sheets, Comforters, Quilt Covers, Kids, Accessories, Quilts
- Fields: name, slug, description, priceFrom, compareAt, stock, badge, featured, isNew, customizable

### Order
- Customer information (name, email, phone, address)
- Order items with variants
- Payment methods: COD, JazzCash, Easypaisa
- Status tracking: new → confirmed → processing → shipped → delivered / cancelled
- Status history with timestamps

### User
- Role-based access: superadmin, admin, manager, support
- Hashed passwords with bcrypt

## 🚢 Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t ara-beddings .
docker run -p 3000:3000 -v $(pwd)/data:/app/data ara-beddings
```

### Option 3: Traditional Hosting

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📱 Payment Methods

### Cash on Delivery (COD)
- Primary payment method
- No additional setup required

### JazzCash
- Account Number: 03160143039
- Customers can upload payment proof (transaction ID or screenshot)

### Easypaisa
- Account Number: 03160143039
- Customers can upload payment proof (transaction ID or screenshot)

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

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order

### Authentication
- `POST /api/auth/login` - Admin login

## 📊 Shipping

- **Flat Rate**: Rs 350 for all orders
- **Coverage**: All across Pakistan
- **No free shipping threshold** (can be configured in settings)

## 🔄 Future Enhancements

### Database Migration
The current JSON file store can be easily migrated to PostgreSQL:

1. Create database schema based on TypeScript types
2. Replace `src/lib/store.ts` functions with database queries
3. Use Prisma or Drizzle ORM for type-safe queries

### Additional Features
- Customer accounts and order history
- Product reviews and ratings
- Email notifications
- Inventory management
- Advanced admin features (media library, reviews moderation)
- Wishlist persistence (currently localStorage)
- Order tracking page
- Invoice generation

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
