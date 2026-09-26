// Queue System for Background Jobs
import fs from 'fs';
import path from 'path';

export interface QueueJob {
  id: string;
  type: string;
  data: any;
  priority: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  processedAt?: string;
  completedAt?: string;
  failedAt?: string;
  error?: string;
  result?: any;
}

export interface QueueWorker {
  type: string;
  handler: (data: any) => Promise<any>;
}

const QUEUE_FILE = path.join(process.cwd(), 'data', 'queue.json');
const workers: Map<string, QueueWorker['handler']> = new Map();

// Get all jobs
function getJobs(): QueueJob[] {
  if (!fs.existsSync(QUEUE_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));
}

// Save jobs
function saveJobs(jobs: QueueJob[]): void {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(jobs, null, 2));
}

// Register worker
export function registerWorker(type: string, handler: QueueWorker['handler']): void {
  workers.set(type, handler);
}

// Add job to queue
export function addJob(
  type: string,
  data: any,
  priority: number = 0,
  maxAttempts: number = 3
): string {
  const jobs = getJobs();
  
  const job: QueueJob = {
    id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    data,
    priority,
    status: 'pending',
    attempts: 0,
    maxAttempts,
    createdAt: new Date().toISOString(),
  };
  
  jobs.push(job);
  
  // Sort by priority (higher priority first)
  jobs.sort((a, b) => b.priority - a.priority);
  
  saveJobs(jobs);
  
  // Process queue asynchronously
  setImmediate(() => processQueue());
  
  return job.id;
}

// Process queue
async function processQueue(): Promise<void> {
  const jobs = getJobs();
  const pendingJobs = jobs.filter(j => j.status === 'pending');
  
  for (const job of pendingJobs) {
    await processJob(job);
  }
}

// Process single job
async function processJob(job: QueueJob): Promise<void> {
  const worker = workers.get(job.type);
  
  if (!worker) {
    console.error(`No worker registered for job type: ${job.type}`);
    return;
  }
  
  const jobs = getJobs();
  const jobIndex = jobs.findIndex(j => j.id === job.id);
  
  if (jobIndex === -1) return;
  
  // Mark as processing
  jobs[jobIndex].status = 'processing';
  jobs[jobIndex].processedAt = new Date().toISOString();
  jobs[jobIndex].attempts += 1;
  saveJobs(jobs);
  
  try {
    // Execute worker
    const result = await worker(job.data);
    
    // Mark as completed
    jobs[jobIndex].status = 'completed';
    jobs[jobIndex].completedAt = new Date().toISOString();
    jobs[jobIndex].result = result;
    saveJobs(jobs);
    
    console.log(`Job ${job.id} completed successfully`);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if we should retry
    if (jobs[jobIndex].attempts < jobs[jobIndex].maxAttempts) {
      // Mark as pending for retry
      jobs[jobIndex].status = 'pending';
      jobs[jobIndex].error = errorMessage;
      saveJobs(jobs);
      
      console.log(`Job ${job.id} failed, will retry (attempt ${jobs[jobIndex].attempts}/${jobs[jobIndex].maxAttempts})`);
      
    } else {
      // Mark as failed
      jobs[jobIndex].status = 'failed';
      jobs[jobIndex].failedAt = new Date().toISOString();
      jobs[jobIndex].error = errorMessage;
      saveJobs(jobs);
      
      console.error(`Job ${job.id} failed after ${jobs[jobIndex].attempts} attempts: ${errorMessage}`);
    }
  }
}

// Get job by ID
export function getJob(id: string): QueueJob | null {
  const jobs = getJobs();
  return jobs.find(j => j.id === id) || null;
}

// Get jobs by status
export function getJobsByStatus(status: QueueJob['status']): QueueJob[] {
  return getJobs().filter(j => j.status === status);
}

// Get jobs by type
export function getJobsByType(type: string): QueueJob[] {
  return getJobs().filter(j => j.type === type);
}

// Cancel job
export function cancelJob(id: string): boolean {
  const jobs = getJobs();
  const jobIndex = jobs.findIndex(j => j.id === id);
  
  if (jobIndex === -1) return false;
  
  // Can only cancel pending jobs
  if (jobs[jobIndex].status !== 'pending') {
    return false;
  }
  
  jobs.splice(jobIndex, 1);
  saveJobs(jobs);
  
  return true;
}

// Retry failed job
export function retryJob(id: string): boolean {
  const jobs = getJobs();
  const jobIndex = jobs.findIndex(j => j.id === id);
  
  if (jobIndex === -1) return false;
  
  // Can only retry failed jobs
  if (jobs[jobIndex].status !== 'failed') {
    return false;
  }
  
  jobs[jobIndex].status = 'pending';
  jobs[jobIndex].attempts = 0;
  jobs[jobIndex].error = undefined;
  jobs[jobIndex].failedAt = undefined;
  saveJobs(jobs);
  
  // Process queue
  setImmediate(() => processQueue());
  
  return true;
}

