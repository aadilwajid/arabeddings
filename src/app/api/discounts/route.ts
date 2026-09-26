import { NextRequest, NextResponse } from 'next/server';
import { getDiscountCodes, createDiscountCode, updateDiscountCode, deleteDiscountCode } from '@/lib/discounts';

export async function GET() {
  const codes = getDiscountCodes();
  return NextResponse.json(codes);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const code = createDiscountCode(data);
  return NextResponse.json({ success: true, code });
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const { id, ...updates } = data;
  updateDiscountCode(id, updates);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  deleteDiscountCode(id);
  return NextResponse.json({ success: true });
}
