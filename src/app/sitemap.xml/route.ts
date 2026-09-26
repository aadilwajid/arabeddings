import { NextResponse } from 'next/server';
import { generateSitemap } from '@/lib/seo-service';

export async function GET() {
  const sitemap = generateSitemap();
  
  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
