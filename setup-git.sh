#!/bin/bash

# ARA BEDDINGS - Git Setup Script
# This script initializes git and creates the initial commit

echo "🚀 ARA BEDDINGS - Git Setup"
echo "=========================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Environment variables
.env
.env.local
.env.production

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Prisma
prisma/*.db
prisma/*.db-journal

# OS
Thumbs.db
EOF
    echo "✅ .gitignore created"
else
    echo "✅ .gitignore already exists"
fi

echo ""

# Add all files
echo "📂 Adding files to git..."
git add .
echo "✅ Files added"

echo ""

# Check if there are any commits
if git rev-parse HEAD >/dev/null 2>&1; then
    echo "✅ Commits already exist"
    echo ""
    echo "Current branch: $(git branch --show-current)"
    echo "Last commit: $(git log -1 --pretty=format:'%h - %s (%ar)')"
else
    echo "📝 Creating initial commit..."
    git commit -m "Initial commit: ARA BEDDINGS e-commerce platform

- React + TypeScript frontend with Tailwind CSS
- Express.js backend with PostgreSQL
- Prisma ORM with complete schema
- JWT authentication
- Pakistan-specific features (PKR, provinces, cities)
- Multi-variant product catalog
- Shopping cart and checkout
- Order management system
- Admin dashboard
- Custom order requests
- Media library
- Comprehensive documentation

Built with ❤️ for ARA BEDDINGS"
    echo "✅ Initial commit created"
fi

echo ""
echo "=========================="
echo "✅ Git setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run these commands:"
echo ""
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo "   git push -u origin main"
echo ""
echo "Replace YOUR_USERNAME and YOUR_REPO with your GitHub details."
echo ""
