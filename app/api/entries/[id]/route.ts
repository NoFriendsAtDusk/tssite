import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/entries/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { text, tags } = body

    if (!text?.trim() || !tags || !Array.isArray(tags)) {
      return NextResponse.json(
        { error: 'Invalid entry data' },
        { status: 400 }
      )
    }

    const entry = await prisma.entry.update({
      where: { id },
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
    console.error('Failed to update entry:', error)
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 }
    )
  }
}

// DELETE /api/entries/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await prisma.entry.delete({
      where: { id }
    })

    return NextResponse.json({ success: true }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Failed to delete entry:', error)
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    )
  }
}
