import { PartnerShell } from '@/components/partner-shell'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PartnerShell>{children}</PartnerShell>
}
