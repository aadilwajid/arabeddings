// Advanced Analytics Service
import { getProducts, getOrders } from './store';

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  items: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  totalSold: number;
  revenue: number;
  orders: number;
  avgRating?: number;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  avgOrderValue: number;
  lifetimeValue: number;
}

export interface InventoryAnalytics {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  stockValue: number;
}

// Get sales analytics
export function getSalesAnalytics(days: number = 30): SalesData[] {
  const orders = getOrders();
  const salesData: SalesData[] = [];
  
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  // Initialize all days
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    salesData.push({
      date: dateStr,
      revenue: 0,
      orders: 0,
      items: 0,
    });
  }
  
  // Populate with actual data
  orders.forEach(order => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
    const dayData = salesData.find(d => d.date === orderDate);
    
    if (dayData) {
      dayData.revenue += order.total;
      dayData.orders += 1;
      dayData.items += order.items.reduce((sum, item) => sum + item.quantity, 0);
    }
  });
  
  return salesData;
}

// Get product performance
export function getProductPerformance(): ProductPerformance[] {
  const orders = getOrders();
  const products = getProducts();
  const performanceMap = new Map<string, ProductPerformance>();
  
  // Initialize all products
  products.forEach(product => {
    performanceMap.set(product.id, {
      productId: product.id,
      productName: product.name,
      totalSold: 0,
      revenue: 0,
      orders: 0,
    });
  });
  
  // Calculate performance from orders
  orders.forEach(order => {
    order.items.forEach(item => {
      const perf = performanceMap.get(item.productId);
      if (perf) {
        perf.totalSold += item.quantity;
        perf.revenue += item.price * item.quantity;
        perf.orders += 1;
      }
    });
  });
  
  // Convert to array and sort by revenue
  return Array.from(performanceMap.values())
    .sort((a, b) => b.revenue - a.revenue);
}

// Get customer analytics
export function getCustomerAnalytics(): CustomerAnalytics {
  const orders = getOrders();
  const customerMap = new Map<string, { orders: number; totalSpent: number; firstOrder: Date; lastOrder: Date }>();
  
  orders.forEach(order => {
    const email = order.customer.email;
    const orderDate = new Date(order.createdAt);
    
    if (!customerMap.has(email)) {
      customerMap.set(email, {
        orders: 0,
        totalSpent: 0,
        firstOrder: orderDate,
        lastOrder: orderDate,
      });
    }
    
    const customer = customerMap.get(email)!;
    customer.orders += 1;
    customer.totalSpent += order.total;
    
    if (orderDate < customer.firstOrder) {
      customer.firstOrder = orderDate;
    }
    if (orderDate > customer.lastOrder) {
      customer.lastOrder = orderDate;
    }
  });
  
  const customers = Array.from(customerMap.values());
  const totalCustomers = customers.length;
  const newCustomers = customers.filter(c => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return c.firstOrder > thirtyDaysAgo;
  }).length;
  
  const returningCustomers = totalCustomers - newCustomers;
  const avgOrderValue = orders.length > 0 
    ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length 
    : 0;
  
  const lifetimeValue = customers.length > 0
    ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length
    : 0;
  
  return {
    totalCustomers,
    newCustomers,
    returningCustomers,
    avgOrderValue,
    lifetimeValue,
  };
}

// Get category performance
export function getCategoryPerformance(): Array<{
  category: string;
  revenue: number;
  orders: number;
  items: number;
}> {
  const orders = getOrders();
  const products = getProducts();
  const categoryMap = new Map<string, { revenue: number; orders: number; items: number }>();
  
  // Initialize categories
  const categories = Array.from(new Set(products.map(p => p.category)));
  categories.forEach(cat => {
    categoryMap.set(cat, { revenue: 0, orders: 0, items: 0 });
  });
  
  // Calculate performance
  orders.forEach(order => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const catData = categoryMap.get(product.category)!;
        catData.revenue += item.price * item.quantity;
        catData.items += item.quantity;
        catData.orders += 1;
      }
    });
  });
  
  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.revenue - a.revenue);
}

// Get payment method analytics
export function getPaymentMethodAnalytics(): Array<{
  method: string;
  orders: number;
  revenue: number;
  percentage: number;
}> {
  const orders = getOrders();
  const methodMap = new Map<string, { orders: number; revenue: number }>();
  
  orders.forEach(order => {
    const method = order.paymentMethod;
    if (!methodMap.has(method)) {
      methodMap.set(method, { orders: 0, revenue: 0 });
    }
    const data = methodMap.get(method)!;
    data.orders += 1;
    data.revenue += order.total;
  });
  
  const totalOrders = orders.length;
  
  return Array.from(methodMap.entries())
    .map(([method, data]) => ({
      method,
      orders: data.orders,
      revenue: data.revenue,
      percentage: totalOrders > 0 ? (data.orders / totalOrders) * 100 : 0,
    }))
    .sort((a, b) => b.orders - a.orders);
}

// Get city-wise analytics
export function getCityAnalytics(): Array<{
  city: string;
  orders: number;
  revenue: number;
}> {
  const orders = getOrders();
  const cityMap = new Map<string, { orders: number; revenue: number }>();
  
  orders.forEach(order => {
    const city = order.customer.city;
    if (!cityMap.has(city)) {
      cityMap.set(city, { orders: 0, revenue: 0 });
    }
    const data = cityMap.get(city)!;
    data.orders += 1;
    data.revenue += order.total;
  });
  
  return Array.from(cityMap.entries())
    .map(([city, data]) => ({ city, ...data }))
    .sort((a, b) => b.orders - a.orders);
}

