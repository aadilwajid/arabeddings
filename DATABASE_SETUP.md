# ARA BEDDINGS - E-Commerce Platform

A full-stack e-commerce platform for premium bedding products built with React, Express.js, PostgreSQL, and Prisma ORM.

## 🚀 Features

### Frontend
- Modern, responsive UI with dark mode support
- Product catalog with advanced filtering (size, color, price, category)
- Multi-variant product selection
- Shopping cart with persistent storage
- 3-step checkout process
- Wishlist functionality
- Custom order requests
- Customer account management
- Order tracking

### Backend
- RESTful API with Express.js
- PostgreSQL database with Prisma ORM
- JWT-based authentication
- Role-based access control (Admin/Customer)
- Order management system
- Payment verification (COD & Bank Transfer)
- Shipping zone management
- Media library for admin
- Site settings management

### Pakistan-Specific
- PKR currency formatting
- Pakistani provinces and cities
- Local shipping zones (Punjab, Sindh, KPK, Balochistan, GB/AJK)
- Pakistani bank details (Meezan Bank)
- Local phone format (+92)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v13 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager

## 🛠️ Setup Instructions

### 1. Install PostgreSQL

**Windows:**
- Download and install from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
- During installation, set a password for the `postgres` user (remember this!)
- Default port: 5432

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database

Open your terminal or PostgreSQL command line:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ara_beddings;

# Exit
\q
```

Or use pgAdmin (GUI tool that comes with PostgreSQL):
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database"
4. Name: `ara_beddings`
5. Click "Save"

### 3. Install Dependencies

Navigate to the project directory and install all required packages:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm install express cors dotenv bcryptjs jsonwebtoken
npm install @prisma/client prisma
npm install --save-dev @types/express @types/cors @types/bcryptjs @types/jsonwebtoken tsx concurrently
```

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and update the following:

```env
# Database URL - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ara_beddings?schema=public"

# JWT Secret - Generate a strong random string
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server port
PORT=3001

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"

# Admin credentials (for initial setup)
ADMIN_EMAIL="admin@arabeddings.com"
ADMIN_PASSWORD="admin123"
```

**Important:** Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

### 5. Initialize Database

Run Prisma migrations to create the database schema:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database with initial data
npx prisma db seed
```

Or if seed is not configured in package.json:

```bash
node prisma/seed.js
```

### 6. Start the Application

You need to run both the frontend and backend servers:

**Option 1: Run separately (recommended for development)**

Terminal 1 - Backend:
```bash
node server/index.js
```

Terminal 2 - Frontend:
```bash
npm run dev
```

**Option 2: Run both concurrently**

Add this script to package.json:
```json
{
  "scripts": {
    "dev": "concurrently \"node server/index.js\" \"vite\"",
    "server": "node server/index.js",
    "client": "vite"
  }
}
```

Then run:
```bash
npm run dev
```

### 7. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Prisma Studio** (Database GUI): `npx prisma studio`

## 👤 Demo Accounts

After seeding the database, you can log in with:

**Admin Account:**
- Email: `admin@arabeddings.com`
- Password: `admin123`

**Customer Account:**
- Email: `demo@arabeddings.com`
- Password: `customer123`

## 📁 Project Structure

```
ara-beddings/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js                # Database seed script
├── server/
│   ├── index.js               # Express server
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   └── routes/
│       ├── auth.js            # Authentication routes
│       ├── products.js        # Product routes
│       ├── categories.js      # Category routes
│       ├── cart.js            # Cart routes
│       ├── wishlist.js        # Wishlist routes
│       ├── orders.js          # Order routes
│       ├── drugOrders.js      # Custom order routes
│       ├── addresses.js       # Address routes
│       ├── shipping.js        # Shipping routes
│       ├── admin.js           # Admin routes
│       ├── media.js           # Media library routes
│       └── settings.js        # Site settings routes
├── src/
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   ├── store/                 # Zustand store
│   ├── data/                  # Static data
│   └── types/                 # TypeScript types
├── .env                       # Environment variables
├── .env.example               # Example environment file
└── package.json
```

## 🔧 Database Management

### View Database with Prisma Studio

```bash
npx prisma studio
```

This opens a web interface at http://localhost:5555 where you can:
- View all tables
- Edit records
- Create new entries
- Delete data

### Reset Database

To reset the database and start fresh:

```bash
# Drop all tables and recreate
npx prisma migrate reset

# This will also run the seed script
```

### Create New Migration

After modifying `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name your_migration_name
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:slug` - Get product by slug
- `GET /api/products/featured/list` - Get featured products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order (checkout)
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Admin (Requires admin role)
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `PUT /api/admin/payments/:orderId/verify` - Verify payment
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## 🐛 Troubleshooting

### Database Connection Error

If you see "Can't reach database server":

1. Check if PostgreSQL is running:
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
   - Default: `postgresql://postgres:password@localhost:5432/ara_beddings`

3. Test connection:
   ```bash
   psql -U postgres -d ara_beddings
   ```

### Port Already in Use

If port 3001 or 5173 is already in use:

1. Change PORT in `.env` for backend
2. Vite will automatically use next available port

### Prisma Client Not Generated

```bash
npx prisma generate
```

## 📝 Development Tips

1. **Use Prisma Studio** to inspect and modify data during development
2. **Check browser console** for frontend errors
3. **Check terminal** for backend errors
4. **Use Postman or Thunder Client** to test API endpoints
5. **Keep .env file secure** - never commit it to git

## 🚀 Deployment

For production deployment:

1. Set up a PostgreSQL database on your hosting provider
2. Update DATABASE_URL with production credentials
3. Generate a strong JWT_SECRET
4. Build frontend: `npm run build`
5. Serve the `dist` folder with the Express server
6. Use environment variables for all sensitive data

## 📄 License

This project is created for ARA BEDDINGS.

## 🤝 Support

For issues or questions:
- Check the troubleshooting section
- Review the API documentation
- Inspect database with Prisma Studio
- Check browser and server logs

---

**Built with ❤️ for ARA BEDDINGS**
