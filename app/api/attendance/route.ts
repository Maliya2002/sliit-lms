// app/api/attendance/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const createSchema = z.object({
  courseId: z.string().min(1),
  date: z.string().min(1),
  topic: z.string().optional(),
})

// GET — Get attendance sessions
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

    const where: Record<string, unknown> = {}
    if (courseId) where.courseId = courseId

    const sessions = await db.attendanceSession.findMany({
      where,
      include: {
        course: {
          select: { title: true, code: true },
        },
        attendances: {
          include: {
            student: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    studentId: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: { attendances: true },
        },
      },
      orderBy: { date: "desc" },
    })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Get sessions error:", error)
    return NextResponse.json(
      { error: "Failed to get sessions" },
      { status: 500 }
    )
  }
}

// POST — Create attendance session
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (
      !session?.user ||
      !["ADMIN", "LECTURER", "TEACHING_ASSISTANT"].includes(
        session.user.role
      )
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
        { error: result.error.flatten() },
        { status: 400 }
      )
    }

    // Get enrolled students for this course
    const enrollments = await db.enrollment.findMany({
      where: {
        courseId: result.data.courseId,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                studentId: true,
              },
            },
          },
        },
      },
    })

    // Create session
    const attendanceSession = await db.attendanceSession.create({
      data: {
        courseId: result.data.courseId,
        date: new Date(result.data.date),
        topic: result.data.topic,
      },
    })

    // Auto-create ABSENT records for all enrolled students
    if (enrollments.length > 0) {
      await db.attendance.createMany({
        data: enrollments.map((e) => ({
          sessionId: attendanceSession.id,
          studentId: e.userId,
          status: "ABSENT",
        })),
      })
    }

    // Fetch full session with attendances
    const fullSession = await db.attendanceSession.findUnique({
      where: { id: attendanceSession.id },
      include: {
        course: {
          select: { title: true, code: true },
        },
        attendances: {
          include: {
            student: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    studentId: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return NextResponse.json(
      { success: true, session: fullSession },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create session error:", error)
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    )
  }
}