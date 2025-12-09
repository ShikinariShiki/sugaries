'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MiniMusicPlayer from '@/components/MiniMusicPlayer'

interface AdminLayoutProps {
  children: React.ReactNode
  onSearchChange?: (query: string) => void
}

export default function AdminLayout({ children, onSearchChange }: AdminLayoutProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isDark, setIsDark] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const adminName = session?.user?.email?.split('@')[0] || 'Admin'

  return (
    <div className={`flex min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar 
        isDark={isDark}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-[240px] bg-gray-50 dark:bg-gray-900">{/* Top Bar */}
        <TopBar 
          adminName={adminName}
          isDark={isDark}
          onThemeToggle={toggleTheme}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onSearchChange={onSearchChange}
        />

        {/* Page Content */}
        <main className={`p-4 lg:p-6 ${isDark ? 'dark' : ''}`}>
          {children}
        </main>

        {/* Music Player */}
        <MiniMusicPlayer />
      </div>
    </div>
  )
}
