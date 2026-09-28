#!/bin/bash

# ARA BEDDINGS - Database Setup Script
# This script helps you set up the PostgreSQL database

echo "🚀 ARA BEDDINGS - Database Setup"
echo "================================"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed!"
    echo ""
    echo "Please install PostgreSQL first:"
    echo ""
    echo "Windows: Download from https://www.postgresql.org/download/windows/"
    echo "macOS: brew install postgresql"
    echo "Linux: sudo apt install postgresql"
    echo ""
    exit 1
fi

echo "✅ PostgreSQL is installed"
echo ""

# Ask for PostgreSQL password
read -sp "Enter your PostgreSQL password: " PG_PASSWORD
echo ""
echo ""

# Create database
echo "📦 Creating database 'ara_beddings'..."
export PGPASSWORD=$PG_PASSWORD

psql -U postgres -h localhost -c "CREATE DATABASE ara_beddings;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully!"
else
    echo "⚠️  Database might already exist or there was an error"
fi

echo ""

# Update .env file
echo "📝 Updating .env file..."
if [ -f .env ]; then
    # Backup existing .env
    cp .env .env.backup
    echo "✅ Backed up existing .env to .env.backup"
fi

# Create new .env
cat > .env << EOF
# Database
DATABASE_URL="postgresql://postgres:${PG_PASSWORD}@localhost:5432/ara_beddings?schema=public"

# JWT Secret
JWT_SECRET="ara-beddings-$(openssl rand -hex 32)"

# Server
PORT=3001
NODE_ENV=development

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# Admin credentials
ADMIN_EMAIL="admin@arabeddings.com"
ADMIN_PASSWORD="admin123"
EOF

echo "✅ .env file created/updated"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""
echo "Please run the following commands manually:"
echo ""
echo "1. Install backend dependencies:"
echo "   npm install express cors dotenv bcryptjs jsonwebtoken @prisma/client"
echo "   npm install --save-dev prisma @types/express @types/cors @types/bcryptjs @types/jsonwebtoken"
echo ""
echo "2. Generate Prisma client:"
echo "   npx prisma generate"
echo ""
echo "3. Run migrations:"
echo "   npx prisma migrate dev --name init"
echo ""
echo "4. Seed database:"
echo "   node prisma/seed.js"
echo ""
echo "5. Start backend server:"
echo "   node server/index.js"
echo ""
echo "6. In another terminal, start frontend:"
echo "   npm run dev"
echo ""

echo "================================"
echo "✅ Setup script completed!"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - POSTGRESQL_SETUP.md"
echo "   - DATABASE_SETUP.md"
echo "   - QUICKSTART.md"
echo ""
echo "🎉 You're almost ready to start!"
