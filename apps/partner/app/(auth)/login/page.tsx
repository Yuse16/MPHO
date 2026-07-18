'use client'

import { Suspense, useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'
import { getSafeRedirect } from '@/lib/routes'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = getSafeRedirect(searchParams.get('redirect'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(() => {
    const reason = searchParams.get('error')
    if (reason === 'auth_callback_failed') {
      return 'No fue posible completar el acceso. Intenta iniciar sesión de nuevo.'
    }
    if (reason === 'service_unavailable') {
      return 'El servicio de acceso no está disponible en este momento.'
    }
    return ''
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createBrowserSupabaseClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(
          authError.message.includes('Invalid login')
            ? 'Correo o contraseña incorrectos.'
            : 'No fue posible iniciar sesión. Intenta de nuevo.',
        )
        return
      }

      router.push(redirect)
      router.refresh()
    } catch {
      setError('No fue posible iniciar sesión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass p-8 rounded-[var(--radius-xl)]">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[color:var(--color-foreground)]">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
          Panel de MPHO Aliados
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-lg bg-[color:var(--color-destructive)]/10 border border-[color:var(--color-destructive)]/30 p-3 text-sm text-[color:var(--color-destructive)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-[color:var(--color-muted-foreground)]"
          >
            Correo electrónico
          </label>
          <div className="relative">
            <Mail aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-faint)]" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface)] py-2.5 pl-10 pr-4 text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-faint)] focus:border-[color:var(--color-border-lime)] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-border-lime)] transition-colors"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-[color:var(--color-muted-foreground)]"
          >
            Contraseña
          </label>
          <div className="relative">
            <Lock aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-faint)]" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface)] py-2.5 pl-10 pr-10 text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-faint)] focus:border-[color:var(--color-border-lime)] focus:outline-none focus:ring-1 focus:ring-[color:var(--color-border-lime)] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-[color:var(--color-faint)] transition-colors hover:text-[color:var(--color-muted-foreground)]"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[var(--radius-md)] bg-[color:var(--color-lime)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-primary-foreground)] transition-all hover:bg-[color:var(--color-lime-intense)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[color:var(--color-muted-foreground)]">
        ¿Necesitas acceso?{' '}
        <Link
          href="/signup"
          className="font-medium text-[color:var(--color-lime)] hover:underline"
        >
          Conoce el proceso
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="inline-block size-6 animate-spin rounded-full border-2 border-[color:var(--color-lime)] border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
