# ARA BEDDINGS - PostgreSQL Database Connection

## ✅ What Has Been Created

I've successfully created a complete PostgreSQL backend for your ARA BEDDINGS e-commerce platform with the following components:

### 📁 Backend Structure

```
server/
├── index.js                    # Main Express server
├── package.json                # Backend dependencies
├── middleware/
│   └── auth.js                 # JWT authentication middleware
└── routes/
    ├── auth.js                 # Login, register, profile
    ├── products.js             # Product catalog with filters
    ├── categories.js           # Product categories
    ├── cart.js                 # Shopping cart operations
    ├── wishlist.js             # Wishlist management
    ├── orders.js               # Order creation & tracking
    ├── drugOrders.js           # Custom order requests
    ├── addresses.js            # Customer addresses
    ├── shipping.js             # Shipping zones & rates
    ├── admin.js                # Admin dashboard operations
    ├── media.js                # Media library management
    └── settings.js             # Site settings

prisma/
├── schema.prisma               # Complete database schema
└── seed.js                     # Database seed script

.env                            # Environment configuration
.env.example                    # Example environment file
```

### 🗄️ Database Schema

The Prisma schema includes all necessary models:

- **Users** - Customer and admin accounts
- **Products** - Multi-variant products with images
- **Categories** - Product categories
- **Variants** - Product variations (size, color, etc.)
- **Options** - Variant options (Size, Color, Material)
- **Cart & CartItems** - Shopping cart
- **Wishlist** - Customer wishlists
- **Orders & OrderItems** - Customer orders
- **Payments** - Payment tracking (COD/Bank Transfer)
- **Addresses** - Customer shipping addresses
- **ShippingZones & Methods** - Pakistan-specific shipping
- **DrugOrders** - Custom order requests
- **Reviews** - Product reviews
- **Media** - Media library for admin
- **SiteSettings** - Global site configuration

### 🔌 API Endpoints

**Authentication**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/profile` - Update profile

**Products**
- GET `/api/products` - List products with filters
- GET `/api/products/:slug` - Get product details
- GET `/api/products/featured/list` - Featured products

**Cart**
- GET `/api/cart` - Get cart
- POST `/api/cart/items` - Add to cart
- PUT `/api/cart/items/:id` - Update quantity
- DELETE `/api/cart/items/:id` - Remove item

**Orders**
- POST `/api/orders` - Create order (checkout)
- GET `/api/orders` - Get user orders
- GET `/api/orders/:id` - Get order details

**Admin** (requires admin role)
- GET `/api/admin/stats` - Dashboard statistics
- PUT `/api/admin/orders/:id/status` - Update order status
- PUT `/api/admin/payments/:id/verify` - Verify bank transfer
- POST `/api/admin/products` - Create product
- PUT `/api/admin/products/:id` - Update product

### 🇵🇰 Pakistan-Specific Features

- **Currency**: All prices in PKR (Pakistani Rupees)
- **Provinces**: Punjab, Sindh, KPK, Balochistan, GB/AJK
- **Cities**: 100+ major Pakistani cities
- **Shipping**: Zone-based rates for each province
- **Bank Details**: Meezan Bank account information
- **Phone Format**: +92 Pakistani format

---

## 🚀 Setup Instructions

### Prerequisites

1. **PostgreSQL** installed and running
2. **Node.js** v18+ installed
3. **npm** or **yarn** package manager

### Step 1: Install PostgreSQL

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Install with default settings
- Remember your postgres password

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql
sudo systemctl start postgresql
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ara_beddings;

# Exit
\q
```

### Step 3: Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Or from root directory
npm install express cors dotenv bcryptjs jsonwebtoken @prisma/client
npm install --save-dev prisma @types/express @types/cors @types/bcryptjs @types/jsonwebtoken
```

### Step 4: Configure Environment

Edit `.env` file:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ara_beddings?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=3001
FRONTEND_URL="http://localhost:5173"
ADMIN_EMAIL="admin@arabeddings.com"
ADMIN_PASSWORD="admin123"
```

**Replace `YOUR_PASSWORD` with your actual PostgreSQL password!**

### Step 5: Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with initial data
node prisma/seed.js
```

### Step 6: Start Servers

Open **TWO terminals**:

**Terminal 1 - Backend:**
```bash
node server/index.js
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 7: Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health

**Demo Accounts:**
- Admin: `admin@arabeddings.com` / `admin123`
- Customer: `demo@arabeddings.com` / `customer123`

---

## 🔧 Database Management

### View Database with Prisma Studio

```bash
npx prisma studio
```

Opens a web interface at http://localhost:5555 where you can:
- View all tables
- Edit records
- Create new entries
- Delete data

### Reset Database

```bash
npx prisma migrate reset
```

This drops all tables, recreates them, and runs the seed script.

### Create New Migration

After modifying `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name your_migration_name
```

---

## 📝 Next Steps

### Update Frontend to Use API

The frontend currently uses localStorage. To connect it to the PostgreSQL database:

1. **Create API service layer** in `src/services/api.js`
2. **Update Zustand store** to fetch from API instead of localStorage
3. **Add authentication** to store JWT token
4. **Update all pages** to use API calls

Example API service:

```javascript
// src/services/api.js
const API_URL = 'http://localhost:3001/api';

export const api = {
  // Products
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/products?${params}`);
    return res.json();
  },

  // Cart
  getCart: async (token) => {
    const res = await fetch(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // Orders
  createOrder: async (orderData, token) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  }
};
```

---

## 🐛 Troubleshooting

### "Can't reach database server"

1. Check PostgreSQL is running:
   ```bash
   # Windows
   net start postgresql-x64-13
   
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verify DATABASE_URL in `.env`:
   - Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
   - Example: `postgresql://postgres:mypassword@localhost:5432/ara_beddings`

3. Test connection:
   ```bash
   psql -U postgres -d ara_beddings
   ```

### "Port 3001 already in use"

Change PORT in `.env`:
```env
PORT=3002
```

### "Module not found" errors

```bash
npm install
```

---

## 📚 Documentation

- **Quick Start**: [QUICKSTART.md](./QUICKSTART.md)
- **Full Setup Guide**: [DATABASE_SETUP.md](./DATABASE_SETUP.md)
- **Prisma Docs**: https://www.prisma.io/docs
- **Express Docs**: https://expressjs.com/

---

## ✅ Summary

You now have:

✅ Complete PostgreSQL database schema  
✅ Express.js backend API with 50+ endpoints  
✅ JWT authentication system  
✅ Pakistan-specific data (provinces, cities, PKR currency)  
✅ Admin dashboard API endpoints  
✅ Order management system  
✅ Payment verification (COD & Bank Transfer)  
✅ Shipping zone management  
✅ Media library for admin  
✅ Database seed script with demo data  
✅ Comprehensive documentation  

**The backend is ready to use! Just follow the setup instructions above to connect your PostgreSQL database.**

---

**Need help?** Check the troubleshooting section or read the full setup guides.
