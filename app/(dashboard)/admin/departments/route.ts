import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const departments = await db.department.findMany({
      include: {
        faculty: { select: { name: true, code: true } },
        _count: { select: { profiles: true, courses: true, programs: true } },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ departments })
  } catch (error) {
    console.error("Get departments error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}