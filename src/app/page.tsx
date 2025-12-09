import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ClientHome from '@/components/ClientHome'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // If admin is logged in, redirect to dashboard
  if (session?.user.role === 'admin') {
    redirect('/admin/dashboard')
  }

  return <ClientHome session={session} />
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'
