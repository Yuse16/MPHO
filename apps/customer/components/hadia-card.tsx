'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { HadiaSphere } from './hadia-sphere'

export function HadiaCard() {
  return (
    <section aria-label="HADIA, inteligencia de regalos" className="px-4 lg:px-8">
      <Link
        href="/hadia"
        aria-label="Abrir HADIA, la inteligencia de regalos"
        className="group relative mx-auto flex w-full max-w-7xl items-center gap-4 overflow-hidden rounded-2xl border border-[color:var(--color-border-cyan)] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] lg:gap-6 lg:p-6"
        style={{
          background:
            'linear-gradient(135deg, rgba(6,16,26,0.92) 0%, rgba(4,12,22,0.92) 55%, rgba(8,20,34,0.92) 100%)',
        }}
      >
        {/* controlled blue glow */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 top-1/2 size-40 -translate-y-1/2 rounded-full bg-[color:var(--color-cyan)]/20 blur-3xl transition-opacity duration-300 group-hover:bg-[color:var(--color-cyan)]/30"
        />

        <HadiaSphere className="size-16 shrink-0 lg:size-20" float />

        <div className="relative min-w-0 flex-1">
          <span className="inline-flex items-center rounded-full border border-[color:var(--color-border-cyan)] bg-[color:var(--color-cyan)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-cyan)]">
            Inteligencia de regalos
          </span>
          <h2 className="mt-2 flex items-center gap-1.5 text-lg font-bold lg:text-2xl">
            Hola, soy <span className="text-[color:var(--color-cyan)]">HADIA</span>
            <Sparkles className="size-4 text-[color:var(--color-cyan)] lg:size-5" />
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground lg:max-w-xl">
            Cuéntame sobre la persona, la ocasión, tu presupuesto y el tiempo que tienes.
          </p>
        </div>

        <span
          aria-hidden="true"
          className="glow-cyan relative flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-cyan)] bg-[color:var(--color-cyan)]/10 text-[color:var(--color-cyan)] transition-all duration-200 group-hover:bg-[color:var(--color-cyan)]/20"
        >
          <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </section>
  )
}
