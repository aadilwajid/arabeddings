/**
 * ARA BEDDINGS - Backend Services
 * Central export for all backend services
 */

export { api, productsApi, cartApi, ordersApi, wishlistApi, authApi, customOrdersApi, adminApi } from './api';
export { logger } from './logger';
export { cache } from './cache';
export { analytics } from './analytics';
export { database } from './database';
export { notifications } from './notifications';
export { validators } from './validators';

/**
 * BACKEND SERVICES OVERVIEW
 * 
 * This module provides a complete backend abstraction layer for ARA BEDDINGS.
 * All services are designed to be easily replaceable with real backend implementations.
 * 
 * SERVICES:
 * 
 * 1. API Service (api.ts)
 *    - RESTful API abstraction
 *    - Products, Cart, Orders, Wishlist, Auth, Custom Orders, Admin
 *    - Simulates network delays for realistic behavior
 *    - Easy to replace with real HTTP calls
 * 
 * 2. Logger Service (logger.ts)
 *    - Comprehensive logging system
 *    - Multiple log levels: debug, info, warn, error, success
 *    - Persists logs to localStorage
 *    - Color-coded console output
 *    - Global access via window.logger
 * 
 * 3. Cache Service (cache.ts)
 *    - In-memory caching with localStorage persistence
 *    - TTL (Time To Live) support
 *    - Helper methods for common patterns
 *    - Global access via window.cache
 * 
 * 4. Analytics Service (analytics.ts)
 *    - User behavior tracking
 *    - E-commerce specific events
 *    - Session management
 *    - Summary reports
 *    - Global access via window.analytics
 * 
 * 5. Database Service (database.ts)
 *    - Database abstraction layer
 *    - CRUD operations
 *    - Transaction support
 *    - Migration guide included
 *    - Ready for PostgreSQL/Prisma integration
 * 
 * 6. Notifications Service (notifications.ts)
 *    - Email, SMS, Push notifications
 *    - Order confirmations
 *    - Status updates
 *    - Integration guide for Resend, Twilio, Firebase
 *    - Global access via window.notifications
 * 
 * 7. Validators Service (validators.ts)
 *    - Form validation
 *    - Pakistani phone format
 *    - Email validation
 *    - Password strength
 *    - Address validation
 *    - File upload validation
 *    - Global access via window.validators
 * 
 * USAGE:
 * 
 * import { api, logger, analytics } from './services';
 * 
 * // Fetch products
 * const result = await api.products.getAll({ category: 'bed-sheets' });
 * 
 * // Log activity
 * logger.info('User viewed product', { productId: '123' });
 * 
 * // Track analytics
 * analytics.trackProductView('123');
 * 
 * MIGRATION TO REAL BACKEND:
 * 
 * 1. Replace API service with real HTTP calls:
 *    - Use fetch or axios
 *    - Point to Express.js backend
 * 
 * 2. Replace Database service with Prisma:
 *    - Install @prisma/client
 *    - Define schema in prisma/schema.prisma
 *    - Replace mock queries with Prisma queries
 * 
 * 3. Replace Notifications with real services:
 *    - Email: Resend, SendGrid, AWS SES
 *    - SMS: Twilio, AWS SNS
 *    - Push: Firebase, OneSignal
 * 
 * DEBUGGING:
 * 
 * All services are available globally in browser console:
 * - window.logger
 * - window.cache
 * - window.analytics
 * - window.database
 * - window.notifications
 * - window.validators
 * 
 * Example:
 * console.log(window.logger.getStats());
 * window.cache.clear();
 * console.log(window.analytics.getSummary());
 */
