// app/api/analytics/route.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()

    if (
      !session?.user ||
      !["ADMIN", "DEPARTMENT_HEAD", "COURSE_COORDINATOR"].includes(
        session.user.role
      )
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    // ─────────────────────────────────────────
    // Overview Stats
    // ─────────────────────────────────────────
    const [
      totalUsers,
      totalStudents,
      totalLecturers,
      totalCourses,
      totalEnrollments,
      totalAssignments,
      totalQuizzes,
      totalSubmissions,
      totalQuizAttempts,
      totalNotifications,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: "STUDENT" } }),
      db.user.count({ where: { role: "LECTURER" } }),
      db.course.count(),
      db.enrollment.count(),
      db.assignment.count(),
      db.quiz.count(),
      db.assignmentSubmission.count(),
      db.quizAttempt.count({ where: { submittedAt: { not: null } } }),
      db.notification.count(),
    ])

    // ─────────────────────────────────────────
    // Published Counts
    // ─────────────────────────────────────────
    const [
      publishedCourses,
      publishedAssignments,
      publishedQuizzes,
      passedQuizzes,
    ] = await Promise.all([
      db.course.count({ where: { status: "PUBLISHED" } }),
      db.assignment.count({ where: { status: "PUBLISHED" } }),
      db.quiz.count({ where: { status: "PUBLISHED" } }),
      db.quizAttempt.count({
        where: {
          submittedAt: { not: null },
          isPassed: true,
        },
      }),
    ])

    // ─────────────────────────────────────────
    // User Growth (last 6 months)
    // ─────────────────────────────────────────
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const usersByMonth = await db.user.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      _count: { id: true },
    })

    // Group by month
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]

    const monthlyData: Record<string, number> = {}
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      monthlyData[key] = 0
    }

    usersByMonth.forEach((item) => {
      const date = new Date(item.createdAt)
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      if (key in monthlyData) {
        monthlyData[key] += item._count.id
      }
    })

    const userGrowth = Object.entries(monthlyData).map(
      ([month, count]) => ({
        month,
        users: count,
      })
    )

    // ─────────────────────────────────────────
    // Course Enrollment Stats
    // ─────────────────────────────────────────
    const courseEnrollments = await db.course.findMany({
      where: { status: "PUBLISHED" },
      select: {
        code: true,
        title: true,
        maxStudents: true,
        _count: { select: { enrollments: true } },
      },
      take: 6,
    })

    const enrollmentData = courseEnrollments.map((c) => ({
      course: c.code,
      title: c.title,
      enrolled: c._count.enrollments,
      capacity: c.maxStudents,
    }))

    // ─────────────────────────────────────────
    // Assignment Submission Stats
    // ─────────────────────────────────────────
    const [submitted, graded, late] = await Promise.all([
      db.assignmentSubmission.count({
        where: { status: "SUBMITTED" },
      }),
      db.assignmentSubmission.count({
        where: { status: "GRADED" },
      }),
      db.assignmentSubmission.count({
        where: { status: "LATE" },
      }),
    ])

    const notSubmitted = Math.max(
      0,
      totalEnrollments - totalSubmissions
    )

    const submissionData = [
      { name: "Submitted", value: submitted, color: "#2563eb" },
      { name: "Graded", value: graded, color: "#059669" },
      { name: "Late", value: late, color: "#d97706" },
      { name: "Pending", value: notSubmitted, color: "#e2e8f0" },
    ]

    // ─────────────────────────────────────────
    // Quiz Pass Rate
    // ─────────────────────────────────────────
    const quizPassRate =
      totalQuizAttempts > 0
        ? Math.round((passedQuizzes / totalQuizAttempts) * 100)
        : 0

    // ─────────────────────────────────────────
    // Role Distribution
    // ─────────────────────────────────────────
    const roleData = [
      { name: "Students", value: totalStudents, color: "#2563eb" },
      { name: "Lecturers", value: totalLecturers, color: "#d97706" },
      {
        name: "Other",
        value: totalUsers - totalStudents - totalLecturers,
        color: "#7c3aed",
      },
    ]

    // ─────────────────────────────────────────
    // Recent Activity
    // ─────────────────────────────────────────
    const [recentUsers, recentSubmissions, recentAttempts] =
      await Promise.all([
        db.user.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
        db.assignmentSubmission.findMany({
          take: 5,
          orderBy: { submittedAt: "desc" },
          include: {
            student: {
              select: {
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
            assignment: {
              select: { title: true },
            },
          },
        }),
        db.quizAttempt.findMany({
          take: 5,
          where: { submittedAt: { not: null } },
          orderBy: { submittedAt: "desc" },
          include: {
            student: {
              select: {
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
            quiz: {
              select: { title: true },
            },
          },
        }),
      ])

    const recentActivity = [
      ...recentUsers.map((u) => ({
        type: "user_joined",
        message: `${u.profile?.firstName} ${u.profile?.lastName} joined as ${u.role}`,
        time: u.createdAt.toISOString(),
        icon: "👤",
      })),
      ...recentSubmissions.map((s) => ({
        type: "assignment_submitted",
        message: `${s.student.profile?.firstName} submitted ${s.assignment.title}`,
        time: s.submittedAt.toISOString(),
        icon: "📝",
      })),
      ...recentAttempts.map((a) => ({
        type: "quiz_taken",
        message: `${a.student.profile?.firstName} completed ${a.quiz.title} — ${a.score}%`,
        time: a.submittedAt!.toISOString(),
        icon: "📊",
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.time).getTime() - new Date(a.time).getTime()
      )
      .slice(0, 10)

    return NextResponse.json({
      overview: {
        totalUsers,
        totalStudents,
        totalLecturers,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        totalAssignments,
        publishedAssignments,
        totalQuizzes,
        publishedQuizzes,
        totalSubmissions,
        totalQuizAttempts,
        quizPassRate,
        totalNotifications,
      },
      userGrowth,
      enrollmentData,
      submissionData,
      roleData,
      recentActivity,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json(
      { error: "Failed to get analytics" },
      { status: 500 }
    )
  }
}