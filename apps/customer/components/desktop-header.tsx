'use client'

import { useEffect, useState } from 'react'
import { UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MphoLogo } from './mpho-logo'
import { LocationSelector } from './location-selector'
import { CartButton } from './cart-button'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Inicio', href: '/', pathname: '/' },
  { label: 'Regalos', href: '/explorar', pathname: '/explorar' },
  { label: 'Ocasiones', href: '/#ocasiones' },
  { label: 'MPHORA', href: '/hadia', pathname: '/hadia' },
  { label: 'Cómo funciona', href: '/#como-funciona' },
  { label: 'Ayuda', href: '/#ayuda' },
]

export function DesktopHeader() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

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
        <Link href="/" aria-label="Ir al inicio de MPHO" className="shrink-0">
          <MphoLogo />
        </Link>

        <nav aria-label="Navegación principal" className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.pathname === pathname ? 'page' : undefined}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200 hover:bg-white/5 hover:text-foreground',
                item.pathname === pathname ? 'bg-white/5 text-foreground' : 'text-muted-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <LocationSelector />
          <Link
            href="/perfil"
            aria-label="Mi cuenta"
            aria-current={pathname === '/perfil' ? 'page' : undefined}
            className={cn(
              'glass flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-foreground transition-all duration-200 hover:border-[color:var(--color-border-lime)] active:scale-95',
              pathname === '/perfil' && 'border-[color:var(--color-border-lime)]',
            )}
          >
            <UserRound className="size-4 text-[color:var(--color-lime)]" />
            Cuenta
          </Link>
          <CartButton />
        </div>
      </div>
    </header>
  )
}
