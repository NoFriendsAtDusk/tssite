-- CreateTable
CREATE TABLE "ProcessedCalendarEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" TEXT NOT NULL,
    "eventTitle" TEXT NOT NULL,
    "eventStart" DATETIME NOT NULL,
    "taskEventId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CalendarTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "processedEventId" INTEGER NOT NULL,
    "taskContent" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CalendarTask_processedEventId_fkey" FOREIGN KEY ("processedEventId") REFERENCES "ProcessedCalendarEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CalendarTaskEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "calendarTaskId" INTEGER NOT NULL,
    "entryId" INTEGER NOT NULL,
    CONSTRAINT "CalendarTaskEntry_calendarTaskId_fkey" FOREIGN KEY ("calendarTaskId") REFERENCES "CalendarTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CalendarTaskEntry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedCalendarEvent_eventId_key" ON "ProcessedCalendarEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarTask_processedEventId_key" ON "CalendarTask"("processedEventId");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarTaskEntry_calendarTaskId_entryId_key" ON "CalendarTaskEntry"("calendarTaskId", "entryId");
