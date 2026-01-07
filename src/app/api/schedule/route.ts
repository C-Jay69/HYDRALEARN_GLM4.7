import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all events
export async function GET() {
  try {
    const events = await db.scheduleEvent.findMany({
      orderBy: { date: 'asc' },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST create event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, date, eventType, color } = body;

    const event = await db.scheduleEvent.create({
      data: {
        title,
        description,
        date: new Date(date),
        eventType,
        color,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
