'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useState } from 'react'
import { Loader2, Shield, Activity, ClipboardList } from 'lucide-react'

export default function VendorLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignIn() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/vendor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Invalid credentials. Please try again.')
      } else {
        window.location.href = '/vendor/dashboard'
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f4c81] flex-col justify-between p-12">
        <div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Rogveda</h1>
          <p className="text-blue-200 text-sm mt-1">Medical Travel Platform</p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-white text-3xl font-bold leading-snug">
              Manage your bookings.<br />
              Help patients heal.
            </h2>
            <p className="text-blue-200 mt-3 text-sm leading-relaxed">
              The vendor portal gives you real-time visibility into patient bookings,
              task management, and procedure coordination — all in one place.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Activity, label: 'Live booking updates', desc: 'See new patient bookings the moment they arrive' },
              { icon: ClipboardList, label: 'Task management', desc: 'Track visa letters, transfers, and coordinator tasks' },
              { icon: Shield, label: 'Secure access', desc: 'Session-protected dashboard, cookie-based auth' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="bg-blue-700 rounded-lg p-2 mt-0.5">
                  <Icon size={16} className="text-blue-200" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{label}</p>
                  <p className="text-blue-300 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-400 text-xs">© 2024 Rogveda. All rights reserved.</p>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#0f4c81]">Rogveda</h1>
            <p className="text-gray-500 text-sm">Vendor Portal</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to your vendor account</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent transition"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                onClick={handleSignIn}
                disabled={loading || !username || !password}
                className="w-full bg-[#0f4c81] hover:bg-[#0d3f6e] disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition text-sm mt-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                Protected vendor access only. Unauthorized access is prohibited.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Patient?{' '}
            <a href="/" className="text-[#0f4c81] hover:underline font-medium">
              Browse hospitals →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
