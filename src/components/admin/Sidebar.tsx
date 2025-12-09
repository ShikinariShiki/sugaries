'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import SugariesIcon from '@/components/SugariesIcon'

interface SidebarProps {
  isDark?: boolean
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export default function Sidebar({ isDark = false, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { icon: '🏠', label: 'Dashboard', href: '/admin/dashboard' },
    { icon: '✉️', label: 'Compose', href: '/admin/compose' },
    { icon: '📊', label: 'Statistics', href: '/admin/statistics' },
    { icon: '👤', label: 'Profile', href: '/admin/profile' },
    { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
  ]

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={onMobileClose}>
          <SugariesIcon className="w-8 h-8" />
          <span className={`text-xl font-bold ${isDark ? 'text-pink-400' : 'text-pink-500'}`}>
            Sugaries
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} onClick={onMobileClose}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? `${isDark ? 'bg-pink-600' : 'bg-pink-500'} text-white shadow-md`
                    : `${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className={`hidden lg:flex fixed left-0 top-0 h-screen w-[240px] ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } border-r ${isDark ? 'border-gray-700' : 'border-gray-200'} flex-col z-40`}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween' }}
              className={`lg:hidden fixed left-0 top-0 h-screen w-[240px] ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } border-r ${isDark ? 'border-gray-700' : 'border-gray-200'} flex flex-col z-50`}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
