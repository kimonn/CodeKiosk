import { NextRequest, NextResponse } from 'next/server';
import { addNewsItem, updateNewsItem, deleteNewsItem } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const newItem = addNewsItem({
      title,
      content,
      publishedAt: new Date().toISOString(),
      active: true
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating news item:', error);
    return NextResponse.json(
      { error: 'Failed to create news item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, active } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const updatedItem = updateNewsItem(id, { title, content, active });

    if (!updatedItem) {
      return NextResponse.json(
        { error: 'News item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating news item:', error);
    return NextResponse.json(
      { error: 'Failed to update news item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const success = deleteNewsItem(id);

    if (!success) {
      return NextResponse.json(
        { error: 'News item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news item:', error);
    return NextResponse.json(
      { error: 'Failed to delete news item' },
      { status: 500 }
    );
  }
}