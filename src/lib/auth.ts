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
      if (!user.email) {
        console.error('Sign in rejected: No email provided')
        return false
      }

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
        // Log the error with details for debugging
        console.error('Database error during sign in:', error)
        console.error('User email:', user.email)

        // Still allow sign in even if database fails
        // The jwt callback will handle creating/fetching user data
        // This prevents "AccessDenied" errors from temporary DB issues
        return true
      }
    },
    async jwt({ token, user, account }) {
      if (user && user.email) {
        // On sign in, fetch or create user in database
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email }
          })

          // If user doesn't exist (signIn had a DB error), create them now
          if (!dbUser) {
            console.log('Creating user in jwt callback (fallback):', user.email)
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                role: ADMIN_EMAILS.includes(user.email) ? "admin" : "user",
                isOnboarded: false,
              }
            })
          }

          token.id = dbUser.id
          token.email = dbUser.email
          // Always check against ADMIN_EMAILS list for role determination
          token.role = ADMIN_EMAILS.includes(dbUser.email || "") ? "admin" : (dbUser.role as "admin" | "user")
          token.isOnboarded = dbUser.isOnboarded
        } catch (error) {
          console.error('JWT callback database error:', error)
          // Set minimal token data from Google profile
          token.email = user.email
          token.role = ADMIN_EMAILS.includes(user.email) ? "admin" : "user"
          token.isOnboarded = false // Default to false on error
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "admin" | "user"
        // Force type assertion as module augmentation for Session might be needed elsewhere
        // @ts-ignore
        session.user.isOnboarded = token.isOnboarded as boolean
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
