// app/api/announcements/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const createSchema = z.object({
  title: z.string().min(3, "Title too short"),
  content: z.string().min(10, "Content too short"),
  courseId: z.string().optional(),
  isGlobal: z.boolean().default(false),
})

// GET — Get announcements
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
    const courseId = searchParams.get("courseId")

    const where: Record<string, unknown> = {}

    if (session.user.role === "STUDENT") {
      // Students see global announcements + course announcements
      const enrollments = await db.enrollment.findMany({
        where: { userId: session.user.id },
        select: { courseId: true },
      })
      const courseIds = enrollments.map((e) => e.courseId)

      where.OR = [
        { isGlobal: true },
        { courseId: { in: courseIds } },
      ]
    } else if (courseId) {
      where.courseId = courseId
    }

    const announcements = await db.announcement.findMany({
      where,
      include: {
        author: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            role: true,
          },
        },
        course: {
          select: { title: true, code: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ announcements })
  } catch (error) {
    console.error("Get announcements error:", error)
    return NextResponse.json(
      { error: "Failed to get announcements" },
      { status: 500 }
    )
  }
}

// POST — Create announcement
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (
      !session?.user ||
      !["ADMIN", "LECTURER", "DEPARTMENT_HEAD"].includes(
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
    {
      error: "Validation failed",
      details: result.error.flatten().fieldErrors,
    },
    { status: 400 }
  )
}

    const announcement = await db.announcement.create({
      data: {
        ...result.data,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    // Send notifications to relevant users
    let userIds: string[] = []

    if (result.data.isGlobal) {
      const users = await db.user.findMany({
        where: { status: "ACTIVE" },
        select: { id: true },
      })
      userIds = users.map((u) => u.id)
    } else if (result.data.courseId) {
      const enrollments = await db.enrollment.findMany({
        where: { courseId: result.data.courseId },
        select: { userId: true },
      })
      userIds = enrollments.map((e) => e.userId)
    }

    // Remove author from notifications
    userIds = userIds.filter(
      (id) => id !== session.user.id
    )

    // Create notifications
    if (userIds.length > 0) {
      await db.notification.createMany({
        data: userIds.map((userId) => ({
          userId,
          title: `📢 ${result.data.title}`,
          message: result.data.content.substring(0, 150),
          type: "ANNOUNCEMENT",
          link: "/student/notifications",
        })),
      })
    }

    return NextResponse.json(
      { success: true, announcement },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create announcement error:", error)
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    )
  }
}