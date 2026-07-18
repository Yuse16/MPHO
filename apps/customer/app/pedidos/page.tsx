'use client'

import { PackageOpen } from 'lucide-react'
import { CustomerEmptyState } from '@/components/customer-empty-state'
import { CustomerPageHeading } from '@/components/customer-page-heading'
import { CustomerShell } from '@/components/customer-shell'
import { useAuth } from '@/lib/auth-context'

export default function OrdersPage() {
  const { user, loading } = useAuth()

  return (
    <CustomerShell>
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-10 sm:px-8 lg:pb-16 lg:pt-14">
        <CustomerPageHeading
          eyebrow="Seguimiento MPHO"
          title="Mis pedidos"
          description="Consulta aquí el avance de tus regalos y los siguientes pasos confirmados por MPHO."
        />

        {loading ? (
          <section className="glass flex min-h-72 items-center justify-center rounded-[2rem]" aria-live="polite">
            <div className="flex flex-col items-center gap-3">
              <span className="size-8 animate-spin rounded-full border-2 border-border-soft border-t-lime" />
              <p className="text-sm text-muted-foreground">Consultando tu sesión…</p>
            </div>
          </section>
        ) : user ? (
          <CustomerEmptyState
            icon={PackageOpen}
            title="Todavía no tienes pedidos"
            description="Cuando crees un pedido, podrás consultar aquí su estado confirmado y acceder a sus detalles."
            action={{ href: '/explorar', label: 'Explorar regalos' }}
          />
        ) : (
          <CustomerEmptyState
            icon={PackageOpen}
            title="Inicia sesión para ver tus pedidos"
            description="Tu historial y seguimiento están protegidos. Accede a tu cuenta para consultarlos."
            action={{ href: '/login?redirect=/pedidos', label: 'Iniciar sesión' }}
          />
        )}
      </main>
    </CustomerShell>
  )
}
