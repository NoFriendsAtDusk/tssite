"use client"

import { useSession } from "next-auth/react"
import Loading from "@/app/components/loading"

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
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {session?.user?.name}</h1>
      {/* Add your app content here */}
    </div>
  )
}
