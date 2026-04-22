import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const session = cookieStore.get('vendor_session')

  if (!session || session.value !== 'valid') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Step 1: Update vendor_task
    const { data: task, error: taskError } = await supabaseAdmin
      .from('vendor_tasks')
      .update({ is_complete: true, completed_at: new Date().toISOString() })
      .eq('id', id)
      .select('booking_id')
      .single()

    if (taskError) throw taskError

    // Step 2 & 3: Update booking status
    const { error: bookingError } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'In Progress' })
      .eq('id', task.booking_id)

    if (bookingError) throw bookingError

    return NextResponse.json({ success: true, booking_status: 'In Progress' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
