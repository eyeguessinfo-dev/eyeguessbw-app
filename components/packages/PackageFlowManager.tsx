// components/packages/PackageFlowManager.tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import EnhancedPackageCard from './EnhancedPackageCard'
import TermsAcceptanceFlow from './TermsAcceptanceFlow'

interface Package {
  name: string
  price: string
  period: string
  features: string[]
  cta: string
  stripeLink: string
  featured?: boolean
}

interface PackageFlowManagerProps {
  pkg: Package
  index: number
}

export default function PackageFlowManager({ pkg, index }: PackageFlowManagerProps) {
  const [currentStep, setCurrentStep] = useState<'package' | 'service-agreement' | 'terms-acceptance'>('package')
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePackageSelect = () => {
    setIsLoading(true)
    setShowModal(true)
    setCurrentStep('service-agreement')
    // Small delay to ensure smooth animation
    setTimeout(() => setIsLoading(false), 300)
  }

  const handleServiceAgreementAccept = () => {
    setCurrentStep('terms-acceptance')
  }

  const handleTermsAccept = (acceptanceId: string) => {
    console.log('Package flow completed with acceptance ID:', acceptanceId)
    // TermsAcceptanceFlow handles the Stripe redirect automatically
    // We just close the modal and reset the flow
    setShowModal(false)
    setCurrentStep('package')
  }

  const handleBack = () => {
    if (currentStep === 'terms-acceptance') {
      setCurrentStep('service-agreement')
    } else if (currentStep === 'service-agreement') {
      setShowModal(false)
      setCurrentStep('package')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setCurrentStep('package')
  }

  // Simple Service Agreement Content for the flow manager
  const ServiceAgreementContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 p-6 bg-gradient-to-r from-gray-900 to-black sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Service Agreement</h2>
            <p className="text-gray-400 text-sm mt-1">Please review the service terms</p>
          </div>
          <button 
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        {/* Selected Plan */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">📦 Selected Plan</h3>
          <p className="text-blue-400 font-medium">{pkg.name} • {pkg.price}{pkg.period}</p>
        </div>

        {/* Key Agreement Points */}
        <div className="space-y-4">
          <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
            <h4 className="text-white font-semibold text-lg mb-4">🎯 Advisory Nature of Services</h4>
            <p className="text-gray-300 leading-relaxed">
              Our services are strictly advisory in nature. We provide strategic guidance and frameworks 
              but cannot guarantee specific business outcomes, revenue increases, or partnership successes. 
              Your success depends on your execution and market factors.
            </p>
          </div>

          <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
            <h4 className="text-white font-semibold text-lg mb-4">🛡️ Limitation of Liability</h4>
            <p className="text-gray-300 leading-relaxed">
              Our total liability is limited to the fees you've paid in the 6 months preceding any claim. 
              We are not liable for indirect, special, or consequential damages including lost profits 
              or business interruption.
            </p>
          </div>

          <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
            <h4 className="text-white font-semibold text-lg mb-4">⚖️ Dispute Resolution</h4>
            <p className="text-gray-300 leading-relaxed">
              We believe in fair resolution through direct negotiation and, if needed, binding arbitration. 
              This efficient process saves time and costs compared to court proceedings.
            </p>
          </div>

          <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
            <h4 className="text-white font-semibold text-lg mb-4">🔄 Subscription Terms</h4>
            <p className="text-gray-300 leading-relaxed">
              Monthly billing with 30-day satisfaction guarantee. Cancel anytime with 30-day notice. 
              No prorated refunds for mid-month cancellations. Services continue during notice period.
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">📄 Complete Agreement</h4>
            <p className="text-gray-300 text-sm">
              This document constitutes the complete understanding between us regarding the services 
              and supersedes all prior discussions and agreements.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-800 p-6 bg-gray-900/50 sticky bottom-0">
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleCloseModal}
            className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium flex-1"
          >
            Cancel
          </button>
          <button 
            onClick={handleServiceAgreementAccept}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-500 hover:to-purple-500 hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/25 flex-1"
          >
            ✅ Accept Agreement & Continue
          </button>
        </div>
        <p className="text-center text-gray-500 text-xs mt-3">
          By clicking "Accept", you acknowledge reading and understanding all terms and agree to be legally bound
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Package Card */}
      <EnhancedPackageCard 
        pkg={pkg} 
        index={index}
        onSelect={handlePackageSelect}
      />
      
      {/* Flow Modal */}
      {showModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Service Agreement Step */}
            {currentStep === 'service-agreement' && (
              <ServiceAgreementContent />
            )}
            
            {/* Terms Acceptance Step */}
            {currentStep === 'terms-acceptance' && (
              <div className="h-full flex flex-col">
                {/* Header with Back Button */}
                <div className="border-b border-gray-800 p-6 bg-gradient-to-r from-gray-900 to-black sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Client Information & Terms</h2>
                      <p className="text-gray-400 text-sm mt-1">Complete your details to proceed to payment</p>
                    </div>
                    <button 
                      onClick={handleBack}
                      className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Terms Acceptance Flow - UPDATED FOR SCROLLING */}
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto">
                    <TermsAcceptanceFlow 
                      package={pkg.name}
                      onAccept={handleTermsAccept}
                      onBack={handleBack}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  )
}