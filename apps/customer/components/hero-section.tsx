'use client'

import { Sparkles, Gift } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { HeroCarousel } from '@/components/hero-carousel'

function Particles() {
  // Discreet golden particles for the hero. Positions are fixed for SSR stability.
  const dots = [
    { top: '12%', left: '62%', size: 3, delay: '0s' },
    { top: '22%', left: '82%', size: 2, delay: '0.6s' },
    { top: '38%', left: '70%', size: 4, delay: '1.1s' },
    { top: '52%', left: '88%', size: 2, delay: '0.3s' },
    { top: '30%', left: '55%', size: 2, delay: '1.6s' },
    { top: '64%', left: '74%', size: 3, delay: '0.9s' },
    { top: '18%', left: '92%', size: 2, delay: '2s' },
  ]
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="animate-sparkle absolute rounded-full bg-[color:var(--color-gold)]"
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
            boxShadow: '0 0 8px rgba(214, 180, 92, 0.8)',
          }}
        />
      ))}
    </div>
  )
}

function HeroButtons({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row', className)}>
      <Link
        href="/hadia"
        className="glow-lime flex h-13 min-h-[52px] items-center justify-center gap-2 rounded-full bg-[color:var(--color-lime)] px-6 text-base font-bold text-[color:var(--color-primary-foreground)] transition-all duration-200 hover:bg-[color:var(--color-lime-intense)] active:scale-[0.97]"
      >
        <Sparkles className="size-5" />
        Encontrar mi regalo
      </Link>
      <Link
        href="/explorar"
        className="glass flex h-13 min-h-[52px] items-center justify-center gap-2 rounded-full border-[color:var(--color-border-lime)] px-6 text-base font-semibold text-foreground transition-all duration-200 hover:bg-white/5 active:scale-[0.97]"
      >
        <Gift className="size-5 text-[color:var(--color-lime)]" />
        Explorar regalos
      </Link>
    </div>
  )
}

export function HeroSection() {
  return (
    <section
      id="inicio"
      aria-label="El regalo correcto, sin perder horas buscándolo"
      className="relative overflow-hidden"
    >
      {/* Halo glow behind the gift */}
      <div
        aria-hidden="true"
        className="animate-halo pointer-events-none absolute -right-16 top-8 size-72 rounded-full bg-[color:var(--color-lime)]/20 blur-3xl lg:right-24 lg:size-96"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pt-6 pb-4 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pt-14 lg:pb-10">
        {/* Mobile: image sits behind/beside text as a background band */}
        <div className="relative">
          {/* Background carousel only for mobile, absolutely placed to the right */}
          <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[62%] lg:hidden">
            <HeroCarousel
              sizes="60vw"
              priority
              className="h-full w-full"
              imageClassName="opacity-90"
            />
            <div className="absolute inset-0 z-[3] bg-gradient-to-r from-[color:var(--color-background)] via-[color:var(--color-background)]/70 to-transparent" />
            <div className="absolute inset-0 z-[3] bg-gradient-to-t from-[color:var(--color-background)] via-transparent to-transparent" />
          </div>
          <Particles />

          <div className="relative z-10 max-w-[85%] pt-4 pb-2 sm:max-w-md lg:max-w-none lg:pt-0">
            <h1 className="text-pretty text-[2.35rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              El regalo <span className="text-[color:var(--color-lime)] text-glow-lime">correcto,</span>{' '}
              sin perder horas buscándolo
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground lg:text-base">
              HADIA encuentra el regalo ideal según la{' '}
              <span className="font-semibold text-[color:var(--color-lime)]">persona</span>, la{' '}
              <span className="font-semibold text-[color:var(--color-lime)]">ocasión</span>, tu{' '}
              <span className="font-semibold text-[color:var(--color-lime)]">presupuesto</span> y el{' '}
              <span className="font-semibold text-[color:var(--color-lime)]">tiempo</span> que tienes.
            </p>

            <HeroButtons className="mt-7" />
          </div>
        </div>

        {/* Desktop carousel column */}
        <div className="relative hidden aspect-square w-full lg:block">
          <HeroCarousel
            sizes="(min-width: 1024px) 45vw, 100vw"
            priority
            rounded
            showDots
            className="h-full w-full"
          />
          <div className="pointer-events-none absolute inset-0 z-[3] rounded-3xl bg-gradient-to-l from-transparent via-transparent to-[color:var(--color-background)]/40" />
        </div>
      </div>
    </section>
  )
}
