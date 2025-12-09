'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'

interface TopBarProps {
  adminName?: string
  adminImage?: string | null
  onThemeToggle?: () => void
  isDark?: boolean
  onMobileMenuToggle?: () => void
  onSearchChange?: (query: string) => void
}

export default function TopBar({ adminName = 'Admin', adminImage, onThemeToggle, isDark = false, onMobileMenuToggle, onSearchChange }: TopBarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (onSearchChange) {
      onSearchChange(value)
    }
  }

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
    <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Hamburger Menu (Mobile) */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search letters..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-pink-500 focus:outline-none transition-colors text-sm"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onThemeToggle}
            className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
          >
            <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors relative"
            >
              <span className="text-lg">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                        <button 
                          onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                          className="text-xs text-pink-500 hover:text-pink-600"
                        >
                          Mark all read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="text-4xl mb-2">🔕</div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                              notif.unread ? 'bg-pink-50 dark:bg-pink-900/10' : ''
                            }`}
                            onClick={() => {
                              setNotifications(notifications.map(n => 
                                n.id === notif.id ? { ...n, unread: false } : n
                              ))
                              setShowNotifications(false)
                              if (notif.letterId) {
                                window.location.href = `/letter/${notif.letterId}?admin=true`
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">📬</div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-900 dark:text-white font-medium">{notif.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                              </div>
                              {notif.unread && (
                                <div className="w-2 h-2 bg-pink-500 rounded-full mt-1"></div>
                              )}
                            </div>
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
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {adminImage ? (
                <img 
                  src={adminImage} 
                  alt={adminName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  {adminName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{adminName}</span>
              <span className="text-gray-400 text-xs">▼</span>
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
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                  >
                    <a
                      href="/admin/profile"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg">👤</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Settings</span>
                    </a>
                    <a
                      href="/admin/settings"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg">⚙️</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Settings</span>
                    </a>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors w-full text-left"
                    >
                      <span className="text-lg">🚪</span>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">Logout</span>
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
