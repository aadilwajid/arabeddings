import { NextResponse } from 'next/server';
import { generateRobotsTxt } from '@/lib/seo-service';

export async function GET() {
  const robots = generateRobotsTxt();
  
  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
