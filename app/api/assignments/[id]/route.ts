// app/api/assignments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  instructions: z.string().optional(),
  dueDate: z.string().optional(),
  maxMarks: z.number().min(1).max(1000).optional(),
  allowLate: z.boolean().optional(),
  latePenalty: z.number().min(0).max(100).optional(),
  status: z
    .enum(["DRAFT", "PUBLISHED", "CLOSED"])
    .optional(),
})

// GET single assignment
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    const assignment = await db.assignment.findUnique({
      where: { id },
      include: {
        course: {
          select: { title: true, code: true },
        },
        createdBy: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: { submissions: true },
        },
      },
    })

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ assignment })
  } catch (error) {
    console.error("Get assignment error:", error)
    return NextResponse.json(
      { error: "Failed to get assignment" },
      { status: 500 }
    )
  }
}

// PUT update assignment
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const result = updateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 }
      )
    }

    const data: Record<string, unknown> = {
      ...result.data,
    }

    if (result.data.dueDate) {
      data.dueDate = new Date(result.data.dueDate)
    }

    const assignment = await db.assignment.update({
      where: { id },
      data,
    })

    return NextResponse.json({
      success: true,
      assignment,
    })
  } catch (error) {
    console.error("Update assignment error:", error)
    return NextResponse.json(
      { error: "Failed to update assignment" },
      { status: 500 }
    )
  }
}

// DELETE assignment
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (
      !session?.user ||
      !["ADMIN", "LECTURER"].includes(session.user.role)
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const { id } = await params

    await db.assignment.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: "Assignment deleted",
    })
  } catch (error) {
    console.error("Delete assignment error:", error)
    return NextResponse.json(
      { error: "Failed to delete assignment" },
      { status: 500 }
    )
  }
}