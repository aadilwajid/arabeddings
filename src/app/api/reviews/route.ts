import { NextRequest, NextResponse } from 'next/server';
import { getReviews, saveReview, deleteReview } from '@/lib/store';
import { Review } from '@/types';

export async function GET() {
  const reviews = getReviews();
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const review: Review = await request.json();
  saveReview(review);
  return NextResponse.json({ success: true, review });
}

export async function PUT(request: NextRequest) {
  const review: Review = await request.json();
  saveReview(review);
  return NextResponse.json({ success: true, review });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  deleteReview(id);
  return NextResponse.json({ success: true });
}
