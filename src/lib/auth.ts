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
        const isAdmin = ADMIN_EMAILS.includes(user.email)
        const dbUser = await prisma.user.upsert({
          where: { email: user.email },
          update: {
            // Do NOT overwrite name on sign in to preserve custom profile names
            // name: user.name,
            // Do NOT overwrite image on sign in to preserve custom profile pictures
            // image: user.image, 
            // Always sync admin role from ADMIN_EMAILS list
            ...(isAdmin ? { role: "admin" } : {}),
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
            role: isAdmin ? "admin" : "user",
            isOnboarded: false,
          }
        })

        // Store the database user ID
        user.id = dbUser.id
        // @ts-ignore
        user.role = dbUser.role

        return true
      } catch (error) {
        console.error('Database error during sign in:', error)
        return true
      }
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.email = user.email
        // @ts-ignore
        token.role = user.role || (ADMIN_EMAILS.includes(user.email || "") ? "admin" : "user")
      }

      // Note: We deliberately do NOT update the token on 'update' trigger
      // nor do we store name/picture in the token.
      // This keeps the cookie size small and prevents "Header too large" errors.
      // The session callback handles fetching fresh data from DB.

      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
        session.user.role = token.role as "admin" | "user"

        // Fetch fresh profile data from database every time
        // This ensures the custom profile picture (even if base64) is always displayed correctly
        // without bloating the session cookie.
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string }
          })

          if (dbUser) {
            session.user.name = dbUser.name
            session.user.image = dbUser.image
            // @ts-ignore
            session.user.role = ADMIN_EMAILS.includes(dbUser.email || "") ? "admin" : dbUser.role
            // @ts-ignore
            session.user.isOnboarded = dbUser.isOnboarded
          }
        } catch (error) {
          console.error('Failed to fetch user data for session:', error)
        }
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
