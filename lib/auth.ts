// lib/auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import type { UserRole, UserStatus } from "@/types/auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // ─────────────────────────────────────────
  // Session Strategy
  // ─────────────────────────────────────────
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  // ─────────────────────────────────────────
  // Custom Pages
  // ─────────────────────────────────────────
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // ─────────────────────────────────────────
  // Providers
  // ─────────────────────────────────────────
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          // Step 1: Validate inputs
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // Step 2: Find user in database
          const user = await db.user.findUnique({
            where: {
              email: credentials.email as string,
            },
            include: {
              profile: true,
            },
          })

          // Step 3: User not found
          if (!user) {
            return null
          }

          // Step 4: Check status
          if (
            user.status === "SUSPENDED" ||
            user.status === "INACTIVE"
          ) {
            return null
          }

          // Step 5: Verify password
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isValid) {
            return null
          }

          // Step 6: Update last login
          await db.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          })

          // Step 7: Return user object
          return {
            id: user.id,
            email: user.email,
            role: user.role as UserRole,
            status: user.status as UserStatus,
            firstName: user.profile?.firstName ?? "",
            lastName: user.profile?.lastName ?? "",
            avatar: user.profile?.avatar ?? null,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],

  // ─────────────────────────────────────────
  // Callbacks
  // ─────────────────────────────────────────
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role as string
        token.status = user.status as string
        token.firstName = user.firstName as string
        token.lastName = user.lastName as string
        token.avatar = user.avatar as string | null
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.status = token.status as UserStatus
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.avatar = token.avatar as string | null
      }
      return session
    },
  },
})