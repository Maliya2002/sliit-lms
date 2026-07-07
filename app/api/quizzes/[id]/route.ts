// app/api/quizzes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  duration: z.number().min(5).max(180).optional(),
  passingScore: z.number().min(0).max(100).optional(),
  status: z
    .enum(["DRAFT", "PUBLISHED", "CLOSED"])
    .optional(),
  shuffleQuestions: z.boolean().optional(),
  showResults: z.boolean().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    const quiz = await db.quiz.findUnique({
      where: { id },
      include: {
        course: {
          select: { title: true, code: true },
        },
        questions: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { attempts: true },
        },
      },
    })

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ quiz })
  } catch (error) {
    console.error("Get quiz error:", error)
    return NextResponse.json(
      { error: "Failed to get quiz" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const result = updateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 }
      )
    }

    const quiz = await db.quiz.update({
      where: { id },
      data: result.data,
    })

    return NextResponse.json({ success: true, quiz })
  } catch (error) {
    console.error("Update quiz error:", error)
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const { id } = await params
    await db.quiz.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete quiz error:", error)
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    )
  }
}