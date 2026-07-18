'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'
import { getSafeRedirect } from '@/lib/routes'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = getSafeRedirect(searchParams.get('redirect'))

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(redirect)
      } else {
        router.replace('/login')
      }
      router.refresh()
    })
  }, [redirect, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block size-8 animate-spin rounded-full border-2 border-[color:var(--color-lime)] border-t-transparent" />
        <p className="text-sm text-[color:var(--color-muted-foreground)]">
          Verificando sesion...
        </p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block size-8 animate-spin rounded-full border-2 border-[color:var(--color-lime)] border-t-transparent" />
            <p className="text-sm text-[color:var(--color-muted-foreground)]">
              Verificando sesion...
            </p>
          </div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  )
}
