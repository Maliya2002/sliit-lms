// app/api/assignments/[id]/submissions/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: assignmentId } = await params

    const submissions = await db.assignmentSubmission.findMany(
      {
        where: { assignmentId },
        include: {
          student: {
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
        },
        orderBy: { submittedAt: "desc" },
      }
    )

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Get submissions error:", error)
    return NextResponse.json(
      { error: "Failed to get submissions" },
      { status: 500 }
    )
  }
}