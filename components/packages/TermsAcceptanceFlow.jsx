'use client'
import { useState } from 'react'
import SignatureCapture from '../ui/SignatureCapture'

export default function TermsAcceptanceFlow({ package: pkg, onAccept, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [accepted, setAccepted] = useState(false)
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')

  const handleAcceptTerms = async (signatureData) => {
    const acceptanceData = {
      clientName,
      clientEmail,
      package: pkg.name,
      signature: signatureData
    }

    const response = await fetch('/api/accept-terms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(acceptanceData)
    })

    if (response.ok) {
      const { acceptanceId } = await response.json()
      onAccept(acceptanceId)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Step 1: Terms Review */}
        {currentStep === 1 && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Terms & Conditions</h2>
            <div className="h-96 overflow-y-auto border p-4 mb-4">
              {/* Your terms content here */}
            </div>
            <label className="flex items-center mb-4">
              <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
              <span className="ml-2">I agree to the terms and conditions</span>
            </label>
            <div className="flex justify-between">
              <button onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
              <button 
                onClick={() => setCurrentStep(2)} 
                disabled={!accepted}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: User Info */}
        {currentStep === 2 && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Your Information</h2>
            <div className="space-y-4 mb-6">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-between">
              <button onClick={() => setCurrentStep(1)} className="px-4 py-2 border rounded">Back</button>
              <button 
                onClick={() => setCurrentStep(3)} 
                disabled={!clientName || !clientEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Continue to Signature
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Signature */}
        {currentStep === 3 && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">E-Signature</h2>
            <SignatureCapture 
              onSignatureSave={handleAcceptTerms}
              onCancel={() => setCurrentStep(2)}
            />
          </div>
        )}
      </div>
    </div>
  )
}