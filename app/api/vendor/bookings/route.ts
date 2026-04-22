import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('vendor_session')

  if (!session || session.value !== 'valid') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        id,
        room_type,
        price_usd,
        status,
        created_at,
        patients!inner(name),
        hospitals!inner(name),
        doctors!inner(name),
        vendor_tasks(id, task_name, is_complete)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    const result = data.map((b: any) => ({
      id: b.id,
      room_type: b.room_type,
      price_usd: b.price_usd,
      status: b.status,
      created_at: b.created_at,
      patient_name: b.patients.name,
      hospital_name: b.hospitals.name,
      doctor_name: b.doctors.name,
      task_id: b.vendor_tasks?.[0]?.id ?? null,
      task_name: b.vendor_tasks?.[0]?.task_name ?? null,
      task_complete: b.vendor_tasks?.[0]?.is_complete ?? false,
    }))

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
