# ARA BEDDINGS — Luxury Home Linen & Bedding E-Commerce

A premium e-commerce web application built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**, deployed on **Vercel**.

## 🛍️ Features

- **6 Premium Products** — Egyptian Cotton Sheets, Silk Pillowcases, Cashmere Throw, Linen Duvet, Bamboo Towels, Velvet Cushions
- **Search & Filters** — Real-time search, category filtering, and sorting
- **Product Details** — Full modal with specs, ratings, and quantity selector
- **Shopping Cart** — Slide-out drawer with quantity controls
- **Simulated Checkout** — Complete checkout flow with form validation and order confirmation
- **Responsive Design** — Mobile-first, works beautifully on all devices

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router |
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Utility-first styling |
| **Lucide React** | Icon library |
| **Vercel** | Hosting & deployment |

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout (metadata, fonts)
│   │   ├── page.tsx         # Home page (main app)
│   │   └── globals.css      # Global styles + Tailwind
│   ├── components/
│   │   ├── Header.tsx       # Navigation + search
│   │   ├── ProductCard.tsx  # Product grid cards
│   │   ├── ProductDetail.tsx # Product modal
│   │   ├── Cart.tsx         # Cart drawer
│   │   └── Checkout.tsx     # Checkout flow
│   ├── data/
│   │   └── products.ts      # Product data
│   └── types.ts             # TypeScript interfaces
├── next.config.mjs          # Next.js configuration
├── postcss.config.mjs       # PostCSS + Tailwind
├── tsconfig.json            # TypeScript config
├── vercel.json              # Vercel deployment config
└── package.json
```

## 🏃 Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

### Option 1: Git Integration (Recommended)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **"Add New Project"**
4. Import your repository
5. Vercel auto-detects Next.js — just click **Deploy**

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

## ⚙️ Vercel Configuration

The `vercel.json` file configures:

- **Framework**: Next.js (auto-detected)
- **Build command**: `next build`
- **Output directory**: `.next`
- **Caching headers**: Optimized for static assets and images
- **Rewrites**: SPA-style routing for client-side navigation

## 🎨 Design System

| Color | Hex | Usage |
|---|---|---|
| Cream | `#FDF8F3` | Background |
| Gold | `#C4A265` | Accent / CTA |
| Charcoal | `#2D2A26` | Primary text |
| Warm Brown | `#5C4A32` | Secondary text |
| Sand | `#E8DFD5` | Borders |

## 📝 Environment Variables

Copy `.env.local.example` to `.env.local` and add your API keys:

```bash
cp .env.local.example .env.local
```

## 📄 License

© 2026 ARA BEDDINGS. All rights reserved.
