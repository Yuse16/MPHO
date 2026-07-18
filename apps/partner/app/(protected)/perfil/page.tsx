'use client'

import { UserRound, Mail, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function PerfilPage() {
  const { user, error, signOut } = useAuth()

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold text-[color:var(--color-foreground)]">
          Mi perfil
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
          Información de la cuenta autorizada
        </p>
      </section>

      <div className="glass rounded-[var(--radius-xl)] p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-[color:var(--color-lime)]/10">
            <UserRound aria-hidden="true" className="size-8 text-[color:var(--color-lime)]" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[color:var(--color-foreground)]">
              Cuenta MPHO Aliados
            </h3>
            <p className="text-sm text-[color:var(--color-muted-foreground)]">
              {user?.email ?? 'Sin correo'}
            </p>
          </div>
        </div>
      </div>

      <div className="glass rounded-[var(--radius-xl)] p-5">
        <h3 className="text-sm font-semibold text-[color:var(--color-foreground)]">
          Datos de cuenta
        </h3>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <Mail aria-hidden="true" className="size-4 text-[color:var(--color-faint)]" />
            <span className="text-[color:var(--color-muted-foreground)]">
              {user?.email ?? 'Sin correo registrado'}
            </span>
          </div>
        </div>
      </div>

      <div className="glass rounded-[var(--radius-xl)] p-5">
        <h3 className="text-sm font-semibold text-[color:var(--color-foreground)]">
          Preferencias
        </h3>
        <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
          Las preferencias de notificacion y idioma estaran disponibles
          proximamente.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-[var(--radius-md)] border border-[color:var(--color-destructive)]/30 bg-[color:var(--color-destructive)]/10 p-3 text-sm text-[color:var(--color-destructive)]"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => void signOut()}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[color:var(--color-destructive)]/30 bg-[color:var(--color-destructive)]/10 px-4 py-2.5 text-sm font-medium text-[color:var(--color-destructive)] transition-colors hover:bg-[color:var(--color-destructive)]/20"
      >
        <LogOut aria-hidden="true" className="size-4" />
        Cerrar sesión
      </button>
    </div>
  )
}
