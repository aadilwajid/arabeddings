import { NextRequest, NextResponse } from 'next/server';
import { getMenu, saveMenu } from '@/lib/store';
import { MenuItem } from '@/types';

export async function GET() {
  const menu = getMenu();
  return NextResponse.json(menu);
}

export async function PUT(request: NextRequest) {
  const menu: MenuItem[] = await request.json();
  saveMenu(menu);
  return NextResponse.json({ success: true, menu });
}
