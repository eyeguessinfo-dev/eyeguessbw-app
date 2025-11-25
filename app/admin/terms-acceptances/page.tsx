'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setValue } from '@/lib/redis-utils'

export default function TermsPage() {
  const [accepted, setAccepted] = useState(false)
  const router = useRouter()

  const handleAccept = async () => {
    try {
      // Generate a unique user ID (in a real app, this would come from authentication)
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Store terms acceptance in Redis
      const acceptanceData = {
        accepted: true,
        timestamp: new Date().toISOString(),
        termsVersion: '1.0',
        userId: userId
      }

      await setValue(`terms_acceptance:${userId}`, acceptanceData)
      
      setAccepted(true)
      
      // Redirect to home page after acceptance
      setTimeout(() => {
        router.push('/')
      }, 2000)
      
    } catch (error) {
      console.error('Error storing terms acceptance:', error)
    }
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Terms Accepted!</h1>
          <p>Redirecting you to the main application...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Terms of Service</h1>
        
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          {/* Your terms content here */}
          <p>By using this service, you agree to our terms and conditions...</p>
          {/* Add your actual terms content */}
        </div>

        <div className="text-center">
          <button
            onClick={handleAccept}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            I Accept the Terms
          </button>
        </div>
      </div>
    </div>
  )
}