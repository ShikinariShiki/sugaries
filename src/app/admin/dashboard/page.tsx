'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperCard } from '@/components/ui/PaperCard'
import { SquishButton } from '@/components/ui/SquishButton'
import SugariesIcon from '@/components/SugariesIcon'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Letter {
  id: string
  recipientName: string
  content: string
  createdAt: string
  isOpened: boolean
  isReply?: boolean
  senderName?: string
  pinHash?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [sentLetters, setSentLetters] = useState<Letter[]>([])
  const [receivedLetters, setReceivedLetters] = useState<Letter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent')
  const [previewLetter, setPreviewLetter] = useState<Letter | null>(null)
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null)
  const [editContent, setEditContent] = useState('')
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    fetchLetters()
  }, [])

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
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDelete = async (letterId: string) => {
    if (!confirm('Are you sure you want to delete this letter?')) return

    try {
      const response = await fetch(`/api/letter/${letterId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchLetters()
        setPreviewLetter(null)
      }
    } catch (error) {
      console.error('Failed to delete letter:', error)
    }
  }

  const handleEdit = (letter: Letter) => {
    setEditingLetter(letter)
    setEditContent(letter.content)
    setPreviewLetter(null)
  }

  const handleUpdate = async () => {
    if (!editingLetter) return

    try {
      const response = await fetch(`/api/letter/${editingLetter.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      })

      if (response.ok) {
        fetchLetters()
        setEditingLetter(null)
      }
    } catch (error) {
      console.error('Failed to update letter:', error)
    }
  }

  const totalSent = sentLetters.length
  const totalReceived = receivedLetters.length
  const openedSent = sentLetters.filter(l => l.isOpened).length
  const unreadReceived = receivedLetters.filter(l => !l.isOpened).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 gap-3">
            <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
              <Link href="/">
                <button className="p-2 hover:bg-white/50 rounded-lg transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </Link>
              <div className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0">
                <SugariesIcon className="w-full h-full" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 font-poppins truncate">
                  Dashboard
                </h1>
                <p className="text-gray-600 font-poppins text-xs md:text-base truncate">
                  Manage your letters
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <Link href="/admin/compose">
                <SquishButton variant="primary" size="lg">
                  <span className="hidden md:inline">✉️ Compose New</span>
                  <span className="md:hidden">✉️</span>
                </SquishButton>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 md:px-6 md:py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200 text-xs md:text-base whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl md:text-2xl">📤</span>
                <span className="text-[10px] md:text-sm text-gray-500 font-poppins">Sent</span>
              </div>
              <p className="text-xl md:text-3xl font-bold text-gray-900 font-poppins">{totalSent}</p>
              <p className="text-[10px] md:text-xs text-gray-500 font-poppins mt-1">{openedSent} opened</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl md:text-2xl">📥</span>
                <span className="text-[10px] md:text-sm text-gray-500 font-poppins">Received</span>
              </div>
              <p className="text-xl md:text-3xl font-bold text-gray-900 font-poppins">{totalReceived}</p>
              <p className="text-[10px] md:text-xs text-gray-500 font-poppins mt-1">{unreadReceived} unread</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl md:text-2xl">💌</span>
                <span className="text-[10px] md:text-sm text-gray-500 font-poppins">Total</span>
              </div>
              <p className="text-xl md:text-3xl font-bold text-gray-900 font-poppins">{totalSent + totalReceived}</p>
              <p className="text-[10px] md:text-xs text-gray-500 font-poppins mt-1">All letters</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm hover:shadow-md transition-shadow text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl md:text-2xl">✨</span>
                <span className="text-[10px] md:text-sm font-poppins opacity-90">Open Rate</span>
              </div>
              <p className="text-xl md:text-3xl font-bold font-poppins">
                {totalSent > 0 ? Math.round((openedSent / totalSent) * 100) : 0}%
              </p>
              <p className="text-[10px] md:text-xs opacity-90 font-poppins mt-1">Success rate</p>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm overflow-x-auto">
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 min-w-[120px] px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all font-poppins text-xs md:text-base whitespace-nowrap ${
                activeTab === 'sent'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="hidden md:inline">📤 Sent Letters</span>
              <span className="md:hidden">📤 Sent</span>
              <span className="ml-2 text-xs opacity-75">({totalSent})</span>
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 min-w-[120px] px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all font-poppins text-xs md:text-base whitespace-nowrap ${
                activeTab === 'received'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="hidden md:inline">📥 Received</span>
              <span className="md:hidden">📥 Received</span>
              <span className="ml-2 text-xs opacity-75">({totalReceived})</span>
            </button>
          </div>
        </div>

        {/* Letters List */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
              <p className="text-gray-500 font-poppins">Loading letters...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTab === 'sent' && sentLetters.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center"
              >
                <div className="text-6xl mb-4">✉️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">No letters sent yet</h3>
                <p className="text-gray-500 mb-6 font-poppins">
                  Start by composing your first letter!
                </p>
                <Link href="/admin/compose">
                  <SquishButton variant="primary" size="lg">
                    ✉️ Compose First Letter
                  </SquishButton>
                </Link>
              </motion.div>
            )}

            {activeTab === 'received' && receivedLetters.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center"
              >
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">No letters received yet</h3>
                <p className="text-gray-500 font-poppins">
                  Letters sent to you will appear here.
                </p>
              </motion.div>
            )}

            {activeTab === 'sent' &&
              sentLetters.map((letter, index) => (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-all p-3 md:p-6 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                            {letter.recipientName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm md:text-lg font-bold text-gray-900 font-poppins truncate">
                              {letter.recipientName}
                            </h3>
                            <p className="text-[10px] md:text-xs text-gray-500 font-poppins">
                              {formatDate(letter.createdAt)}
                            </p>
                          </div>
                        </div>
                        {letter.isOpened ? (
                          <span className="px-2 py-1 md:px-3 bg-green-100 text-green-700 text-[10px] md:text-xs rounded-full font-poppins font-medium whitespace-nowrap">
                            ✓ Opened
                          </span>
                        ) : (
                          <span className="px-2 py-1 md:px-3 bg-yellow-100 text-yellow-700 text-[10px] md:text-xs rounded-full font-poppins font-medium whitespace-nowrap">
                            ⏳ Pending
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs md:text-sm mb-2 font-poppins line-clamp-2">
                        {letter.content.substring(0, 120)}
                        {letter.content.length > 120 ? '...' : ''}
                      </p>
                      {letter.pinHash && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md">
                          <span className="text-[10px] md:text-xs text-gray-600 font-poppins">🔑 PIN Protected</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 w-full md:w-auto md:flex-col">
                      <button 
                        onClick={() => setPreviewLetter(letter)}
                        className="flex-1 md:flex-none px-3 md:px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-poppins text-xs md:text-sm transition-colors whitespace-nowrap"
                      >
                        👁️ Preview
                      </button>
                      <Link href={`/letter/${letter.id}?admin=true`} className="flex-1 md:flex-none">
                        <button className="w-full px-3 md:px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-poppins text-xs md:text-sm transition-all whitespace-nowrap">
                          View →
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}

            {activeTab === 'received' &&
              receivedLetters.map((letter, index) => (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-all p-3 md:p-6 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                            {(letter.senderName || letter.recipientName).charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm md:text-lg font-bold text-gray-900 font-poppins truncate">
                              {letter.senderName || letter.recipientName}
                            </h3>
                            <p className="text-[10px] md:text-xs text-gray-500 font-poppins">
                              {formatDate(letter.createdAt)}
                            </p>
                          </div>
                        </div>
                        {letter.isOpened ? (
                          <span className="px-2 py-1 md:px-3 bg-blue-100 text-blue-700 text-[10px] md:text-xs rounded-full font-poppins font-medium whitespace-nowrap">
                            ✓ Read
                          </span>
                        ) : (
                          <span className="px-2 py-1 md:px-3 bg-pink-100 text-pink-700 text-[10px] md:text-xs rounded-full font-poppins font-medium animate-pulse whitespace-nowrap">
                            ✉️ New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs md:text-sm mb-2 font-poppins line-clamp-2">
                        {letter.content.substring(0, 120)}
                        {letter.content.length > 120 ? '...' : ''}
                      </p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto md:flex-col">
                      <button 
                        onClick={() => setPreviewLetter(letter)}
                        className="flex-1 md:flex-none px-3 md:px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-poppins text-xs md:text-sm transition-colors whitespace-nowrap"
                      >
                        👁️ Preview
                      </button>
                      <Link href={`/letter/${letter.id}?admin=true`} className="flex-1 md:flex-none">
                        <button className="w-full px-3 md:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-poppins text-xs md:text-sm transition-all whitespace-nowrap">
                          Open →
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}

        {/* Preview Modal */}
        <AnimatePresence>
          {previewLetter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setPreviewLetter(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
              >
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl z-10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1 font-poppins">
                        📧 Letter Preview
                      </h2>
                      <p className="text-gray-600 font-poppins text-sm">
                        {activeTab === 'sent' ? 'To' : 'From'}: {previewLetter.senderName || previewLetter.recipientName}
                      </p>
                    </div>
                    <button
                      onClick={() => setPreviewLetter(null)}
                      className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Letter Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <h3 className="font-poppins font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      ℹ️ Letter Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recipient:</span>
                        <span className="font-medium text-gray-900">{previewLetter.recipientName}</span>
                      </div>
                      {previewLetter.senderName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sender:</span>
                          <span className="font-medium text-gray-900">{previewLetter.senderName}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${previewLetter.isOpened ? 'text-green-600' : 'text-orange-600'}`}>
                          {previewLetter.isOpened ? '✓ Opened' : '○ Not Opened'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Protected:</span>
                        <span className="font-medium text-gray-900">
                          {previewLetter.pinHash ? '🔒 Yes (PIN required)' : '🔓 No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium text-gray-900">{formatDate(previewLetter.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
                    <p className="text-gray-800 whitespace-pre-wrap font-handwriting text-lg leading-relaxed">
                      {previewLetter.content}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Direct view button for admin */}
                    <button
                      onClick={() => window.open(`/letter/${previewLetter.id}?admin=true`, '_blank')}
                      className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-poppins font-medium transition-all"
                    >
                      👁️ View Full Letter (Admin)
                    </button>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/letter/${previewLetter.id}`)
                          alert('Link copied to clipboard!')
                        }}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-poppins font-medium transition-colors"
                      >
                        🔗 Copy Link
                      </button>
                      {activeTab === 'sent' && (
                        <>
                          <button
                            onClick={() => handleEdit(previewLetter)}
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-poppins font-medium transition-colors"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(previewLetter.id)}
                            className="flex-1 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-poppins font-medium transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => setPreviewLetter(null)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-poppins font-medium transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingLetter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setEditingLetter(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
              >
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl z-10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1 font-poppins">
                        ✏️ Edit Letter
                      </h2>
                      <p className="text-gray-600 font-poppins text-sm">
                        To: {editingLetter.recipientName}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingLetter(null)}
                      className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3 font-poppins">
                      Message Content
                    </label>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={12}
                      maxLength={10000}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors font-handwriting text-lg resize-none"
                      placeholder="Write your message here..."
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-500 font-poppins">
                        {editContent.length} / 10,000 characters
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingLetter(null)}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-poppins font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-poppins font-medium transition-all"
                    >
                      💾 Save Changes
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
