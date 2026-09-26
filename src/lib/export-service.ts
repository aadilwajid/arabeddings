// Data Export Service
import { getProducts, getOrders, getUsers } from './store';
import fs from 'fs';
import path from 'path';

export type ExportFormat = 'csv' | 'json' | 'excel';

// Export products
export function exportProducts(format: ExportFormat = 'csv'): string {
  const products = getProducts();
  
  if (format === 'json') {
    return JSON.stringify(products, null, 2);
  }
  
  if (format === 'csv') {
    const headers = [
      'ID',
      'Name',
      'Slug',
      'Category',
      'Description',
      'Price From',
      'Compare At',
      'Stock',
      'Badge',
      'Featured',
      'Is New',
      'Customizable',
      'Main Image',
      'Created At',
      'Updated At',
    ];
    
    const rows = products.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.slug,
      p.category,
      `"${p.description.replace(/"/g, '""')}"`,
      p.priceFrom,
      p.compareAt || '',
      p.stock,
      p.badge || '',
      p.featured,
      p.isNew,
      p.customizable,
      p.mainImage,
      p.createdAt,
      p.updatedAt,
    ]);
    
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
  
  // Excel format (simplified - in production use a library like exceljs)
  return exportProducts('csv');
}

// Export orders
export function exportOrders(format: ExportFormat = 'csv', filters?: {
  startDate?: string;
  endDate?: string;
  status?: string;
}): string {
  let orders = getOrders();
  
  // Apply filters
  if (filters?.startDate) {
    orders = orders.filter(o => new Date(o.createdAt) >= new Date(filters.startDate!));
  }
  if (filters?.endDate) {
    orders = orders.filter(o => new Date(o.createdAt) <= new Date(filters.endDate!));
  }
  if (filters?.status) {
    orders = orders.filter(o => o.status === filters.status);
  }
  
  if (format === 'json') {
    return JSON.stringify(orders, null, 2);
  }
  
  if (format === 'csv') {
    const headers = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Address',
      'City',
      'Postal Code',
      'Subtotal',
      'Shipping',
      'Discount',
      'Total',
      'Status',
      'Payment Method',
      'Payment Proof',
      'Courier',
      'Tracking Number',
      'Items Count',
      'Created At',
      'Updated At',
    ];
    
    const rows = orders.map(o => [
      o.orderNumber,
      `"${o.customer.name.replace(/"/g, '""')}"`,
      o.customer.email,
      o.customer.phone,
      `"${o.customer.address.replace(/"/g, '""')}"`,
      o.customer.city,
      o.customer.postalCode,
      o.subtotal,
      o.shipping,
      0, // discount (not in Order type)
      o.total,
      o.status,
      o.paymentMethod,
      o.paymentProof || '',
      o.courier || '',
      o.trackingNumber || '',
      o.items.length,
      o.createdAt,
      o.updatedAt,
    ]);
    
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
  
  return exportOrders('csv', filters);
}

// Export order items (detailed)
export function exportOrderItems(format: ExportFormat = 'csv'): string {
  const orders = getOrders();
  
  if (format === 'json') {
    const items = orders.flatMap(o => 
      o.items.map(item => ({
        orderNumber: o.orderNumber,
        customerName: o.customer.name,
        customerEmail: o.customer.email,
        ...item,
      }))
    );
    return JSON.stringify(items, null, 2);
  }
  
  if (format === 'csv') {
    const headers = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Product ID',
      'Product Name',
      'Variant ID',
      'Size',
      'Type',
      'Price',
      'Quantity',
      'Total',
      'Image',
    ];
    
    const rows = orders.flatMap(o =>
      o.items.map(item => [
        o.orderNumber,
        `"${o.customer.name.replace(/"/g, '""')}"`,
        o.customer.email,
        item.productId,
        `"${item.productName.replace(/"/g, '""')}"`,
        item.variantId,
        item.size,
        item.type,
        item.price,
        item.quantity,
        item.price * item.quantity,
        item.image,
      ])
    );
    
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
  
  return exportOrderItems('csv');
}

// Export customers
export function exportCustomers(format: ExportFormat = 'csv'): string {
  const orders = getOrders();
  
  // Group by customer email
  const customerMap = new Map<string, {
    name: string;
    email: string;
    phone: string;
    orders: number;
    totalSpent: number;
    firstOrder: string;
    lastOrder: string;
    addresses: string[];
  }>();
  
  orders.forEach(order => {
    const email = order.customer.email;
    
    if (!customerMap.has(email)) {
      customerMap.set(email, {
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
        orders: 0,
        totalSpent: 0,
        firstOrder: order.createdAt,
        lastOrder: order.createdAt,
        addresses: [],
      });
    }
    
    const customer = customerMap.get(email)!;
    customer.orders += 1;
    customer.totalSpent += order.total;
    
    const address = `${order.customer.address}, ${order.customer.city} ${order.customer.postalCode}`;
    if (!customer.addresses.includes(address)) {
      customer.addresses.push(address);
    }
    
    if (new Date(order.createdAt) < new Date(customer.firstOrder)) {
      customer.firstOrder = order.createdAt;
    }
    if (new Date(order.createdAt) > new Date(customer.lastOrder)) {
      customer.lastOrder = order.createdAt;
    }
  });
  
  const customers = Array.from(customerMap.values());
  
  if (format === 'json') {
    return JSON.stringify(customers, null, 2);
  }
  
  if (format === 'csv') {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Total Orders',
      'Total Spent',
      'Average Order Value',
      'First Order',
      'Last Order',
      'Addresses',
    ];
    
    const rows = customers.map(c => [
      `"${c.name.replace(/"/g, '""')}"`,
      c.email,
      c.phone,
      c.orders,
      c.totalSpent,
      Math.round(c.totalSpent / c.orders),
      c.firstOrder,
      c.lastOrder,
      `"${c.addresses.join('; ').replace(/"/g, '""')}"`,
    ]);
    
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
  
  return exportCustomers('csv');
}

