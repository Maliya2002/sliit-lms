// app/api/courses/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import type { Prisma } from "@prisma/client"

const createCourseSchema = z.object({
  title: z.string().min(5).max(100),
  code: z.string().min(3).max(20),
  description: z.string().optional(),
  credits: z.number().min(1).max(6).default(3),
  maxStudents: z.number().min(5).max(500).default(50),
  departmentId: z.string().optional(),
  semesterId: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || ""

  const where: Prisma.CourseWhereInput = {}

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
    ]
  }
  if (status) where.status = status as unknown as Prisma.CourseWhereInput["status"]

  const courses = await db.course.findMany({
    where,
    include: {
      instructor: {
        select: { profile: { select: { firstName: true, lastName: true } } },
      },
      department: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ courses })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "LECTURER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const result = createCourseSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
  }

  const course = await db.course.create({
    data: {
      ...result.data,
      instructorId: session.user.id,
      status: "DRAFT",
    },
  })

  return NextResponse.json({ success: true, course }, { status: 201 })
}