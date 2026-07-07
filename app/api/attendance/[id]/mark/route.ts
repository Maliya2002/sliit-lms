// app/api/attendance/[id]/mark/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const markSchema = z.object({
  studentId: z.string(),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: sessionId } = await params
    const body = await req.json()
    const result = markSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      )
    }

    const { studentId, status } = result.data

    // Update or create attendance record
    const attendance = await db.attendance.upsert({
      where: {
        sessionId_studentId: {
          sessionId,
          studentId,
        },
      },
      update: { status },
      create: {
        sessionId,
        studentId,
        status,
      },
    })

    return NextResponse.json({ success: true, attendance })
  } catch (error) {
    console.error("Mark attendance error:", error)
    return NextResponse.json(
      { error: "Failed to mark attendance" },
      { status: 500 }
    )
  }
}

// PATCH — Mark all at once (bulk update)
const bulkSchema = z.object({
  attendances: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
    })
  ),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: sessionId } = await params
    const body = await req.json()
    const result = bulkSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      )
    }

    // Update all attendances
    for (const item of result.data.attendances) {
      await db.attendance.upsert({
        where: {
          sessionId_studentId: {
            sessionId,
            studentId: item.studentId,
          },
        },
        update: { status: item.status },
        create: {
          sessionId,
          studentId: item.studentId,
          status: item.status,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Attendance saved successfully",
    })
  } catch (error) {
    console.error("Bulk mark error:", error)
    return NextResponse.json(
      { error: "Failed to save attendance" },
      { status: 500 }
    )
  }
}