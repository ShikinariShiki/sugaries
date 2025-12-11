import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ClientHome from '@/components/ClientHome'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAILS = ["natkevin143@gmail.com", "theseproyt@gmail.com"]

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // If logged in, check role from database
  if (session?.user?.email) {
    // Fetch fresh user data from database to get latest role
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isOnboarded: true }
    })
    
    // Check if user is admin based on email list
    const isAdmin = ADMIN_EMAILS.includes(session.user.email)
    
    if (isAdmin) {
      redirect('/admin/dashboard')
    } else {
      // Regular users go to user dashboard
      redirect('/user/dashboard')
    }
  }

  return <ClientHome session={session} />
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'

