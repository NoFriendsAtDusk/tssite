import { NextResponse } from 'next/server';
import { getUpcomingEvents, processCalendarEvent } from '@/lib/google-calendar';

// POST /api/calendar/process
export async function POST() {
  try {
    const events = await getUpcomingEvents();
    const results = await Promise.all(
      events.map(async (event) => {
        if (!event.id || !event.summary) {
          return null;
        }
        
        return processCalendarEvent({
          id: event.id,
          summary: event.summary,
          description: event.description || undefined,
          start: {
            dateTime: event.start?.dateTime || undefined,
            date: event.start?.date || undefined,
          },
          end: {
            dateTime: event.end?.dateTime || undefined,
            date: event.end?.date || undefined,
          },
        });
      })
    );

    // Filter out null results and count successful processes
    const successfulResults = results.filter((result): result is NonNullable<typeof result> => result !== null);

    return NextResponse.json({
      message: `Processed ${successfulResults.length} events`,
      results: successfulResults,
    });
  } catch (error) {
    console.error('Failed to process calendar events:', error);
    return NextResponse.json(
      { error: 'Failed to process calendar events' },
      { status: 500 }
    );
  }
}
