export type Currency = 'USD' | 'INR' | 'NGN'

const RATES: Record<Currency, number> = {
  USD: 1,
  INR: 83,
  NGN: 1550,
}

const SYMBOLS: Record<Currency, string> = {
  USD: '$',
  INR: '₹',
  NGN: '₦',
}

export function convertPrice(usdPrice: number, currency: Currency): string {
  const converted = usdPrice * RATES[currency]
  const symbol = SYMBOLS[currency]
  return `${symbol}${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

export function getCurrencySymbol(currency: Currency): string {
  return SYMBOLS[currency]
}
