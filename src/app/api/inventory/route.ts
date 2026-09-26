import { NextRequest, NextResponse } from 'next/server';
import { 
  getInventorySummary, 
  getLowStockItems, 
  getOutOfStockItems,
  restockProduct,
  generateInventoryReport,
  addBackInStockSubscriber
} from '@/lib/inventory-service';

export async function GET() {
  const summary = getInventorySummary();
  const lowStock = getLowStockItems();
  const outOfStock = getOutOfStockItems();
  
  return NextResponse.json({
    summary,
    lowStock,
    outOfStock,
  });
}

export async function POST(request: NextRequest) {
  const { action, productId, variantId, quantity, reason, userId, email } = await request.json();
  
  if (action === 'restock') {
    const result = await restockProduct(productId, variantId, quantity, reason, userId);
    return NextResponse.json(result);
  }
  
  if (action === 'subscribe') {
    addBackInStockSubscriber(productId, email);
    return NextResponse.json({ success: true, message: 'Subscribed to back in stock notifications' });
  }
  
  if (action === 'report') {
    const report = generateInventoryReport();
    return NextResponse.json({ report });
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
