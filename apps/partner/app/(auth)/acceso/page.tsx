'use client'

import Link from 'next/link'
import { ShieldX } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function AccesoPage() {
  const { user, loading, error, signOut } = useAuth()

  return (
    <div className="glass rounded-[var(--radius-xl)] p-8 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[color:var(--color-destructive)]/10">
        <ShieldX
          aria-hidden="true"
          className="size-6 text-[color:var(--color-destructive)]"
        />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-[color:var(--color-foreground)]">
        Acceso de aliado no habilitado
      </h1>
      <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted-foreground)]">
        Para entrar se requiere un rol vigente de MPHO Aliados y un Punto MPHO
        autorizado. No se mostró información operativa de ningún aliado.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-[var(--radius-md)] border border-[color:var(--color-destructive)]/30 bg-[color:var(--color-destructive)]/10 p-3 text-sm text-[color:var(--color-destructive)]"
        >
          {error}
        </p>
      )}

      {!loading && user ? (
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border border-[color:var(--color-border-soft)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-foreground)] transition-colors hover:bg-white/5"
        >
          Cerrar sesión
        </button>
      ) : (
        <Link
          href="/login"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-[color:var(--color-lime)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-primary-foreground)] transition-colors hover:bg-[color:var(--color-lime-intense)]"
        >
          Ir a iniciar sesión
        </Link>
      )}
    </div>
  )
}
