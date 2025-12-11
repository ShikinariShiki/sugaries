import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

const ADMIN_EMAILS = ["natkevin143@gmail.com", "theseproyt@gmail.com"]

export const authOptions: NextAuthOptions = {
  // Remove adapter to use pure JWT authentication
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error("Invalid email or password")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Invalid email or password")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role as "user" | "admin",
          isOnboarded: user.isOnboarded,
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false
      
      // Skip database operations for credentials provider (already handled in authorize)
      if (account?.provider === "credentials") {
        return true
      }
      
      try {
        // For OAuth providers (Google), create or update user in database
        const dbUser = await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            image: user.image,
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
            role: ADMIN_EMAILS.includes(user.email) ? "admin" : "user",
            isOnboarded: false,
          }
        })
        
        // Store the database user ID
        user.id = dbUser.id
        
        return true
      } catch (error) {
        console.error('Sign in error:', error)
        return false
      }
    },
    async jwt({ token, user, account, trigger, session }) {
      // On sign in or when session is updated
      if (user) {
        // On sign in, fetch user from database to get the ID
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        
        if (dbUser) {
          token.id = dbUser.id
          token.email = dbUser.email
          token.name = dbUser.name
          token.image = dbUser.image
          // Always check against ADMIN_EMAILS list for role determination
          token.role = ADMIN_EMAILS.includes(dbUser.email || "") ? "admin" : (dbUser.role as "admin" | "user")
        }
      }
      
      // If session update is triggered (e.g., from update() call), refresh user data
      if (trigger === "update" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string }
        })
        
        if (dbUser) {
          token.name = dbUser.name
          token.image = dbUser.image
          token.role = ADMIN_EMAILS.includes(dbUser.email || "") ? "admin" : (dbUser.role as "admin" | "user")
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "admin" | "user"
        session.user.name = token.name as string
        session.user.image = token.image as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
