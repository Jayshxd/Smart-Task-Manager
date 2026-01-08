import { cn, stringToColor } from '@/lib/utils'

interface TagPillProps {
  tag: string
  size?: 'sm' | 'md'
  onRemove?: () => void
}

export function TagPill({ tag, size = 'md', onRemove }: TagPillProps) {
  const colors = stringToColor(tag)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium transition-all',
        colors.bg,
        colors.text,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      )}
    >
      <span className="truncate max-w-[100px]">{tag}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 hover:bg-white/10 rounded-full p-0.5 transition-colors"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  )
}
