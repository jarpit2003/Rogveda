interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="border border-red-300 bg-red-50 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium text-red-700 hover:text-red-900 underline whitespace-nowrap transition"
        >
          Retry
        </button>
      )}
    </div>
  )
}
