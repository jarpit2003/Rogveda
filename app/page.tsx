import SearchClient from '@/app/_components/SearchClient'
import { supabaseAdmin } from '@/lib/supabase'
import type { HospitalWithDetails } from '@/lib/types'

export default async function HomePage() {
  let hospitals: HospitalWithDetails[] = []

  try {
    const { data: hospitalRows, error } = await supabaseAdmin.from('hospitals').select('*')
    if (error) throw error

    hospitals = await Promise.all(
      (hospitalRows ?? []).map(async (hospital) => {
        const [{ data: doctors }, { data: pricing }] = await Promise.all([
          supabaseAdmin.from('doctors').select('id, name, experience_years').eq('hospital_id', hospital.id),
          supabaseAdmin.from('pricing').select('doctor_id, room_type, price_usd').eq('hospital_id', hospital.id),
        ])
        return { ...hospital, doctors: doctors ?? [], pricing: pricing ?? [] }
      })
    )
  } catch {
    hospitals = []
  }

  return <SearchClient hospitals={hospitals} />
}
