// Inventory Management System
import { getProducts, saveProduct } from './store';
import { sendLowStockAlert, sendBackInStock } from './email-service';
import { sendLowStockAlertSMS } from './sms-service';

export interface InventoryLog {
  id: string;
  productId: string;
  variantId: string;
  action: 'restock' | 'sale' | 'adjustment' | 'return';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  timestamp: string;
  userId?: string;
}

// Get inventory logs
export function getInventoryLogs(): InventoryLog[] {
  const fs = require('fs');
  const path = require('path');
  const filepath = path.join(process.cwd(), 'data', 'inventory-logs.json');
  
  if (!fs.existsSync(filepath)) {
    return [];
  }
  
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

// Save inventory log
function saveInventoryLog(log: InventoryLog): void {
  const fs = require('fs');
  const path = require('path');
  const filepath = path.join(process.cwd(), 'data', 'inventory-logs.json');
  
  const logs = getInventoryLogs();
  logs.unshift(log); // Add to beginning
  
  // Keep only last 1000 logs
  const trimmedLogs = logs.slice(0, 1000);
  
  fs.writeFileSync(filepath, JSON.stringify(trimmedLogs, null, 2));
}

// Update stock quantity
export async function updateStock(
  productId: string,
  variantId: string,
  quantity: number,
  action: InventoryLog['action'],
  reason?: string,
  userId?: string
): Promise<{ success: boolean; message: string; newStock?: number }> {
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return { success: false, message: 'Product not found' };
  }

  const product = products[productIndex];
  const variantIndex = product.variants.findIndex(v => v.id === variantId);
  
  if (variantIndex === -1) {
    return { success: false, message: 'Variant not found' };
  }

  const variant = product.variants[variantIndex];
  const previousStock = variant.stock;
  const newStock = previousStock + quantity;

  if (newStock < 0) {
    return { success: false, message: 'Insufficient stock' };
  }

  // Update variant stock
  product.variants[variantIndex].stock = newStock;
  
  // Update product total stock
  product.stock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  product.updatedAt = new Date().toISOString();

  // Save product
  saveProduct(product);

  // Log the inventory change
  const log: InventoryLog = {
    id: `inv-${Date.now()}`,
    productId,
    variantId,
    action,
    quantity,
    previousStock,
    newStock,
    reason,
    timestamp: new Date().toISOString(),
    userId,
  };
  saveInventoryLog(log);

  // Check for low stock alert
  if (newStock <= 10 && newStock > 0) {
    await sendLowStockAlert(product, product.variants[variantIndex]);
    await sendLowStockAlertSMS(product, product.variants[variantIndex]);
  }

  // Check if back in stock (was 0, now > 0)
  if (previousStock === 0 && newStock > 0) {
    // Get subscribers for this product
    const subscribers = getBackInStockSubscribers(productId);
    if (subscribers.length > 0) {
      await sendBackInStock(product, subscribers);
      clearBackInStockSubscribers(productId);
    }
  }

  return { success: true, message: 'Stock updated successfully', newStock };
}

// Restock product
export async function restockProduct(
  productId: string,
  variantId: string,
  quantity: number,
  reason: string = 'Restock',
  userId?: string
): Promise<{ success: boolean; message: string; newStock?: number }> {
  return updateStock(productId, variantId, quantity, 'restock', reason, userId);
}

// Record sale
export async function recordSale(
  productId: string,
  variantId: string,
  quantity: number,
  orderId?: string
): Promise<{ success: boolean; message: string; newStock?: number }> {
  return updateStock(
    productId,
    variantId,
    -quantity,
    'sale',
    `Order: ${orderId || 'N/A'}`
  );
}

// Record return
export async function recordReturn(
  productId: string,
  variantId: string,
  quantity: number,
  reason: string,
  userId?: string
): Promise<{ success: boolean; message: string; newStock?: number }> {
  return updateStock(productId, variantId, quantity, 'return', reason, userId);
}

// Adjust stock (manual adjustment)
export async function adjustStock(
  productId: string,
  variantId: string,
  quantity: number,
  reason: string,
  userId: string
): Promise<{ success: boolean; message: string; newStock?: number }> {
  return updateStock(productId, variantId, quantity, 'adjustment', reason, userId);
}

// Get inventory summary
export function getInventorySummary(): {
  totalProducts: number;
  totalVariants: number;
  totalStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
} {
  const products = getProducts();
  
  let totalVariants = 0;
  let totalStock = 0;
  let lowStockItems = 0;
  let outOfStockItems = 0;
  let totalValue = 0;

  products.forEach(product => {
    totalVariants += product.variants.length;
    
    product.variants.forEach(variant => {
      totalStock += variant.stock;
      totalValue += variant.stock * variant.price;
      
      if (variant.stock === 0) {
        outOfStockItems++;
      } else if (variant.stock <= 10) {
        lowStockItems++;
      }
    });
  });

  return {
    totalProducts: products.length,
    totalVariants,
    totalStock,
    lowStockItems,
    outOfStockItems,
    totalValue,
  };
}

