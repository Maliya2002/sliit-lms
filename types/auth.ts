// types/auth.ts
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      role: string
      status: string
      firstName: string
      lastName: string
      avatar?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    role: string
    status: string
    firstName: string
    lastName: string
    avatar?: string | null
  }
}