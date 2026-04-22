'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function VendorLoginPage() {
  const router = useRouter()
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
        router.push('/vendor/dashboard')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8 space-y-5">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Rogveda Vendor Portal</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-[11px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-[11px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition min-h-[44px]"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign In
        </button>
      </div>
    </div>
  )
}
