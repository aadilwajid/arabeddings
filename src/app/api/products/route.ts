import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProduct, deleteProduct } from '@/lib/store';
import { Product } from '@/types';

export async function GET() {
  const products = getProducts();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const product: Product = await request.json();
  saveProduct(product);
  return NextResponse.json({ success: true, product });
}

export async function PUT(request: NextRequest) {
  const product: Product = await request.json();
  saveProduct(product);
  return NextResponse.json({ success: true, product });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  deleteProduct(id);
  return NextResponse.json({ success: true });
}
