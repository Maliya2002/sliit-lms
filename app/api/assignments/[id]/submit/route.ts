// app/api/assignments/[id]/submit/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const submitSchema = z.object({
  content: z.string().optional(),
  fileUrl: z.string().optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (
      !session?.user ||
      session.user.role !== "STUDENT"
    ) {
      return NextResponse.json(
        { error: "Only students can submit" },
        { status: 403 }
      )
    }

    const { id: assignmentId } = await params

    // Check assignment exists and is published
    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId },
    })

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      )
    }

    if (assignment.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Assignment is not open for submission" },
        { status: 400 }
      )
    }

    // Check if already submitted
    const existing = await db.assignmentSubmission.findUnique(
      {
        where: {
          assignmentId_studentId: {
            assignmentId,
            studentId: session.user.id,
          },
        },
      }
    )

    const body = await req.json()
    const result = submitSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid submission data" },
        { status: 400 }
      )
    }

    if (!result.data.content && !result.data.fileUrl) {
      return NextResponse.json(
        { error: "Please provide content or file" },
        { status: 400 }
      )
    }

    // Check if late
    const isLate = new Date() > assignment.dueDate
    const status = isLate ? "LATE" : "SUBMITTED"

    if (isLate && !assignment.allowLate) {
      return NextResponse.json(
        { error: "Submission deadline has passed" },
        { status: 400 }
      )
    }

    let submission

    if (existing) {
      // Update existing submission
      submission = await db.assignmentSubmission.update({
        where: { id: existing.id },
        data: {
          content: result.data.content,
          fileUrl: result.data.fileUrl,
          status: "RESUBMITTED",
          submittedAt: new Date(),
        },
      })
    } else {
      // Create new submission
      submission = await db.assignmentSubmission.create({
        data: {
          assignmentId,
          studentId: session.user.id,
          content: result.data.content,
          fileUrl: result.data.fileUrl,
          status,
        },
      })
    }

    return NextResponse.json(
      { success: true, submission },
      { status: 201 }
    )
  } catch (error) {
    console.error("Submit error:", error)
    return NextResponse.json(
      { error: "Failed to submit assignment" },
      { status: 500 }
    )
  }
}