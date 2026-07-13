'use client'

import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { MphoLogo } from './mpho-logo'
import { LocationSelector } from './location-selector'
import { CartButton } from './cart-button'
import { cn } from '@/lib/utils'

export function MobileHeader() {
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
        'glass sticky top-0 z-40 flex items-center gap-2 rounded-none border-x-0 border-t-0 px-4 transition-[height,background-color] duration-300 lg:hidden',
        scrolled ? 'h-16' : 'h-[76px]',
      )}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <MphoLogo className={cn('transition-all duration-300', scrolled ? 'text-xl' : 'text-2xl')} />

      <div className="ml-auto flex items-center gap-2">
        <LocationSelector />
        <CartButton />
        <button
          type="button"
          aria-label="Abrir menú"
          className="glass hidden size-11 items-center justify-center rounded-full transition-transform active:scale-95 min-[420px]:flex"
        >
          <Menu className="size-5 text-foreground" />
        </button>
      </div>
    </header>
  )
}
