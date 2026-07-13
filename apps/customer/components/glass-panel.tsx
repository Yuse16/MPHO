import { cn } from '@/lib/utils'

type GlassPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: 'div' | 'section' | 'article'
  elevated?: boolean
}

export function GlassPanel({
  as: Tag = 'div',
  elevated = false,
  className,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <Tag
      className={cn(
        elevated ? 'glass-elevated' : 'glass',
        'rounded-2xl',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
