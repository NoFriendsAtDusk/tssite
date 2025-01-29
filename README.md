# Knowledge Base App

A Next.js application for managing knowledge entries with Google Calendar integration.

## Features

- Create and manage knowledge entries with tags
- Automatic task creation based on calendar events
- Tag-based matching between calendar events and knowledge entries
- Daily synchronization with Google Calendar

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
# Copy the example environment file
cp .env.example .env
```

Then edit `.env` with your:
- Database configuration
- Google Calendar API credentials (see below for setup)

3. Initialize the database:

```bash
npx prisma migrate dev
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Google Calendar Integration Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google Calendar API
4. Create API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key
5. Add the API key to your .env file:
   ```
   GOOGLE_API_KEY="your-api-key"
   ```

## Calendar Sync

The app automatically checks for calendar events in the next 24 hours and creates preparation tasks based on matching knowledge entries. The sync runs daily at midnight.

To start the calendar sync manually:

```bash
npm run calendar-sync
```

### How it works

1. The system checks your Google Calendar for events in the next 24 hours
2. For each event, it looks for knowledge base entries with tags that match the event's title or description
3. If matches are found, it combines the content of matching entries into a task
4. Creates a new calendar event 1 hour before the original event with the combined knowledge as the description

## Development

This project uses:
- [Next.js](https://nextjs.org) for the framework
- [Prisma](https://www.prisma.io) for database management
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Google Calendar API](https://developers.google.com/calendar) for calendar integration

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
