import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PATCH update event
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, date, eventType, color } = body;

    const event = await db.scheduleEvent.update({
      where: { id: params.id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        eventType,
        color,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.scheduleEvent.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
