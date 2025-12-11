import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{
    code: string
  }>
}

export default async function ShortCodeRedirect({ params }: PageProps) {
  const { code } = await params

  // First check if it's an inbox code (multiple letters)
  const inboxLetters = await prisma.letter.findMany({
    where: { inboxCode: code },
    select: { id: true, messageIndex: true },
    orderBy: { messageIndex: 'asc' }
  })

  if (inboxLetters.length > 0) {
    // It's an inbox - redirect to first letter with inbox info
    redirect(`/letter/${inboxLetters[0].id}?inbox=${code}`)
  }

  // Otherwise check if it's a shortCode
  const letter = await prisma.letter.findUnique({
    where: { shortCode: code },
    select: { id: true }
  })

  if (!letter) {
    notFound()
  }

  // Redirect to full letter URL
  redirect(`/letter/${letter.id}`)
}
