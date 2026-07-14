import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Package, ShieldCheck } from 'lucide-react'
import { formatPrice, getCatalogListingBySlug } from '@/lib/catalog'

export default async function PublicProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const result = await getCatalogListingBySlug(slug)

  if (result.status === 'SUCCESS_EMPTY') notFound()

  if (result.status !== 'SUCCESS_WITH_DATA' || !result.data) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div role="alert" className="glass max-w-lg rounded-3xl p-8 text-center">
          <h1 className="text-2xl font-bold">No pudimos consultar este regalo</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            El catálogo no está disponible en este momento. Intenta de nuevo más tarde.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-lime px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    )
  }

  const product = result.data

  return (
    <main className="min-h-screen px-4 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-[0.35em] text-foreground">
            MPHO
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border-soft px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Inicio
          </Link>
        </header>

        <article className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="glass flex min-h-[360px] items-center justify-center overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_50%_35%,rgba(200,255,53,0.15),transparent_55%)] sm:min-h-[520px]">
            <div className="flex size-32 items-center justify-center rounded-full border border-border-lime bg-lime/5 text-lime shadow-[0_0_80px_-20px_rgba(200,255,53,0.6)]">
              <Package className="size-14" aria-label="Presentación del regalo" />
            </div>
          </div>

          <div className="glass flex flex-col rounded-[2rem] p-7 sm:p-10">
            {product.category && (
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-lime">
                {product.category.name}
              </p>
            )}
            <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              {product.fullDescription ?? product.shortDescription ?? 'Información del regalo disponible al confirmar.'}
            </p>
            <p className="mt-8 text-3xl font-extrabold text-foreground">
              {formatPrice(product.price)}
            </p>

            <div className="mt-8 flex gap-3 rounded-2xl border border-border-soft bg-white/[0.03] p-4 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-lime" />
              <p>
                Disponibilidad, preparación y entrega sujetas a confirmación antes del pago.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="mt-auto w-full cursor-not-allowed rounded-full bg-white/10 px-6 py-4 font-bold text-faint"
            >
              Compra todavía no disponible
            </button>
          </div>
        </article>
      </div>
    </main>
  )
}
