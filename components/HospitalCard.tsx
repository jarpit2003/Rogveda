'use client'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrency } from '@/context/CurrencyContext'
import { convertPrice } from '@/lib/currency'
import type { HospitalWithDetails } from '@/lib/types'

const hospitalImages: Record<string, string> = {
  'a0000000-0000-0000-0000-000000000001': 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=400&q=80',
  'a0000000-0000-0000-0000-000000000002': 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80',
  'a0000000-0000-0000-0000-000000000003': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80',
}

export default function HospitalCard({ hospital }: { hospital: HospitalWithDetails }) {
  const router = useRouter()
  const { currency } = useCurrency()

  const getAvailableRooms = (doctorId: string) =>
    [...new Set(hospital.pricing.filter((p) => p.doctor_id === doctorId).map((p) => p.room_type))]

  const getLowestPrice = (doctorId: string) => {
    const prices = hospital.pricing.filter((p) => p.doctor_id === doctorId).map((p) => p.price_usd)
    return prices.length ? Math.min(...prices) : 0
  }

  const getPrice = (doctorId: string, roomType: string) =>
    hospital.pricing.find((p) => p.doctor_id === doctorId && p.room_type === roomType)?.price_usd ?? 0

  const defaultDoctor = hospital.doctors[0]
  const defaultRooms = getAvailableRooms(defaultDoctor?.id ?? '')
  const defaultRoom = defaultRooms[0] ?? ''

  const [selectedDoctorId, setSelectedDoctorId] = useState(defaultDoctor?.id ?? '')
  const [selectedRoomType, setSelectedRoomType] = useState(defaultRoom)

  const availableRooms = getAvailableRooms(selectedDoctorId)
  const currentPrice = getPrice(selectedDoctorId, selectedRoomType)
  const lowestPrice = getLowestPrice(selectedDoctorId)
  const isLowest = currentPrice === lowestPrice && currentPrice > 0
  const selectedDoctor = hospital.doctors.find((d) => d.id === selectedDoctorId)

  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctorId(doctorId)
    const rooms = getAvailableRooms(doctorId)
    setSelectedRoomType(rooms[0] ?? '')
  }

  const handleBook = () => {
    const params = new URLSearchParams({
      doctorId: selectedDoctorId,
      roomType: selectedRoomType,
      price: String(currentPrice),
      hospitalName: hospital.name,
      doctorName: selectedDoctor?.name ?? '',
      procedure: hospital.procedure,
    })
    router.push(`/booking/${hospital.id}?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-md flex flex-col border border-gray-100 overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={hospitalImages[hospital.id] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80'}
          alt={hospital.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-bold text-gray-900">{hospital.name}</h2>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full whitespace-nowrap">
          {hospital.accreditation}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>📍 {hospital.location}</span>
        <span className="text-gray-300">·</span>
        <span>{hospital.procedure}</span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-600">Select Doctor</label>
        <select
          value={selectedDoctorId}
          onChange={(e) => handleDoctorChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-[11px] text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {hospital.doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.experience_years} yrs exp)
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-600">Room Type</label>
        <select
          value={selectedRoomType}
          onChange={(e) => setSelectedRoomType(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-[11px] text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {availableRooms.map((room) => (
            <option key={room} value={room}>{room}</option>
          ))}
        </select>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-[#0f4c81]">
          {convertPrice(currentPrice, currency)}
        </span>
        {isLowest && (
          <span className="text-xs text-green-600 font-medium mb-1">Lowest price</span>
        )}
      </div>

      <p className="text-xs text-gray-400">Free visa assistance · NABH certified · BNPL available</p>

      <button
        onClick={handleBook}
        className="mt-1 w-full bg-[#0f4c81] hover:bg-[#0d3f6e] text-white font-semibold py-3 rounded-xl text-sm transition-colors min-h-[44px]"
      >
        Book Now →
      </button>
      </div>
    </div>
  )
}
