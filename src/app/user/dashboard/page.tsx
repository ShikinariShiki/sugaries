'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import OnboardingFlow from '@/components/OnboardingFlow'

interface Letter {
  id: string
  recipientName: string
  content: string
  createdAt: string
  isOpened: boolean
  isReply?: boolean
  senderName?: string
  rating?: number
  letterColor?: string
  letterFont?: string
  shortCode?: string
}

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sentLetters, setSentLetters] = useState<Letter[]>([])
  const [receivedLetters, setReceivedLetters] = useState<Letter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [checkingOnboarding, setCheckingOnboarding] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchLetters()
      checkOnboarding()
    }
  }, [status])

  const checkOnboarding = async () => {
    try {
      const res = await fetch('/api/check-onboarding')
      const data = await res.json()
      
      if (!data.isOnboarded) {
        setShowOnboarding(true)
      }
    } catch (error) {
      console.error('Failed to check onboarding:', error)
    } finally {
      setCheckingOnboarding(false)
    }
  }

  const fetchLetters = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/letter/list')
      const data = await response.json()
      
      if (response.ok) {
        setSentLetters(data.sent || [])
        setReceivedLetters(data.received || [])
      }
    } catch (error) {
      console.error('Failed to fetch letters:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const letters = activeTab === 'sent' ? sentLetters : receivedLetters

  // Show onboarding if needed
  if (showOnboarding && status === 'authenticated') {
    return (
      <OnboardingFlow 
        userName={session?.user?.name || ''} 
        userEmail={session?.user?.email || ''} 
      />
    )
  }

  if (status === 'loading' || isLoading || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✉️</span>
              <h1 className="text-2xl font-bold text-pink-500">Gulalies</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/user/profile"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                    {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                  {session?.user?.name || 'Profile'}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Send beautiful letters or check your messages
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <Link href="/admin/compose">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-pink-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✍️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Compose Letter</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Send a secret message</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/user/profile">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Profile</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Update your information</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Letters Sent</p>
            <p className="text-3xl font-bold text-pink-500">{sentLetters.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Received</p>
            <p className="text-3xl font-bold text-purple-500">{receivedLetters.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Opened</p>
            <p className="text-3xl font-bold text-green-500">
              {sentLetters.filter(l => l.isOpened).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Replies</p>
            <p className="text-3xl font-bold text-blue-500">
              {receivedLetters.filter(l => l.isReply).length}
            </p>
          </div>
        </motion.div>

        {/* Letters List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('sent')}
              className={`pb-3 px-4 font-semibold transition-colors relative ${
                activeTab === 'sent'
                  ? 'text-pink-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Sent Letters
              {activeTab === 'sent' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`pb-3 px-4 font-semibold transition-colors relative ${
                activeTab === 'received'
                  ? 'text-purple-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Received Letters
              {activeTab === 'received' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                />
              )}
            </button>
          </div>

          {/* Letters Grid */}
          <AnimatePresence mode="wait">
            {letters.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <span className="text-6xl mb-4 block">📭</span>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {activeTab === 'sent' ? 'No letters sent yet' : 'No letters received yet'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-4"
              >
                {letters.map((letter) => (
                  <Link
                    key={letter.id}
                    href={activeTab === 'sent' ? `/letter/${letter.id}` : `/${letter.shortCode || letter.id}`}
                    className="block"
                  >
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-pink-500 dark:hover:border-pink-500 transition-all hover:shadow-md">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {activeTab === 'sent' ? `To: ${letter.recipientName}` : `From: ${letter.senderName || 'Anonymous'}`}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                            {letter.content.substring(0, 100)}...
                          </p>
                        </div>
                        <div className="ml-4 text-right">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(letter.createdAt)}
                          </span>
                          {activeTab === 'sent' && (
                            <div className="mt-1">
                              {letter.isOpened ? (
                                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                                  ✓ Opened
                                </span>
                              ) : (
                                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                                  Pending
                                </span>
                              )}
                            </div>
                          )}
                          {letter.rating && (
                            <div className="mt-1">
                              <span className="text-xs text-yellow-500">
                                {'⭐'.repeat(letter.rating)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  )
}

