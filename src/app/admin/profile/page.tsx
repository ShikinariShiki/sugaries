'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import AdminLayout from '@/components/admin/AdminLayout'
import { PaperCard } from '@/components/ui/PaperCard'
import { SquishButton } from '@/components/ui/SquishButton'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || 'User',
        email: session.user.email || '',
        avatar: session.user.image || ''
      }))
      setIsLoading(false)
    }
  }, [session])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          avatar: formData.avatar
        })
      })

      if (response.ok) {
        alert('✅ Profile saved successfully!')
        setIsEditing(false)
      } else {
        alert('❌ Failed to save profile')
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('❌ Error saving profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, avatar: data.url }))
        alert('✅ Avatar uploaded!')
      } else {
        alert('❌ Failed to upload avatar')
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      alert('❌ Error uploading avatar')
    }
  }

  return (
    <AdminLayout>
      <div>
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading profile...</div>
          </div>
        ) : (
          <>
            {/* Profile Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PaperCard className="mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
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
                    {formData.avatar ? (
                      <img 
                        src={formData.avatar} 
                        alt="Profile avatar" 
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                        {formData.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {isEditing && (
                      <div>
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <label htmlFor="avatar-upload" className="inline-block cursor-pointer">
                          <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-poppins text-sm transition-all">
                            📷 Change Avatar
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-pink-500 focus:outline-none transition-colors"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-pink-500 focus:outline-none transition-colors"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.email}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <SquishButton
                      variant="primary"
                      size="md"
                      onClick={handleSave}
                      className="flex-1"
                      disabled={isSaving}
                    >
                      {isSaving ? '💾 Saving...' : '💾 Save Changes'}
                    </SquishButton>
                    <SquishButton
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        setIsEditing(false)
                        fetchProfile() // Reset form
                      }}
                      className="flex-1"
                      disabled={isSaving}
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
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-pink-500 focus:outline-none transition-colors"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-pink-500 focus:outline-none transition-colors"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-pink-500 focus:outline-none transition-colors"
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
          </>
        )}
      </div>
    </AdminLayout>
  )
}
