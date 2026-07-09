import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || !["LECTURER", "TEACHING_ASSISTANT"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const courses = await db.course.findMany({
      where: { instructorId: session.user.id },
      select: { id: true, title: true, code: true },
    })

    const courseIds = courses.map((c: { id: string }) => c.id)

    const enrollments = await db.enrollment.findMany({
      where: { courseId: { in: courseIds }, isActive: true },
      include: {
        user: {
          select: {
            id: true, email: true, status: true,
            profile: { select: { firstName: true, lastName: true, studentId: true, yearOfStudy: true } },
          },
        },
        course: { select: { title: true, code: true } },
      },
    })

    const studentMap = new Map()
    for (const e of enrollments) {
      const existing = studentMap.get(e.userId)
      if (existing) {
        existing.courses.push({ code: e.course.code, title: e.course.title })
      } else {
        studentMap.set(e.userId, {
          student: e.user,
          courses: [{ code: e.course.code, title: e.course.title }],
          progress: e.progress,
        })
      }
    }

    return NextResponse.json({ students: Array.from(studentMap.values()), totalStudents: studentMap.size })
  } catch (error) {
    console.error("Lecturer students error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}