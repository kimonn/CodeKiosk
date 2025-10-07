import { NextRequest, NextResponse } from 'next/server';
import { addDeadline, updateDeadline, deleteDeadline } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, dueDate, priority = 'medium' } = body;

    if (!title || !content || !dueDate) {
      return NextResponse.json(
        { error: 'Title, content, and due date are required' },
        { status: 400 }
      );
    }

    const newItem = addDeadline({
      title,
      content,
      dueDate,
      priority,
      active: true
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating deadline:', error);
    return NextResponse.json(
      { error: 'Failed to create deadline' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, dueDate, priority, active } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const updatedItem = updateDeadline(id, { title, content, dueDate, priority, active });

    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Deadline not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating deadline:', error);
    return NextResponse.json(
      { error: 'Failed to update deadline' },
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

    const success = deleteDeadline(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Deadline not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting deadline:', error);
    return NextResponse.json(
      { error: 'Failed to delete deadline' },
      { status: 500 }
    );
  }
}