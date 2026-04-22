import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  message: string
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 bg-gray-50 rounded-2xl text-center">
      <Inbox className="w-10 h-10 text-gray-400" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  )
}