// Export inventory
export function exportInventory(format: ExportFormat = 'csv'): string {
  const products = getProducts();
  
  if (format === 'json') {
    const inventory = products.flatMap(p =>
      p.variants.map(v => ({
        productId: p.id,
        productName: p.name,
        category: p.category,
        variantId: v.id,
        size: v.size,
        type: v.type,
        sku: v.sku,
        price: v.price,
        stock: v.stock,
        stockValue: v.price * v.stock,
      }))
    );
    return JSON.stringify(inventory, null, 2);
  }
  
  if (format === 'csv') {
    const headers = [
      'Product ID',
      'Product Name',
      'Category',
      'Variant ID',
      'Size',
      'Type',
      'SKU',
      'Price',
      'Stock',
      'Stock Value',
    ];
    
    const rows = products.flatMap(p =>
      p.variants.map(v => [
        p.id,
        `"${p.name.replace(/"/g, '""')}"`,
        p.category,
        v.id,
        v.size,
        v.type,
        v.sku,
        v.price,
        v.stock,
        v.price * v.stock,
      ])
    );
    
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
  
  return exportInventory('csv');
}

// Export analytics data
export function exportAnalytics(format: ExportFormat = 'csv'): string {
  const { getSalesAnalytics, getProductPerformance, getCustomerAnalytics } = require('./analytics-service');
  
  const sales = getSalesAnalytics(30);
  const products = getProductPerformance();
  const customers = getCustomerAnalytics();
  
  const data = {
    sales,
    products,
    customers,
    exportedAt: new Date().toISOString(),
  };
  
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  
  if (format === 'csv') {
    // Export sales data
    const salesHeaders = ['Date', 'Revenue', 'Orders', 'Items'];
    const salesRows = sales.map((s: any) => [s.date, s.revenue, s.orders, s.items]);
    
    return [
      'SALES DATA',
      salesHeaders.join(','),
      ...salesRows.map((r: any) => r.join(',')),
      '',
      'CUSTOMER METRICS',
      `Total Customers,${customers.totalCustomers}`,
      `New Customers,${customers.newCustomers}`,
      `Returning Customers,${customers.returningCustomers}`,
      `Average Order Value,${Math.round(customers.avgOrderValue)}`,
      `Lifetime Value,${Math.round(customers.lifetimeValue)}`,
      '',
      'TOP PRODUCTS',
      'Product Name,Total Sold,Revenue,Orders',
      ...products.slice(0, 20).map((p: any) => 
        [`"${p.productName}"`, p.totalSold, p.revenue, p.orders].join(',')
      ),
    ].join('\n');
  }
  
  return exportAnalytics('csv');
}

// Save export to file
export function saveExportToFile(data: string, filename: string): string {
  const exportsDir = path.join(process.cwd(), 'data', 'exports');
  
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }
  
  const filepath = path.join(exportsDir, filename);
  fs.writeFileSync(filepath, data);
  
  return filepath;
}

// Generate export filename
function generateFilename(type: string, format: ExportFormat): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${type}-${timestamp}.${format}`;
}

// Export all data
export function exportAllData(format: ExportFormat = 'json'): { [key: string]: string } {
  return {
    products: exportProducts(format),
    orders: exportOrders(format),
    orderItems: exportOrderItems(format),
    customers: exportCustomers(format),
    inventory: exportInventory(format),
    analytics: exportAnalytics(format),
  };
}

// Save all exports
export function saveAllExports(format: ExportFormat = 'csv'): string[] {
  const exports = exportAllData(format);
  const files: string[] = [];
  
  Object.entries(exports).forEach(([type, data]) => {
    const filename = generateFilename(type, format);
    const filepath = saveExportToFile(data, filename);
    files.push(filepath);
  });
  
  return files;
}

// Get export history
export function getExportHistory(): Array<{
  filename: string;
  type: string;
  format: string;
  size: number;
  createdAt: string;
}> {
  const exportsDir = path.join(process.cwd(), 'data', 'exports');
  
  if (!fs.existsSync(exportsDir)) {
    return [];
  }
  
  const files = fs.readdirSync(exportsDir);
  
  return files.map(filename => {
    const filepath = path.join(exportsDir, filename);
    const stats = fs.statSync(filepath);
    const [type, ...rest] = filename.split('-');
    const format = filename.split('.').pop() || '';
    
    return {
      filename,
      type,
      format,
      size: stats.size,
      createdAt: stats.birthtime.toISOString(),
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Delete old exports
export function cleanOldExports(daysToKeep: number = 30): number {
  const exportsDir = path.join(process.cwd(), 'data', 'exports');
  
  if (!fs.existsSync(exportsDir)) {
    return 0;
  }
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  const files = fs.readdirSync(exportsDir);
  let deletedCount = 0;
  
  files.forEach(filename => {
    const filepath = path.join(exportsDir, filename);
    const stats = fs.statSync(filepath);
    
    if (stats.birthtime < cutoffDate) {
      fs.unlinkSync(filepath);
      deletedCount++;
    }
  });
  
  return deletedCount;
}
