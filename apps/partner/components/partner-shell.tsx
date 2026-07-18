import type { ReactNode } from 'react'
import { PartnerSidebar } from './partner-sidebar'
import { PartnerBottomNav } from './partner-bottom-nav'
import { PartnerHeader } from './partner-header'

export function PartnerShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)]">
      <PartnerSidebar />
      <div className="lg:ml-64">
        <PartnerHeader />
        <main className="px-4 py-6 pb-24 lg:px-8 lg:py-8 lg:pb-8">{children}</main>
      </div>
      <PartnerBottomNav />
    </div>
  )
}
