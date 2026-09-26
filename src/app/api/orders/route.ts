import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrder, updateOrderStatus } from '@/lib/store';
import { Order, OrderStatus } from '@/types';
import { sendOrderConfirmation } from '@/lib/email-service';
import { sendOrderConfirmationSMS } from '@/lib/sms-service';
import { triggerOrderCreated, triggerOrderStatusChanged } from '@/lib/webhook-service';
import { logOrderAction } from '@/lib/audit-service';
import { recordSale } from '@/lib/inventory-service';
import { queueOrderConfirmation, queueOrderShipped, queueOrderDelivered } from '@/lib/queue-service';

export async function GET() {
  const orders = getOrders();
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  try {
    const order: Order = await request.json();
    
    // Save order
    saveOrder(order);
    
    // Queue email and SMS notifications
    queueOrderConfirmation(order, 10);
    
    // Trigger webhooks
    await triggerOrderCreated(order);
    
    // Log action
    logOrderAction(
      'system',
      'system@arabeddings.com',
      'create',
      order.id,
      { orderNumber: order.orderNumber, total: order.total },
      request.headers.get('x-forwarded-for') || 'unknown'
    );
    
    // Update inventory
    for (const item of order.items) {
      await recordSale(item.productId, item.variantId, item.quantity, order.id);
    }
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status, note } = await request.json();
    const orders = getOrders();
    const order = orders.find(o => o.id === id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    const oldStatus = order.status;
    updateOrderStatus(id, status as OrderStatus, note);
    
    // Trigger webhook for status change
    const updatedOrder = { ...order, status };
    await triggerOrderStatusChanged(updatedOrder, oldStatus, status);
    
    // Queue notifications based on status
    if (status === 'shipped') {
      queueOrderShipped(updatedOrder, updatedOrder.trackingNumber, 10);
    } else if (status === 'delivered') {
      queueOrderDelivered(updatedOrder, 10);
    }
    
    // Log action
    logOrderAction(
      'system',
      'system@arabeddings.com',
      'update_status',
      id,
      { oldStatus, newStatus: status, note },
      request.headers.get('x-forwarded-for') || 'unknown'
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
