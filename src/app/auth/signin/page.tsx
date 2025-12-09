'use client'

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-24 h-24 mx-auto mb-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl flex items-center justify-center"
          >
            <span className="text-5xl">✉️</span>
          </motion.div>
          
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-3">
            Sugaries
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-handwriting">
            Send secret, beautiful digital letters with a touch of whimsy ✨
          </p>
        </div>

        {/* Sign In Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Welcome Back!</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">Sign in to continue your journey</p>

          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-4 px-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 transition-all duration-200 shadow-md hover:shadow-xl hover:scale-[1.02]"
          >
            <FcGoogle className="text-2xl" />
            <span>Continue with Google</span>
          </button>

          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/legal/terms" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/legal/privacy" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">PIN Protected</p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl mb-2">🎨</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Beautiful Design</p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl mb-2">🎵</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Add Music</p>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2024 Sugaries. Made with love 💖
        </p>
      </motion.div>
    </div>
  )
}
