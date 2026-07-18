'use client'

import { CalendarDays, LogOut, Mail, UserRound } from 'lucide-react'
import { CustomerEmptyState } from '@/components/customer-empty-state'
import { CustomerPageHeading } from '@/components/customer-page-heading'
import { CustomerShell } from '@/components/customer-shell'
import { useAuth } from '@/lib/auth-context'

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()

  const createdAt = user
    ? new Date(user.created_at).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <CustomerShell>
      <main className="mx-auto w-full max-w-4xl px-4 pb-28 pt-10 sm:px-8 lg:pb-16 lg:pt-14">
        <CustomerPageHeading
          eyebrow="Tu espacio MPHO"
          title="Perfil"
          description="Administra el acceso a tu cuenta y, más adelante, tus preferencias y fechas importantes."
        />

        {loading ? (
          <section className="glass flex min-h-72 items-center justify-center rounded-[2rem]" aria-live="polite">
            <div className="flex flex-col items-center gap-3">
              <span className="size-8 animate-spin rounded-full border-2 border-border-soft border-t-lime" />
              <p className="text-sm text-muted-foreground">Consultando tu perfil…</p>
            </div>
          </section>
        ) : user ? (
          <section className="glass rounded-[2rem] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-foreground">Mi información</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-border-soft bg-white/[0.03] p-4">
                <Mail className="size-5 shrink-0 text-lime" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-xs text-faint">Correo</p>
                  <p className="truncate text-sm text-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-border-soft bg-white/[0.03] p-4">
                <CalendarDays className="size-5 shrink-0 text-lime" aria-hidden="true" />
                <div>
                  <p className="text-xs text-faint">Miembro desde</p>
                  <p className="text-sm text-foreground">{createdAt}</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-8 flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border-soft px-5 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Cerrar sesión
            </button>
          </section>
        ) : (
          <CustomerEmptyState
            icon={UserRound}
            title="Tu perfil te espera"
            description="Inicia sesión o crea una cuenta para proteger tus pedidos y mantener tu experiencia MPHO en un solo lugar."
            action={{ href: '/login?redirect=/perfil', label: 'Acceder o registrarme' }}
          />
        )}
      </main>
    </CustomerShell>
  )
}
