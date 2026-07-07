// app/api/attendance/student/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (
      !session?.user ||
      session.user.role !== "STUDENT"
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    // Get all enrollments for this student
    const enrollments = await db.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          select: { id: true, title: true, code: true },
        },
      },
    })

    // For each course, calculate attendance
    const attendanceData = await Promise.all(
      enrollments.map(async (enrollment) => {
        // Get all sessions for this course
        const totalSessions =
          await db.attendanceSession.count({
            where: { courseId: enrollment.courseId },
          })

        // Get student's attendance records
        const attended = await db.attendance.count({
          where: {
            studentId: session.user.id,
            session: {
              courseId: enrollment.courseId,
            },
            status: { in: ["PRESENT", "LATE"] },
          },
        })

        const absent = await db.attendance.count({
          where: {
            studentId: session.user.id,
            session: {
              courseId: enrollment.courseId,
            },
            status: "ABSENT",
          },
        })

        const percentage =
          totalSessions > 0
            ? Math.round((attended / totalSessions) * 100)
            : 0

        // Get recent records
        const recentRecords = await db.attendance.findMany({
          where: {
            studentId: session.user.id,
            session: {
              courseId: enrollment.courseId,
            },
          },
          include: {
            session: {
              select: {
                date: true,
                topic: true,
              },
            },
          },
          orderBy: {
            session: { date: "desc" },
          },
          take: 5,
        })

        return {
          course: enrollment.course,
          totalSessions,
          attended,
          absent,
          percentage,
          recentRecords,
        }
      })
    )

    return NextResponse.json({
      attendance: attendanceData,
    })
  } catch (error) {
    console.error("Student attendance error:", error)
    return NextResponse.json(
      { error: "Failed to get attendance" },
      { status: 500 }
    )
  }
}