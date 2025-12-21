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

  try {
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
  } catch (error) {
    console.error('ShortCode redirect error:', error)

    // Return error UI instead of crashing
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't find this letter. Please try again later.
          </p>
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
}
