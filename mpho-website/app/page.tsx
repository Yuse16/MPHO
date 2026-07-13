import { CartProvider } from '@/lib/cart-context'
import { MobileHeader } from '@/components/mobile-header'
import { DesktopHeader } from '@/components/desktop-header'
import { HeroSection } from '@/components/hero-section'
import { RecipientSelector } from '@/components/recipient-selector'
import { HadiaCard } from '@/components/hadia-card'
import { MphoraSection } from '@/components/mphora-section'
import { TrustNetworkSection } from '@/components/trust-network-section'
import { SiteFooter } from '@/components/site-footer'
import { MobileBottomNavigation } from '@/components/mobile-bottom-navigation'
import { FloatingCartButton } from '@/components/floating-cart-button'

export default function Home() {
  return (
    <CartProvider initialCount={2}>
      <div className="mpho-bg min-h-screen">
        <MobileHeader />
        <DesktopHeader />

        <main className="flex flex-col gap-8 pb-28 pt-2 lg:gap-12 lg:pb-8">
          <HeroSection />
          <RecipientSelector />
          <HadiaCard />
          <MphoraSection />
          <TrustNetworkSection />
          <SiteFooter />
        </main>

        <MobileBottomNavigation />
        <FloatingCartButton />
      </div>
    </CartProvider>
  )
}
