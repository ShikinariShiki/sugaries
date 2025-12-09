'use client'

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">
            🍬 Sugar Snuggles
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Send sweet letters to your loved ones
          </p>
        </div>

        <button
          onClick={() => signIn('google', { callbackUrl: '/admin/dashboard' })}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <FcGoogle className="text-2xl" />
          <span>Continue with Google</span>
        </button>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>By signing in, you agree to our</p>
          <p className="mt-1">
            <a href="#" className="text-pink-600 dark:text-pink-400 hover:underline">Terms of Service</a>
            {' & '}
            <a href="#" className="text-pink-600 dark:text-pink-400 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
