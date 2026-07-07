// app/api/quizzes/[id]/questions/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const questionSchema = z.object({
  question: z.string().min(3),
  type: z.enum(["MCQ", "TRUE_FALSE", "SHORT_ANSWER"]),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1),
  marks: z.number().min(1).default(1),
  explanation: z.string().optional(),
  order: z.number().default(0),
})

export async function POST(
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

    const { id: quizId } = await params
    const body = await req.json()
    const result = questionSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 }
      )
    }

    const question = await db.quizQuestion.create({
      data: {
        ...result.data,
        options: result.data.options || [],
        quizId,
      },
    })

    return NextResponse.json(
      { success: true, question },
      { status: 201 }
    )
  } catch (error) {
    console.error("Add question error:", error)
    return NextResponse.json(
      { error: "Failed to add question" },
      { status: 500 }
    )
  }
}