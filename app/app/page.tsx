"use client"

import { useSession } from "next-auth/react"
import Loading from "@/app/components/loading"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EntriesList } from "@/app/components/entries-list"
import { EntryForm } from "@/app/components/entry-form"

export default function AppPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/app/login"
    },
  })

  if (status === "loading") {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Knowledge Base</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {session?.user?.name}</span>
            <Button
              variant="outline"
              onClick={() => window.location.href = "/api/auth/signout"}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-8">
          <aside>
            <Card className="p-4">
              <EntryForm />
            </Card>
          </aside>
          
          <section>
            <EntriesList />
          </section>
        </div>
      </main>
    </div>
  )
}