// Get low stock items
export function getLowStockItems(threshold: number = 10): Array<{
  product: any;
  variant: any;
  stock: number;
}> {
  const products = getProducts();
  const lowStockItems: Array<{ product: any; variant: any; stock: number }> = [];

  products.forEach(product => {
    product.variants.forEach(variant => {
      if (variant.stock <= threshold) {
        lowStockItems.push({
          product,
          variant,
          stock: variant.stock,
        });
      }
    });
  });

  // Sort by stock level (lowest first)
  return lowStockItems.sort((a, b) => a.stock - b.stock);
}

// Get out of stock items
export function getOutOfStockItems(): Array<{
  product: any;
  variant: any;
}> {
  const products = getProducts();
  const outOfStockItems: Array<{ product: any; variant: any }> = [];

  products.forEach(product => {
    product.variants.forEach(variant => {
      if (variant.stock === 0) {
        outOfStockItems.push({ product, variant });
      }
    });
  });

  return outOfStockItems;
}

// Back in stock subscribers
interface BackInStockSubscriber {
  productId: string;
  email: string;
  phone?: string;
  timestamp: string;
}

export function getBackInStockSubscribers(productId: string): string[] {
  const fs = require('fs');
  const path = require('path');
  const filepath = path.join(process.cwd(), 'data', 'back-in-stock-subscribers.json');
  
  if (!fs.existsSync(filepath)) {
    return [];
  }
  
  const subscribers: BackInStockSubscriber[] = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  return subscribers
    .filter(s => s.productId === productId)
    .map(s => s.email);
}

export function addBackInStockSubscriber(productId: string, email: string, phone?: string): void {
  const fs = require('fs');
  const path = require('path');
  const filepath = path.join(process.cwd(), 'data', 'back-in-stock-subscribers.json');
  
  let subscribers: BackInStockSubscriber[] = [];
  if (fs.existsSync(filepath)) {
    subscribers = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  }
  
  // Check if already subscribed
  const exists = subscribers.some(s => s.productId === productId && s.email === email);
  if (exists) return;
  
  subscribers.push({
    productId,
    email,
    phone,
    timestamp: new Date().toISOString(),
  });
  
  fs.writeFileSync(filepath, JSON.stringify(subscribers, null, 2));
}

export function clearBackInStockSubscribers(productId: string): void {
  const fs = require('fs');
  const path = require('path');
  const filepath = path.join(process.cwd(), 'data', 'back-in-stock-subscribers.json');
  
  if (!fs.existsSync(filepath)) return;
  
  let subscribers: BackInStockSubscriber[] = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  subscribers = subscribers.filter(s => s.productId !== productId);
  fs.writeFileSync(filepath, JSON.stringify(subscribers, null, 2));
}

// Generate inventory report
export function generateInventoryReport(): string {
  const products = getProducts();
  const summary = getInventorySummary();
  const lowStock = getLowStockItems();
  const outOfStock = getOutOfStockItems();

  let report = 'INVENTORY REPORT\n';
  report += '================\n\n';
  
  report += `Generated: ${new Date().toLocaleString()}\n\n`;
  
  report += 'SUMMARY\n';
  report += '-------\n';
  report += `Total Products: ${summary.totalProducts}\n`;
  report += `Total Variants: ${summary.totalVariants}\n`;
  report += `Total Stock: ${summary.totalStock} units\n`;
  report += `Total Value: Rs ${summary.totalValue.toLocaleString()}\n`;
  report += `Low Stock Items: ${summary.lowStockItems}\n`;
  report += `Out of Stock Items: ${summary.outOfStockItems}\n\n`;

  if (lowStock.length > 0) {
    report += 'LOW STOCK ITEMS\n';
    report += '---------------\n';
    lowStock.forEach(item => {
      report += `- ${item.product.name} (${item.variant.size} - ${item.variant.type}): ${item.stock} units\n`;
    });
    report += '\n';
  }

  if (outOfStock.length > 0) {
    report += 'OUT OF STOCK ITEMS\n';
    report += '------------------\n';
    outOfStock.forEach(item => {
      report += `- ${item.product.name} (${item.variant.size} - ${item.variant.type})\n`;
    });
    report += '\n';
  }

  report += 'DETAILED INVENTORY\n';
  report += '------------------\n';
  products.forEach(product => {
    report += `\n${product.name}\n`;
    product.variants.forEach(variant => {
      report += `  - ${variant.size} - ${variant.type}: ${variant.stock} units (Rs ${variant.price.toLocaleString()} each)\n`;
    });
  });

  return report;
}
