'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { PaperCard } from '@/components/ui/PaperCard'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Letter {
  id: string
  createdAt: string
  isOpened: boolean
  isReply: boolean
}

interface ChartDataPoint {
  date: string
  sent: number
  opened: number
  replies: number
}

export default function StatisticsPage() {
  const [stats, setStats] = useState({
    totalSent: 0,
    opened: 0,
    replies: 0,
    openRate: 0
  })
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/letter/list')
      const data = await response.json()
      
      if (response.ok) {
        const sent = data.sent || []
        const received = data.received || []
        
        setStats({
          totalSent: sent.length,
          opened: sent.filter((l: any) => l.isOpened).length,
          replies: received.length,
          openRate: sent.length > 0 ? Math.round((sent.filter((l: any) => l.isOpened).length / sent.length) * 100) : 0
        })

        // Generate chart data
        const activityData = generateChartData(sent, received)
        setChartData(activityData)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateChartData = (sent: Letter[], received: Letter[]): ChartDataPoint[] => {
    const dataMap = new Map<string, ChartDataPoint>()
    
    // Get date range (last 7 days)
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      dataMap.set(dateStr, { date: dateStr, sent: 0, opened: 0, replies: 0 })
    }

    // Count sent letters by date
    sent.forEach((letter: Letter) => {
      const date = new Date(letter.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (dataMap.has(date)) {
        const point = dataMap.get(date)!
        point.sent++
        if (letter.isOpened) point.opened++
      }
    })

    // Count replies by date
    received.forEach((letter: Letter) => {
      const date = new Date(letter.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (dataMap.has(date)) {
        const point = dataMap.get(date)!
        point.replies++
      }
    })

    return Array.from(dataMap.values())
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Statistics</h1>
          <p className="text-gray-600 dark:text-gray-400">View detailed analytics and insights</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PaperCard className="text-center">
              <div className="text-4xl mb-2">📨</div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{isLoading ? '...' : stats.totalSent}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Sent</p>
            </PaperCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PaperCard className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{isLoading ? '...' : stats.opened}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Opened</p>
            </PaperCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PaperCard className="text-center">
              <div className="text-4xl mb-2">💌</div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{isLoading ? '...' : stats.replies}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Replies</p>
            </PaperCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <PaperCard className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{isLoading ? '...' : `${stats.openRate}%`}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Open Rate</p>
            </PaperCard>
          </motion.div>
        </div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <PaperCard>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Activity Over Time</h2>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <p>Loading chart...</p>
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <p>No activity data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReplies" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9ca3af" 
                    className="dark:stroke-gray-400"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    className="dark:stroke-gray-400"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sent" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorSent)" 
                    name="Sent"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="opened" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorOpened)" 
                    name="Opened"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="replies" 
                    stroke="#ec4899" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorReplies)" 
                    name="Replies"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </PaperCard>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
