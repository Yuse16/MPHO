import { HeroSection } from '@/components/hero-section'
import { RecipientSelector } from '@/components/recipient-selector'
import { HadiaCard } from '@/components/hadia-card'
import { MphoraSection } from '@/components/mphora-section'
import { TrustNetworkSection } from '@/components/trust-network-section'
import { SiteFooter } from '@/components/site-footer'
import { CustomerShell } from '@/components/customer-shell'

export default function Home() {
  return (
    <CustomerShell>
      <main className="flex flex-col gap-8 pb-28 pt-2 lg:gap-12 lg:pb-8">
        <HeroSection />
        <RecipientSelector />
        <HadiaCard />
        <MphoraSection />
        <TrustNetworkSection />
        <SiteFooter />
      </main>
    </CustomerShell>
  )
}
