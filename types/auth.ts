// types/auth.ts

import type { DefaultSession } from "next-auth"

export type UserRole =
  | "ADMIN"
  | "LECTURER"
  | "STUDENT"
  | "DEPARTMENT_HEAD"
  | "COURSE_COORDINATOR"
  | "TEACHING_ASSISTANT"

export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PENDING"

export interface SessionUser {
  id: string
  email: string
  role: UserRole
  status: UserStatus
  firstName: string
  lastName: string
  avatar?: string | null
}

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: SessionUser & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    role: UserRole
    status: UserStatus
    firstName: string
    lastName: string
    avatar?: string | null
  }
}