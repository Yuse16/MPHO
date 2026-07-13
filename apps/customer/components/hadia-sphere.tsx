import { cn } from '@/lib/utils'

export function HadiaSphere({
  className,
  showLabel = true,
  float = false,
}: {
  className?: string
  showLabel?: boolean
  float?: boolean
}) {
  return (
    <span
      className={cn(
        'relative inline-flex items-center justify-center rounded-full',
        float && 'animate-float',
        className,
      )}
    >
      {/* glow */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full blur-md"
        style={{ background: 'radial-gradient(circle at 50% 45%, rgba(22,217,255,0.55), rgba(0,109,255,0.25) 60%, transparent 75%)' }}
      />
      {/* crystal body */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-[color:var(--color-border-cyan)]"
        style={{
          background:
            'radial-gradient(circle at 35% 28%, rgba(255,255,255,0.75) 0%, rgba(22,217,255,0.55) 22%, rgba(0,90,190,0.85) 62%, rgba(2,10,30,0.95) 100%)',
          boxShadow: 'inset 0 -6px 14px rgba(0,0,0,0.55), inset 0 4px 10px rgba(255,255,255,0.35), 0 0 22px rgba(22,217,255,0.5)',
        }}
      />
      {/* top highlight */}
      <span
        aria-hidden="true"
        className="absolute left-[26%] top-[16%] h-1/4 w-1/3 rounded-full bg-white/70 blur-[3px]"
      />
      {showLabel && (
        <span className="relative z-10 font-sans text-[0.6rem] font-bold tracking-widest text-white drop-shadow-[0_0_6px_rgba(0,0,0,0.6)]">
          HADIA
        </span>
      )}
    </span>
  )
}
