import { NextRequest, NextResponse } from 'next/server';
import { reorderMainContent } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemIds } = body;

    if (!itemIds || !Array.isArray(itemIds)) {
      return NextResponse.json(
        { error: 'itemIds array is required' },
        { status: 400 }
      );
    }

    reorderMainContent(itemIds);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering main content:', error);
    return NextResponse.json(
      { error: 'Failed to reorder main content' },
      { status: 500 }
    );
  }
}