import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-sm text-[#bbc3be] mb-6">
          Esta página no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-[#c8ff35] px-6 py-2.5 text-sm font-semibold text-[#05110a] hover:bg-[#b5f500] transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
