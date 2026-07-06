// app/api/assignments/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const createSchema = z.object({
  title: z.string().min(3, "Min 3 characters"),
  description: z.string().optional(),
  instructions: z.string().optional(),
  courseId: z.string().min(1, "Course is required"),
  dueDate: z.string().min(1, "Due date is required"),
  maxMarks: z.number().min(1).max(1000).default(100),
  allowLate: z.boolean().default(false),
  latePenalty: z.number().min(0).max(100).optional(),
})

// GET all assignments
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId") || ""
    const role = session.user.role

    let assignments

    if (role === "STUDENT") {
      // Get assignments for courses student is enrolled in
      const enrollments = await db.enrollment.findMany({
        where: { userId: session.user.id },
        select: { courseId: true },
      })
      const courseIds = enrollments.map((e) => e.courseId)

      assignments = await db.assignment.findMany({
        where: {
          courseId: courseId || { in: courseIds },
          status: "PUBLISHED",
        },
        include: {
          course: {
            select: { title: true, code: true },
          },
          submissions: {
            where: { studentId: session.user.id },
            select: {
              id: true,
              status: true,
              marks: true,
              submittedAt: true,
            },
          },
        },
        orderBy: { dueDate: "asc" },
      })
    } else {
      // Lecturer/Admin sees all their assignments
      const where: Record<string, unknown> = {}
      if (courseId) where.courseId = courseId
      if (role === "LECTURER") {
        where.createdById = session.user.id
      }

      assignments = await db.assignment.findMany({
        where,
        include: {
          course: {
            select: { title: true, code: true },
          },
          _count: {
            select: { submissions: true },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    }

    return NextResponse.json({ assignments })
  } catch (error) {
    console.error("Get assignments error:", error)
    return NextResponse.json(
      { error: "Failed to get assignments" },
      { status: 500 }
    )
  }
}

// POST create assignment
export async function POST(req: NextRequest) {
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

    const body = await req.json()
    const result = createSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const assignment = await db.assignment.create({
      data: {
        ...result.data,
        dueDate: new Date(result.data.dueDate),
        createdById: session.user.id,
        status: "DRAFT",
      },
    })

    return NextResponse.json(
      { success: true, assignment },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create assignment error:", error)
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    )
  }
}