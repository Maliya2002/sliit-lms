// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

// ─────────────────────────────────────────
// GET — Get current user profile
// ─────────────────────────────────────────
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Return safe data (no password!)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      profile: user.profile,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────
// PUT — Update profile
// ─────────────────────────────────────────
const updateSchema = z.object({
  firstName: z.string().min(2, "Min 2 characters").max(50),
  lastName: z.string().min(2, "Min 2 characters").max(50),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  bio: z.string().max(500, "Max 500 characters").optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
})

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const result = updateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const {
      firstName,
      lastName,
      phone,
      address,
      bio,
      dateOfBirth,
      gender,
    } = result.data

    // Update profile
    const updatedProfile = await db.profile.update({
      where: { userId: session.user.id },
      data: {
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        phone: phone || null,
        address: address || null,
        bio: bio || null,
        dateOfBirth: dateOfBirth
          ? new Date(dateOfBirth)
          : null,
        gender: gender || null,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      profile: updatedProfile,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}