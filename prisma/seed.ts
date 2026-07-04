// prisma/seed.ts
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // ─────────────────────────────────────
  // Create Faculty
  // ─────────────────────────────────────
  const faculty = await prisma.faculty.upsert({
    where: { code: "FOC" },
    update: {},
    create: {
      name: "Faculty of Computing",
      code: "FOC",
      description: "Faculty of Computing at SLIIT",
    },
  })
  console.log("✅ Faculty created:", faculty.name)

  // ─────────────────────────────────────
  // Create Department
  // ─────────────────────────────────────
  const department = await prisma.department.upsert({
    where: { code: "SE" },
    update: {},
    create: {
      name: "Software Engineering",
      code: "SE",
      description: "Department of Software Engineering",
      facultyId: faculty.id,
    },
  })
  console.log("✅ Department created:", department.name)

  // ─────────────────────────────────────
  // Create Admin
  // ─────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@sliit.lk" },
    update: {},
    create: {
      email: "admin@sliit.lk",
      password: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: new Date(),
      profile: {
        create: {
          firstName: "System",
          lastName: "Admin",
          displayName: "Admin",
          gender: "MALE",
        },
      },
    },
  })
  console.log("✅ Admin created:", admin.email)

  // ─────────────────────────────────────
  // Create Lecturer
  // ─────────────────────────────────────
  const lecturerPassword = await bcrypt.hash("Lecturer@123", 12)

  const lecturer = await prisma.user.upsert({
    where: { email: "silva@sliit.lk" },
    update: {},
    create: {
      email: "silva@sliit.lk",
      password: lecturerPassword,
      role: "LECTURER",
      status: "ACTIVE",
      emailVerified: new Date(),
      profile: {
        create: {
          firstName: "Kasun",
          lastName: "Silva",
          displayName: "Dr. Silva",
          employeeId: "EMP001",
          departmentId: department.id,
          gender: "MALE",
        },
      },
    },
  })
  console.log("✅ Lecturer created:", lecturer.email)

  // ─────────────────────────────────────
  // Create Student
  // ─────────────────────────────────────
  const studentPassword = await bcrypt.hash("Student@123", 12)

  const student = await prisma.user.upsert({
    where: { email: "student@sliit.lk" },
    update: {},
    create: {
      email: "student@sliit.lk",
      password: studentPassword,
      role: "STUDENT",
      status: "ACTIVE",
      emailVerified: new Date(),
      profile: {
        create: {
          firstName: "Amal",
          lastName: "Perera",
          displayName: "Amal",
          studentId: "IT21000001",
          departmentId: department.id,
          yearOfStudy: 2,
          gender: "MALE",
        },
      },
    },
  })
  console.log("✅ Student created:", student.email)

  console.log("\n🎉 Seeding completed!")
  console.log("\n📋 Login Credentials:")
  console.log("─────────────────────────────────────────")
  console.log("Admin:    admin@sliit.lk    / Admin@123")
  console.log("Lecturer: silva@sliit.lk    / Lecturer@123")
  console.log("Student:  student@sliit.lk  / Student@123")
  console.log("─────────────────────────────────────────")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })