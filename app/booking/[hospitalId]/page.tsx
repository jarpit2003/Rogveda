import BookingClient from './BookingClient'

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ hospitalId: string }>
  searchParams: Promise<{ doctorId: string; roomType: string; price: string; hospitalName: string; doctorName: string; procedure: string }>
}) {
  const { hospitalId } = await params
  const { doctorId, roomType, price, hospitalName, doctorName, procedure } = await searchParams

  return (
    <BookingClient
      hospitalId={hospitalId}
      doctorId={doctorId}
      roomType={roomType}
      price={price}
      hospitalName={hospitalName}
      doctorName={doctorName}
      procedure={procedure}
    />
  )
}
