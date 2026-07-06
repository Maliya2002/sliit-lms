// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

// ─────────────────────────────────────────
// GET — Get all users with filters
// ─────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    // Auth check
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Only admin can access
    const adminRoles = [
      "ADMIN",
      "DEPARTMENT_HEAD",
      "COURSE_COORDINATOR",
    ]
    if (!adminRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    // Get query params
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || ""
    const status = searchParams.get("status") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build filter
    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          profile: {
            OR: [
              {
                firstName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      ]
    }

    if (role) where.role = role
    if (status) where.status = status

    // Query database
    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        include: {
          profile: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
              studentId: true,
              employeeId: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.user.count({ where }),
    ])

    // Get stats
    const [totalActive, totalPending, totalSuspended] =
      await Promise.all([
        db.user.count({ where: { status: "ACTIVE" } }),
        db.user.count({ where: { status: "PENDING" } }),
        db.user.count({ where: { status: "SUSPENDED" } }),
      ])

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt.toISOString(),
        lastLogin: u.lastLogin?.toISOString() ?? null,
        profile: u.profile,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total: await db.user.count(),
        active: totalActive,
        pending: totalPending,
        suspended: totalSuspended,
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json(
      { error: "Failed to get users" },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────
// PATCH — Update user status
// ─────────────────────────────────────────
const patchSchema = z.object({
  userId: z.string(),
  status: z.enum([
    "ACTIVE",
    "INACTIVE",
    "SUSPENDED",
    "PENDING",
  ]),
})

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const adminRoles = ["ADMIN", "DEPARTMENT_HEAD"]
    if (!adminRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const result = patchSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      )
    }

    const { userId, status } = result.data

    // Cannot change own status
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot change your own status" },
        { status: 400 }
      )
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { status },
    })

    return NextResponse.json({
      success: true,
      message: `User status updated to ${status}`,
      user: { id: updated.id, status: updated.status },
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────
// DELETE — Delete user
// ─────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      )
    }

    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      )
    }

    await db.user.delete({ where: { id: userId } })

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}