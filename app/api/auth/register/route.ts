// app/api/auth/register/route.ts
// API endpoint for user registration
// POST /api/auth/register

import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { z } from "zod"

// ─────────────────────────────────────────
// Validation Schema
// ─────────────────────────────────────────
const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name too long"),
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase and number"
    ),
  role: z.enum(["STUDENT", "LECTURER"]),
  studentId: z.string().optional(),
})

// ─────────────────────────────────────────
// POST Handler
// ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Step 1: Parse request body
    const body = await req.json()

    // Step 2: Validate input
    const validationResult = registerSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const {
      firstName,
      lastName,
      email,
      password,
      role,
      studentId,
    } = validationResult.data

    // Step 3: Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    // Step 4: Check student ID if role is STUDENT
    if (role === "STUDENT" && studentId) {
      const existingStudentId = await db.profile.findUnique({
        where: { studentId },
      })

      if (existingStudentId) {
        return NextResponse.json(
          { error: "This Student ID is already registered" },
          { status: 409 }
        )
      }
    }

    // Step 5: Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Step 6: Create user with profile
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        status: "ACTIVE",
        emailVerified: new Date(), // Auto verify for now
        profile: {
          create: {
            firstName,
            lastName,
            displayName: `${firstName} ${lastName}`,
            studentId:
              role === "STUDENT" ? studentId : undefined,
          },
        },
      },
      include: {
        profile: true,
      },
    })

    // Step 7: Return success (never return password!)
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully!",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}