// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { z } from "zod"

// Validation
const schema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase and number"
    ),
})

export async function POST(req: NextRequest) {
  try {
    // Step 1: Parse body
    const body = await req.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { token, password } = result.data

    // Step 2: Hash the token from URL (same as we did before saving)
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    // Step 3: Find user with this token that hasn't expired
    const user = await db.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date(), // Token must not be expired
        },
      },
    })

    // Step 4: Check token is valid
    if (!user) {
      return NextResponse.json(
        {
          error:
            "Invalid or expired reset token. Please request a new one.",
        },
        { status: 400 }
      )
    }

    // Step 5: Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Step 6: Update password and clear reset token
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,        // Clear token
        resetTokenExpiry: null,  // Clear expiry
      },
    })

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now login.",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Failed to reset password. Please try again." },
      { status: 500 }
    )
  }
}

// Verify token is valid (GET request)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Token is required" },
        { status: 400 }
      )
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    const user = await db.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return NextResponse.json({ valid: false })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error("Token verify error:", error)
    return NextResponse.json({ valid: false })
  }
}