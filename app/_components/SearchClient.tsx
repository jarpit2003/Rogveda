'use client'
import HospitalCard from '@/components/HospitalCard'
import CurrencyToggle from '@/components/CurrencyToggle'
import TrustSignals from '@/components/TrustSignals'
import type { HospitalWithDetails } from '@/lib/types'

export default function SearchClient({ hospitals }: { hospitals: HospitalWithDetails[] }) {
  return (
    <div className="min-h-screen bg-gray-50">
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
            Comparing {hospitals.length} accredited hospitals · Prices in your currency
          </p>
        </div>
      </div>

      {/* Trust Signals */}
      <TrustSignals />

      {/* Hospital Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {hospitals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hospitals found for this search.</p>
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
