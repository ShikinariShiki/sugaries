import { notFound } from 'next/navigation'
import LetterClientView from '@/components/LetterClientView'

interface PageProps {
  params: {
    id: string
  }
}

export default function LetterPage({ params }: PageProps) {
  const { id } = params

  // Basic validation
  if (!id) {
    notFound()
  }

  // CRITICAL: We do NOT fetch the letter content here (Server Component)
  // All verification and content fetching happens client-side via API routes
  return <LetterClientView letterId={id} />
}

// Optional: Generate metadata
export async function generateMetadata({ params }: PageProps) {
  return {
    title: 'You have a letter! | Sugaries',
    description: 'Someone sent you an encrypted digital letter',
  }
}
