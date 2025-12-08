'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { PaperCard } from '@/components/ui/PaperCard'
import { SquishButton } from '@/components/ui/SquishButton'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    newLetterAlerts: true,
    weeklyDigest: false,
    soundEffects: true,
    autoRefresh: true,
    refreshInterval: 5,
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleRefreshIntervalChange = (value: number) => {
    setSettings(prev => ({ ...prev, refreshInterval: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Save to localStorage
    localStorage.setItem('appSettings', JSON.stringify(settings))
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setIsSaving(false)
    alert('Settings saved successfully!')
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your application preferences</p>
        </motion.div>

        <div className="grid gap-6">
          {/* Notifications Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PaperCard>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications</h2>
              
              <div className="space-y-4">
                <SettingToggle
                  label="Email Notifications"
                  description="Receive email updates about your letters"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                />
                
                <SettingToggle
                  label="New Letter Alerts"
                  description="Get notified when you receive a new letter"
                  checked={settings.newLetterAlerts}
                  onChange={() => handleToggle('newLetterAlerts')}
                />
                
                <SettingToggle
                  label="Weekly Digest"
                  description="Receive a weekly summary of your letter activity"
                  checked={settings.weeklyDigest}
                  onChange={() => handleToggle('weeklyDigest')}
                />
              </div>
            </PaperCard>
          </motion.div>

          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PaperCard>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Appearance & Behavior</h2>
              
              <div className="space-y-4">
                <SettingToggle
                  label="Sound Effects"
                  description="Play sound effects for interactions"
                  checked={settings.soundEffects}
                  onChange={() => handleToggle('soundEffects')}
                />
                
                <SettingToggle
                  label="Auto Refresh"
                  description="Automatically refresh dashboard data"
                  checked={settings.autoRefresh}
                  onChange={() => handleToggle('autoRefresh')}
                />
                
                {settings.autoRefresh && (
                  <div className="ml-6 p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Refresh Interval (seconds)
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="30"
                      value={settings.refreshInterval}
                      onChange={(e) => handleRefreshIntervalChange(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>3s</span>
                      <span className="font-medium text-pink-600">{settings.refreshInterval}s</span>
                      <span>30s</span>
                    </div>
                  </div>
                )}
              </div>
            </PaperCard>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end"
          >
            <SquishButton
              onClick={handleSave}
              disabled={isSaving}
              className="px-8"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </SquishButton>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white">{label}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-pink-500' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
