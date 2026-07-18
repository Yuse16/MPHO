import { CustomerPageHeading } from '@/components/customer-page-heading'
import { CustomerShell } from '@/components/customer-shell'
import { HadiaStarter } from '@/components/hadia-starter'

export default function HadiaPage() {
  return (
    <CustomerShell>
      <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-10 sm:px-8 lg:pb-16 lg:pt-14">
        <CustomerPageHeading
          eyebrow="Inteligencia de regalos"
          title="Hola, soy HADIA"
          description="Te ayudaré a elegir según la persona, la ocasión, tu presupuesto, la fecha y la zona de entrega, siempre con información real de MPHO."
          accent="cyan"
        />
        <HadiaStarter />
      </main>
    </CustomerShell>
  )
}
