'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

type OnboardingProps = {
  userName: string
  userEmail: string
}

export default function OnboardingFlow({ userName, userEmail }: OnboardingProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleting, setIsCompleting] = useState(false)

  const steps = [
    {
      title: 'Welcome to Gulalies! 🎉',
      description: `Hi ${userName || 'there'}! We are thrilled to have you here.`,
      content: (
        <div className="text-center space-y-4">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center text-6xl">
            ✉️
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Gulalies lets you send beautiful, personalized digital letters to your loved ones with a touch of magic.
          </p>
        </div>
      )
    },
    {
      title: 'How It Works 📝',
      description: 'Creating and sending letters is simple!',
      content: (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Compose Your Letter</h3>
              <p className="text-gray-600 dark:text-gray-400">Write your message, add images, and choose background music</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Set a Secret PIN</h3>
              <p className="text-gray-600 dark:text-gray-400">Create a 4-digit PIN to protect your letter</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Share the Magic</h3>
              <p className="text-gray-600 dark:text-gray-400">Send the link to your recipient along with the PIN (separately!)</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Features You Will Love ✨',
      description: 'Discover what makes Gulalies special',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-3xl mb-2">🎵</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Background Music</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add the perfect soundtrack to your letter</p>
          </div>
          <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
            <div className="text-3xl mb-2">🖼️</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Image Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Include photos to make it personal</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">PIN Protection</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Keep your messages private and secure</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Track Opens</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">See when your letters are read</p>
          </div>
        </div>
      )
    },
    {
      title: 'You Are All Set! 🚀',
      description: 'Ready to send your first letter?',
      content: (
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-6xl animate-bounce">
            🎉
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            You are ready to start creating beautiful letters! Head to your dashboard to compose your first one.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 <strong>Tip:</strong> You can access settings, view statistics, and manage your letters from the sidebar.
            </p>
          </div>
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!res.ok) throw new Error('Failed to update status')

      // Wait a bit for the database to sync/propagate if needed, then redirect
      router.refresh() // Refresh server components
      window.location.href = '/admin/compose'
    } catch (error) {
      console.error('Onboarding failed:', error)
      setIsCompleting(false)
      // Optional: Add toast notification here
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-pink-500 h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {steps[currentStep].description}
            </p>
            <div className="mb-8">
              {steps[currentStep].content}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isCompleting ? 'Loading...' : 'Get Started! 🚀'}
            </button>
          )}
        </div>

        {/* Skip Option */}
        <div className="text-center mt-4">
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Skip tutorial
          </button>
        </div>
      </motion.div>
    </div>
  )
}
