import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./prisma"

const ADMIN_EMAILS = ["natkevin143@gmail.com", "theseproyt@gmail.com"]

export const authOptions: NextAuthOptions = {
  // Remove adapter to use pure JWT authentication
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false
      
      try {
        // Create or update user in database
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
    async jwt({ token, user, account }) {
      if (user) {
        // On sign in, fetch user from database to get the ID
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        
        if (dbUser) {
          token.id = dbUser.id
          token.email = dbUser.email
          // Always check against ADMIN_EMAILS list for role determination
          token.role = ADMIN_EMAILS.includes(dbUser.email || "") ? "admin" : dbUser.role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "admin" | "user"
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
