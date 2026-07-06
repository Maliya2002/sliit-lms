// app/api/courses/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const updateSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  code: z.string().min(3).max(20).optional(),
  description: z.string().optional(),
  credits: z.number().min(1).max(6).optional(),
  maxStudents: z.number().min(5).max(500).optional(),
  status: z
    .enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
    .optional(),
})

// ─────────────────────────────────────────
// GET single course
// ─────────────────────────────────────────
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

    // ← AWAIT params here
    const { id } = await params

    const course = await db.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        department: true,
        semester: true,
        modules: {
          include: { lessons: true },
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            enrollments: true,
            assignments: true,
            quizzes: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ course })
  } catch (error) {
    console.error("Get course error:", error)
    return NextResponse.json(
      { error: "Failed to get course" },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────
// PUT update course
// ─────────────────────────────────────────
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

    // ← AWAIT params here
    const { id } = await params

    const body = await req.json()
    const result = updateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 }
      )
    }

    const updated = await db.course.update({
      where: { id },
      data: result.data,
    })

    return NextResponse.json({
      success: true,
      course: updated,
    })
  } catch (error) {
    console.error("Update course error:", error)
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────
// DELETE course
// ─────────────────────────────────────────
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

    // ← AWAIT params here
    const { id } = await params

    await db.course.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: "Course deleted",
    })
  } catch (error) {
    console.error("Delete course error:", error)
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    )
  }
}