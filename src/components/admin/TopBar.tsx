'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'

interface TopBarProps {
  adminName?: string
  adminImage?: string | null
  onThemeToggle?: () => void
  isDark?: boolean
  onMobileMenuToggle?: () => void
}

const GREETINGS = {
  morning: [
    "Rise and shine! ☀️", "Morning sunshine! 🌻", "Ready to slay? 💅", "Coffee first? ☕",
    "New day, new goals! 🚀", "Good morning, star! ✨", "Wakey wakey! 🍳",
    "Top of the mornin'! 🎩", "Hello, early bird! 🐦", "Let's get this bread! 🥖"
  ],
  afternoon: [
    "Good afternoon! 🌤️", "Keep glowing! ✨", "You're doing great! 💖", "Lunch break? 🥗",
    "Halfway there! 🏁", "Stay hydrated! 💧", "Afternoon vibes! 🎵",
    "Keep the energy up! ⚡", "Don't stop now! 💪", "Sun's out! 😎"
  ],
  evening: [
    "Good evening! 🌆", "Unwind time! 🍷", "Dinner plans? 🍝", "Relax mode: ON 🛋️",
    "Sunset vibes 🧡", "Almost done! 🏠", "Chilling time? 🍃",
    "Evening glow ✨", "Wrap it up! 🎁", "Cozy vibes 🧸"
  ],
  night: [
    "Sweet dreams soon? 🌙", "Night owl mode! 🦉", "Burning the oil! 🕯️", "Time to rest? 💤",
    "Starry night! 🌠", "Late night grind! 💻", "Sleepy yet? 🥱",
    "Moon's out! 🌕", "Rest your eyes! 👁️", "Good night! 😴"
  ]
}

export default function TopBar({ adminName = 'Admin', adminImage, onThemeToggle, isDark = false, onMobileMenuToggle }: TopBarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    // Determine time of day and pick random greeting
    const hour = new Date().getHours()
    let timeOfDay: keyof typeof GREETINGS = 'night'
    if (hour >= 5 && hour < 12) timeOfDay = 'morning'
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon'
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening'

    const options = GREETINGS[timeOfDay]
    // Use day of year to consistent rotation or just random? User said "random" effectively.
    // Random is better for variety.
    setGreeting(options[Math.floor(Math.random() * options.length)])
  }, [])

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications')
        const data = await response.json()
        if (response.ok) {
          setNotifications(data.notifications || [])
          setUnreadCount(data.unreadCount || 0)
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      }
    }

    fetchNotifications()
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 px-4 lg:px-6 py-4 transition-all">
      {/* Gradient Line at Top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-400" />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Greeting (Desktop/Tablet) */}
          <div className="hidden sm:block">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 uppercase tracking-wider font-poppins">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <span className="text-lg font-bold text-gray-800 dark:text-gray-100 font-poppins">
                {greeting}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onThemeToggle}
            className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-pink-50 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-all border border-gray-200 dark:border-gray-600"
          >
            <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-pink-50 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-all border border-gray-200 dark:border-gray-600 relative"
            >
              <span className="text-lg">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-bold text-gray-900 dark:text-white font-poppins">Notifications</h3>
                      <button
                        onClick={() => {
                          setNotifications(notifications.map(n => ({ ...n, unread: false })))
                          setUnreadCount(0)
                          fetch('/api/notifications', { method: 'POST' }).catch(console.error)
                        }}
                        className="text-xs font-medium text-pink-500 hover:text-pink-600 transition-colors"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="text-4xl mb-3 opacity-50">🔕</div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm font-poppins">No new notifications</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer flex gap-4 ${notif.unread ? 'bg-pink-50/30 dark:bg-pink-900/10' : ''
                              }`}
                            onClick={async () => {
                              setNotifications(notifications.map(n =>
                                n.id === notif.id ? { ...n, unread: false } : n
                              ))
                              setShowNotifications(false)
                              fetch('/api/notifications', { method: 'POST' }).catch(console.error)
                              if (notif.letterId) {
                                window.location.href = `/letter/${notif.letterId}?admin=true`
                              }
                            }}
                          >
                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 text-xl">
                              📬
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 dark:text-white font-medium font-poppins line-clamp-2 leading-relaxed">
                                {notif.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                                {notif.time}
                              </p>
                            </div>
                            {notif.unread && (
                              <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 shrink-0"></div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
            >
              {adminImage ? (
                <img
                  src={adminImage}
                  alt={adminName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-100 dark:ring-pink-900"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {adminName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Hello,</p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-none">{adminName}</p>
              </div>
              <span className="text-gray-400 text-xs ml-1">▼</span>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-60 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{adminName}</p>
                    </div>

                    <a
                      href="/admin/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg bg-blue-50 dark:bg-blue-900/20 w-8 h-8 rounded-lg flex items-center justify-center">👤</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-poppins">Profile Settings</span>
                    </a>
                    <a
                      href="/admin/settings"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg bg-purple-50 dark:bg-purple-900/20 w-8 h-8 rounded-lg flex items-center justify-center">⚙️</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-poppins">Settings</span>
                    </a>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-2" />
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full text-left"
                    >
                      <span className="text-lg bg-red-50 dark:bg-red-900/20 w-8 h-8 rounded-lg flex items-center justify-center">🚪</span>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400 font-poppins">Logout</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
