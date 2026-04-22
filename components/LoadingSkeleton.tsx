export default function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 border border-gray-100 animate-pulse">
      {/* Title + badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-5 bg-gray-200 rounded-full w-16" />
      </div>

      {/* Location + procedure */}
      <div className="h-4 bg-gray-200 rounded w-1/2" />

      {/* Doctor dropdown */}
      <div className="flex flex-col gap-2">
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-9 bg-gray-200 rounded-lg" />
      </div>

      {/* Room dropdown */}
      <div className="flex flex-col gap-2">
        <div className="h-3 bg-gray-200 rounded w-20" />
        <div className="h-9 bg-gray-200 rounded-lg" />
      </div>

      {/* Price */}
      <div className="h-8 bg-gray-200 rounded w-28" />

      {/* Tagline */}
      <div className="h-3 bg-gray-200 rounded w-3/4" />

      {/* Button */}
      <div className="h-10 bg-gray-200 rounded-xl mt-1" />
    </div>
  )
}
