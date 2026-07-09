// app/api/lecturer/students/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (
      !session?.user ||
      !["LECTURER", "TEACHING_ASSISTANT"].includes(
        session.user.role
      )
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    // Get courses taught by this lecturer
    const courses = await db.course.findMany({
      where: { instructorId: session.user.id },
      select: { id: true, title: true, code: true },
    })

    const courseIds = courses.map(
      (c: { id: string }) => c.id
    )

    // Get all enrolled students
    const enrollments = await db.enrollment.findMany({
      where: {
        courseId: { in: courseIds },
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            status: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                studentId: true,
                avatar: true,
                yearOfStudy: true,
              },
            },
          },
        },
        course: {
          select: { title: true, code: true },
        },
      },
    })

    // Group by student (unique)
    const studentMap = new Map<
      string,
      {
        student: (typeof enrollments)[0]["user"]
        courses: Array<{ code: string; title: string }>
        progress: number
      }
    >()

    for (const enrollment of enrollments) {
      const existing = studentMap.get(enrollment.userId)
      if (existing) {
        existing.courses.push({
          code: enrollment.course.code,
          title: enrollment.course.title,
        })
      } else {
        studentMap.set(enrollment.userId, {
          student: enrollment.user,
          courses: [
            {
              code: enrollment.course.code,
              title: enrollment.course.title,
            },
          ],
          progress: enrollment.progress,
        })
      }
    }

    const students = Array.from(studentMap.values())

    return NextResponse.json({
      students,
      totalStudents: students.length,
      totalCourses: courses.length,
    })
  } catch (error) {
    console.error("Get lecturer students error:", error)
    return NextResponse.json(
      { error: "Failed to get students" },
      { status: 500 }
    )
  }
}