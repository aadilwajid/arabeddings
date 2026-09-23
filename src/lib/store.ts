import fs from 'fs';
import path from 'path';
import { Product, Order, User, Review, Media, SiteSettings, MenuItem, OrderStatus } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper functions
function readJSON<T>(filename: string, defaultValue: T): T {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    writeJSON(filename, defaultValue);
    return defaultValue;
  }
  const data = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(data);
}

function writeJSON<T>(filename: string, data: T): void {
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

// Products
export function getProducts(): Product[] {
  return readJSON<Product[]>('products.json', []);
}

export function getProduct(id: string): Product | undefined {
  return getProducts().find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find(p => p.slug === slug);
}

export function saveProduct(product: Product): void {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.push(product);
  }
  writeJSON('products.json', products);
}

export function deleteProduct(id: string): void {
  const products = getProducts().filter(p => p.id !== id);
  writeJSON('products.json', products);
}

// Orders
export function getOrders(): Order[] {
  return readJSON<Order[]>('orders.json', []);
}

export function getOrder(id: string): Order | undefined {
  return getOrders().find(o => o.id === id);
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  return getOrders().find(o => o.orderNumber === orderNumber);
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === order.id);
  if (index >= 0) {
    orders[index] = order;
  } else {
    orders.push(order);
  }
  writeJSON('orders.json', orders);
}

export function updateOrderStatus(id: string, status: OrderStatus, note?: string): void {
  const orders = getOrders();
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note
    });
    order.updatedAt = new Date().toISOString();
    writeJSON('orders.json', orders);
  }
}

// Users
export function getUsers(): User[] {
  return readJSON<User[]>('users.json', []);
}

export function getUser(email: string): User | undefined {
  return getUsers().find(u => u.email === email);
}

export function saveUser(user: User): void {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  writeJSON('users.json', users);
}

// Reviews
export function getReviews(): Review[] {
  return readJSON<Review[]>('reviews.json', []);
}

export function getProductReviews(productId: string): Review[] {
  return getReviews().filter(r => r.productId === productId);
}

export function saveReview(review: Review): void {
  const reviews = getReviews();
  const index = reviews.findIndex(r => r.id === review.id);
  if (index >= 0) {
    reviews[index] = review;
  } else {
    reviews.push(review);
  }
  writeJSON('reviews.json', reviews);
}

export function deleteReview(id: string): void {
  const reviews = getReviews().filter(r => r.id !== id);
  writeJSON('reviews.json', reviews);
}

// Media
export function getMedia(): Media[] {
  return readJSON<Media[]>('media.json', []);
}

export function saveMedia(media: Media): void {
  const mediaList = getMedia();
  mediaList.push(media);
  writeJSON('media.json', mediaList);
}

export function deleteMedia(id: string): void {
  const mediaList = getMedia().filter(m => m.id !== id);
  writeJSON('media.json', mediaList);
}

// Settings
export function getSettings(): SiteSettings {
  return readJSON<SiteSettings>('settings.json', {
    siteName: 'ARA Beddings',
    logo: '/logo.png',
    favicon: '/favicon.ico',
    whatsapp: '03160143039',
    jazzcash: '03160143039',
    easypaisa: '03160143039',
    shippingFee: 350,
    heroTitle: 'Luxury Bedding for Every Home',
    heroSubtitle: 'Premium quality sheets, comforters, and more',
    heroImage: '/hero.jpg'
  });
}

export function saveSettings(settings: SiteSettings): void {
  writeJSON('settings.json', settings);
}

// Menu
export function getMenu(): MenuItem[] {
  return readJSON<MenuItem[]>('menu.json', [
    { id: '1', label: 'Home', href: '/', order: 1 },
    { id: '2', label: 'Shop', href: '/shop', order: 2 },
    { id: '3', label: 'About', href: '/about', order: 3 },
    { id: '4', label: 'Contact', href: '/contact', order: 4 }
  ]);
}

export function saveMenu(menu: MenuItem[]): void {
  writeJSON('menu.json', menu);
}
