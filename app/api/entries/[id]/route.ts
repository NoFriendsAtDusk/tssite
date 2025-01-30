import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"

// PUT /api/entries/[id] - Update an entry
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const entry = await prisma.entry.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        text,
        tags: JSON.stringify(tags)
      }
    })

    return NextResponse.json({
      ...entry,
      tags: JSON.parse(entry.tags)
    })
  } catch (error) {
    console.error('Error updating entry:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// DELETE /api/entries/[id] - Delete an entry
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.entry.delete({
      where: {
        id: parseInt(params.id)
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting entry:', error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
