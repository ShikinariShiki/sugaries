'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, Palette, Music, Sparkles, Heart } from 'lucide-react'
import GulaliesIcon from '@/components/GulaliesIcon'
import { FcGoogle } from 'react-icons/fc'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-pink-200 selection:text-pink-900">
      {/* Abstract Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative w-24 h-24 mx-auto mb-6"
          >
            <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-20 rounded-full" />
            <GulaliesIcon className="w-full h-full text-pink-500 relative z-10 drop-shadow-xl" />
          </motion.div>

          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 mb-3 font-poppins tracking-tight">
            Gulalies
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
            Send secret, beautiful digital letters <br /> with a touch of whimsy <Sparkles className="inline w-4 h-4 text-yellow-500" />
          </p>
        </div>

        {/* Sign In Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-white/10 p-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center font-poppins">Welcome Back!</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Sign in to continue your journey</p>

          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full group relative overflow-hidden flex items-center justify-center gap-3 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-4 px-6 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
          >
            <FcGoogle className="text-2xl" />
            <span>Continue with Google</span>
          </button>

          <div className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
              <Link href="/privacy" className="hover:text-pink-500 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <a href="mailto:shikimanmaru@gmail.com" className="hover:text-pink-500 transition-colors">
                Contact
              </a>
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
          <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-white/5">
            <Lock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">Secure</p>
          </div>
          <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-white/5">
            <Palette className="w-6 h-6 mx-auto mb-2 text-pink-500" />
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">Beautiful</p>
          </div>
          <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-white/5">
            <Music className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">Musical</p>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> by <span className="text-pink-600 dark:text-pink-400 font-bold">Pien</span>
        </p>
      </motion.div>
    </div>
  )
}
