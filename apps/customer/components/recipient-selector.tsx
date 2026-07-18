'use client'

import { useState } from 'react'
import { ChevronRight, Heart, Flower2, Briefcase, Users, Gift, Cake, GraduationCap, Baby } from 'lucide-react'
import { GlassPanel } from './glass-panel'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

type RecipientItem = {
  id: string
  label: string
  icon: LucideIcon
  accent: 'lime' | 'cyan' | 'blue' | 'gold' | 'mphora'
}

const RECIPIENTS: RecipientItem[] = [
  { id: 'pareja', label: 'Pareja', icon: Heart, accent: 'mphora' },
  { id: 'mama', label: 'Mamá', icon: Flower2, accent: 'cyan' },
  { id: 'papa', label: 'Papá', icon: Briefcase, accent: 'blue' },
  { id: 'amistad', label: 'Amistad', icon: Users, accent: 'gold' },
  { id: 'cumpleanos', label: 'Cumpleaños', icon: Cake, accent: 'lime' },
  { id: 'graduacion', label: 'Graduación', icon: GraduationCap, accent: 'cyan' },
  { id: 'bebe', label: 'Bebé', icon: Baby, accent: 'gold' },
  { id: 'gracias', label: 'Gracias', icon: Gift, accent: 'lime' },
]

const ACCENT: Record<string, string> = {
  lime: 'text-[color:var(--color-lime)]',
  cyan: 'text-[color:var(--color-cyan)]',
  blue: 'text-[color:var(--color-blue-deep)]',
  gold: 'text-[color:var(--color-gold)]',
  mphora: 'text-[color:var(--color-mphora)]',
}

export function RecipientSelector() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <section id="ocasiones" aria-label="Para quién buscas un regalo" className="scroll-mt-20 px-4 lg:scroll-mt-24 lg:px-8">
      <GlassPanel className="mx-auto max-w-7xl p-4 lg:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold lg:text-lg">¿Para quién buscas un regalo?</h2>
          <Link
            href="/explorar"
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-[color:var(--color-lime)]"
          >
            Ver todos
            <ChevronRight className="size-4" />
          </Link>
        </div>

        <div className="no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible">
          {RECIPIENTS.map((r) => {
            const Icon = r.icon
            const active = selected === r.id
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(active ? null : r.id)}
                className={cn(
                  'flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all duration-200 active:scale-95',
                  active
                    ? 'border-[color:var(--color-border-lime)] bg-[color:var(--color-lime)]/12 text-foreground glow-lime'
                    : 'border-[color:var(--color-border-soft)] bg-white/[0.03] text-muted-foreground hover:border-white/25 hover:text-foreground',
                )}
              >
                <Icon className={cn('size-4', active ? 'text-[color:var(--color-lime)]' : ACCENT[r.accent])} />
                {r.label}
              </button>
            )
          })}
        </div>
      </GlassPanel>
    </section>
  )
}
