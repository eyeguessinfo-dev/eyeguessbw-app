'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
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

interface EnhancedPackageCardProps {
  pkg: Package
  index: number
  onSelect?: () => void  
}

export default function EnhancedPackageCard({ pkg, index }: EnhancedPackageCardProps) {
  const [showTerms, setShowTerms] = useState(false)
  const [flowStep, setFlowStep] = useState<'service-agreement' | 'terms-acceptance'>('service-agreement')
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const termsContainerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollCheckRef = useRef<NodeJS.Timeout>()

  const handlePackageSelect = () => {
    setShowTerms(true)
    setFlowStep('service-agreement')
    setHasScrolledToBottom(false)
  }

  const handleServiceAgreementAccept = () => {
    if (hasScrolledToBottom) {
      setFlowStep('terms-acceptance')
    }
  }

  const handleTermsAccept = (acceptanceId: string) => {
    console.log('Terms accepted with ID:', acceptanceId)
    // TermsAcceptanceFlow will handle the Stripe redirect automatically
    setShowTerms(false)
    setFlowStep('service-agreement')
  }

  const handleBackToServiceAgreement = () => {
    setFlowStep('service-agreement')
  }

  // Improved scroll detection with better mobile support
  useEffect(() => {
    const container = termsContainerRef.current
    if (!container) return

    const checkScrollPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      
      // More generous threshold for mobile devices
      const threshold = 100 // Increased from 50px to be more forgiving
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold
      
      if (isAtBottom && !hasScrolledToBottom) {
        setHasScrolledToBottom(true)
      }
      
      setIsScrolling(false)
    }

    const handleScroll = () => {
      setIsScrolling(true)
      
      // Debounce scroll checking for better performance
      if (scrollCheckRef.current) {
        clearTimeout(scrollCheckRef.current)
      }
      
      scrollCheckRef.current = setTimeout(checkScrollPosition, 100)
    }

    // Also use Intersection Observer as a backup for mobile
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasScrolledToBottom(true)
          }
        })
      },
      {
        root: container,
        threshold: 0.8, // Trigger when 80% of the bottom element is visible
      }
    )

    if (bottomRef.current) {
      observer.observe(bottomRef.current)
    }

    container.addEventListener('scroll', handleScroll)
    
    // Initial check
    checkScrollPosition()

    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (scrollCheckRef.current) {
        clearTimeout(scrollCheckRef.current)
      }
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current)
      }
    }
  }, [hasScrolledToBottom, showTerms])

  // Reset scroll state when modal opens
  useEffect(() => {
    if (showTerms && flowStep === 'service-agreement') {
      setHasScrolledToBottom(false)
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (termsContainerRef.current) {
          termsContainerRef.current.scrollTop = 0
        }
      }, 100)
    }
  }, [showTerms, flowStep])

  // Force enable after a reasonable time as fallback
  useEffect(() => {
    if (showTerms && flowStep === 'service-agreement' && !hasScrolledToBottom) {
      const fallbackTimer = setTimeout(() => {
        setHasScrolledToBottom(true)
      }, 30000) // 30 second fallback

      return () => clearTimeout(fallbackTimer)
    }
  }, [showTerms, hasScrolledToBottom, flowStep])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 ${
          pkg.featured ? 'ring-2 ring-blue-500 shadow-2xl shadow-blue-500/20 scale-105' : 'shadow-xl shadow-black/50'
        }`}
      >
        {pkg.featured && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-500/25">
              ⭐ Most Popular
            </span>
          </div>
        )}
        
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            {pkg.name}
          </h3>
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-4xl font-bold text-white">{pkg.price}</span>
            <span className="text-gray-400">{pkg.period}</span>
          </div>
          <p className="text-gray-400 text-sm">Billed monthly • Cancel anytime</p>
        </div>

        <ul className="space-y-4 mb-8">
          {pkg.features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-gray-300 group">
              <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="group-hover:text-white transition-colors">{feature}</span>
            </li>
          ))}
        </ul>

        <button 
          onClick={handlePackageSelect}
          className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
            pkg.featured 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25' 
              : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-gray-600'
          }`}
        >
          {pkg.cta}
        </button>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          🔒 Secure payment • 30-day guarantee
        </p>
      </motion.div>

      {/* Combined Modal for Service Agreement & Terms Acceptance */}
      {showTerms && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowTerms(false)
            setFlowStep('service-agreement')
          }}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Service Agreement Content */}
            {flowStep === 'service-agreement' && (
              <>
                {/* Header */}
                <div className="border-b border-gray-800 p-6 bg-gradient-to-r from-gray-900 to-black sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Service Agreement</h2>
                      <p className="text-gray-400 text-sm mt-1">Please read through all terms carefully</p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowTerms(false)
                        setFlowStep('service-agreement')
                      }}
                      className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Scroll Progress Indicator */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">
                        {hasScrolledToBottom ? 'All terms reviewed' : 'Scroll to review all terms'}
                      </span>
                      <span className={`text-sm font-medium ${
                        hasScrolledToBottom ? 'text-green-400' : 'text-blue-400'
                      }`}>
                        {hasScrolledToBottom ? '✓ Ready to Accept' : 'Scroll to Continue'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          hasScrolledToBottom 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        }`}
                        style={{ 
                          width: hasScrolledToBottom ? '100%' : '0%' 
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Terms Content */}
                <div 
                  ref={termsContainerRef}
                  className="p-6 overflow-y-auto max-h-[60vh] space-y-6"
                  style={{
                    WebkitOverflowScrolling: 'touch', // Better scrolling on iOS
                  }}
                >
                  {/* Selected Plan */}
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-2">📦 Selected Plan</h3>
                    <p className="text-blue-400 font-medium">{pkg.name} • {pkg.price}{pkg.period}</p>
                  </div>

                  {/* Your existing legal sections */}
                  <div className="space-y-6">
                    {/* 1. Advisory Nature Section */}
                    <div className="border-2 border-gray-700 rounded-xl p-5 bg-gray-800/30">
                      <h4 className="text-white font-semibold text-lg mb-4">🎯 Advisory Nature of Services</h4>
                      
                      <div className="space-y-4 text-gray-300">
                        <p className="leading-relaxed">
                          Our partnership consulting services are strictly <strong>advisory in nature</strong>. We provide strategic guidance, frameworks, and recommendations based on our expertise and industry knowledge. However, we cannot and do not guarantee specific business outcomes, revenue increases, partnership successes, or any other specific results.
                        </p>
                        
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                          <h5 className="text-amber-400 font-semibold mb-2">📊 What This Means For You:</h5>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>Your Success Depends on Your Execution:</strong> The value you receive depends on your team's ability to implement our recommendations within your specific business context</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>Market Factors Matter:</strong> External market conditions, competition, timing, and economic factors significantly impact outcomes</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>No Financial Guarantees:</strong> We do not guarantee ROI, revenue increases, cost savings, or any specific financial metrics</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">•</span>
                              <span><strong>Partnership Outcomes Vary:</strong> Success in forming and maintaining partnerships depends on many factors beyond our control</span>
                            </li>
                          </ul>
                        </div>

                        {/* ... Rest of your existing service agreement content ... */}
                        {/* Include all your existing legal sections here */}
                      </div>
                    </div>

                    {/* Add all your existing legal sections (2-6) here */}
                    {/* 2. Liability Limitation Section */}
                    {/* 3. Dispute Resolution Section */} 
                    {/* 4. Subscription Terms Section */}
                    {/* 5. Data Protection & Privacy Section */}
                    {/* 6. Intellectual Property Section */}

                    {/* Complete Legal Agreement Section */}
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <h4 className="text-white font-semibold mb-3">📄 Complete Legal Agreement</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                        <div>
                          <h5 className="text-blue-400 font-semibold mb-2">✅ Entire Agreement</h5>
                          <p>
                            This document constitutes the <strong>complete and exclusive understanding</strong> between us regarding the services. 
                            It supersedes all prior discussions, agreements, and understandings of any kind.
                          </p>
                        </div>
                        <div>
                          <h5 className="text-green-400 font-semibold mb-2">⚖️ Severability</h5>
                          <p>
                            If any part of this agreement is found unenforceable, the <strong>remainder continues in full force</strong>. 
                            We'll replace invalid provisions with valid ones that achieve similar economic effect.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Scroll to bottom indicator */}
                    <div ref={bottomRef} className="text-center py-8">
                      {!hasScrolledToBottom ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6"
                        >
                          <div className="flex items-center justify-center gap-3 mb-3">
                            <svg className="w-6 h-6 text-blue-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            <span className="text-blue-400 font-semibold">Keep scrolling to review all terms</span>
                            <svg className="w-6 h-6 text-blue-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                          <p className="text-gray-400 text-sm">
                            Please read through all sections above before proceeding
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-green-500/10 border border-green-500/20 rounded-xl p-6"
                        >
                          <div className="flex items-center justify-center gap-3 mb-3">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-green-400 font-semibold text-lg">All Terms Reviewed</span>
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-gray-300 text-sm">
                            You may now proceed to accept the agreement and continue to client information
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-800 p-6 bg-gray-900/50 sticky bottom-0">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => {
                        setShowTerms(false)
                        setFlowStep('service-agreement')
                      }}
                      className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium flex-1"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleServiceAgreementAccept}
                      disabled={!hasScrolledToBottom}
                      className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 transform ${
                        hasScrolledToBottom
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 hover:scale-105 shadow-lg shadow-blue-500/25'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      } flex-1`}
                    >
                      {hasScrolledToBottom ? (
                        '✅ Accept Agreement & Continue'
                      ) : (
                        'Scroll to Review All Terms'
                      )}
                    </button>
                  </div>
                  <p className="text-center text-gray-500 text-xs mt-3">
                    {hasScrolledToBottom 
                      ? 'By clicking "Accept", you acknowledge reading and understanding all terms and agree to be legally bound'
                      : 'Please scroll through all terms before accepting'
                    }
                  </p>
                  
                  {/* Mobile helper text */}
                  <div className="block sm:hidden mt-2">
                    <p className="text-center text-blue-400 text-xs">
                      {!hasScrolledToBottom && '💡 Tip: Swipe up to scroll through all terms'}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Terms Acceptance Flow */}
            {flowStep === 'terms-acceptance' && (
              <div className="h-full">
                <div className="border-b border-gray-800 p-6 bg-gradient-to-r from-gray-900 to-black sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Client Information & Terms</h2>
                      <p className="text-gray-400 text-sm mt-1">Complete your details to proceed</p>
                    </div>
                    <button 
                      onClick={handleBackToServiceAgreement}
                      className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="h-[calc(95vh-200px)] overflow-hidden">
                  <TermsAcceptanceFlow 
                    package={pkg.name}
                    onAccept={handleTermsAccept}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  )
}