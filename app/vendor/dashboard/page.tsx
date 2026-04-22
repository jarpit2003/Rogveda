'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import type { VendorBooking } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(8)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
        </td>
      ))}
    </tr>
  )
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Confirmed': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    'In Progress': 'bg-blue-100 text-blue-800 border border-blue-300',
    'Completed': 'bg-green-100 text-green-800 border border-green-300',
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}

export default function VendorDashboardPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<VendorBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState<Record<string, boolean>>({})

  async function fetchBookings() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/vendor/bookings')
      if (!res.ok) throw new Error('Failed to load bookings')
      setBookings(await res.json())
    } catch {
      setError('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  useEffect(() => {
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings' },
        async () => {
          const res = await fetch('/api/vendor/bookings')
          const data = await res.json()
          setBookings(data)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function markComplete(taskId: string, bookingId: string) {
    setUpdating(prev => ({ ...prev, [taskId]: true }))
    try {
      const res = await fetch(`/api/vendor/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_complete: true }),
      })
      if (res.ok) {
        toast.success('Task marked complete!')
        setBookings(prev =>
          prev.map(b =>
            b.id === bookingId ? { ...b, task_complete: true, status: 'In Progress' } : b
          )
        )
      } else {
        toast.error('Failed to update. Please try again.')
      }
    } finally {
      setUpdating(prev => ({ ...prev, [taskId]: false }))
    }
  }

  async function handleLogout() {
    await fetch('/api/vendor/logout', { method: 'DELETE' })
    router.push('/vendor/login')
  }

  const total = bookings.length
  const confirmed = bookings.filter(b => b.status === 'Confirmed').length
  const inProgress = bookings.filter(b => b.status === 'In Progress').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b px-4 sm:px-6 py-4 flex items-center justify-between gap-2">
        <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">Rogveda Vendor Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            Apollo Spectra
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 font-medium transition min-h-[44px] px-2"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Bookings', value: total },
            { label: 'Confirmed', value: confirmed },
            { label: 'In Progress', value: inProgress },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-5 text-center">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Table area */}
        {loading ? (
          <div className="overflow-x-auto rounded-xl shadow-sm">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  {['Patient', 'Procedure', 'Doctor', 'Room', 'Price', 'Status', 'Task', 'Action'].map(col => (
                    <th key={col} className="px-4 py-3 text-left font-medium whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        ) : error ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchBookings}
              className="text-sm text-blue-600 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No bookings yet. Patient bookings will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-sm">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  {['Patient', 'Procedure', 'Doctor', 'Room', 'Price', 'Status', 'Task', 'Action'].map(col => (
                    <th key={col} className="px-4 py-3 text-left font-medium whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{b.patient_name}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">Total Knee Replacement</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.doctor_name}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.room_type}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      ${b.price_usd.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusPill status={b.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.task_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {b.task_complete ? (
                        <button disabled className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg cursor-default">
                          ✓ Visa Letter Sent
                        </button>
                      ) : (
                        <button
                          onClick={() => markComplete(b.task_id, b.id)}
                          disabled={updating[b.task_id]}
                          className="text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                        >
                          {updating[b.task_id] && <Loader2 className="w-3 h-3 animate-spin" />}
                          Mark Visa Letter Sent
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
