'use client'

import { AuthProvider } from '@/lib/auth-context'
import { PartnerShell } from '@/components/partner-shell'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <PartnerShell>{children}</PartnerShell>
    </AuthProvider>
  )
}
