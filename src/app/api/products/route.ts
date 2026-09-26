import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProduct, deleteProduct } from '@/lib/store';
import { Product } from '@/types';
import { logProductAction } from '@/lib/audit-service';
import { triggerWebhookEvent, WEBHOOK_EVENTS } from '@/lib/webhook-service';

export async function GET() {
  const products = getProducts();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    const product: Product = await request.json();
    saveProduct(product);
    
    // Trigger webhook
    await triggerWebhookEvent(WEBHOOK_EVENTS.PRODUCT_CREATED, { product });
    
    // Log action
    logProductAction(
      'system',
      'system@arabeddings.com',
      'create',
      product.id,
      { name: product.name, category: product.category },
      request.headers.get('x-forwarded-for') || 'unknown'
    );
    
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const product: Product = await request.json();
    const products = getProducts();
    const oldProduct = products.find(p => p.id === product.id);
    
    saveProduct(product);
    
    // Trigger webhook
    await triggerWebhookEvent(WEBHOOK_EVENTS.PRODUCT_UPDATED, { 
      product,
      changes: oldProduct ? { old: oldProduct, new: product } : null
    });
    
    // Log action
    logProductAction(
      'system',
      'system@arabeddings.com',
      'update',
      product.id,
      { name: product.name },
      request.headers.get('x-forwarded-for') || 'unknown'
    );
    
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const products = getProducts();
    const product = products.find(p => p.id === id);
    
    deleteProduct(id);
    
    // Trigger webhook
    if (product) {
      await triggerWebhookEvent(WEBHOOK_EVENTS.PRODUCT_DELETED, { product });
    }
    
    // Log action
    logProductAction(
      'system',
      'system@arabeddings.com',
      'delete',
      id,
      { name: product?.name },
      request.headers.get('x-forwarded-for') || 'unknown'
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
