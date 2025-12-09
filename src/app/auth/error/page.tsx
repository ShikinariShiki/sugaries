'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Authentication Error
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error === 'Configuration' && 'There is a problem with the server configuration.'}
            {error === 'AccessDenied' && 'You do not have permission to sign in.'}
            {error === 'Verification' && 'The verification token has expired or has already been used.'}
            {!error && 'An error occurred during authentication.'}
          </p>
          <Link
            href="/auth/signin"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  )
}
