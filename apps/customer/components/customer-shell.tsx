import type { ReactNode } from 'react'
import { DesktopHeader } from './desktop-header'
import { FloatingCartButton } from './floating-cart-button'
import { MobileBottomNavigation } from './mobile-bottom-navigation'
import { MobileHeader } from './mobile-header'

export function CustomerShell({ children }: { children: ReactNode }) {
  return (
    <div className="mpho-bg min-h-screen">
      <MobileHeader />
      <DesktopHeader />
      {children}
      <MobileBottomNavigation />
      <FloatingCartButton />
    </div>
  )
}
