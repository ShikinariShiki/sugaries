'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { PaperCard } from '@/components/ui/PaperCard'
import { SquishButton } from '@/components/ui/SquishButton'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: 'Admin',
    email: 'admin@sugaries.app',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSave = () => {
    // TODO: Implement save profile logic
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PaperCard className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              {!isEditing && (
                <SquishButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit
                </SquishButton>
              )}
            </div>

            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
                {isEditing && (
                  <SquishButton variant="secondary" size="sm">
                    Change Avatar
                  </SquishButton>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:outline-none transition-colors"
                  />
                ) : (
                  <p className="text-gray-900">{formData.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:outline-none transition-colors"
                  />
                ) : (
                  <p className="text-gray-900">{formData.email}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <SquishButton
                  variant="primary"
                  size="md"
                  onClick={handleSave}
                  className="flex-1"
                >
                  Save Changes
                </SquishButton>
                <SquishButton
                  variant="secondary"
                  size="md"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </SquishButton>
              </div>
            )}
          </PaperCard>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PaperCard>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:outline-none transition-colors"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:outline-none transition-colors"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:outline-none transition-colors"
                  placeholder="Confirm new password"
                />
              </div>

              <SquishButton
                variant="primary"
                size="md"
                onClick={() => console.log('Changing password')}
                className="w-full"
              >
                Update Password
              </SquishButton>
            </div>
          </PaperCard>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
