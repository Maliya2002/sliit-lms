import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const enrollments = await db.enrollment.findMany({
      where: { userId: session.user.id, isActive: true },
      include: {
        course: {
          include: {
            instructor: {
              select: { profile: { select: { firstName: true, lastName: true } } },
            },
            department: { select: { name: true } },
            _count: { select: { enrollments: true, assignments: true, quizzes: true, modules: true } },
          },
        },
      },
    })

    const courses = enrollments.map((e) => ({
      id: e.course.id,
      title: e.course.title,
      code: e.course.code,
      description: e.course.description,
      credits: e.course.credits,
      progress: e.progress,
      instructor: e.course.instructor.profile
        ? `${e.course.instructor.profile.firstName} ${e.course.instructor.profile.lastName}`
        : "Unknown",
      department: e.course.department?.name ?? null,
      stats: {
        totalStudents: e.course._count.enrollments,
        assignments: e.course._count.assignments,
        quizzes: e.course._count.quizzes,
        modules: e.course._count.modules,
      },
    }))

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("Student courses error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}