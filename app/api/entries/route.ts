import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"

// GET /api/entries - Get all entries
export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const entries = await prisma.entry.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse tags from JSON string to array for each entry
    const parsedEntries = entries.map(entry => ({
      ...entry,
      tags: JSON.parse(entry.tags)
    }))

    return NextResponse.json(parsedEntries)
  } catch (error) {
    console.error('Error fetching entries:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// POST /api/entries - Create a new entry
export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await request.json()
    const { text, tags } = json

    if (!text || !Array.isArray(tags)) {
      return new NextResponse("Invalid request body", { status: 400 })
    }

    const entry = await prisma.entry.create({
      data: {
        text,
        tags: JSON.stringify(tags), // Convert tags array to JSON string
      }
    })

    // Parse tags back to array in response
    return NextResponse.json({
      ...entry,
      tags: JSON.parse(entry.tags)
    })
  } catch (error) {
    console.error('Error creating entry:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
