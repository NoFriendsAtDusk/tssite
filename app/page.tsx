"use client"

import { useState } from "react"
import { EntryForm } from "./components/entry-form"
import { EntriesList } from "./components/entries-list"

export default function Home() {
  const [refreshCounter, setRefreshCounter] = useState(0)

  const handleEntryCreated = () => {
    setRefreshCounter(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 space-y-8">
        <h1 className="text-2xl font-bold">ナレッジベース</h1>
        <EntryForm onEntryCreated={handleEntryCreated} />
        <EntriesList refresh={refreshCounter} />
      </main>
    </div>
  )
}
