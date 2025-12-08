'use client'

import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { PaperCard } from '@/components/ui/PaperCard'

export default function StatisticsPage() {
  return (
    <AdminLayout>
      <div className="max-w-6xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistics</h1>
          <p className="text-gray-600">View detailed analytics and insights</p>
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
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600 mt-1">Total Sent</p>
            </PaperCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PaperCard className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600 mt-1">Opened</p>
            </PaperCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PaperCard className="text-center">
              <div className="text-4xl mb-2">💌</div>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600 mt-1">Replies</p>
            </PaperCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <PaperCard className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-3xl font-bold text-gray-900">0%</p>
              <p className="text-sm text-gray-600 mt-1">Open Rate</p>
            </PaperCard>
          </motion.div>
        </div>

        {/* Charts Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <PaperCard>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Over Time</h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>Charts coming soon...</p>
            </div>
          </PaperCard>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
