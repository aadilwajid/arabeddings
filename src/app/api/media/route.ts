import { NextRequest, NextResponse } from 'next/server';
import { getMedia, saveMedia, deleteMedia } from '@/lib/store';
import { Media } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const media = getMedia();
  return NextResponse.json(media);
}

export async function POST(request: NextRequest) {
  const { url, filename, tags } = await request.json();
  const media: Media = {
    id: uuidv4(),
    url,
    filename,
    tags: tags || [],
    usageCount: 0,
    uploadedAt: new Date().toISOString()
  };
  saveMedia(media);
  return NextResponse.json({ success: true, media });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  deleteMedia(id);
  return NextResponse.json({ success: true });
}
