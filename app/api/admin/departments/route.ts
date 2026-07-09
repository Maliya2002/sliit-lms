// app/api/admin/departments/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const createSchema = z.object({
  name: z.string().min(3),
  code: z.string().min(2).max(10),
  description: z.string().optional(),
  facultyId: z.string().min(1),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const departments = await db.department.findMany({
      include: {
        faculty: {
          select: { name: true, code: true },
        },
        _count: {
          select: {
            profiles: true,
            courses: true,
            programs: true,
          },
        },
      },
      orderBy: { name: "asc" },
    })

    const faculties = await db.faculty.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ departments, faculties })
  } catch (error) {
    console.error("Get departments error:", error)
    return NextResponse.json(
      { error: "Failed to get departments" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (
      !session?.user ||
      !["ADMIN", "DEPARTMENT_HEAD"].includes(session.user.role)
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const result = createSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      )
    }

    const existing = await db.department.findUnique({
      where: { code: result.data.code },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Department code already exists" },
        { status: 409 }
      )
    }

    const department = await db.department.create({
      data: result.data,
    })

    return NextResponse.json(
      { success: true, department },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create department error:", error)
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 }
    )
  }
}