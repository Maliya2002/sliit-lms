// lib/auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const user = await db.user.findUnique({
            where: { email: credentials.email as string },
            include: { profile: true },
          })

          if (!user) return null

          if (
            user.status === "SUSPENDED" ||
            user.status === "INACTIVE"
          ) {
            return null
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isValid) return null

          await db.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          })

          return {
            id: user.id,
            email: user.email,
            role: user.role as string,
            status: user.status as string,
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.status = user.status
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.avatar = user.avatar
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.status = token.status as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.avatar = token.avatar as string | null
      }
      return session
    },
  },
})