import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ClientHome from '@/components/ClientHome'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAILS = ["natkevin143@gmail.com", "theseproyt@gmail.com"]

export default async function HomePage() {
  try {
    const session = await getServerSession(authOptions)

    // If logged in, check role from database
    if (session?.user?.email) {
      try {
        // Fetch fresh user data from database to get latest role
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email }
        })

        // Check if user is admin based on email list
        const isAdmin = ADMIN_EMAILS.includes(session.user.email)

        if (isAdmin) {
          redirect('/admin/dashboard')
        } else {
          // Regular users go to compose letter
          redirect('/admin/compose')
        }
      } catch (dbError) {
        // Database error - just show home page
        console.error('Database error in HomePage:', dbError)
      }
    }

    return <ClientHome session={session} />
  } catch (error) {
    console.error('HomePage error:', error)
    // Return basic home page on any error
    return <ClientHome session={null} />
  }
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'
