import { NextRequest, NextResponse } from 'next/server';
import { addReminder, updateReminder, deleteReminder } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, dueDate } = body;

    if (!title || !content || !dueDate) {
      return NextResponse.json(
        { error: 'Title, content, and due date are required' },
        { status: 400 }
      );
    }

    const newItem = addReminder({
      title,
      content,
      dueDate,
      active: true
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, dueDate, active } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const updatedItem = updateReminder(id, { title, content, dueDate, active });

    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json(
      { error: 'Failed to update reminder' },
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

    const success = deleteReminder(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json(
      { error: 'Failed to delete reminder' },
      { status: 500 }
    );
  }
}