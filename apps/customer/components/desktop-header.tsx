'use client'

import { useEffect, useState } from 'react'
import { UserRound } from 'lucide-react'
import { MphoLogo } from './mpho-logo'
import { LocationSelector } from './location-selector'
import { CartButton } from './cart-button'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Regalos', href: '#regalos' },
  { label: 'Ocasiones', href: '#ocasiones' },
  { label: 'MPHORA', href: '#mphora' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Ayuda', href: '#ayuda' },
]

export function DesktopHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'glass sticky top-0 z-40 hidden rounded-none border-x-0 border-t-0 transition-[height] duration-300 lg:block',
        scrolled ? 'h-[72px]' : 'h-20',
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center gap-6 px-8">
        <a href="#inicio" className="shrink-0">
          <MphoLogo />
        </a>

        <nav aria-label="Navegación principal" className="flex items-center gap-1">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-white/5 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <LocationSelector />
          <button
            type="button"
            aria-label="Mi cuenta"
            className="glass flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-foreground transition-all duration-200 hover:border-[color:var(--color-border-lime)] active:scale-95"
          >
            <UserRound className="size-4 text-[color:var(--color-lime)]" />
            Cuenta
          </button>
          <CartButton />
        </div>
      </div>
    </header>
  )
}
