// app/api/grades/[courseId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { calculateGrade } from "@/lib/grade-calculator"
import { z } from "zod"

const gradeSchema = z.object({
  studentId: z.string(),
  marks: z.number().min(0).max(1000),
  maxMarks: z.number().min(1).default(100),
  remarks: z.string().optional(),
  publish: z.boolean().default(false),
})

// GET — Gradebook for a course
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
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

    const { courseId } = await params

    const course = await db.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        code: true,
        credits: true,
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    const enrollments = await db.enrollment.findMany({
      where: { courseId, isActive: true },
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
                avatar: true,
              },
            },
          },
        },
        grades: true,
      },
    })

    const assignments = await db.assignment.findMany({
      where: { courseId, status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        maxMarks: true,
      },
    })

    const quizzes = await db.quiz.findMany({
      where: { courseId, status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        passingScore: true,
      },
    })

    const gradebook = await Promise.all(
      enrollments.map(async (enrollment) => {
        const submissions =
          await db.assignmentSubmission.findMany({
            where: {
              studentId: enrollment.userId,
              assignmentId: {
                in: assignments.map((a) => a.id),
              },
            },
            select: {
              assignmentId: true,
              marks: true,
              status: true,
            },
          })

        const quizAttempts = await db.quizAttempt.findMany({
          where: {
            studentId: enrollment.userId,
            quizId: { in: quizzes.map((q) => q.id) },
            submittedAt: { not: null },
          },
          orderBy: { score: "desc" },
          select: {
            quizId: true,
            score: true,
            isPassed: true,
          },
        })

        const publishedGrade = enrollment.grades[0]

        return {
          student: enrollment.user,
          enrollmentId: enrollment.id,
          assignments: assignments.map((a) => {
            const sub = submissions.find(
              (s) => s.assignmentId === a.id
            )
            return {
              assignmentId: a.id,
              title: a.title,
              maxMarks: a.maxMarks,
              marks: sub?.marks ?? null,
              submitted: !!sub,
              graded: sub?.status === "GRADED",
            }
          }),
          quizzes: quizzes.map((q) => {
            const attempt = quizAttempts.find(
              (a) => a.quizId === q.id
            )
            return {
              quizId: q.id,
              title: q.title,
              score: attempt?.score ?? null,
              isPassed: attempt?.isPassed ?? null,
            }
          }),
          publishedGrade: publishedGrade
            ? {
                marks: publishedGrade.marks,
                grade: publishedGrade.grade,
                gpa: publishedGrade.gpa,
                remarks: publishedGrade.remarks,
                publishedAt: publishedGrade.publishedAt,
              }
            : null,
        }
      })
    )

    return NextResponse.json({
      course,
      assignments,
      quizzes,
      gradebook,
    })
  } catch (error) {
    console.error("Gradebook error:", error)
    return NextResponse.json(
      { error: "Failed to get gradebook" },
      { status: 500 }
    )
  }
}

// POST — Save or publish a grade
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
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

    const { courseId } = await params
    const body = await req.json()
    const result = gradeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 }
      )
    }

    const { studentId, marks, maxMarks, remarks, publish } =
      result.data

    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: studentId,
          courseId,
        },
      },
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: "Student not enrolled" },
        { status: 404 }
      )
    }

    const gradeResult = calculateGrade(marks, maxMarks)

    // ✅ safer than upsert on enrollmentId
    const existingGrade = await db.grade.findFirst({
      where: { enrollmentId: enrollment.id },
    })

    let grade

    if (existingGrade) {
      grade = await db.grade.update({
        where: { id: existingGrade.id },
        data: {
          marks,
          grade: gradeResult.letterGrade,
          gpa: gradeResult.gradePoint,
          remarks: remarks || gradeResult.remarks,
          publishedAt: publish ? new Date() : existingGrade.publishedAt,
        },
      })
    } else {
      grade = await db.grade.create({
        data: {
          enrollmentId: enrollment.id,
          studentId,
          courseId,
          marks,
          grade: gradeResult.letterGrade,
          gpa: gradeResult.gradePoint,
          remarks: remarks || gradeResult.remarks,
          publishedAt: publish ? new Date() : null,
        },
      })
    }

    return NextResponse.json({
      success: true,
      grade,
    })
  } catch (error) {
    console.error("Submit grade error:", error)
    return NextResponse.json(
      { error: "Failed to submit grade" },
      { status: 500 }
    )
  }
}