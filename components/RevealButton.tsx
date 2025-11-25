'use client'

import { useState } from 'react'
import { Eye, Lock, Mail, Phone, Loader2 } from 'lucide-react'
import { revealContact } from '@/actions/reveal-contact'

interface RevealButtonProps {
  contactId: string
  type: 'email' | 'phone'
}

export default function RevealButton({ contactId, type }: RevealButtonProps) {
  const [revealedValue, setRevealedValue] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)

  const handleReveal = async () => {
    if (loading || revealedValue) return

    setLoading(true)
    setError(null)

    try {
      const result = await revealContact(contactId)

      if (result.error) {
        if (result.limitReached) {
          setLimitReached(true)
        } else {
          setError(result.error)
        }
      } else if (result.data) {
        setRevealedValue(type === 'email' ? result.data.email : result.data.phone)
      }
    } catch (err) {
      setError('Failed to reveal')
    } finally {
      setLoading(false)
    }
  }

  if (limitReached) {
    return (
      <>
        <button
          disabled
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md border border-red-100 cursor-not-allowed opacity-75"
        >
          <Lock className="w-3 h-3" />
          Limit Reached
        </button>
        
        {/* Modal Overlay */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Daily Limit Reached</h3>
              <p className="text-gray-500 mb-6">
                You have viewed 50 contacts today. To access more contacts and unlock unlimited views, please upgrade your plan.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => setLimitReached(false)}
                  className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Upgrade to Pro
                </button>
                <button
                  onClick={() => setLimitReached(false)}
                  className="w-full text-gray-600 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t text-center">
              <p className="text-xs text-gray-500">
                Need help? <a href="#" className="text-blue-600 hover:underline">Contact Support</a>
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (revealedValue) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-900 font-medium bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
        {type === 'email' ? <Mail className="w-3.5 h-3.5 text-gray-500" /> : <Phone className="w-3.5 h-3.5 text-gray-500" />}
        {revealedValue}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start">
      <button
        onClick={handleReveal}
        disabled={loading}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all active:scale-95"
      >
        {loading ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            Revealing...
          </>
        ) : (
          <>
            <Eye className="w-3 h-3" />
            Reveal {type === 'email' ? 'Email' : 'Phone'}
          </>
        )}
      </button>
      {error && <span className="text-xs text-red-500 mt-1 font-medium">{error}</span>}
    </div>
  )
}
