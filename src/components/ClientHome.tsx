'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, Palette, Music, Heart, Sparkles, Mail, ArrowRight, Github, Twitter } from 'lucide-react'
import GulaliesIcon from '@/components/GulaliesIcon'

export default function ClientHome({ session }: { session: any }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden font-sans selection:bg-pink-200 selection:text-pink-900">
      {/* Abstract Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-blue-300/30 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center p-4 md:p-8">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center max-w-5xl w-full"
          >
            {/* Hero Section */}
            <motion.div variants={item} className="flex flex-col items-center justify-center gap-6 mb-12">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-20 rounded-full" />
                <GulaliesIcon className="w-24 h-24 md:w-32 md:h-32 text-pink-500 relative z-10 drop-shadow-xl" />
              </motion.div>

              <div>
                <motion.h1
                  className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 mb-6 font-poppins tracking-tight"
                >
                  Gulalies
                </motion.h1>
                <motion.p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                  Send secret, beautiful digital letters <br className="hidden md:block" /> with a touch of whimsy <Sparkles className="inline w-5 h-5 text-yellow-400 mb-1" />
                </motion.p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center mb-20 px-4">
              {!session ? (
                <Link href="/auth/signin" className="group">
                  <button className="relative overflow-hidden w-full sm:w-auto px-10 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-lg shadow-2xl transition-transform transform group-hover:-translate-y-1">
                    <span className="relative z-10 flex items-center gap-2">
                      <Lock className="w-5 h-5" /> Sign In to Start
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/admin/compose" className="group">
                    <button className="relative w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg shadow-lg shadow-pink-500/30 transition-all transform group-hover:shadow-pink-500/50 group-hover:-translate-y-1">
                      <span className="flex items-center gap-2">
                        <Mail className="w-5 h-5" /> Compose Letter
                      </span>
                    </button>
                  </Link>
                  <Link href="/admin/dashboard" className="group">
                    <button className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-lg shadow-sm hover:shadow-md transition-all transform group-hover:-translate-y-1">
                      <span className="flex items-center gap-2">
                        Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 mb-12">
              {[
                {
                  icon: <Lock className="w-8 h-8 text-blue-500" />,
                  title: "Encrypted",
                  desc: "PIN-protected messages that only the recipient can open.",
                  color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
                },
                {
                  icon: <Palette className="w-8 h-8 text-pink-500" />,
                  title: "Beautiful",
                  desc: "Aesthetic themes and handwritten fonts for a personal touch.",
                  color: "bg-pink-50 dark:bg-pink-900/20 border-pink-100 dark:border-pink-800"
                },
                {
                  icon: <Music className="w-8 h-8 text-purple-500" />,
                  title: "Musical",
                  desc: "Add your favorite songs to make memories even sweeter.",
                  color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800"
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={item}
                  whileHover={{ y: -5 }}
                  className={`p-8 rounded-3xl border backdrop-blur-sm ${feature.color} transition-all`}
                >
                  <div className="mb-4 bg-white dark:bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mx-auto md:mx-0">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-xl font-poppins text-center md:text-left">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed text-center md:text-left">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {session && (
              <motion.div variants={item} className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/10 border border-slate-200 dark:border-white/10 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Welcome back, {session.user.name || session.user.email}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="py-8 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50"
        >
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span>© {new Date().getFullYear()} Gulalies</span>
              <span>•</span>
              <Link href="/privacy" className="hover:text-pink-500 transition-colors">Privacy</Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>by <span className="text-pink-600 dark:text-pink-400 font-bold">Pien</span></span>
            </div>
          </div>
        </motion.footer>
      </div>
    </main>
  )
}