// Get time-based analytics (hour of day, day of week)
export function getTimeAnalytics(): {
  byHour: Array<{ hour: number; orders: number; revenue: number }>;
  byDay: Array<{ day: string; orders: number; revenue: number }>;
} {
  const orders = getOrders();
  
  const hourMap = new Map<number, { orders: number; revenue: number }>();
  const dayMap = new Map<string, { orders: number; revenue: number }>();
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Initialize
  for (let i = 0; i < 24; i++) {
    hourMap.set(i, { orders: 0, revenue: 0 });
  }
  days.forEach(day => {
    dayMap.set(day, { orders: 0, revenue: 0 });
  });
  
  // Populate
  orders.forEach(order => {
    const date = new Date(order.createdAt);
    const hour = date.getHours();
    const day = days[date.getDay()];
    
    const hourData = hourMap.get(hour)!;
    hourData.orders += 1;
    hourData.revenue += order.total;
    
    const dayData = dayMap.get(day)!;
    dayData.orders += 1;
    dayData.revenue += order.total;
  });
  
  return {
    byHour: Array.from(hourMap.entries())
      .map(([hour, data]) => ({ hour, ...data }))
      .sort((a, b) => a.hour - b.hour),
    byDay: Array.from(dayMap.entries())
      .map(([day, data]) => ({ day, ...data })),
  };
}

// Get conversion metrics
export function getConversionMetrics(): {
  totalVisitors: number;
  totalOrders: number;
  conversionRate: number;
  avgSessionDuration: number;
  bounceRate: number;
} {
  const orders = getOrders();
  
  // Note: In a real app, you'd track visitors from analytics service
  // This is a placeholder calculation
  const totalVisitors = orders.length * 10; // Assume 10 visitors per order
  const totalOrders = orders.length;
  const conversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;
  
  return {
    totalVisitors,
    totalOrders,
    conversionRate,
    avgSessionDuration: 180, // 3 minutes placeholder
    bounceRate: 35, // 35% placeholder
  };
}

// Generate comprehensive report
export function generateAnalyticsReport(): string {
  const sales = getSalesAnalytics(30);
  const products = getProductPerformance();
  const customers = getCustomerAnalytics();
  const categories = getCategoryPerformance();
  const payments = getPaymentMethodAnalytics();
  const cities = getCityAnalytics();
  const time = getTimeAnalytics();
  
  let report = 'COMPREHENSIVE ANALYTICS REPORT\n';
  report += '================================\n\n';
  report += `Generated: ${new Date().toLocaleString()}\n\n`;
  
  // Customer Summary
  report += 'CUSTOMER METRICS\n';
  report += '----------------\n';
  report += `Total Customers: ${customers.totalCustomers}\n`;
  report += `New Customers (30 days): ${customers.newCustomers}\n`;
  report += `Returning Customers: ${customers.returningCustomers}\n`;
  report += `Average Order Value: Rs ${Math.round(customers.avgOrderValue).toLocaleString()}\n`;
  report += `Customer Lifetime Value: Rs ${Math.round(customers.lifetimeValue).toLocaleString()}\n\n`;
  
  // Top Products
  report += 'TOP 10 PRODUCTS\n';
  report += '---------------\n';
  products.slice(0, 10).forEach((product, index) => {
    report += `${index + 1}. ${product.productName}\n`;
    report += `   Sold: ${product.totalSold} units | Revenue: Rs ${product.revenue.toLocaleString()}\n`;
  });
  report += '\n';
  
  // Category Performance
  report += 'CATEGORY PERFORMANCE\n';
  report += '--------------------\n';
  categories.forEach(cat => {
    report += `${cat.category}: Rs ${cat.revenue.toLocaleString()} (${cat.orders} orders)\n`;
  });
  report += '\n';
  
  // Payment Methods
  report += 'PAYMENT METHODS\n';
  report += '---------------\n';
  payments.forEach(method => {
    report += `${method.method}: ${method.orders} orders (${method.percentage.toFixed(1)}%) - Rs ${method.revenue.toLocaleString()}\n`;
  });
  report += '\n';
  
  // Top Cities
  report += 'TOP 10 CITIES\n';
  report += '-------------\n';
  cities.slice(0, 10).forEach((city, index) => {
    report += `${index + 1}. ${city.city}: ${city.orders} orders - Rs ${city.revenue.toLocaleString()}\n`;
  });
  report += '\n';
  
  // Peak Hours
  report += 'PEAK ORDER HOURS\n';
  report += '----------------\n';
  const peakHours = time.byHour
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);
  peakHours.forEach(hour => {
    report += `${hour.hour}:00 - ${hour.orders} orders\n`;
  });
  report += '\n';
  
  // Peak Days
  report += 'PEAK ORDER DAYS\n';
  report += '---------------\n';
  const peakDays = time.byDay
    .sort((a, b) => b.orders - a.orders);
  peakDays.forEach(day => {
    report += `${day.day}: ${day.orders} orders\n`;
  });
  
  return report;
}

// Export analytics data as JSON
export function exportAnalyticsData(): object {
  return {
    sales: getSalesAnalytics(30),
    products: getProductPerformance(),
    customers: getCustomerAnalytics(),
    categories: getCategoryPerformance(),
    payments: getPaymentMethodAnalytics(),
    cities: getCityAnalytics(),
    time: getTimeAnalytics(),
    conversion: getConversionMetrics(),
    generatedAt: new Date().toISOString(),
  };
}
