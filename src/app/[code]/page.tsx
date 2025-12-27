import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface PageProps {
  params: Promise<{
    code: string
  }>
}

export default async function ShortCodeRedirect({ params }: PageProps) {
  const { code } = await params

  let letterId: string | null = null

  try {
    // Find letter by short code
    const letter = await prisma.letter.findUnique({
      where: { shortCode: code },
      select: { id: true }
    })

    if (letter) {
      letterId = letter.id
    }
  } catch (error: any) {
    console.error('ShortCode database error:', error)

    // Return error UI for actual errors (like database issues)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 mb-4">
            We couldn't find this letter. Please try again later.
          </p>

          {/* Debug Error Message - Visible to help debugging */}
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm text-left overflow-auto max-h-40 mb-6 font-mono border border-red-200">
            <p className="font-bold">Error Details:</p>
            <p>{error?.message || 'Unknown error'}</p>
            {error?.code && <p>Code: {error.code}</p>}
          </div>

          <Link
            href="/"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  // Handle routing outside try/catch to ensure Next.js errors propagate correctly
  if (!letterId) {
    notFound()
  }

  // Redirect to full letter URL
  redirect(`/letter/${letterId}`)
}
