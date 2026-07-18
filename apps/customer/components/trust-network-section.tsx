import { MapPin, Truck, ShieldCheck, UserRound } from 'lucide-react'
import { GlassPanel } from './glass-panel'

const BENEFITS = [
  { icon: Truck, title: 'Entrega rápida', sub: 'en horas' },
  { icon: ShieldCheck, title: 'Calidad verificada', sub: 'por MPHO' },
  { icon: UserRound, title: 'Atención personalizada', sub: 'y segura' },
]

export function TrustNetworkSection() {
  return (
    <section id="como-funciona" aria-label="Preparado cerca, coordinado por MPHO" className="scroll-mt-20 px-4 lg:scroll-mt-24 lg:px-8">
      <GlassPanel className="mx-auto flex max-w-7xl flex-col gap-5 p-5 lg:flex-row lg:items-center lg:gap-8 lg:p-7">
        <div className="flex items-center gap-4 lg:shrink-0">
          {/* radar */}
          <span className="pulse-ring relative flex size-16 items-center justify-center rounded-full border border-[color:var(--color-border-lime)] bg-[color:var(--color-lime)]/8">
            <span className="animate-spin-slow absolute inset-1 rounded-full border border-dashed border-[color:var(--color-lime)]/30" />
            <MapPin className="size-6 text-[color:var(--color-lime)]" />
          </span>
          <h2 className="text-xl font-extrabold leading-tight text-balance lg:text-2xl">
            Preparado cerca.
            <br />
            Coordinado por <span className="text-[color:var(--color-lime)]">MPHO</span>.
          </h2>
        </div>

        <ul className="grid flex-1 gap-4 sm:grid-cols-3 lg:border-l lg:border-[color:var(--color-border-soft)] lg:pl-8">
          {BENEFITS.map((b) => {
            const Icon = b.icon
            return (
              <li key={b.title} className="flex items-start gap-2.5">
                <Icon className="mt-0.5 size-5 shrink-0 text-[color:var(--color-lime)]" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{b.title}</p>
                  <p className="text-xs text-faint">{b.sub}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </GlassPanel>
    </section>
  )
}
