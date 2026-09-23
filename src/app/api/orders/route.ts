import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrder } from '@/lib/store';

export async function GET() {
  const orders = getOrders();
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const order = await request.json();
  saveOrder(order);
  return NextResponse.json({ success: true, order });
}
