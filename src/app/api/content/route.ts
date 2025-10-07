import { NextRequest, NextResponse } from 'next/server';
import { readContentData } from '@/lib/database';

export async function GET() {
  try {
    const data = readContentData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}