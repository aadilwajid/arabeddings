// This file is called when the Next.js server starts
// Use it to initialize background services

import { startQueueProcessor } from './lib/queue-service';

export async function register() {
  // Start queue processor for background jobs
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('Starting queue processor...');
    startQueueProcessor();
  }
}
