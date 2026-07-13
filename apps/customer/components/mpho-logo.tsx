import { cn } from '@/lib/utils'

export function MphoLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'select-none font-sans text-2xl font-medium tracking-[0.35em] text-[color:var(--color-lime)] text-glow-lime',
        className,
      )}
      aria-label="MPHO"
    >
      MPHO
    </span>
  )
}
