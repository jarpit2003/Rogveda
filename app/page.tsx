import SearchClient from '@/app/_components/SearchClient'
import type { HospitalWithDetails } from '@/lib/types'

export default async function HomePage() {
  let hospitals: HospitalWithDetails[] = []

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/hospitals`, { cache: 'no-store' })
    if (res.ok) hospitals = await res.json()
  } catch {
    hospitals = []
  }

  return <SearchClient hospitals={hospitals} />
}
