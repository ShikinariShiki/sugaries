'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperCard } from '@/components/ui/PaperCard'
import { SquishButton } from '@/components/ui/SquishButton'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  Search,
  Upload,
  Download,
  Mail,
  Sparkles,
  Star,
  Trash2,
  Eye,
  ArrowRight,
  Loader2,
  Inbox,
  Send
} from 'lucide-react'

interface Letter {
  id: string
  recipientName: string
  content: string
  createdAt: string
  isOpened: boolean
  isReply?: boolean
  senderName?: string
  pinHash?: string
  pin?: string
  rating?: number
  imageUrl?: string
  musicUrl?: string
  musicTitle?: string
  musicArtist?: string
  letterColor?: string
  letterFont?: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [sentLetters, setSentLetters] = useState<Letter[]>([])
  const [receivedLetters, setReceivedLetters] = useState<Letter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent')
  const [previewLetter, setPreviewLetter] = useState<Letter | null>(null)
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null)
  const [editContent, setEditContent] = useState('')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedLetters, setSelectedLetters] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchLetters(true) // Initial fetch with loading state

    // Auto-refresh every 2 seconds to catch new letters (silent update)
    const interval = setInterval(() => {
      fetchLetters(false) // Silent refresh without loading state
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const fetchLetters = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true)
    }
    try {
      const response = await fetch('/api/letter/list')
      const data = await response.json()

      console.log('=== Dashboard Fetch ===')
      console.log('Response OK:', response.ok)
      console.log('Sent letters:', data.sent?.length || 0)
      console.log('Received letters:', data.received?.length || 0)

      if (response.ok) {
        setSentLetters(data.sent || [])
        setReceivedLetters(data.received || [])
        console.log('State updated - Sent:', data.sent?.length, 'Received:', data.received?.length)
      }
    } catch (error) {
      console.error('Failed to fetch letters:', error)
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
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

    // Optimistic update - remove immediately from UI
    setPreviewLetter(null)
    const prevSent = sentLetters
    const prevReceived = receivedLetters
    setSentLetters(prev => prev.filter(l => l.id !== letterId))
    setReceivedLetters(prev => prev.filter(l => l.id !== letterId))

    try {
      const response = await fetch(`/api/letter/${letterId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        // Revert on error
        setSentLetters(prevSent)
        setReceivedLetters(prevReceived)
        alert('Failed to delete letter')
      }
    } catch (error) {
      console.error('Failed to delete letter:', error)
      setSentLetters(prevSent)
      setReceivedLetters(prevReceived)
      alert('Failed to delete letter')
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

  const toggleSelectLetter = (letterId: string) => {
    const newSelected = new Set(selectedLetters)
    if (newSelected.has(letterId)) {
      newSelected.delete(letterId)
    } else {
      newSelected.add(letterId)
    }
    setSelectedLetters(newSelected)
  }

  const toggleSelectAll = () => {
    const currentLetters = activeTab === 'sent' ? filteredSentLetters : filteredReceivedLetters
    if (selectedLetters.size === currentLetters.length && currentLetters.length > 0) {
      setSelectedLetters(new Set())
    } else {
      setSelectedLetters(new Set(currentLetters.map(l => l.id)))
    }
  }

  const handleBatchDelete = async () => {
    if (selectedLetters.size === 0) return

    if (!confirm(`Are you sure you want to delete ${selectedLetters.size} letter(s)?`)) return

    // Optimistic update - remove immediately
    const idsToDelete = Array.from(selectedLetters)
    const prevSent = sentLetters
    const prevReceived = receivedLetters
    setSentLetters(prev => prev.filter(l => !selectedLetters.has(l.id)))
    setReceivedLetters(prev => prev.filter(l => !selectedLetters.has(l.id)))
    setSelectedLetters(new Set())

    try {
      const deletePromises = idsToDelete.map(letterId =>
        fetch(`/api/letter/${letterId}`, { method: 'DELETE' })
      )

      const results = await Promise.all(deletePromises)
      const failed = results.filter(r => !r.ok)

      if (failed.length > 0) {
        // Revert on error
        setSentLetters(prevSent)
        setReceivedLetters(prevReceived)
        alert(`Failed to delete ${failed.length} letter(s)`)
      }
    } catch (error) {
      console.error('Failed to delete letters:', error)
      setSentLetters(prevSent)
      setReceivedLetters(prevReceived)
      alert('Some letters could not be deleted')
    }
  }

  const totalSent = sentLetters.length
  const totalReceived = receivedLetters.length
  const openedSent = sentLetters.filter(l => l.isOpened).length
  const unreadReceived = receivedLetters.filter(l => !l.isOpened).length

  // Calculate average satisfaction from received letters with ratings
  const ratingsFromReplies = receivedLetters.filter(l => l.rating).map(l => l.rating!)
  console.log('=== Statistics Calculation ===')
  console.log('Total sent:', totalSent)
  console.log('Total received:', totalReceived)
  console.log('Opened sent:', openedSent)
  console.log('Ratings from replies:', ratingsFromReplies)

  const averageSatisfaction = ratingsFromReplies.length > 0
    ? (ratingsFromReplies.reduce((sum, rating) => sum + rating, 0) / ratingsFromReplies.length).toFixed(1)
    : null

  console.log('Average satisfaction:', averageSatisfaction)

  // Filter letters based on search query
  const filterLetters = (letters: Letter[]) => {
    if (!searchQuery.trim()) return letters

    const query = searchQuery.toLowerCase()
    return letters.filter(letter =>
      letter.recipientName?.toLowerCase().includes(query) ||
      letter.senderName?.toLowerCase().includes(query) ||
      letter.content?.toLowerCase().includes(query)
    )
  }

  const filteredSentLetters = filterLetters(sentLetters)
  const filteredReceivedLetters = filterLetters(receivedLetters)
  const currentLetters = activeTab === 'sent' ? filteredSentLetters : filteredReceivedLetters

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">Dashboard</h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Manage your letters</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {selectedLetters.size > 0 && (
                <SquishButton
                  variant="secondary"
                  size="lg"
                  onClick={handleBatchDelete}
                  disabled={isDeleting}
                  className="bg-red-50 text-red-600 hover:bg-red-100 flex-1 md:flex-none"
                >
                  <span className="hidden sm:inline flex items-center gap-2">
                    {isDeleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                    Delete {selectedLetters.size}
                  </span>
                  <span className="sm:hidden"><Trash2 size={16} /> {selectedLetters.size}</span>
                </SquishButton>
              )}
              <Link href="/admin/compose" className="flex-1 md:flex-none hidden">
                <SquishButton variant="primary" size="lg" className="w-full">
                  <span className="hidden sm:inline flex items-center gap-2"><Mail size={16} /> Compose New</span>
                  <span className="inline sm:hidden"><Mail size={16} /></span>
                </SquishButton>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search letters by name or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none transition-colors shadow-sm font-poppins"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl md:text-2xl text-pink-500"><Send size={24} /></span>
              <span className="text-[10px] md:text-sm text-gray-500 dark:text-gray-300 font-poppins">Sent</span>
            </div>
            <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white font-poppins">{totalSent}</p>
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-300 font-poppins mt-1">{openedSent} opened</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl md:text-2xl text-pink-500"><Inbox size={24} /></span>
              <span className="text-[10px] md:text-sm text-gray-500 dark:text-gray-300 font-poppins">Received</span>
            </div>
            <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white font-poppins">{totalReceived}</p>
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-300 font-poppins mt-1">{unreadReceived} unread</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl md:text-2xl text-pink-500"><Mail size={24} /></span>
              <span className="text-[10px] md:text-sm text-gray-500 dark:text-gray-300 font-poppins">Total</span>
            </div>
            <p className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white font-poppins">{totalSent + totalReceived}</p>
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-300 font-poppins mt-1">All letters</p>
          </motion.div>

          <Link href="/admin/statistics">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-pink-500 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl md:text-2xl"><Sparkles size={24} /></span>
                <span className="text-[10px] md:text-sm font-poppins opacity-90">Open Rate</span>
              </div>
              <p className="text-xl md:text-3xl font-bold font-poppins">
                {totalSent > 0 ? Math.round((openedSent / totalSent) * 100) : 0}%
              </p>
              <p className="text-[10px] md:text-xs opacity-90 font-poppins mt-1">Success rate</p>
            </motion.div>
          </Link>

          <Link href="/admin/statistics">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer text-white col-span-2 md:col-span-1"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl md:text-2xl"><Star size={24} className="fill-current" /></span>
                <span className="text-[10px] md:text-sm font-poppins opacity-90">Satisfaction</span>
              </div>
              <p className="text-xl md:text-3xl font-bold font-poppins">
                {averageSatisfaction || 'N/A'}
                {averageSatisfaction && <span className="text-sm ml-1">/5</span>}
              </p>
              <p className="text-[10px] md:text-xs opacity-90 font-poppins mt-1">
                {ratingsFromReplies.length > 0 ? `${ratingsFromReplies.length} ratings` : 'No ratings yet'}
              </p>
            </motion.div>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm overflow-x-auto mb-4">
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 min-w-[120px] px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all font-poppins text-xs md:text-base whitespace-nowrap ${activeTab === 'sent'
              ? 'bg-pink-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            <span className="hidden md:inline">📤 Sent Letters</span>
            <span className="md:hidden">📤 Sent</span>
            <span className="ml-2 text-xs opacity-75">({totalSent})</span>
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 min-w-[120px] px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all font-poppins text-xs md:text-base whitespace-nowrap ${activeTab === 'received'
              ? 'bg-pink-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            <span className="hidden md:inline">📥 Received</span>
            <span className="md:hidden">📥 Received</span>
            <span className="ml-2 text-xs opacity-75">({totalReceived})</span>
          </button>
        </div>

        {/* Batch Actions Bar */}
        {(activeTab === 'sent' ? sentLetters : receivedLetters).length > 0 && (
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLetters.size === (activeTab === 'sent' ? sentLetters : receivedLetters).length && selectedLetters.size > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedLetters.size > 0 ? `${selectedLetters.size} selected` : 'Select All'}
              </span>
            </label>
            {selectedLetters.size > 0 && (
              <button
                onClick={handleBatchDelete}
                disabled={isDeleting}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                {isDeleting ? 'Deleting...' : 'Delete Selected'}
              </button>
            )}
          </div>
        )}

        {/* Letters List */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 md:p-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400 font-poppins">Loading letters...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTab === 'sent' && filteredSentLetters.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 md:p-12 text-center"
              >
                <div className="text-6xl mb-4">{searchQuery ? '🔍' : '✉️'}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-poppins">
                  {searchQuery ? 'No letters found' : 'No letters sent yet'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 font-poppins">
                  {searchQuery ? 'Try a different search term' : 'Start by composing your first letter!'}
                </p>
                {!searchQuery && (
                  <Link href="/admin/compose">
                    <SquishButton variant="primary" size="lg">
                      ✉️ Compose First Letter
                    </SquishButton>
                  </Link>
                )}
              </motion.div>
            )}

            {activeTab === 'received' && filteredReceivedLetters.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 md:p-12 text-center"
              >
                <div className="text-6xl mb-4">{searchQuery ? '🔍' : '📭'}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-poppins">
                  {searchQuery ? 'No letters found' : 'No letters received yet'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-poppins">
                  {searchQuery ? 'Try a different search term' : 'Letters sent to you will appear here.'}
                </p>
              </motion.div>
            )}

            {activeTab === 'sent' &&
              filteredSentLetters.map((letter, index) => (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-all p-3 md:p-6 group"
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedLetters.has(letter.id)}
                      onChange={() => toggleSelectLetter(letter.id)}
                      className="mt-2 w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer flex-shrink-0"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                                {letter.recipientName.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-sm md:text-lg font-bold text-gray-900 dark:text-white font-poppins truncate">
                                  {letter.recipientName}
                                </h3>
                                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-300 font-poppins">
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
                          <p className="text-gray-700 dark:text-gray-200 text-xs md:text-sm mb-2 font-poppins line-clamp-2">
                            {letter.content.substring(0, 120)}
                            {letter.content.length > 120 ? '...' : ''}
                          </p>
                          {letter.pinHash && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                              <span className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300 font-poppins">🔑 PIN Protected</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 w-full md:w-auto md:flex-col">
                          <button
                            onClick={() => setPreviewLetter(letter)}
                            className="flex-1 md:flex-none px-3 md:px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-poppins text-xs md:text-sm transition-colors whitespace-nowrap"
                          >
                            👁️ Preview
                          </button>
                          <Link href={`/letter/${letter.id}?admin=true`} className="flex-1 md:flex-none">
                            <button className="w-full px-3 md:px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-poppins text-xs md:text-sm transition-all whitespace-nowrap">
                              View →
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

            {activeTab === 'received' &&
              filteredReceivedLetters.map((letter, index) => (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-all p-3 md:p-6 group"
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedLetters.has(letter.id)}
                      onChange={() => toggleSelectLetter(letter.id)}
                      className="mt-2 w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer flex-shrink-0"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                                {(letter.senderName || letter.recipientName).charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-sm md:text-lg font-bold text-gray-900 dark:text-white font-poppins truncate">
                                  {letter.senderName || letter.recipientName}
                                </h3>
                                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-300 font-poppins">
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
                          <p className="text-gray-700 dark:text-gray-200 text-xs md:text-sm mb-2 font-poppins line-clamp-2">
                            {letter.content.substring(0, 120)}
                            {letter.content.length > 120 ? '...' : ''}
                          </p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto md:flex-col">
                          <button
                            onClick={() => {
                              console.log('Preview letter data:', letter)
                              console.log('PIN:', letter.pin, 'Image:', letter.imageUrl)
                              setPreviewLetter(letter)
                            }}
                            className="flex-1 md:flex-none px-3 md:px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-poppins text-xs md:text-sm transition-colors whitespace-nowrap"
                          >
                            👁️ Preview
                          </button>
                          <Link href={`/letter/${letter.id}?admin=true`} className="flex-1 md:flex-none">
                            <button className="w-full px-3 md:px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-poppins text-xs md:text-sm transition-all whitespace-nowrap">
                              Open →
                            </button>
                          </Link>
                        </div>
                      </div>
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
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-6 rounded-t-2xl z-10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 font-poppins">
                        📧 Letter Preview
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 font-poppins text-sm">
                        {activeTab === 'sent' ? 'To' : 'From'}: {previewLetter.senderName || previewLetter.recipientName}
                      </p>
                    </div>
                    <button
                      onClick={() => setPreviewLetter(null)}
                      className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Letter Info */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
                    <h3 className="font-poppins font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                      ℹ️ Letter Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Recipient:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{previewLetter.recipientName}</span>
                      </div>
                      {previewLetter.senderName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Sender:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{previewLetter.senderName}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={`font-medium ${previewLetter.isOpened ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                          {previewLetter.isOpened ? '✓ Opened' : '○ Not Opened'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Protected:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {previewLetter.pinHash ? '🔒 Yes (PIN required)' : '🔓 No'}
                        </span>
                      </div>
                      {previewLetter.pin && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">PIN Code:</span>
                          <span className="font-mono font-bold text-pink-600 dark:text-pink-400">{previewLetter.pin}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Created:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatDate(previewLetter.createdAt)}</span>
                      </div>
                      {previewLetter.musicUrl && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Music:</span>
                          <span className="text-xs text-blue-600 dark:text-blue-400">🎵 Attached</span>
                        </div>
                      )}
                      {previewLetter.imageUrl && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Image:</span>
                          <span className="text-xs text-blue-600 dark:text-blue-400">📷 Attached</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Preview */}
                  {previewLetter.imageUrl && (
                    <div className="mb-4 rounded-xl overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800">
                      <img
                        src={previewLetter.imageUrl}
                        alt="Letter attachment"
                        className="w-full h-auto object-contain"
                        style={{ maxHeight: '300px' }}
                        onError={(e) => {
                          console.error('Failed to load image:', previewLetter.imageUrl)
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.parentElement!.innerHTML = '<div class="p-4 text-center text-red-500">❌ Image failed to load</div>'
                        }}
                        onLoad={() => console.log('Image loaded:', previewLetter.imageUrl)}
                      />
                    </div>
                  )}

                  <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-6 mb-6">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-handwriting text-lg leading-relaxed">
                      {previewLetter.content}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Direct view button for admin */}
                    <button
                      onClick={() => window.open(`/letter/${previewLetter.id}?admin=true`, '_blank')}
                      className="w-full px-4 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-poppins font-medium transition-all"
                    >
                      👁️ View Full Letter (Admin)
                    </button>

                    {/* Link Display */}
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 mb-3 border border-gray-100 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-poppins">Unique Link:</p>
                      <code className="block text-xs md:text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 break-all text-pink-600 dark:text-pink-400 font-mono select-all">
                        {`${typeof window !== 'undefined' ? window.location.origin : ''}/letter/${previewLetter.id}`}
                      </code>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/letter/${previewLetter.id}`)
                          alert('Link copied to clipboard! ✨')
                        }}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-poppins font-medium transition-colors"
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
                      className="flex-1 px-4 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-poppins font-medium transition-all"
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
    </AdminLayout>
  )
}
