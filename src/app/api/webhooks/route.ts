import { NextRequest, NextResponse } from 'next/server';
import { 
  getWebhooks, 
  createWebhook, 
  updateWebhook, 
  deleteWebhook,
  getWebhookDeliveries,
  retryWebhookDelivery,
  WEBHOOK_EVENTS
} from '@/lib/webhook-service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const webhookId = searchParams.get('webhookId');
  
  if (type === 'events') {
    return NextResponse.json(WEBHOOK_EVENTS);
  }
  
  if (type === 'deliveries' && webhookId) {
    const deliveries = getWebhookDeliveries(webhookId);
    return NextResponse.json(deliveries);
  }
  
  const webhooks = getWebhooks();
  return NextResponse.json(webhooks);
}

export async function POST(request: NextRequest) {
  const { action, url, events, secret, id, deliveryId } = await request.json();
  
  if (action === 'create') {
    if (!url || !events || !Array.isArray(events)) {
      return NextResponse.json({ error: 'URL and events are required' }, { status: 400 });
    }
    
    const webhook = createWebhook(url, events, secret);
    return NextResponse.json({ success: true, webhook });
  }
  
  if (action === 'update') {
    if (!id) {
      return NextResponse.json({ error: 'Webhook ID is required' }, { status: 400 });
    }
    
    const webhook = updateWebhook(id, { url, events, secret, active: true });
    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, webhook });
  }
  
  if (action === 'retry') {
    if (!deliveryId) {
      return NextResponse.json({ error: 'Delivery ID is required' }, { status: 400 });
    }
    
    const success = await retryWebhookDelivery(deliveryId);
    return NextResponse.json({ success });
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  
  if (!id) {
    return NextResponse.json({ error: 'Webhook ID is required' }, { status: 400 });
  }
  
  const deleted = deleteWebhook(id);
  
  if (!deleted) {
    return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
  }
  
  return NextResponse.json({ success: true });
}
