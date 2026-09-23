import { NextRequest, NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/store';
import { SiteSettings } from '@/types';

export async function GET() {
  const settings = getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const settings: SiteSettings = await request.json();
  saveSettings(settings);
  return NextResponse.json({ success: true, settings });
}
