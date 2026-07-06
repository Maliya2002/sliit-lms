// app/api/submissions/[id]/grade/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const gradeSchema = z.object({
  marks: z.number().min(0),
  feedback: z.string().optional(),
})

export async function PUT(
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

    const { id: submissionId } = await params
    const body = await req.json()
    const result = gradeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid grade data" },
        { status: 400 }
      )
    }

    const submission = await db.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        marks: result.data.marks,
        feedback: result.data.feedback,
        status: "GRADED",
        gradedAt: new Date(),
        gradedById: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      submission,
    })
  } catch (error) {
    console.error("Grade submission error:", error)
    return NextResponse.json(
      { error: "Failed to grade submission" },
      { status: 500 }
    )
  }
}