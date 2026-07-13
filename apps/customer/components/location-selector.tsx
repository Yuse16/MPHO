'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, ChevronDown, Check } from 'lucide-react'
import { CITIES, type City } from '@/lib/data'
import { cn } from '@/lib/utils'

export function LocationSelector({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [city, setCity] = useState<City | null>(CITIES[0])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Seleccionar ciudad de entrega"
        className={cn(
          'glass flex h-11 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-all duration-200 active:scale-[0.97]',
          city ? 'text-foreground' : 'text-[color:var(--color-mphora)]',
        )}
      >
        <MapPin
          className={cn('size-4 shrink-0', city ? 'text-[color:var(--color-lime)]' : 'text-[color:var(--color-mphora)]')}
        />
        <span className="max-w-[7.5rem] truncate">{city?.name ?? 'Elige tu ciudad'}</span>
        <ChevronDown className={cn('size-4 shrink-0 text-faint transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Ciudades disponibles"
          className="glass-elevated absolute left-0 top-[calc(100%+0.5rem)] z-50 w-52 overflow-hidden rounded-xl p-1.5"
        >
          {CITIES.map((c) => {
            const active = c.id === city?.id
            return (
              <li key={c.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    setCity(c)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                    active
                      ? 'bg-[color:var(--color-lime)]/12 text-foreground'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                  )}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="size-4 text-[color:var(--color-lime)]" />
                    {c.name}
                    {c.status === 'planned' && (
                      <span className="text-xs text-faint">(próximamente)</span>
                    )}
                  </span>
                  {active && <Check className="size-4 text-[color:var(--color-lime)]" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
