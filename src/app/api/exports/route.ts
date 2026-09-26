import { NextRequest, NextResponse } from 'next/server';
import { 
  exportProducts, 
  exportOrders, 
  exportOrderItems,
  exportCustomers,
  exportInventory,
  exportAnalytics,
  exportAllData,
  saveExportToFile,
  getExportHistory,
  cleanOldExports
} from '@/lib/export-service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';
  const format = (searchParams.get('format') || 'csv') as 'csv' | 'json';
  
  if (type === 'history') {
    const history = getExportHistory();
    return NextResponse.json(history);
  }
  
  let data: string;
  
  switch (type) {
    case 'products':
      data = exportProducts(format);
      break;
    case 'orders':
      const startDate = searchParams.get('startDate') || undefined;
      const endDate = searchParams.get('endDate') || undefined;
      const status = searchParams.get('status') || undefined;
      data = exportOrders(format, { startDate, endDate, status });
      break;
    case 'order-items':
      data = exportOrderItems(format);
      break;
    case 'customers':
      data = exportCustomers(format);
      break;
    case 'inventory':
      data = exportInventory(format);
      break;
    case 'analytics':
      data = exportAnalytics(format);
      break;
    case 'all':
      const allData = exportAllData(format);
      data = JSON.stringify(allData);
      break;
    default:
      return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
  }
  
  // Return as file download
  const extension = format === 'json' ? 'json' : 'csv';
  const mimeType = format === 'json' ? 'application/json' : 'text/csv';
  
  return new NextResponse(data, {
    headers: {
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${type}-export-${Date.now()}.${extension}"`,
    },
  });
}

export async function POST(request: NextRequest) {
  const { action, type, format } = await request.json();
  
  if (action === 'save') {
    const exportType = type || 'all';
    const exportFormat = format || 'csv';
    
    let data: string;
    
    switch (exportType) {
      case 'products':
        data = exportProducts(exportFormat);
        break;
      case 'orders':
        data = exportOrders(exportFormat);
        break;
      case 'customers':
        data = exportCustomers(exportFormat);
        break;
      case 'inventory':
        data = exportInventory(exportFormat);
        break;
      case 'analytics':
        data = exportAnalytics(exportFormat);
        break;
      case 'all':
      default:
        const allData = exportAllData(exportFormat);
        data = JSON.stringify(allData);
    }
    
    const filename = `${exportType}-export-${Date.now()}.${exportFormat}`;
    const filepath = saveExportToFile(data, filename);
    
    return NextResponse.json({ 
      success: true, 
      filename,
      filepath 
    });
  }
  
  if (action === 'clean') {
    const daysToKeep = 30;
    const deletedCount = cleanOldExports(daysToKeep);
    return NextResponse.json({ 
      success: true, 
      message: `Cleaned ${deletedCount} old exports`,
      deletedCount 
    });
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
