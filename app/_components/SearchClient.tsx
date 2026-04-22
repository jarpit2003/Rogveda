'use client'
import HospitalCard from '@/components/HospitalCard'
import CurrencyToggle from '@/components/CurrencyToggle'
import TrustSignals from '@/components/TrustSignals'
import type { HospitalWithDetails } from '@/lib/types'
import { Info } from 'lucide-react'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="h-7 bg-gray-200 rounded w-1/3" />
        <div className="h-11 bg-gray-200 rounded-xl" />
      </div>
    </div>
  )
}

export default function SearchClient({ hospitals }: { hospitals: HospitalWithDetails[] }) {
  const isLoading = hospitals.length === 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs text-amber-800">
          <Info size={13} className="shrink-0" />
          <span>
            <strong>Demo build</strong> — If cards take a moment to load, the Supabase free-tier instance is waking up. Data is live from a real PostgreSQL database.
          </span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#0f4c81]">Rogveda</h1>
          <CurrencyToggle />
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-white px-4 py-8 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Total Knee Replacement in Delhi
          </h2>
          <p className="text-sm text-gray-500">
            {isLoading
              ? 'Loading accredited hospitals...'
              : `Comparing ${hospitals.length} accredited hospitals · Prices in your currency`}
          </p>
        </div>
      </div>

      {/* Trust Signals */}
      <TrustSignals />

      {/* Hospital Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
