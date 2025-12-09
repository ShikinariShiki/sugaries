import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ClientHome from '@/components/ClientHome'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // If logged in, check role
  if (session?.user) {
    if (session.user.role === 'admin') {
      redirect('/admin/dashboard')
    } else {
      // Regular users go to compose letter
      redirect('/admin/compose')
    }
  }

  return <ClientHome session={session} />
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'
