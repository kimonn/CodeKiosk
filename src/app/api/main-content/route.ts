import { NextRequest, NextResponse } from 'next/server';
import { updateMainContent, addMainContent, deleteMainContent } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, content, mediaPath, active = true, order = 1, duration = 10 } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: 'Type and title are required' },
        { status: 400 }
      );
    }

    const newContent = addMainContent({
      type,
      title,
      content: content || '',
      mediaPath: mediaPath || '',
      active,
      order,
      duration
    });

    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    console.error('Error creating main content:', error);
    return NextResponse.json(
      { error: 'Failed to create main content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type, title, content, mediaPath, active, order, duration } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const updatedContent = updateMainContent(id, {
      type,
      title,
      content: content || '',
      mediaPath: mediaPath || '',
      active,
      order,
      duration
    });

    if (!updatedContent) {
      return NextResponse.json(
        { error: 'Main content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating main content:', error);
    return NextResponse.json(
      { error: 'Failed to update main content' },
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

    const success = deleteMainContent(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Main content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting main content:', error);
    return NextResponse.json(
      { error: 'Failed to delete main content' },
      { status: 500 }
    );
  }
}