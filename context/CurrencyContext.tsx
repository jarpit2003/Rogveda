'use client'
import { createContext, useContext, useState } from 'react'
import type { Currency } from '@/lib/currency'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (c: Currency) => void
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {}
})

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD')
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
