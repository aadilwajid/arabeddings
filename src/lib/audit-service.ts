// Audit Logging System
import fs from 'fs';
import path from 'path';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure';
  errorMessage?: string;
}

const AUDIT_LOG_FILE = path.join(process.cwd(), 'data', 'audit-logs.json');

// Get all audit logs
export function getAuditLogs(): AuditLog[] {
  if (!fs.existsSync(AUDIT_LOG_FILE)) {
    return [];
  }
  
  const data = fs.readFileSync(AUDIT_LOG_FILE, 'utf-8');
  return JSON.parse(data);
}

// Save audit log
export function saveAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
  const logs = getAuditLogs();
  
  const newLog: AuditLog = {
    ...log,
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  
  logs.unshift(newLog); // Add to beginning
  
  // Keep only last 10000 logs
  const trimmedLogs = logs.slice(0, 10000);
  
  fs.writeFileSync(AUDIT_LOG_FILE, JSON.stringify(trimmedLogs, null, 2));
}

// Log user actions
export function logUserAction(
  userId: string,
  userEmail: string,
  action: string,
  resource: string,
  resourceId?: string,
  details?: any,
  ipAddress?: string,
  userAgent?: string
): void {
  saveAuditLog({
    userId,
    userEmail,
    action,
    resource,
    resourceId,
    details,
    ipAddress,
    userAgent,
    status: 'success',
  });
}

// Log authentication events
export function logAuthEvent(
  email: string,
  action: 'login' | 'logout' | 'login_failed' | 'password_reset' | 'password_changed',
  status: 'success' | 'failure',
  ipAddress?: string,
  userAgent?: string,
  errorMessage?: string
): void {
  saveAuditLog({
    userEmail: email,
    action,
    resource: 'authentication',
    ipAddress,
    userAgent,
    status,
    errorMessage,
  });
}

// Log product actions
export function logProductAction(
  userId: string,
  userEmail: string,
  action: 'create' | 'update' | 'delete' | 'restock',
  productId: string,
  details?: any,
  ipAddress?: string
): void {
  logUserAction(userId, userEmail, action, 'product', productId, details, ipAddress);
}

// Log order actions
export function logOrderAction(
  userId: string,
  userEmail: string,
  action: 'create' | 'update_status' | 'cancel' | 'refund',
  orderId: string,
  details?: any,
  ipAddress?: string
): void {
  logUserAction(userId, userEmail, action, 'order', orderId, details, ipAddress);
}

// Log customer actions
export function logCustomerAction(
  userId: string,
  userEmail: string,
  action: 'create' | 'update' | 'delete',
  customerId: string,
  details?: any,
  ipAddress?: string
): void {
  logUserAction(userId, userEmail, action, 'customer', customerId, details, ipAddress);
}

// Log settings changes
export function logSettingsChange(
  userId: string,
  userEmail: string,
  setting: string,
  oldValue: any,
  newValue: any,
  ipAddress?: string
): void {
  logUserAction(
    userId,
    userEmail,
    'update',
    'settings',
    setting,
    { oldValue, newValue },
    ipAddress
  );
}

// Get logs by user
export function getLogsByUser(userId: string): AuditLog[] {
  return getAuditLogs().filter(log => log.userId === userId);
}

// Get logs by action
export function getLogsByAction(action: string): AuditLog[] {
  return getAuditLogs().filter(log => log.action === action);
}

// Get logs by resource
export function getLogsByResource(resource: string): AuditLog[] {
  return getAuditLogs().filter(log => log.resource === resource);
}

// Get logs by date range
export function getLogsByDateRange(startDate: Date, endDate: Date): AuditLog[] {
  return getAuditLogs().filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= startDate && logDate <= endDate;
  });
}

// Get failed actions
export function getFailedActions(): AuditLog[] {
  return getAuditLogs().filter(log => log.status === 'failure');
}

// Get suspicious activities (multiple failed logins, etc.)
export function getSuspiciousActivities(): AuditLog[] {
  const logs = getAuditLogs();
  const failedLogins = logs.filter(log => log.action === 'login_failed');
  
  // Group by IP address
  const ipGroups = new Map<string, AuditLog[]>();
  failedLogins.forEach(log => {
    if (log.ipAddress) {
      if (!ipGroups.has(log.ipAddress)) {
        ipGroups.set(log.ipAddress, []);
      }
      ipGroups.get(log.ipAddress)!.push(log);
    }
  });
  
  // Return IPs with more than 5 failed attempts
  const suspicious: AuditLog[] = [];
  ipGroups.forEach((logs, ip) => {
    if (logs.length >= 5) {
      suspicious.push(...logs);
    }
  });
  
  return suspicious;
}

// Generate audit report
export function generateAuditReport(days: number = 30): string {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
  const logs = getLogsByDateRange(startDate, endDate);
  
  let report = `AUDIT LOG REPORT\n`;
  report += `================\n\n`;
  report += `Period: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}\n`;
  report += `Total Events: ${logs.length}\n\n`;
  
  // Summary by action
  const actionSummary = new Map<string, number>();
  logs.forEach(log => {
    actionSummary.set(log.action, (actionSummary.get(log.action) || 0) + 1);
  });
  
  report += 'ACTION SUMMARY\n';
  report += '--------------\n';
  Array.from(actionSummary.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([action, count]) => {
      report += `${action}: ${count}\n`;
    });
  report += '\n';
  
  // Summary by resource
  const resourceSummary = new Map<string, number>();
  logs.forEach(log => {
    resourceSummary.set(log.resource, (resourceSummary.get(log.resource) || 0) + 1);
  });
  
  report += 'RESOURCE SUMMARY\n';
  report += '----------------\n';
  Array.from(resourceSummary.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([resource, count]) => {
      report += `${resource}: ${count}\n`;
    });
  report += '\n';
  
  // Failed actions
  const failedActions = logs.filter(log => log.status === 'failure');
  report += `FAILED ACTIONS: ${failedActions.length}\n`;
  report += '-------------------\n';
  failedActions.slice(0, 10).forEach(log => {
    report += `${log.timestamp} - ${log.action} on ${log.resource}`;
    if (log.userEmail) report += ` by ${log.userEmail}`;
    if (log.errorMessage) report += `: ${log.errorMessage}`;
    report += '\n';
  });
  report += '\n';
  
  // Suspicious activities
  const suspicious = getSuspiciousActivities();
  if (suspicious.length > 0) {
    report += `SUSPICIOUS ACTIVITIES: ${suspicious.length}\n`;
    report += '------------------------\n';
    suspicious.slice(0, 10).forEach(log => {
      report += `${log.timestamp} - ${log.action} from IP ${log.ipAddress}\n`;
    });
  }
  
  return report;
}

// Export audit logs as JSON
export function exportAuditLogs(startDate?: Date, endDate?: Date): AuditLog[] {
  if (startDate && endDate) {
    return getLogsByDateRange(startDate, endDate);
  }
  return getAuditLogs();
}

// Clean old logs (keep only last N days)
export function cleanOldLogs(daysToKeep: number = 90): void {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  const logs = getAuditLogs();
  const recentLogs = logs.filter(log => new Date(log.timestamp) > cutoffDate);
  
  fs.writeFileSync(AUDIT_LOG_FILE, JSON.stringify(recentLogs, null, 2));
}
