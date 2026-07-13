'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export const HERO_SLIDES = [
  {
    src: '/images/hero-gift.png',
    alt: 'Caja de regalo negra con listón verde y chocolates premium',
  },
  {
    src: '/images/hero-gift-2.png',
    alt: 'Caja de regalo negra con rosas rojas premium y velas',
  },
  {
    src: '/images/hero-gift-3.png',
    alt: 'Set de bienestar premium con perfume y vela en caja negra',
  },
  {
    src: '/images/hero-gift-4.png',
    alt: 'Cajas de regalo negras apiladas con trufas de chocolate',
  },
] as const

const INTERVAL = 3000

type HeroCarouselProps = {
  className?: string
  imageClassName?: string
  sizes: string
  priority?: boolean
  rounded?: boolean
  showDots?: boolean
}

export function HeroCarousel({
  className,
  imageClassName,
  sizes,
  priority = false,
  rounded = false,
  showDots = false,
}: HeroCarouselProps) {
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_SLIDES.length)
    }, INTERVAL)
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    start()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [start])

  const goTo = (i: number) => {
    setActive(i)
    start()
  }

  return (
    <div className={cn('relative overflow-hidden', rounded && 'rounded-3xl', className)}>
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== active}
          data-active={i === active}
          className="hero-slide absolute inset-0"
        >
          {/* keyed inner wrapper restarts Ken Burns each time the slide becomes active */}
          <div key={`${slide.src}-${active === i}`} className="hero-slide-img absolute inset-0">
            <Image
              src={slide.src || '/placeholder.svg'}
              alt={i === active ? slide.alt : ''}
              fill
              priority={priority && i === 0}
              sizes={sizes}
              className={cn('object-cover object-center', imageClassName)}
            />
          </div>
        </div>
      ))}

      {showDots && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver imagen ${i + 1} de ${HERO_SLIDES.length}`}
              aria-current={i === active}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500',
                i === active
                  ? 'w-7 bg-[color:var(--color-lime)] shadow-[0_0_12px_rgba(200,255,53,0.7)]'
                  : 'w-1.5 bg-white/40 hover:bg-white/70',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
