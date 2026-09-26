// Webhook System for External Integrations
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface Webhook {
  id: string;
  url: string;
  secret: string;
  events: string[];
  active: boolean;
  createdAt: string;
  lastTriggered?: string;
  failureCount: number;
}

export interface WebhookEvent {
  event: string;
  data: any;
  timestamp: string;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  payload: any;
  response?: {
    status: number;
    body?: string;
  };
  success: boolean;
  timestamp: string;
  errorMessage?: string;
}

const WEBHOOKS_FILE = path.join(process.cwd(), 'data', 'webhooks.json');
const WEBHOOK_DELIVERIES_FILE = path.join(process.cwd(), 'data', 'webhook-deliveries.json');

// Get all webhooks
export function getWebhooks(): Webhook[] {
  if (!fs.existsSync(WEBHOOKS_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(WEBHOOKS_FILE, 'utf-8'));
}

// Save webhooks
function saveWebhooks(webhooks: Webhook[]): void {
  fs.writeFileSync(WEBHOOKS_FILE, JSON.stringify(webhooks, null, 2));
}

// Create webhook
export function createWebhook(url: string, events: string[], secret?: string): Webhook {
  const webhooks = getWebhooks();
  
  const webhook: Webhook = {
    id: `wh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    url,
    secret: secret || crypto.randomBytes(32).toString('hex'),
    events,
    active: true,
    createdAt: new Date().toISOString(),
    failureCount: 0,
  };
  
  webhooks.push(webhook);
  saveWebhooks(webhooks);
  
  return webhook;
}

// Update webhook
export function updateWebhook(id: string, updates: Partial<Webhook>): Webhook | null {
  const webhooks = getWebhooks();
  const index = webhooks.findIndex(w => w.id === id);
  
  if (index === -1) return null;
  
  webhooks[index] = { ...webhooks[index], ...updates };
  saveWebhooks(webhooks);
  
  return webhooks[index];
}

// Delete webhook
export function deleteWebhook(id: string): boolean {
  const webhooks = getWebhooks();
  const filtered = webhooks.filter(w => w.id !== id);
  
  if (filtered.length === webhooks.length) {
    return false;
  }
  
  saveWebhooks(filtered);
  return true;
}

// Get webhook by ID
export function getWebhook(id: string): Webhook | null {
  const webhooks = getWebhooks();
  return webhooks.find(w => w.id === id) || null;
}

// Generate webhook signature
function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

// Deliver webhook
async function deliverWebhook(webhook: Webhook, event: WebhookEvent): Promise<WebhookDelivery> {
  const payload = JSON.stringify(event);
  const signature = generateSignature(payload, webhook.secret);
  
  const delivery: WebhookDelivery = {
    id: `dlv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    webhookId: webhook.id,
    event: event.event,
    payload: event.data,
    success: false,
    timestamp: new Date().toISOString(),
  };
  
  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': event.event,
        'X-Webhook-ID': delivery.id,
        'User-Agent': 'ARA-Beddings-Webhook/1.0',
      },
      body: payload,
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    delivery.response = {
      status: response.status,
      body: await response.text(),
    };
    
    delivery.success = response.ok;
    
  } catch (error) {
    delivery.success = false;
    delivery.errorMessage = error instanceof Error ? error.message : 'Unknown error';
  }
  
  // Save delivery log
  saveWebhookDelivery(delivery);
  
  // Update webhook status
  const webhooks = getWebhooks();
  const index = webhooks.findIndex(w => w.id === webhook.id);
  
  if (index !== -1) {
    webhooks[index].lastTriggered = new Date().toISOString();
    
    if (!delivery.success) {
      webhooks[index].failureCount += 1;
      
      // Disable webhook after 5 consecutive failures
      if (webhooks[index].failureCount >= 5) {
        webhooks[index].active = false;
      }
    } else {
      webhooks[index].failureCount = 0;
    }
    
    saveWebhooks(webhooks);
  }
  
  return delivery;
}

// Trigger webhook event
export async function triggerWebhookEvent(event: string, data: any): Promise<void> {
  const webhooks = getWebhooks();
  const matchingWebhooks = webhooks.filter(
    w => w.active && w.events.includes(event)
  );
  
  const webhookEvent: WebhookEvent = {
    event,
    data,
    timestamp: new Date().toISOString(),
  };
  
  // Deliver to all matching webhooks in parallel
  await Promise.all(
    matchingWebhooks.map(webhook => deliverWebhook(webhook, webhookEvent))
  );
}

