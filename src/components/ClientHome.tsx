'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import SugariesIcon from '@/components/SugariesIcon'

export default function ClientHome({ session }: { session: any }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4 md:p-8">
      <div className="text-center max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <SugariesIcon className="w-20 h-20 md:w-24 md:h-24" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 font-poppins"
        >
          Sugaries
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-2xl text-gray-600 mb-12 font-handwriting px-4"
        >
          Send secret, beautiful digital letters with a touch of whimsy ✨
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4"
        >
          {!session ? (
            <>
              <Link href="/auth/signin" className="flex-1 sm:flex-none">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-poppins font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  🔐 Sign In
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/admin/compose" className="flex-1 sm:flex-none">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-poppins font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  ✉️ Compose a Letter
                </button>
              </Link>
              <Link href="/admin/dashboard" className="flex-1 sm:flex-none">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-gray-50 text-gray-900 font-poppins font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  📊 Dashboard
                </button>
              </Link>
            </>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8"
          >
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="font-bold text-gray-900 mb-3 text-xl font-poppins">Encrypted</h3>
            <p className="text-gray-600 font-poppins">
              PIN-protected messages that only the recipient can open
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8"
          >
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="font-bold text-gray-900 mb-3 text-xl font-poppins">Beautiful</h3>
            <p className="text-gray-600 font-poppins">
              Aesthetic themes and handwritten fonts for personal touch
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8"
          >
            <div className="text-5xl mb-4">🎵</div>
            <h3 className="font-bold text-gray-900 mb-3 text-xl font-poppins">Musical</h3>
            <p className="text-gray-600 font-poppins">
              Add your favorite songs to make memories even sweeter
            </p>
          </motion.div>
        </div>

        {session && (
          <div className="mt-8">
            <p className="text-gray-600">
              Welcome back, {session.user.email}!
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
