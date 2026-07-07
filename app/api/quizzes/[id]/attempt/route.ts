// app/api/quizzes/[id]/attempt/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const submitSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
    })
  ),
  timeTaken: z.number().optional(),
})

// POST — Start or Submit attempt
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
        { error: "Only students can attempt quizzes" },
        { status: 403 }
      )
    }

    const { id: quizId } = await params
    const body = await req.json()

    // If no answers — just start attempt
    if (!body.answers) {
      const attempt = await db.quizAttempt.create({
        data: {
          quizId,
          studentId: session.user.id,
          startedAt: new Date(),
        },
      })
      return NextResponse.json({ attempt })
    }

    // Submit attempt with answers
    const result = submitSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      )
    }

    // Get quiz with questions
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    })

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      )
    }

    // Get or create attempt
    let attempt = await db.quizAttempt.findFirst({
      where: {
        quizId,
        studentId: session.user.id,
        submittedAt: null,
      },
    })

    if (!attempt) {
      attempt = await db.quizAttempt.create({
        data: {
          quizId,
          studentId: session.user.id,
        },
      })
    }

    // Auto-evaluate answers
    let totalScore = 0
    let maxScore = 0

    const answerData = result.data.answers.map((ans) => {
      const question = quiz.questions.find(
        (q) => q.id === ans.questionId
      )

      if (!question) {
        return {
          attemptId: attempt!.id,
          questionId: ans.questionId,
          answer: ans.answer,
          isCorrect: false,
          marksGained: 0,
        }
      }

      maxScore += question.marks

      const isCorrect =
        ans.answer.trim().toLowerCase() ===
        question.correctAnswer.trim().toLowerCase()

      const marksGained = isCorrect ? question.marks : 0
      totalScore += marksGained

      return {
        attemptId: attempt!.id,
        questionId: ans.questionId,
        answer: ans.answer,
        isCorrect,
        marksGained,
      }
    })

    // Save answers
    await db.quizAnswer.createMany({
      data: answerData,
      skipDuplicates: true,
    })

    // Calculate percentage
    const percentage =
      maxScore > 0
        ? Math.round((totalScore / maxScore) * 100)
        : 0

    const isPassed = percentage >= quiz.passingScore

    // Update attempt
    const updatedAttempt = await db.quizAttempt.update({
      where: { id: attempt.id },
      data: {
        submittedAt: new Date(),
        score: percentage,
        isPassed,
        timeTaken: result.data.timeTaken,
      },
    })

    return NextResponse.json({
      success: true,
      attempt: updatedAttempt,
      score: percentage,
      totalScore,
      maxScore,
      isPassed,
      passingScore: quiz.passingScore,
    })
  } catch (error) {
    console.error("Quiz attempt error:", error)
    return NextResponse.json(
      { error: "Failed to process quiz attempt" },
      { status: 500 }
    )
  }
}