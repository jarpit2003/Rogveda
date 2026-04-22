'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { CheckCircle, Copy, Check } from 'lucide-react'
import { useCurrency } from '@/context/CurrencyContext'
import { convertPrice } from '@/lib/currency'

function ConfirmationContent() {
  const params = useSearchParams()
  const router = useRouter()
  const { currency } = useCurrency()
  const [copied, setCopied] = useState(false)

  const bookingId = params.get('bookingId') ?? ''
  const balance = parseFloat(params.get('balance') ?? '0')
  const hospitalName = params.get('hospitalName') ?? ''
  const doctorName = params.get('doctorName') ?? ''
  const roomType = params.get('roomType') ?? ''
  const price = parseFloat(params.get('price') ?? '0')

  function copyBookingId() {
    navigator.clipboard.writeText(bookingId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md max-w-lg w-full p-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <CheckCircle className="text-green-500 w-16 h-16" />
          <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
        </div>

        {/* Booking ID */}
        <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3">
          <div>
            <p className="text-xs text-gray-500">Booking ID</p>
            <p className="font-mono font-semibold text-gray-800">{bookingId}</p>
          </div>
          <button onClick={copyBookingId} className="text-gray-500 hover:text-gray-800 transition">
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <h2 className="font-semibold text-gray-700">Booking Summary</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Hospital:</span> {hospitalName}</p>
            <p><span className="font-medium">Doctor:</span> {doctorName}</p>
            <p><span className="font-medium">Room Type:</span> {roomType}</p>
            <p><span className="font-medium">Price:</span> {convertPrice(price, currency)}</p>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 space-y-1">
          <p className="font-semibold text-red-600">
            Wallet Balance: {convertPrice(balance, currency)}
          </p>
          <p className="text-xs text-gray-500">
            Your coordinator will reach out to discuss payment options.
          </p>
        </div>

        {/* Next Steps */}
        <div className="space-y-2">
          <h2 className="font-semibold text-gray-700">Next Steps</h2>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
            <li>Visa invitation letter will be sent within 48 hours</li>
            <li>Your coordinator will call you within 2 hours</li>
            <li>Travel and accommodation guidance will be emailed to you</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => router.push('/')}
            className="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition min-h-[44px]"
          >
            Book Another Procedure
          </button>
          <button
            onClick={() => {}}
            className="w-full sm:w-auto flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition min-h-[44px]"
          >
            Contact Coordinator
          </button>
        </div>

      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
