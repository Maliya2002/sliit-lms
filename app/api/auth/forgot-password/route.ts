// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/email"
import { z } from "zod"

// Validation
const schema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(req: NextRequest) {
  try {
    // Step 1: Parse and validate body
    const body = await req.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    const { email } = result.data

    // Step 2: Find user
    const user = await db.user.findUnique({
      where: { email },
      include: { profile: true },
    })

    // Step 3: Always return success (security - don't reveal if email exists)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If this email exists, a reset link has been sent.",
      })
    }

    // Step 4: Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex")

    // Step 5: Hash token before saving (extra security)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")

    // Step 6: Save token with 1 hour expiry
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    })

    // Step 7: Send email with UNHASHED token
    await sendPasswordResetEmail({
      email: user.email,
      firstName: user.profile?.firstName ?? "User",
      resetToken: resetToken, // Send original, not hashed
    })

    return NextResponse.json({
      success: true,
      message: "Password reset email sent successfully.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Failed to send reset email. Please try again." },
      { status: 500 }
    )
  }
}