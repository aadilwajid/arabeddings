# ARA BEDDINGS - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install PostgreSQL

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Install with default settings
- Remember the password you set for `postgres` user

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

Open terminal/command prompt:

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
# Install all required packages
npm install express cors dotenv bcryptjs jsonwebtoken @prisma/client
npm install --save-dev prisma @types/express @types/cors @types/bcryptjs @types/jsonwebtoken tsx concurrently
```

### Step 4: Configure Environment

Edit the `.env` file and update:

```env
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/ara_beddings?schema=public"
JWT_SECRET="generate-a-random-secure-string-here"
ADMIN_PASSWORD="your-admin-password"
```

**Replace `YOUR_POSTGRES_PASSWORD` with your actual PostgreSQL password!**

### Step 5: Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
node prisma/seed.js
```

### Step 6: Start Application

Open **TWO terminals**:

**Terminal 1 - Backend:**
```bash
node server/index.js
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 7: Access the App

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

**Login with:**
- Admin: `admin@arabeddings.com` / `admin123`
- Customer: `demo@arabeddings.com` / `customer123`

---

## 🐛 Common Issues

### "Can't reach database server"
- Make sure PostgreSQL is running
- Check password in `.env` file
- Verify database name is `ara_beddings`

### "Port 3001 already in use"
- Change `PORT=3001` to another port in `.env`
- Or kill the process using port 3001

### "Module not found" errors
- Run `npm install` again
- Make sure all dependencies are installed

---

## 📚 Need Help?

Read the full setup guide: [DATABASE_SETUP.md](./DATABASE_SETUP.md)

---

**That's it! You're ready to start developing 🎉**
