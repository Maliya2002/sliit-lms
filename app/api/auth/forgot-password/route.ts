// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/email"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"

const schema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 requests per minute per IP
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown"

    const allowed = rateLimit(ip, 5, 60000)

    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "Too many requests. Please try again later.",
        },
        { status: 429 }
      )
    }

    const body = await req.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    const { email } = result.data

    const user = await db.user.findUnique({
      where: { email },
      include: { profile: true },
    })

    // Always return success (security — don't reveal if email exists)
    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "If this email exists, a reset link has been sent.",
      })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")

    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: new Date(
          Date.now() + 60 * 60 * 1000
        ),
      },
    })

    await sendPasswordResetEmail({
      email: user.email,
      firstName: user.profile?.firstName ?? "User",
      resetToken,
    })

    return NextResponse.json({
      success: true,
      message: "Password reset email sent successfully.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      {
        error:
          "Failed to send reset email. Please try again.",
      },
      { status: 500 }
    )
  }
}