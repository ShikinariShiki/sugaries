import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: {
    code: string
  }
}

export default async function ShortCodeRedirect({ params }: PageProps) {
  const { code } = params

  // Find letter by short code
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
