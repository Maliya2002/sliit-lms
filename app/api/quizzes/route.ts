// app/api/quizzes/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  courseId: z.string().min(1),
  duration: z.number().min(5).max(180),
  maxAttempts: z.number().min(1).max(10).default(1),
  passingScore: z.number().min(0).max(100).default(50),
  shuffleQuestions: z.boolean().default(false),
  showResults: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const role = session.user.role

    let quizzes

    if (role === "STUDENT") {
      const enrollments = await db.enrollment.findMany({
        where: { userId: session.user.id },
        select: { courseId: true },
      })
      const courseIds = enrollments.map((e) => e.courseId)

      quizzes = await db.quiz.findMany({
        where: {
          courseId: { in: courseIds },
          status: "PUBLISHED",
        },
        include: {
          course: {
            select: { title: true, code: true },
          },
          _count: { select: { questions: true } },
          attempts: {
            where: { studentId: session.user.id },
            select: {
              id: true,
              score: true,
              isPassed: true,
              submittedAt: true,
              startedAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      const where: Record<string, unknown> =
        role === "LECTURER"
          ? { course: { instructorId: session.user.id } }
          : {}

      quizzes = await db.quiz.findMany({
        where,
        include: {
          course: {
            select: { title: true, code: true },
          },
          _count: {
            select: { questions: true, attempts: true },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    }

    return NextResponse.json({ quizzes })
  } catch (error) {
    console.error("Get quizzes error:", error)
    return NextResponse.json(
      { error: "Failed to get quizzes" },
      { status: 500 }
    )
  }
}

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
        { error: result.error.flatten() },
        { status: 400 }
      )
    }

    const quiz = await db.quiz.create({
      data: {
        ...result.data,
        startDate: result.data.startDate
          ? new Date(result.data.startDate)
          : null,
        endDate: result.data.endDate
          ? new Date(result.data.endDate)
          : null,
        status: "DRAFT",
      },
    })

    return NextResponse.json(
      { success: true, quiz },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create quiz error:", error)
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    )
  }
}