import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

const ADMIN_EMAILS = ["natkevin143@gmail.com", "theseproyt@gmail.com"]

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Allow all users to sign in
      return true
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Assign admin role to specific emails
        session.user.role = ADMIN_EMAILS.includes(user.email || "") ? "admin" : "user"
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = ADMIN_EMAILS.includes(user.email || "") ? "admin" : "user"
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