// Clean completed jobs
export function cleanCompletedJobs(olderThanDays: number = 7): number {
  const jobs = getJobs();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
  
  const cleanedJobs = jobs.filter(job => {
    if (job.status === 'completed' && job.completedAt) {
      return new Date(job.completedAt) > cutoffDate;
    }
    return true;
  });
  
  const removedCount = jobs.length - cleanedJobs.length;
  saveJobs(cleanedJobs);
  
  return removedCount;
}

// Get queue statistics
export function getQueueStats(): {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
} {
  const jobs = getJobs();
  
  return {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    processing: jobs.filter(j => j.status === 'processing').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
  };
}

// ============ BUILT-IN WORKERS ============

// Email worker
registerWorker('send_email', async (data: { to: string; subject: string; html: string }) => {
  const { sendEmail } = await import('./email-service');
  return sendEmail(data);
});

// SMS worker
registerWorker('send_sms', async (data: { to: string; message: string }) => {
  const { sendSMS } = await import('./sms-service');
  return sendSMS(data);
});

// Order confirmation worker
registerWorker('order_confirmation', async (data: { order: any }) => {
  const { sendOrderConfirmation } = await import('./email-service');
  const { sendOrderConfirmationSMS } = await import('./sms-service');
  
  await sendOrderConfirmation(data.order);
  await sendOrderConfirmationSMS(data.order);
  
  return { sent: true };
});

// Order shipped worker
registerWorker('order_shipped', async (data: { order: any; trackingNumber?: string }) => {
  const { sendOrderShipped } = await import('./email-service');
  const { sendOrderShippedSMS } = await import('./sms-service');
  
  await sendOrderShipped(data.order, data.trackingNumber);
  await sendOrderShippedSMS(data.order, data.trackingNumber);
  
  return { sent: true };
});

// Order delivered worker
registerWorker('order_delivered', async (data: { order: any }) => {
  const { sendOrderDelivered } = await import('./email-service');
  const { sendOrderDeliveredSMS } = await import('./sms-service');
  
  await sendOrderDelivered(data.order);
  await sendOrderDeliveredSMS(data.order);
  
  return { sent: true };
});

// Low stock alert worker
registerWorker('low_stock_alert', async (data: { product: any; variant: any }) => {
  const { sendLowStockAlert } = await import('./email-service');
  const { sendLowStockAlertSMS } = await import('./sms-service');
  
  await sendLowStockAlert(data.product, data.variant);
  await sendLowStockAlertSMS(data.product, data.variant);
  
  return { sent: true };
});

// Webhook worker
registerWorker('trigger_webhook', async (data: { event: string; payload: any }) => {
  const { triggerWebhookEvent } = await import('./webhook-service');
  await triggerWebhookEvent(data.event, data.payload);
  return { triggered: true };
});

// Inventory update worker
registerWorker('inventory_update', async (data: { 
  productId: string; 
  variantId: string; 
  quantity: number; 
  action: string;
  reason?: string;
}) => {
  const { updateStock } = await import('./inventory-service');
  return updateStock(
    data.productId,
    data.variantId,
    data.quantity,
    data.action as any,
    data.reason
  );
});

// Helper functions for common jobs
export function queueEmail(to: string, subject: string, html: string, priority: number = 0): string {
  return addJob('send_email', { to, subject, html }, priority);
}

export function queueSMS(to: string, message: string, priority: number = 0): string {
  return addJob('send_sms', { to, message }, priority);
}

export function queueOrderConfirmation(order: any, priority: number = 10): string {
  return addJob('order_confirmation', { order }, priority);
}

export function queueOrderShipped(order: any, trackingNumber?: string, priority: number = 10): string {
  return addJob('order_shipped', { order, trackingNumber }, priority);
}

export function queueOrderDelivered(order: any, priority: number = 10): string {
  return addJob('order_delivered', { order }, priority);
}

export function queueLowStockAlert(product: any, variant: any, priority: number = 5): string {
  return addJob('low_stock_alert', { product, variant }, priority);
}

export function queueWebhook(event: string, payload: any, priority: number = 0): string {
  return addJob('trigger_webhook', { event, payload }, priority);
}

export function queueInventoryUpdate(
  productId: string,
  variantId: string,
  quantity: number,
  action: string,
  reason?: string,
  priority: number = 5
): string {
  return addJob('inventory_update', { productId, variantId, quantity, action, reason }, priority);
}

// Start queue processor (call this on server start)
export function startQueueProcessor(): void {
  console.log('Queue processor started');
  
  // Process queue every 10 seconds
  setInterval(() => {
    processQueue();
  }, 10000);
  
  // Clean old jobs every hour
  setInterval(() => {
    cleanCompletedJobs(7);
  }, 60 * 60 * 1000);
}
