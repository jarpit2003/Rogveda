import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patient_id, hospital_id, doctor_id, room_type, price_usd } = body

    if (!patient_id || !hospital_id || !doctor_id || !room_type || !price_usd) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (typeof price_usd !== 'number' || price_usd <= 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Step 1: Insert booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({ patient_id, hospital_id, doctor_id, room_type, price_usd, status: 'Confirmed' })
      .select('id')
      .single()

    if (bookingError) throw bookingError

    const booking_id = booking.id

    // Step 2: Insert wallet transaction
    const { error: txError } = await supabaseAdmin
      .from('wallet_transactions')
      .insert({ patient_id, booking_id, amount: -price_usd, type: 'booking_charge' })

    if (txError) throw txError

    // Step 3: Update wallet balance
    const { data: currentPatient, error: fetchError } = await supabaseAdmin
      .from('patients')
      .select('wallet_balance')
      .eq('id', patient_id)
      .single()

    if (fetchError) throw fetchError

    const { data: patient, error: walletError } = await supabaseAdmin
      .from('patients')
      .update({ wallet_balance: currentPatient.wallet_balance - price_usd })
      .eq('id', patient_id)
      .select('wallet_balance')
      .single()

    if (walletError) throw walletError

    // Step 4: Insert vendor task
    const { error: taskError } = await supabaseAdmin
      .from('vendor_tasks')
      .insert({ booking_id, task_name: 'Visa Invite Letter', is_complete: false })

    if (taskError) throw taskError

    return NextResponse.json({ booking_id, new_wallet_balance: patient.wallet_balance })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
