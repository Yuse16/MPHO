'use client'

import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CatalogRetryButton() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-lime-intense"
    >
      <RefreshCw className="size-4" aria-hidden="true" />
      Intentar de nuevo
    </button>
  )
}
