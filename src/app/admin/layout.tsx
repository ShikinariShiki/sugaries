import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Only allow admins to access admin routes
  if (session.user.role !== 'admin') {
    redirect('/') // Regular users go to home
  }

  return <>{children}</>
}
