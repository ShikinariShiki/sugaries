'use client'

import { MusicProvider } from "@/context/MusicContext"
import { MusicPlayerWithQueue } from "@/components/MusicPlayerWithQueue"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()

  // We need to handle auth here client-side because MusicProvider uses Context which is client-only
  // Or we can keep the server-side check but we need 'use client' for the provider anyway.
  // Actually, let's just make the layout client-side for simplicity as it wraps client context.

  if (status === 'loading') {
    return null // or a loading spinner
  }

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <MusicProvider>
      {children}
      <MusicPlayerWithQueue />
    </MusicProvider>
  )
}