// Save webhook delivery
function saveWebhookDelivery(delivery: WebhookDelivery): void {
  let deliveries: WebhookDelivery[] = [];
  
  if (fs.existsSync(WEBHOOK_DELIVERIES_FILE)) {
    deliveries = JSON.parse(fs.readFileSync(WEBHOOK_DELIVERIES_FILE, 'utf-8'));
  }
  
  deliveries.unshift(delivery);
  
  // Keep only last 1000 deliveries
  deliveries = deliveries.slice(0, 1000);
  
  fs.writeFileSync(WEBHOOK_DELIVERIES_FILE, JSON.stringify(deliveries, null, 2));
}

// Get webhook deliveries
export function getWebhookDeliveries(webhookId?: string, limit: number = 50): WebhookDelivery[] {
  if (!fs.existsSync(WEBHOOK_DELIVERIES_FILE)) {
    return [];
  }
  
  let deliveries: WebhookDelivery[] = JSON.parse(
    fs.readFileSync(WEBHOOK_DELIVERIES_FILE, 'utf-8')
  );
  
  if (webhookId) {
    deliveries = deliveries.filter(d => d.webhookId === webhookId);
  }
  
  return deliveries.slice(0, limit);
}

// Retry failed delivery
export async function retryWebhookDelivery(deliveryId: string): Promise<boolean> {
  if (!fs.existsSync(WEBHOOK_DELIVERIES_FILE)) {
    return false;
  }
  
  const deliveries: WebhookDelivery[] = JSON.parse(
    fs.readFileSync(WEBHOOK_DELIVERIES_FILE, 'utf-8')
  );
  
  const delivery = deliveries.find(d => d.id === deliveryId);
  if (!delivery) return false;
  
  const webhook = getWebhook(delivery.webhookId);
  if (!webhook) return false;
  
  const event: WebhookEvent = {
    event: delivery.event,
    data: delivery.payload,
    timestamp: new Date().toISOString(),
  };
  
  await deliverWebhook(webhook, event);
  return true;
}

// Available webhook events
export const WEBHOOK_EVENTS = {
  // Order events
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_STATUS_CHANGED: 'order.status_changed',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_DELIVERED: 'order.delivered',
  
  // Product events
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  PRODUCT_LOW_STOCK: 'product.low_stock',
  PRODUCT_OUT_OF_STOCK: 'product.out_of_stock',
  PRODUCT_BACK_IN_STOCK: 'product.back_in_stock',
  
  // Customer events
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
  CUSTOMER_DELETED: 'customer.deleted',
  
  // Review events
  REVIEW_CREATED: 'review.created',
  REVIEW_APPROVED: 'review.approved',
  REVIEW_DELETED: 'review.deleted',
  
  // Inventory events
  INVENTORY_UPDATED: 'inventory.updated',
  INVENTORY_RESTOCKED: 'inventory.restocked',
  
  // Payment events
  PAYMENT_RECEIVED: 'payment.received',
  PAYMENT_FAILED: 'payment.failed',
  REFUND_PROCESSED: 'refund.processed',
};

// Helper functions for common events
export async function triggerOrderCreated(order: any): Promise<void> {
  await triggerWebhookEvent(WEBHOOK_EVENTS.ORDER_CREATED, { order });
}

export async function triggerOrderStatusChanged(order: any, oldStatus: string, newStatus: string): Promise<void> {
  await triggerWebhookEvent(WEBHOOK_EVENTS.ORDER_STATUS_CHANGED, {
    order,
    oldStatus,
    newStatus,
  });
}

export async function triggerProductLowStock(product: any, variant: any): Promise<void> {
  await triggerWebhookEvent(WEBHOOK_EVENTS.PRODUCT_LOW_STOCK, {
    product,
    variant,
    stock: variant.stock,
  });
}

export async function triggerProductOutOfStock(product: any, variant: any): Promise<void> {
  await triggerWebhookEvent(WEBHOOK_EVENTS.PRODUCT_OUT_OF_STOCK, {
    product,
    variant,
  });
}

export async function triggerProductBackInStock(product: any, variant: any): Promise<void> {
  await triggerWebhookEvent(WEBHOOK_EVENTS.PRODUCT_BACK_IN_STOCK, {
    product,
    variant,
    stock: variant.stock,
  });
}

export async function triggerCustomerCreated(customer: any): Promise<void> {
  await triggerWebhookEvent(WEBHOOK_EVENTS.CUSTOMER_CREATED, { customer });
}

export async function triggerReviewCreated(review: any): Promise<void> {
  await triggerWebhookEvent(WEBHOOK_EVENTS.REVIEW_CREATED, { review });
}
