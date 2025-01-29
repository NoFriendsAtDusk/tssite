import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/entries
export async function GET() {
  try {
    const entries = await prisma.entry.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse JSON strings back to arrays
    const formattedEntries = entries.map(entry => ({
      ...entry,
      tags: JSON.parse(entry.tags),
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString()
    }))

    return NextResponse.json(formattedEntries, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Failed to fetch entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    )
  }
}

// POST /api/entries
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, tags } = body

    if (!text?.trim() || !tags || !Array.isArray(tags)) {
      return NextResponse.json(
        { error: 'Invalid entry data' },
        { status: 400 }
      )
    }

    const entry = await prisma.entry.create({
      data: {
        text: text.trim(),
        tags: JSON.stringify(tags)
      }
    })

    return NextResponse.json({
      ...entry,
      tags: JSON.parse(entry.tags),
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString()
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Failed to create entry:', error)
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    )
  }
}
