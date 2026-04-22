export interface Hospital {
  id: string
  name: string
  location: string
  procedure: string
  image_url: string | null
  accreditation: string
}

export interface Doctor {
  id: string
  hospital_id: string
  name: string
  experience_years: number
}

export interface Pricing {
  id: string
  hospital_id: string
  doctor_id: string
  room_type: string
  price_usd: number
}

export interface HospitalWithDetails extends Hospital {
  doctors: Doctor[]
  pricing: Pricing[]
}

export interface Patient {
  id: string
  name: string
  email: string | null
  wallet_balance: number
}

export interface Booking {
  id: string
  patient_id: string
  hospital_id: string
  doctor_id: string
  room_type: string
  price_usd: number
  status: string
  created_at: string
}

export interface VendorTask {
  id: string
  booking_id: string
  task_name: string
  is_complete: boolean
  completed_at: string | null
}

export interface WalletTransaction {
  id: string
  patient_id: string
  booking_id: string
  amount: number
  type: string
}

export interface VendorBooking {
  id: string
  patient_name: string
  hospital_name: string
  doctor_name: string
  room_type: string
  price_usd: number
  status: string
  created_at: string
  task_id: string
  task_name: string
  task_complete: boolean
}
