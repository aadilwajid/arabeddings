import { NextRequest, NextResponse } from 'next/server';
import { 
  getAuditLogs, 
  getLogsByUser, 
  getLogsByAction,
  getLogsByResource,
  getLogsByDateRange,
  getFailedActions,
  getSuspiciousActivities,
  generateAuditReport,
  exportAuditLogs,
  cleanOldLogs
} from '@/lib/audit-service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';
  const userId = searchParams.get('userId');
  const action = searchParams.get('action');
  const resource = searchParams.get('resource');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const days = parseInt(searchParams.get('days') || '30');
  
  if (type === 'failed') {
    return NextResponse.json(getFailedActions());
  }
  
  if (type === 'suspicious') {
    return NextResponse.json(getSuspiciousActivities());
  }
  
  if (type === 'report') {
    const report = generateAuditReport(days);
    return NextResponse.json({ report });
  }
  
  if (type === 'export') {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    const logs = exportAuditLogs(start, end);
    return NextResponse.json(logs);
  }
  
  if (userId) {
    return NextResponse.json(getLogsByUser(userId));
  }
  
  if (action) {
    return NextResponse.json(getLogsByAction(action));
  }
  
  if (resource) {
    return NextResponse.json(getLogsByResource(resource));
  }
  
  if (startDate && endDate) {
    return NextResponse.json(getLogsByDateRange(new Date(startDate), new Date(endDate)));
  }
  
  // Return all logs (with limit)
  const limit = parseInt(searchParams.get('limit') || '100');
  const logs = getAuditLogs().slice(0, limit);
  
  return NextResponse.json(logs);
}

export async function POST(request: NextRequest) {
  const { action } = await request.json();
  
  if (action === 'clean') {
    const daysToKeep = 90;
    const deletedCount = cleanOldLogs(daysToKeep);
    return NextResponse.json({ 
      success: true, 
      message: `Cleaned ${deletedCount} old logs`,
      deletedCount 
    });
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
