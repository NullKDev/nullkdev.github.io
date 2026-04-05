import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const typeStyles = {
  success:
    'border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300',
  error: 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300',
  info: 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300',
}

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
}

export function Toast({ message, type, onClose }: ToastProps) {
  const Icon = icons[type]

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg',
        'animate-in fade-in slide-in-from-right-full duration-200',
        typeStyles[type],
      )}
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', iconColors[type])} />
      <p className="flex-1 text-sm">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground -mt-1 -mr-1 rounded p-1 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
