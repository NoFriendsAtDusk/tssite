import { google, calendar_v3 } from 'googleapis';
import { prisma } from './prisma';

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

// Initialize calendar client with API key
const calendar = google.calendar({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY
});

// Function to get events in the next 24 hours
export async function getUpcomingEvents() {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: tomorrow.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

// Function to create a task event
export async function createTaskEvent(
  originalEvent: CalendarEvent,
  taskContent: string,
  entryIds: number[]
): Promise<calendar_v3.Schema$Event> {
  const startDateTime = originalEvent.start.dateTime || originalEvent.start.date;
  if (!startDateTime) {
    throw new Error('Event start time is missing');
  }
  const eventStartTime = new Date(startDateTime);
  const taskStartTime = new Date(eventStartTime.getTime() - 60 * 60 * 1000); // 1 hour before

  try {
    // Create the task event
    const taskEvent = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: `Preparation for: ${originalEvent.summary}`,
        description: `${taskContent}\n\nGenerated from knowledge base entries: ${entryIds.join(', ')}`,
        start: {
          dateTime: taskStartTime.toISOString(),
        },
        end: {
          dateTime: eventStartTime.toISOString(),
        },
      },
    });

    return taskEvent.data;
  } catch (error) {
    console.error('Error creating task event:', error);
    throw error;
  }
}

// Function to find matching entries for an event
export async function findMatchingEntries(eventTitle: string, eventDescription?: string) {
  // Get all entries
  const entries = await prisma.entry.findMany();
  
  // Combine event title and description for matching
  const eventText = `${eventTitle} ${eventDescription || ''}`.toLowerCase();
  
  // Filter entries with matching tags
  const matchingEntries = entries.filter(entry => {
    const tags = JSON.parse(entry.tags) as string[];
    return tags.some(tag => eventText.includes(tag.toLowerCase()));
  });

  return matchingEntries;
}

// Function to create a calendar task with related entries
export async function processCalendarEvent(event: CalendarEvent) {
  try {
    // Check if event was already processed
    const existingProcessedEvent = await prisma.processedCalendarEvent.findFirst({
      where: { eventId: event.id },
    });

    if (existingProcessedEvent) {
      return null;
    }

    // Find matching entries
    const matchingEntries = await findMatchingEntries(
      event.summary,
      event.description
    );

    if (matchingEntries.length === 0) {
      return null;
    }

    // Combine entry contents into one paragraph
    const taskContent = matchingEntries
      .map(entry => entry.text)
      .join(' ');

    // Create the calendar task event
    const taskEvent = await createTaskEvent(
      event,
      taskContent,
      matchingEntries.map(entry => entry.id)
    );

    // Store the processed event and task
    const processedEvent = await prisma.processedCalendarEvent.create({
      data: {
        eventId: event.id,
        eventTitle: event.summary,
        eventStart: new Date(event.start.dateTime || event.start.date || new Date().toISOString()),
        taskEventId: taskEvent.id,
        calendarTask: {
          create: {
            taskContent,
            entries: {
              create: matchingEntries.map(entry => ({
                entry: { connect: { id: entry.id } },
              })),
            },
          },
        },
      },
      include: {
        calendarTask: {
          include: {
            entries: true,
          },
        },
      },
    });

    return processedEvent;
  } catch (error) {
    console.error('Error processing calendar event:', error);
    throw error;
  }
}
