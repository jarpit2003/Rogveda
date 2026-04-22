import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data: hospitals, error } = await supabaseAdmin
      .from('hospitals')
      .select('*')

    if (error) throw error

    const hospitalsWithDetails = await Promise.all(
      hospitals.map(async (hospital) => {
        const [{ data: doctors }, { data: pricing }] = await Promise.all([
          supabaseAdmin
            .from('doctors')
            .select('id, name, experience_years')
            .eq('hospital_id', hospital.id),
          supabaseAdmin
            .from('pricing')
            .select('doctor_id, room_type, price_usd')
            .eq('hospital_id', hospital.id),
        ])

        return {
          ...hospital,
          doctors: doctors ?? [],
          pricing: pricing ?? [],
        }
      })
    )

    return NextResponse.json(hospitalsWithDetails)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
