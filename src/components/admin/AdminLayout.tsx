'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

import OnboardingFlow from '@/components/OnboardingFlow'


interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isDark, setIsDark] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true)

  // Check onboarding status
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!session?.user?.email) {
        setIsCheckingOnboarding(false)
        return
      }

      try {
        const response = await fetch('/api/check-onboarding')
        const data = await response.json()

        if (!data.isOnboarded) {
          setShowOnboarding(true)
        }
      } catch (error) {
        console.error('Failed to check onboarding:', error)
      } finally {
        setIsCheckingOnboarding(false)
      }
    }

    checkOnboarding()
  }, [session])

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

  const adminName = session?.user?.name || 'User'
  const adminImage = session?.user?.image

  if (isCheckingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className={`flex min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingFlow
          userName={adminName}
          userEmail={session?.user?.email || ''}
        />
      )}

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
          adminImage={adminImage}
          isDark={isDark}
          onThemeToggle={toggleTheme}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Page Content */}
        <main className={`p-4 lg:p-6 ${isDark ? 'dark' : ''}`}>
          {children}
        </main>


      </div>
    </div>
  )
}
