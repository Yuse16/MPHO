'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold mb-2">Algo salió mal</h1>
        <p className="text-sm text-[#bbc3be] mb-6">
          {error.message || 'Ocurrió un error inesperado. Intenta de nuevo.'}
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-[#c8ff35] px-6 py-2.5 text-sm font-semibold text-[#05110a] hover:bg-[#b5f500] transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
