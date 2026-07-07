// app/api/grades/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"


// GET — Student's own grades
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (session.user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    // Get all enrollments
    const enrollments = await db.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
            credits: true,
          },
        },
      },
    })

    // For each course, collect grades
    const gradeData = await Promise.all(
      enrollments.map(async (enrollment) => {
        // Get assignment submissions with marks
        const submissions =
          await db.assignmentSubmission.findMany({
            where: {
              studentId: session.user.id,
              assignment: {
                courseId: enrollment.courseId,
              },
              status: "GRADED",
            },
            include: {
              assignment: {
                select: {
                  title: true,
                  maxMarks: true,
                },
              },
            },
          })

        // Get quiz attempts
        const quizAttempts = await db.quizAttempt.findMany({
          where: {
            studentId: session.user.id,
            quiz: { courseId: enrollment.courseId },
            submittedAt: { not: null },
          },
          include: {
            quiz: {
              select: {
                title: true,
                passingScore: true,
              },
            },
          },
          orderBy: { score: "desc" },
        })

        // Get published grade record
        const gradeRecord = await db.grade.findFirst({
          where: {
            enrollmentId: enrollment.id,
            studentId: session.user.id,
            publishedAt: { not: null },
          },
        })

        // Calculate totals
        const assignmentTotal = submissions.reduce(
          (sum, s) => sum + (s.marks || 0),
          0
        )
        const assignmentMax = submissions.reduce(
          (sum, s) => sum + s.assignment.maxMarks,
          0
        )

        // Best quiz score
        const bestQuiz = quizAttempts[0]

        return {
          course: enrollment.course,
          assignments: {
            items: submissions.map((s) => ({
              title: s.assignment.title,
              marks: s.marks,
              maxMarks: s.assignment.maxMarks,
            })),
            total: assignmentTotal,
            maxTotal: assignmentMax,
            percentage:
              assignmentMax > 0
                ? Math.round(
                    (assignmentTotal / assignmentMax) * 100
                  )
                : null,
          },
          quizzes: {
            bestScore: bestQuiz?.score ?? null,
            totalAttempts: quizAttempts.length,
          },
          publishedGrade: gradeRecord
            ? {
                marks: gradeRecord.marks,
                grade: gradeRecord.grade,
                gpa: gradeRecord.gpa,
                remarks: gradeRecord.remarks,
                publishedAt: gradeRecord.publishedAt,
              }
            : null,
        }
      })
    )

    return NextResponse.json({ grades: gradeData })
  } catch (error) {
    console.error("Get grades error:", error)
    return NextResponse.json(
      { error: "Failed to get grades" },
      { status: 500 }
    )
  }
}