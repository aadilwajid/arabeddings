import { NextRequest, NextResponse } from 'next/server';
import { 
  getSalesAnalytics, 
  getProductPerformance, 
  getCustomerAnalytics,
  getCategoryPerformance,
  getPaymentMethodAnalytics,
  getCityAnalytics,
  getTimeAnalytics,
  getConversionMetrics,
  generateAnalyticsReport,
  exportAnalyticsData
} from '@/lib/analytics-service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '30');
  const type = searchParams.get('type') || 'all';
  
  if (type === 'sales') {
    return NextResponse.json(getSalesAnalytics(days));
  }
  
  if (type === 'products') {
    return NextResponse.json(getProductPerformance());
  }
  
  if (type === 'customers') {
    return NextResponse.json(getCustomerAnalytics());
  }
  
  if (type === 'categories') {
    return NextResponse.json(getCategoryPerformance());
  }
  
  if (type === 'payments') {
    return NextResponse.json(getPaymentMethodAnalytics());
  }
  
  if (type === 'cities') {
    return NextResponse.json(getCityAnalytics());
  }
  
  if (type === 'time') {
    return NextResponse.json(getTimeAnalytics());
  }
  
  if (type === 'conversion') {
    return NextResponse.json(getConversionMetrics());
  }
  
  if (type === 'report') {
    const report = generateAnalyticsReport();
    return NextResponse.json({ report });
  }
  
  if (type === 'export') {
    const data = exportAnalyticsData();
    return NextResponse.json(data);
  }
  
  // Return all analytics
  return NextResponse.json({
    sales: getSalesAnalytics(days),
    products: getProductPerformance(),
    customers: getCustomerAnalytics(),
    categories: getCategoryPerformance(),
    payments: getPaymentMethodAnalytics(),
    cities: getCityAnalytics(),
    time: getTimeAnalytics(),
    conversion: getConversionMetrics(),
  });
}
