import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrder, updateOrderStatus } from '@/lib/store';
import { Order, OrderStatus } from '@/types';

export async function GET() {
  const orders = getOrders();
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const order: Order = await request.json();
  saveOrder(order);
  return NextResponse.json({ success: true, order });
}

export async function PUT(request: NextRequest) {
  const { id, status, note } = await request.json();
  updateOrderStatus(id, status as OrderStatus, note);
  return NextResponse.json({ success: true });
}
