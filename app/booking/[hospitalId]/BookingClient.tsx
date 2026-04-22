'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCurrency } from '@/context/CurrencyContext'
import { convertPrice } from '@/lib/currency'
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react'

interface BookingClientProps {
  hospitalId: string
  doctorId: string
  roomType: string
  price: string
  hospitalName: string
  doctorName: string
  procedure: string
}

export default function BookingClient({
  hospitalId,
  doctorId,
  roomType,
  price,
  hospitalName,
  doctorName,
  procedure,
}: BookingClientProps) {
  const router = useRouter()
  const { currency } = useCurrency()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [patientName, setPatientName] = useState('Demo Patient')
  const [patientEmail, setPatientEmail] = useState('')

  const handleConfirm = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await fetch('/api/patients/e1111111-1111-1111-1111-111111111111', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: patientName, email: patientEmail }),
      })
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: 'e1111111-1111-1111-1111-111111111111',
          hospital_id: hospitalId,
          doctor_id: doctorId,
          room_type: roomType,
          price_usd: Number(price),
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error ?? 'Booking failed')
      router.push(
        `/confirmation?bookingId=${result.booking_id}&balance=${result.new_wallet_balance}&hospitalName=${encodeURIComponent(hospitalName)}&doctorName=${encodeURIComponent(doctorName)}&roomType=${encodeURIComponent(roomType)}&price=${price}`
      )
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-800">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold text-[#0f4c81]">Confirm Your Booking</h1>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
          <h2 className="text-xl font-bold text-gray-900">{hospitalName}</h2>
          <p className="text-sm text-gray-500">{procedure}</p>
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-500">Doctor</span>
              <span className="font-medium">{doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Room Type</span>
              <span className="font-medium">{roomType}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-500">Total Price</span>
              <span className="text-2xl font-bold text-[#0f4c81]">
                {convertPrice(Number(price), currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Your Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
          <h3 className="font-semibold text-gray-800">Your Details</h3>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              value={patientName}
              onChange={e => setPatientName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-[11px] text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={patientEmail}
              onChange={e => setPatientEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-[11px] text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Wallet Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
          <h3 className="font-semibold text-gray-800">Your Rogveda Wallet</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Current Balance</span>
            <span className="font-medium text-gray-800">$0.00</span>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800">
            <strong>BNPL Enabled</strong> — Book now, your balance will go negative. Pay before your procedure date.
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-3">What&apos;s Included</h3>
          <ul className="flex flex-col gap-2">
            {[
              'Visa invitation letter assistance',
              'Airport transfer coordination',
              'Dedicated patient coordinator',
              'Post-operative support & follow-up',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle size={15} className="text-green-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="w-full bg-[#0f4c81] hover:bg-[#0d3f6e] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? 'Processing...' : 'Confirm Booking'}
        </button>

        <Link href="/" className="text-center text-sm text-gray-400 hover:text-gray-600">
          Cancel
        </Link>
      </div>
    </div>
  )
}
