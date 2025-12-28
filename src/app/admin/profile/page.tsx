'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import AdminLayout from '@/components/admin/AdminLayout'
import { PaperCard } from '@/components/ui/PaperCard'
import { SquishButton } from '@/components/ui/SquishButton'
import ImageCropper from '@/components/ImageCropper'

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [tempImage, setTempImage] = useState('')
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
        // Update client-side session to reflect changes immediately
        await update({ name: formData.name, image: formData.avatar })

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

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB')
      return
    }

    // Read file as data URL for cropper
    const reader = new FileReader()
    reader.onloadend = () => {
      setTempImage(reader.result as string)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (croppedImage: string) => {
    try {
      // Convert base64 to blob
      const response = await fetch(croppedImage)
      const blob = await response.blob()

      const formData = new FormData()
      formData.append('file', blob, 'avatar.jpg')

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (uploadResponse.ok) {
        const data = await uploadResponse.json()
        setFormData(prev => ({ ...prev, avatar: data.url }))
        setShowCropper(false)
        setTempImage('')
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
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
                {/* Banner */}
                <div className="h-32 md:h-48 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500 relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>

                <div className="px-6 md:px-10 pb-10">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar - Negative Margin to overlap banner */}
                    <div className="-mt-12 md:-mt-16 relative group">
                      <div className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-xl">
                        {formData.avatar ? (
                          <img
                            src={formData.avatar}
                            alt="Profile avatar"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-gray-800"
                          />
                        ) : (
                          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl md:text-4xl border-4 border-white dark:border-gray-800">
                            {formData.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        {isEditing && (
                          <div className="absolute bottom-1 right-1">
                            <input
                              type="file"
                              id="avatar-upload"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              className="hidden"
                            />
                            <label htmlFor="avatar-upload" className="cursor-pointer w-8 h-8 md:w-10 md:h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:text-pink-500 transition-colors border border-gray-200">
                              📷
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Text & Actions */}
                    <div className="flex-1 pt-4 md:pt-6 w-full">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-poppins">
                            {formData.name}
                          </h2>
                          <p className="text-gray-500 dark:text-gray-400 font-poppins">{formData.email}</p>
                        </div>
                        {!isEditing && (
                          <SquishButton
                            variant="secondary"
                            size="md"
                            onClick={() => setIsEditing(true)}
                          >
                            ✏️ Edit Profile
                          </SquishButton>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Edit Form */}
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 max-w-2xl"
                    >
                      <div className="grid gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-poppins">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                            placeholder="Enter your name"
                          />
                        </div>

                        <div className="flex gap-4">
                          <SquishButton
                            variant="primary"
                            size="lg"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1"
                          >
                            {isSaving ? '💾 Saving...' : '💾 Save Changes'}
                          </SquishButton>
                          <SquishButton
                            variant="secondary"
                            size="lg"
                            onClick={() => {
                              setIsEditing(false)
                              if (session?.user) {
                                setFormData(prev => ({
                                  ...prev,
                                  name: session.user.name || 'User',
                                  email: session.user.email || '',
                                  avatar: session.user.image || ''
                                }))
                              }
                            }}
                            disabled={isSaving}
                            className="flex-1"
                          >
                            Cancel
                          </SquishButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Change Password - Removed since Google Auth is enforced */}
            {/* <motion.div ... relative code removed ... /> */}
          </>
        )}
      </div>

      {/* Image Cropper Modal */}
      {showCropper && (
        <ImageCropper
          imageSrc={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false)
            setTempImage('')
          }}
        />
      )}
    </AdminLayout>
  )
}
