import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Create admin user
const adminPassword = bcrypt.hashSync('password', 10);
const adminUser = {
  id: uuidv4(),
  email: 'admin@arabeddings.com',
  password: adminPassword,
  name: 'Admin',
  role: 'superadmin',
  createdAt: new Date().toISOString()
};

fs.writeFileSync(path.join(DATA_DIR, 'users.json'), JSON.stringify([adminUser], null, 2));

// Create sample products
const products = [
  {
    id: uuidv4(),
    name: 'Premium Cotton Bed Sheet Set',
    slug: 'premium-cotton-bed-sheet-set',
    category: 'Bed Sheets',
    description: 'Luxurious 400 thread count cotton bed sheet set. Soft, breathable, and durable for a perfect night\'s sleep.',
    mainImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'
    ],
    priceFrom: 3500,
    compareAt: 4500,
    stock: 50,
    badge: 'Best Seller',
    featured: true,
    isNew: false,
    customizable: true,
    variants: [
      { id: uuidv4(), size: 'Single', type: 'Bed Sheet Set', price: 3500, stock: 15, sku: 'BSS-SIN-001' },
      { id: uuidv4(), size: 'Double', type: 'Bed Sheet Set', price: 4200, stock: 15, sku: 'BSS-DBL-001' },
      { id: uuidv4(), size: 'Queen', type: 'Bed Sheet Set', price: 4800, stock: 10, sku: 'BSS-QUE-001' },
      { id: uuidv4(), size: 'King', type: 'Bed Sheet Set', price: 5500, stock: 10, sku: 'BSS-KNG-001' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Luxury Comforter Set',
    slug: 'luxury-comforter-set',
    category: 'Comforters',
    description: 'Premium comforter set with soft filling and elegant design. Perfect for all seasons.',
    mainImage: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800'
    ],
    priceFrom: 8500,
    stock: 30,
    badge: 'New',
    featured: true,
    isNew: true,
    customizable: true,
    variants: [
      { id: uuidv4(), size: 'Single', type: 'Comforter Set', price: 8500, stock: 10, sku: 'COM-SIN-001' },
      { id: uuidv4(), size: 'Double', type: 'Comforter Set', price: 10500, stock: 10, sku: 'COM-DBL-001' },
      { id: uuidv4(), size: 'Queen', type: 'Comforter Set', price: 12500, stock: 5, sku: 'COM-QUE-001' },
      { id: uuidv4(), size: 'King', type: 'Comforter Set', price: 14500, stock: 5, sku: 'COM-KNG-001' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Elegant Quilt Cover Set',
    slug: 'elegant-quilt-cover-set',
    category: 'Quilt Covers',
    description: 'Beautiful quilt cover set with hidden zipper closure. Easy to wash and maintain.',
    mainImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
    galleryImages: [],
    priceFrom: 4500,
    stock: 40,
    featured: true,
    isNew: false,
    customizable: true,
    variants: [
      { id: uuidv4(), size: 'Single', type: 'Quilt Cover Set', price: 4500, stock: 12, sku: 'QCS-SIN-001' },
      { id: uuidv4(), size: 'Double', type: 'Quilt Cover Set', price: 5500, stock: 12, sku: 'QCS-DBL-001' },
      { id: uuidv4(), size: 'Queen', type: 'Quilt Cover Set', price: 6500, stock: 8, sku: 'QCS-QUE-001' },
      { id: uuidv4(), size: 'King', type: 'Quilt Cover Set', price: 7500, stock: 8, sku: 'QCS-KNG-001' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Kids Cartoon Bed Sheet Set',
    slug: 'kids-cartoon-bed-sheet-set',
    category: 'Kids',
    description: 'Fun and colorful bed sheet set designed for kids. Made with soft, safe materials.',
    mainImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    galleryImages: [],
    priceFrom: 2800,
    stock: 60,
    badge: 'Kids Special',
    featured: false,
    isNew: true,
    customizable: true,
    variants: [
      { id: uuidv4(), size: 'Single', type: 'Bed Sheet Set', price: 2800, stock: 30, sku: 'KID-SIN-001' },
      { id: uuidv4(), size: 'Double', type: 'Bed Sheet Set', price: 3500, stock: 30, sku: 'KID-DBL-001' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Decorative Cushion Cover',
    slug: 'decorative-cushion-cover',
    category: 'Accessories',
    description: 'Elegant cushion cover to add style to your living room or bedroom.',
    mainImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
    galleryImages: [],
    priceFrom: 850,
    stock: 100,
    featured: false,
    isNew: false,
    customizable: false,
    variants: [
      { id: uuidv4(), size: 'Single', type: 'Fitted Sheet Only', price: 850, stock: 100, sku: 'ACC-001' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

fs.writeFileSync(path.join(DATA_DIR, 'products.json'), JSON.stringify(products, null, 2));

// Initialize empty orders, reviews, media
fs.writeFileSync(path.join(DATA_DIR, 'orders.json'), JSON.stringify([], null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'reviews.json'), JSON.stringify([], null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'media.json'), JSON.stringify([], null, 2));

// Settings
const settings = {
  siteName: 'ARA Beddings',
  logo: '/logo.png',
  favicon: '/favicon.ico',
  whatsapp: '03160143039',
  jazzcash: '03160143039',
  easypaisa: '03160143039',
  shippingFee: 350,
  heroTitle: 'Luxury Bedding for Every Home',
  heroSubtitle: 'Premium quality sheets, comforters, and more delivered across Pakistan',
  heroImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600'
};

fs.writeFileSync(path.join(DATA_DIR, 'settings.json'), JSON.stringify(settings, null, 2));

console.log('✓ Database seeded successfully');
console.log('✓ Admin login: admin@arabeddings.com / password');
console.log('✓ 5 sample products created');
