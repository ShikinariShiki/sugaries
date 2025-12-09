'use client'

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-pink-500 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-3xl flex items-center justify-center shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <span className="text-6xl">✉️</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4">SUGARIES</h1>
          <p className="text-xl opacity-90 font-light">
            Create Your Shorten Links, Customize Anytime
          </p>
          
          <div className="mt-12 space-y-4 text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <h3 className="font-semibold mb-1">Beautiful Letters</h3>
                <p className="text-sm opacity-75">Send personalized digital letters with style</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-semibold mb-1">Secure & Private</h3>
                <p className="text-sm opacity-75">PIN-protected messages for your loved ones</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <h3 className="font-semibold mb-1">Fully Customizable</h3>
                <p className="text-sm opacity-75">Add music, images, and personal touches</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 text-sm opacity-75">
          © 2024 Sugaries. All Rights Reserved. Made with love by Sugaries Team!
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500 mb-2">
              ✉️ Sugaries
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign Up</h2>
            <p className="text-gray-600 dark:text-gray-400">Enter your email and password to sign up!</p>
          </div>

          <button
            onClick={() => signIn('google', { callbackUrl: '/admin/dashboard' })}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3.5 px-6 rounded-xl border border-gray-300 dark:border-gray-600 transition-all duration-200 shadow-sm hover:shadow-md mb-6"
          >
            <FcGoogle className="text-2xl" />
            <span>Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">or</span>
            </div>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="simple@mail.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Min. 8 characters (mix of letters & numbers)"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="terms" className="rounded border-gray-300" />
              <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Sign In
            </Link>
          </p>

          <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>By signing in or continuing, you agree to our</p>
            <p className="mt-1">
              <Link href="/legal/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link>
              {' and '}
              <Link href="/legal/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact Us</Link>
            <span>•</span>
            <Link href="/legal/terms" className="hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">Our Instagram</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
