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

// Create additional users
const managerUser = {
  id: uuidv4(),
  email: 'manager@arabeddings.com',
  password: bcrypt.hashSync('manager123', 10),
  name: 'Store Manager',
  role: 'manager',
  createdAt: new Date().toISOString()
};

const supportUser = {
  id: uuidv4(),
  email: 'support@arabeddings.com',
  password: bcrypt.hashSync('support123', 10),
  name: 'Support Team',
  role: 'support',
  createdAt: new Date().toISOString()
};

fs.writeFileSync(path.join(DATA_DIR, 'users.json'), JSON.stringify([adminUser, managerUser, supportUser], null, 2));

// Create sample products (8 products)
const products = [
  {
    id: uuidv4(),
    name: 'Premium Egyptian Cotton Sheet Set',
    slug: 'premium-egyptian-cotton-sheet-set',
    category: 'Bed Sheets',
    description: 'Luxurious 800 thread count Egyptian cotton bed sheet set. Incredibly soft, breathable, and durable for the perfect night\'s sleep. Gets softer with every wash.',
    mainImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'
    ],
    priceFrom: 8500,
    compareAt: 12000,
    stock: 50,
    badge: 'Best Seller',
    featured: true,
    isNew: false,
    customizable: true,
    variants: [
      { id: uuidv4(), size: 'Single', type: 'Bed Sheet Set', price: 8500, stock: 15, sku: 'ECS-SIN-001' },
      { id: uuidv4(), size: 'Double', type: 'Bed Sheet Set', price: 10500, stock: 15, sku: 'ECS-DBL-001' },
      { id: uuidv4(), size: 'Queen', type: 'Bed Sheet Set', price: 12500, stock: 10, sku: 'ECS-QUE-001' },
      { id: uuidv4(), size: 'King', type: 'Bed Sheet Set', price: 14500, stock: 10, sku: 'ECS-KNG-001' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Luxury Microfiber Comforter Set',
    slug: 'luxury-microfiber-comforter-set',
    category: 'Comforters',
    description: 'Premium comforter set with soft microfiber filling and elegant design. Perfect for all seasons with excellent temperature regulation.',
    mainImage: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800',
    galleryImages: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800'
    ],
    priceFrom: 12500,
    compareAt: 16000,
    stock: 30,
    badge: 'New',
    featured: true,
    isNew: true,
    customizable: true,
    variants: [
      { id: uuidv4(), size: 'Single', type: 'Comforter Set', price: 12500, stock: 10, sku: 'COM-SIN-001' },
      { id: uuidv4(), size: 'Double', type: 'Comforter Set', price: 15500, stock: 10, sku: 'COM-DBL-001' },
      { id: uuidv4(), size: 'Queen', type: 'Comforter Set', price: 18500, stock: 5, sku: 'COM-QUE-001' },
      { id: uuidv4(), size: 'King', type: 'Comforter Set', price: 21500, stock: 5, sku: 'COM-KNG-001' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Elegant Satin Quilt Cover Set',
    slug: 'elegant-satin-quilt-cover-set',
    category: 'Quilt Covers',
    description: 'Beautiful quilt cover set with hidden zipper closure and satin finish. Easy to wash and maintain with a luxurious feel.',
    mainImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
    galleryImages: [],
    priceFrom: 6500,
    stock: 40,
    featured: true,
    isNew: false,
    customizable: true,
    variants: [
      { id: uuidv4(), size: 'Single', type: 'Quilt Cover Set', price: 6500, stock: 12, sku: 'QCS-SIN-001' },
      { id: uuidv4(), size: 'Double', type: 'Quilt Cover Set', price: 8500, stock: 12, sku: 'QCS-DBL-001' },
      { id: uuidv4(), size: 'Queen', type: 'Quilt Cover Set', price: 10500, stock: 8, sku: 'QCS-QUE-001' },
      { id: uuidv4(), size: 'King', type: 'Quilt Cover Set', price: 12500, stock: 8, sku: 'QCS-KNG-001' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Kids Cartoon Bed Sheet Set',
    slug: 'kids-cartoon-bed-sheet-set',
    category: 'Kids',
    description: 'Fun and colorful bed sheet set designed for kids. Made with soft, safe materials that are gentle on sensitive skin.',
    mainImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    galleryImages: [],
    priceFrom: 4500,
    stock: 60,
    badge: 'Kids Special',
    featured: false,
    isNew: true,
    customizable: true,
    variants: [
      { id: uuidv4(), size: 'Single', type: 'Bed Sheet Set', price: 4500, stock: 30, sku: 'KID-SIN-001' },
      { id: uuidv4(), size: 'Double', type: 'Bed Sheet Set', price: 5500, stock: 30, sku: 'KID-DBL-001' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Velvet Decorative Cushion Cover',
    slug: 'velvet-decorative-cushion-cover',
    category: 'Accessories',
    description: 'Elegant velvet cushion cover to add style to your living room or bedroom. Premium quality with hidden zipper.',
    mainImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
    galleryImages: [],
    priceFrom: 1200,
    compareAt: 1800,
    stock: 100,
    badge: 'Sale',
    featured: false,
    isNew: false,
    customizable: false,
    variants: [
      { id: uuidv4(), size: 'Single', type: 'Fitted Sheet Only', price: 1200, stock: 100, sku: 'ACC-001' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Winter Warm Quilt',
    slug: 'winter-warm-quilt',
    category: 'Quilts',
    description: 'Cozy winter quilt made with premium filling for maximum warmth. Perfect for cold Pakistani winters.',
    mainImage: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800',
    galleryImages: [],
    priceFrom: 9500,
    stock: 25,
    featured: true,
    isNew: false,
    customizable: true,
    variants: [
      { id: uuidv4(), size: 'Single', type: 'Comforter Set', price: 9500, stock: 8, sku: 'QUT-SIN-001' },
      { id: uuidv4(), size: 'Double', type: 'Comforter Set', price: 12500, stock: 8, sku: 'QUT-DBL-001' },
      { id: uuidv4(), size: 'Queen', type: 'Comforter Set', price: 15500, stock: 5, sku: 'QUT-QUE-001' },
      { id: uuidv4(), size: 'King', type: 'Comforter Set', price: 18500, stock: 4, sku: 'QUT-KNG-001' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Organic Cotton Fitted Sheet',
    slug: 'organic-cotton-fitted-sheet',
    category: 'Bed Sheets',
    description: '100% organic cotton fitted sheet with deep pockets. Eco-friendly and incredibly comfortable.',
    mainImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    galleryImages: [],
    priceFrom: 3500,
    stock: 45,
    badge: 'Eco-Friendly',
    featured: false,
    isNew: true,
    customizable: true,
    variants: [
      { id: uuidv4(), size: 'Single', type: 'Fitted Sheet Only', price: 3500, stock: 15, sku: 'OFS-SIN-001' },
      { id: uuidv4(), size: 'Double', type: 'Fitted Sheet Only', price: 4500, stock: 15, sku: 'OFS-DBL-001' },
      { id: uuidv4(), size: 'Queen', type: 'Fitted Sheet Only', price: 5500, stock: 10, sku: 'OFS-QUE-001' },
      { id: uuidv4(), size: 'King', type: 'Fitted Sheet Only', price: 6500, stock: 5, sku: 'OFS-KNG-001' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Luxury Silk Pillowcase Set',
    slug: 'luxury-silk-pillowcase-set',
    category: 'Accessories',
    description: 'Premium silk pillowcases that are gentle on hair and skin. Reduces friction and helps maintain moisture.',
    mainImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
    galleryImages: [],
    priceFrom: 2800,
    compareAt: 3500,
    stock: 80,
    featured: true,
    isNew: false,
    customizable: false,
    variants: [
      { id: uuidv4(), size: 'Single', type: 'Fitted Sheet Only', price: 2800, stock: 80, sku: 'SLK-001' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

fs.writeFileSync(path.join(DATA_DIR, 'products.json'), JSON.stringify(products, null, 2));

// Create sample orders
const orders = [
  {
    id: uuidv4(),
    orderNumber: 'ARA-123456',
    customer: {
      name: 'Fatima Ahmed',
      email: 'fatima@example.com',
      phone: '03001234567',
      address: 'House 45, Street 12, DHA Phase 5',
      city: 'Lahore',
      postalCode: '54000'
    },
    items: [
      {
        productId: products[0].id,
        productName: products[0].name,
        variantId: products[0].variants[2].id,
        size: 'Queen',
        type: 'Bed Sheet Set',
        price: 12500,
        quantity: 1,
        image: products[0].mainImage
      }
    ],
    subtotal: 12500,
    shipping: 350,
    total: 12850,
    status: 'delivered',
    paymentMethod: 'cod',
    statusHistory: [
      { status: 'new', timestamp: '2026-01-10T10:00:00Z' },
      { status: 'confirmed', timestamp: '2026-01-10T11:00:00Z' },
      { status: 'processing', timestamp: '2026-01-11T09:00:00Z' },
      { status: 'shipped', timestamp: '2026-01-12T14:00:00Z', note: 'TCS Tracking: 123456789' },
      { status: 'delivered', timestamp: '2026-01-14T16:00:00Z' }
    ],
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-14T16:00:00Z'
  },
  {
    id: uuidv4(),
    orderNumber: 'ARA-123457',
    customer: {
      name: 'Ali Hassan',
      email: 'ali@example.com',
      phone: '03211234567',
      address: 'Flat 12B, Tower 3, Bahria Town',
      city: 'Islamabad',
      postalCode: '44000'
    },
    items: [
      {
        productId: products[1].id,
        productName: products[1].name,
        variantId: products[1].variants[3].id,
        size: 'King',
        type: 'Comforter Set',
        price: 21500,
        quantity: 1,
        image: products[1].mainImage
      },
      {
        productId: products[4].id,
        productName: products[4].name,
        variantId: products[4].variants[0].id,
        size: 'Single',
        type: 'Fitted Sheet Only',
        price: 1200,
        quantity: 2,
        image: products[4].mainImage
      }
    ],
    subtotal: 23900,
    shipping: 350,
    total: 24250,
    status: 'shipped',
    paymentMethod: 'jazzcash',
    paymentProof: 'TXN-987654321',
    statusHistory: [
      { status: 'new', timestamp: '2026-01-15T10:00:00Z' },
      { status: 'confirmed', timestamp: '2026-01-15T11:00:00Z' },
      { status: 'processing', timestamp: '2026-01-16T09:00:00Z' },
      { status: 'shipped', timestamp: '2026-01-17T14:00:00Z', note: 'Leopard Tracking: LP-456789' }
    ],
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-17T14:00:00Z'
  },
  {
    id: uuidv4(),
    orderNumber: 'ARA-123458',
    customer: {
      name: 'Sara Khan',
      email: 'sara@example.com',
      phone: '03331234567',
      address: 'House 78, Block C, Gulberg III',
      city: 'Lahore',
      postalCode: '54000'
    },
    items: [
      {
        productId: products[2].id,
        productName: products[2].name,
        variantId: products[2].variants[1].id,
        size: 'Double',
        type: 'Quilt Cover Set',
        price: 8500,
        quantity: 1,
        image: products[2].mainImage
      }
    ],
    subtotal: 8500,
    shipping: 350,
    total: 8850,
    status: 'processing',
    paymentMethod: 'easypaisa',
    paymentProof: 'EP-1122334455',
    statusHistory: [
      { status: 'new', timestamp: '2026-01-18T10:00:00Z' },
      { status: 'confirmed', timestamp: '2026-01-18T11:00:00Z' },
      { status: 'processing', timestamp: '2026-01-19T09:00:00Z' }
    ],
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-01-19T09:00:00Z'
  }
];

fs.writeFileSync(path.join(DATA_DIR, 'orders.json'), JSON.stringify(orders, null, 2));

// Create sample reviews
const reviews = [
  {
    id: uuidv4(),
    productId: products[0].id,
    customerName: 'Fatima Ahmed',
    customerEmail: 'fatima@example.com',
    rating: 5,
    comment: 'Absolutely love these sheets! So soft and comfortable. The quality is amazing for the price. Will definitely order again.',
    approved: true,
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: uuidv4(),
    productId: products[0].id,
    customerName: 'Ali Hassan',
    customerEmail: 'ali@example.com',
    rating: 4,
    comment: 'Great quality sheets. Very comfortable and the fit is perfect. Shipping was fast too.',
    approved: true,
    createdAt: '2026-01-14T15:00:00Z'
  },
  {
    id: uuidv4(),
    productId: products[1].id,
    customerName: 'Sara Khan',
    customerEmail: 'sara@example.com',
    rating: 5,
    comment: 'The comforter is amazing! So warm and cozy. Perfect for winter. Highly recommended!',
    approved: true,
    createdAt: '2026-01-16T12:00:00Z'
  },
  {
    id: uuidv4(),
    productId: products[2].id,
    customerName: 'Ahmed Raza',
    customerEmail: 'ahmed@example.com',
    rating: 4,
    comment: 'Beautiful quilt cover. The satin finish is lovely. Good quality for the price.',
    approved: false,
    createdAt: '2026-01-17T09:00:00Z'
  },
  {
    id: uuidv4(),
    productId: products[3].id,
    customerName: 'Ayesha Malik',
    customerEmail: 'ayesha@example.com',
    rating: 5,
    comment: 'My kids love these sheets! The cartoon design is so cute and the material is very soft.',
    approved: true,
    createdAt: '2026-01-13T14:00:00Z'
  }
];

fs.writeFileSync(path.join(DATA_DIR, 'reviews.json'), JSON.stringify(reviews, null, 2));

// Create sample media
const media = [
  {
    id: uuidv4(),
    url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    filename: 'egyptian-cotton-sheets.jpg',
    tags: ['bedsheet', 'cotton', 'white', 'luxury'],
    usageCount: 1,
    uploadedAt: '2026-01-01T10:00:00Z'
  },
  {
    id: uuidv4(),
    url: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800',
    filename: 'comforter-set.jpg',
    tags: ['comforter', 'luxury', 'bedroom'],
    usageCount: 1,
    uploadedAt: '2026-01-02T10:00:00Z'
  },
  {
    id: uuidv4(),
    url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
    filename: 'quilt-cover.jpg',
    tags: ['quilt', 'cover', 'elegant'],
    usageCount: 1,
    uploadedAt: '2026-01-03T10:00:00Z'
  },
  {
    id: uuidv4(),
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    filename: 'kids-bedding.jpg',
    tags: ['kids', 'cartoon', 'colorful'],
    usageCount: 1,
    uploadedAt: '2026-01-04T10:00:00Z'
  },
  {
    id: uuidv4(),
    url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
    filename: 'luxury-bedroom.jpg',
    tags: ['luxury', 'bedroom', 'inspiration'],
    usageCount: 1,
    uploadedAt: '2026-01-05T10:00:00Z'
  }
];

fs.writeFileSync(path.join(DATA_DIR, 'media.json'), JSON.stringify(media, null, 2));

// Settings
const settings = {
  siteName: 'ARA Beddings',
  logo: '/logo.png',
  favicon: '/favicon.ico',
  whatsapp: '03160143039',
  jazzcash: '03160143039',
  easypaisa: '03160143039',
  shippingFee: 350,
  freeShippingThreshold: 10000,
  heroTitle: 'Luxury Bedding for Every Home',
  heroSubtitle: 'Premium quality sheets, comforters, and more delivered across Pakistan',
  heroImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600'
};

fs.writeFileSync(path.join(DATA_DIR, 'settings.json'), JSON.stringify(settings, null, 2));

// Menu
const menu = [
  { id: uuidv4(), label: 'Home', href: '/', order: 1 },
  { id: uuidv4(), label: 'Shop', href: '/shop', order: 2 },
  { id: uuidv4(), label: 'About', href: '/about', order: 3 },
  { id: uuidv4(), label: 'Services', href: '/services', order: 4 },
  { id: uuidv4(), label: 'Blog', href: '/blog', order: 5 },
  { id: uuidv4(), label: 'Contact', href: '/contact', order: 6 }
];

fs.writeFileSync(path.join(DATA_DIR, 'menu.json'), JSON.stringify(menu, null, 2));

console.log('✓ Database seeded successfully');
console.log('');
console.log('Admin Accounts:');
console.log('  - admin@arabeddings.com / password (Super Admin)');
console.log('  - manager@arabeddings.com / manager123 (Manager)');
console.log('  - support@arabeddings.com / support123 (Support)');
console.log('');
console.log('Demo Data Created:');
console.log('  - 8 products with variants');
console.log('  - 3 sample orders');
console.log('  - 5 customer reviews');
console.log('  - 5 media files');
console.log('  - Site settings');
console.log('  - Navigation menu');
