interface ThinkingIndicatorProps {
  className?: string
  label?: string
  variant?: 'surface' | 'terminal'
}

export default function ThinkingIndicator({
  className = '',
  label = 'AI is thinking...',
  variant = 'surface',
}: ThinkingIndicatorProps) {
  const variantClass =
    variant === 'terminal'
      ? 'thinking-spotlight-terminal'
      : 'thinking-spotlight-surface'

  return (
    <span className={className}>
      <span className={`thinking-spotlight ${variantClass}`}>{label}</span>
    </span>
  )
}
