'use client'
import { useCurrency } from '@/context/CurrencyContext'
import type { Currency } from '@/lib/currency'

const currencies: Currency[] = ['USD', 'INR', 'NGN']

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency()

  return (
    <div className="flex flex-row border border-gray-300 rounded-lg overflow-hidden text-xs">
      {currencies.map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={`px-3 py-1 font-medium transition-colors ${
            currency === c
              ? 'bg-[#0f4c81] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
