// prisma/seed.ts
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prismaClient = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...\n")

  // ─────────────────────────────────────
  // 1. Faculty
  // ─────────────────────────────────────
  const faculty = await prismaClient.faculty.upsert({
    where: { code: "FOC" },
    update: {},
    create: {
      name: "Faculty of Computing",
      code: "FOC",
      description: "Faculty of Computing at SLIIT",
    },
  })
  console.log("✅ Faculty:", faculty.name)

  // ─────────────────────────────────────
  // 2. Department
  // ─────────────────────────────────────
  const department = await prismaClient.department.upsert({
    where: { code: "SE" },
    update: {},
    create: {
      name: "Software Engineering",
      code: "SE",
      description: "Department of Software Engineering",
      facultyId: faculty.id,
    },
  })
  console.log("✅ Department:", department.name)

  // ─────────────────────────────────────
  // 3. Users
  // ─────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@123", 12)
  const lecturerPassword = await bcrypt.hash("Lecturer@123", 12)
  const studentPassword = await bcrypt.hash("Student@123", 12)
  const student2Password = await bcrypt.hash("Student@123", 12)

  const admin = await prismaClient.user.upsert({
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
  console.log("✅ Admin:", admin.email)

  const lecturer = await prismaClient.user.upsert({
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
  console.log("✅ Lecturer:", lecturer.email)

  const student = await prismaClient.user.upsert({
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
  console.log("✅ Student:", student.email)

  const student2 = await prismaClient.user.upsert({
    where: { email: "sanduni@sliit.lk" },
    update: {},
    create: {
      email: "sanduni@sliit.lk",
      password: student2Password,
      role: "STUDENT",
      status: "ACTIVE",
      emailVerified: new Date(),
      profile: {
        create: {
          firstName: "Sanduni",
          lastName: "Fernando",
          displayName: "Sanduni",
          studentId: "IT21000002",
          departmentId: department.id,
          yearOfStudy: 2,
          gender: "FEMALE",
        },
      },
    },
  })
  console.log("✅ Student 2:", student2.email)

  // ─────────────────────────────────────
  // 4. Courses
  // ─────────────────────────────────────
  const course1 = await prismaClient.course.upsert({
    where: { code: "SE3040" },
    update: {},
    create: {
      title: "Software Engineering",
      code: "SE3040",
      description:
        "Learn software development methodologies, design patterns, and best practices.",
      status: "PUBLISHED",
      credits: 4,
      maxStudents: 50,
      instructorId: lecturer.id,
      departmentId: department.id,
    },
  })
  console.log("✅ Course:", course1.code)

  const course2 = await prismaClient.course.upsert({
    where: { code: "IT3030" },
    update: {},
    create: {
      title: "Database Management Systems",
      code: "IT3030",
      description:
        "Comprehensive study of relational databases, SQL, and normalization.",
      status: "PUBLISHED",
      credits: 3,
      maxStudents: 45,
      instructorId: lecturer.id,
      departmentId: department.id,
    },
  })
  console.log("✅ Course:", course2.code)

  const course3 = await prismaClient.course.upsert({
    where: { code: "IT3050" },
    update: {},
    create: {
      title: "Web Technologies",
      code: "IT3050",
      description:
        "Modern web development with React, Next.js, and TypeScript.",
      status: "PUBLISHED",
      credits: 3,
      maxStudents: 50,
      instructorId: lecturer.id,
      departmentId: department.id,
    },
  })
  console.log("✅ Course:", course3.code)

  const course4 = await prismaClient.course.upsert({
    where: { code: "IT3020" },
    update: {},
    create: {
      title: "Computer Networks",
      code: "IT3020",
      description:
        "Study of computer networking fundamentals and protocols.",
      status: "DRAFT",
      credits: 3,
      maxStudents: 40,
      instructorId: lecturer.id,
      departmentId: department.id,
    },
  })
  console.log("✅ Course:", course4.code)

  // ─────────────────────────────────────
  // 5. Enrollments
  // ─────────────────────────────────────
  const enrollmentData = [
    { userId: student.id, courseId: course1.id },
    { userId: student.id, courseId: course2.id },
    { userId: student.id, courseId: course3.id },
    { userId: student2.id, courseId: course1.id },
    { userId: student2.id, courseId: course2.id },
  ]

  for (const enroll of enrollmentData) {
    await prismaClient.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: enroll.userId,
          courseId: enroll.courseId,
        },
      },
      update: {},
      create: {
        userId: enroll.userId,
        courseId: enroll.courseId,
        progress: Math.floor(Math.random() * 70) + 10,
      },
    })
  }
  console.log("✅ Enrollments: 5 created")

  // ─────────────────────────────────────
  // 6. Assignments
  // ─────────────────────────────────────
  const assignment1 = await prismaClient.assignment.upsert({
    where: { id: "seed-assignment-1" },
    update: {},
    create: {
      id: "seed-assignment-1",
      title: "Software Design Document",
      description:
        "Create a comprehensive software design document for your group project.",
      instructions:
        "1. Use draw.io for UML diagrams\n2. Include class, sequence, and deployment diagrams\n3. Minimum 10 pages\n4. Submit as PDF",
      courseId: course1.id,
      createdById: lecturer.id,
      status: "PUBLISHED",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxMarks: 100,
      allowLate: true,
      latePenalty: 10,
      fileTypes: [],
    },
  })
  console.log("✅ Assignment:", assignment1.title)

  const assignment2 = await prismaClient.assignment.upsert({
    where: { id: "seed-assignment-2" },
    update: {},
    create: {
      id: "seed-assignment-2",
      title: "ER Diagram & Database Schema",
      description:
        "Design an ER diagram and implement the database schema for an online shopping system.",
      instructions:
        "1. Draw ER diagram with at least 8 entities\n2. Write CREATE TABLE SQL\n3. Include sample INSERT data\n4. Submit .sql file",
      courseId: course2.id,
      createdById: lecturer.id,
      status: "PUBLISHED",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      maxMarks: 50,
      allowLate: false,
      fileTypes: [],
    },
  })
  console.log("✅ Assignment:", assignment2.title)

  const assignment3 = await prismaClient.assignment.upsert({
    where: { id: "seed-assignment-3" },
    update: {},
    create: {
      id: "seed-assignment-3",
      title: "React Portfolio Website",
      description:
        "Build a personal portfolio website using React and Next.js.",
      instructions:
        "1. Use Next.js App Router\n2. Minimum 5 pages\n3. Responsive design\n4. Deploy on Vercel\n5. Submit GitHub link",
      courseId: course3.id,
      createdById: lecturer.id,
      status: "PUBLISHED",
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      maxMarks: 100,
      allowLate: true,
      latePenalty: 5,
      fileTypes: [],
    },
  })
  console.log("✅ Assignment:", assignment3.title)

  // ─────────────────────────────────────
  // 7. Quizzes
  // ─────────────────────────────────────
  const quiz1 = await prismaClient.quiz.upsert({
    where: { id: "seed-quiz-1" },
    update: {},
    create: {
      id: "seed-quiz-1",
      title: "Database Fundamentals Quiz",
      description:
        "Test your knowledge on database concepts, SQL, and normalization.",
      courseId: course2.id,
      status: "PUBLISHED",
      duration: 30,
      maxAttempts: 2,
      passingScore: 50,
      shuffleQuestions: true,
      showResults: true,
    },
  })
  console.log("✅ Quiz:", quiz1.title)

  // Quiz 1 Questions
  const quiz1Questions = [
    {
      question: "What is a Primary Key?",
      type: "MCQ",
      options: [
        "A unique identifier for each record in a table",
        "A foreign key reference to another table",
        "A column that allows NULL values",
        "An index on a table",
      ],
      correctAnswer: "A unique identifier for each record in a table",
      marks: 2,
      explanation: "A primary key uniquely identifies each record and cannot be NULL.",
      order: 1,
    },
    {
      question: "Which SQL command is used to retrieve data?",
      type: "MCQ",
      options: ["SELECT", "INSERT", "UPDATE", "DELETE"],
      correctAnswer: "SELECT",
      marks: 1,
      explanation: "SELECT is used to query data from a database.",
      order: 2,
    },
    {
      question: "Normalization helps reduce data redundancy.",
      type: "TRUE_FALSE",
      options: [],
      correctAnswer: "True",
      marks: 1,
      explanation: "Normalization minimizes redundancy and dependency.",
      order: 3,
    },
    {
      question: "What does SQL stand for?",
      type: "MCQ",
      options: [
        "Structured Query Language",
        "Simple Query Language",
        "Standard Query Logic",
        "Sequential Query Language",
      ],
      correctAnswer: "Structured Query Language",
      marks: 1,
      explanation: "SQL stands for Structured Query Language.",
      order: 4,
    },
    {
      question: "Which normal form eliminates transitive dependencies?",
      type: "MCQ",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correctAnswer: "3NF",
      marks: 2,
      explanation: "Third Normal Form (3NF) eliminates transitive dependencies.",
      order: 5,
    },
    {
      question: "A foreign key references the primary key of another table.",
      type: "TRUE_FALSE",
      options: [],
      correctAnswer: "True",
      marks: 1,
      explanation: "A foreign key creates a link between two tables.",
      order: 6,
    },
    {
      question: "Which JOIN returns all records from both tables?",
      type: "MCQ",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
      correctAnswer: "FULL OUTER JOIN",
      marks: 2,
      explanation: "FULL OUTER JOIN returns all records from either table.",
      order: 7,
    },
  ]

  for (const q of quiz1Questions) {
    await prismaClient.quizQuestion.create({
      data: {
        question: q.question,
        type: q.type as "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER" | "ESSAY",
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: q.marks,
        explanation: q.explanation,
        order: q.order,
        quizId: quiz1.id,
      },
    })
  }
  console.log(`  → Added ${quiz1Questions.length} questions to Database Quiz`)

  // Quiz 2 — Web Technologies
  const quiz2 = await prismaClient.quiz.upsert({
    where: { id: "seed-quiz-2" },
    update: {},
    create: {
      id: "seed-quiz-2",
      title: "Web Technologies Quiz",
      description:
        "Test your knowledge on HTML, CSS, JavaScript, React, and Next.js.",
      courseId: course3.id,
      status: "PUBLISHED",
      duration: 20,
      maxAttempts: 1,
      passingScore: 60,
      shuffleQuestions: false,
      showResults: true,
    },
  })
  console.log("✅ Quiz:", quiz2.title)

  const quiz2Questions = [
    {
      question: "What does HTML stand for?",
      type: "MCQ",
      options: [
        "HyperText Markup Language",
        "High Tech Modern Language",
        "HyperText Modern Language",
        "Home Tool Markup Language",
      ],
      correctAnswer: "HyperText Markup Language",
      marks: 1,
      explanation: "HTML stands for HyperText Markup Language.",
      order: 1,
    },
    {
      question: "React is a JavaScript library for building user interfaces.",
      type: "TRUE_FALSE",
      options: [],
      correctAnswer: "True",
      marks: 1,
      explanation: "React is a JavaScript library for building UI.",
      order: 2,
    },
    {
      question: "Which hook is used for state management in React?",
      type: "MCQ",
      options: ["useState", "useEffect", "useContext", "useRef"],
      correctAnswer: "useState",
      marks: 2,
      explanation: "useState is the primary hook for managing state.",
      order: 3,
    },
    {
      question: "Next.js supports Server-Side Rendering.",
      type: "TRUE_FALSE",
      options: [],
      correctAnswer: "True",
      marks: 1,
      explanation: "Next.js supports SSR, SSG, and ISR strategies.",
      order: 4,
    },
    {
      question: "Which CSS property creates a flex container?",
      type: "MCQ",
      options: ["display: flex", "position: flex", "layout: flex", "flex: container"],
      correctAnswer: "display: flex",
      marks: 1,
      explanation: "display: flex creates a flex container.",
      order: 5,
    },
  ]

  for (const q of quiz2Questions) {
    await prismaClient.quizQuestion.create({
      data: {
        question: q.question,
        type: q.type as "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER" | "ESSAY",
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: q.marks,
        explanation: q.explanation,
        order: q.order,
        quizId: quiz2.id,
      },
    })
  }
  console.log(`  → Added ${quiz2Questions.length} questions to Web Tech Quiz`)

  // Quiz 3 — Draft
  const quiz3 = await prismaClient.quiz.upsert({
    where: { id: "seed-quiz-3" },
    update: {},
    create: {
      id: "seed-quiz-3",
      title: "Software Engineering Concepts",
      description:
        "Test your understanding of SDLC, Agile, and Design Patterns.",
      courseId: course1.id,
      status: "DRAFT",
      duration: 45,
      maxAttempts: 1,
      passingScore: 50,
      shuffleQuestions: false,
      showResults: true,
    },
  })
  console.log("✅ Quiz:", quiz3.title, "(Draft)")

  // ─────────────────────────────────────
  // 8. Sample Submission
  // ─────────────────────────────────────
  await prismaClient.assignmentSubmission.upsert({
    where: {
      assignmentId_studentId: {
        assignmentId: assignment2.id,
        studentId: student.id,
      },
    },
    update: {},
    create: {
      assignmentId: assignment2.id,
      studentId: student.id,
      content:
        "Here is my ER diagram for the online shopping system with 10 entities including User, Product, Category, Order, OrderItem, Payment, Review, Address, Cart, and CartItem.",
      status: "SUBMITTED",
    },
  })
  console.log("✅ Sample submission created")

  // ─────────────────────────────────────
  // Done
  // ─────────────────────────────────────
  console.log("\n🎉 Seeding completed!\n")
  console.log("📋 Login Credentials:")
  console.log("──────────────────────────────────────")
  console.log("Admin:    admin@sliit.lk     / Admin@123")
  console.log("Lecturer: silva@sliit.lk     / Lecturer@123")
  console.log("Student:  student@sliit.lk   / Student@123")
  console.log("Student:  sanduni@sliit.lk   / Student@123")
  console.log("──────────────────────────────────────")
  console.log("\n📚 Courses: 4 (3 Published + 1 Draft)")
  console.log("📊 Quizzes: 3 (2 Published + 1 Draft)")
  console.log("📝 Assignments: 3 (All Published)")
  console.log("👥 Enrollments: 5")
  console.log("──────────────────────────────────────")
}

main()
  .catch((e: Error) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prismaClient.$disconnect()
  })