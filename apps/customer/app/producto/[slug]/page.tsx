import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ImageOff, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { BasicAddToCart } from '@/components/basic-add-to-cart'
import { CatalogRetryButton } from '@/components/catalog-retry-button'
import { CustomerShell } from '@/components/customer-shell'
import { QuoteCalculator } from '@/components/quote-calculator'
import { formatPrice, getCatalogListingBySlug } from '@/lib/catalog'
import { getQuoteConfiguration } from '@/lib/quotes'

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
      <CustomerShell>
        <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-12 sm:px-8">
          <section role="alert" className="glass w-full rounded-[2rem] p-8 text-center">
            <h1 className="text-2xl font-bold">No pudimos consultar este regalo</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              La información no está disponible en este momento. Puedes intentarlo nuevamente o volver al catálogo.
            </p>
            <CatalogRetryButton />
            <Link
              href="/explorar"
              className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
            >
              Volver al catálogo
            </Link>
          </section>
        </main>
      </CustomerShell>
    )
  }

  const product = result.data
  const quoteConfiguration = await getQuoteConfiguration(product.listingId)

  return (
    <CustomerShell>
      <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-8 sm:px-8 lg:pb-16 lg:pt-10">
        <Link
          href="/explorar"
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver al catálogo
        </Link>

        <article className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="glass relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_50%_35%,rgba(200,255,53,0.15),transparent_55%)] sm:min-h-[560px]">
            {product.image ? (
              <Image
                src={product.image.url}
                alt={product.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-sm text-faint">
                <ImageOff className="size-12" aria-hidden="true" />
                Imagen no disponible
              </div>
            )}
          </div>

          <div className="glass rounded-[2rem] p-7 sm:p-10">
            {product.category && (
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-lime">
                {product.category.name}
              </p>
            )}
            <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
              {product.name}
            </h1>
            {(product.fullDescription || product.shortDescription) && (
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                {product.fullDescription ?? product.shortDescription}
              </p>
            )}
            <p className="mt-8 text-3xl font-extrabold text-foreground">
              {formatPrice(product.price)}
            </p>

            <div className="mt-8 flex gap-3 rounded-2xl border border-border-soft bg-white/[0.03] p-4 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-lime" aria-hidden="true" />
              <p>Disponibilidad, preparación y entrega sujetas a confirmación antes del pago.</p>
            </div>

            {product.personalizationAvailable && (
              <div className="mt-4 flex gap-3 rounded-2xl border border-border-soft bg-white/[0.03] p-4 text-sm text-muted-foreground">
                <SlidersHorizontal className="mt-0.5 size-5 shrink-0 text-cyan" aria-hidden="true" />
                <p>Este regalo tiene opciones de personalización publicadas.</p>
              </div>
            )}

            {quoteConfiguration ? (
              <QuoteCalculator listingId={product.listingId} configuration={quoteConfiguration} />
            ) : product.personalizationAvailable ? (
              <section role="alert" className="mt-8 border-t border-border-soft pt-7 text-center">
                <h2 className="text-lg font-bold">No pudimos cargar las opciones</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Este regalo necesita configuración antes de agregarlo. Intenta nuevamente para ver las opciones publicadas.
                </p>
                <CatalogRetryButton />
              </section>
            ) : (
              <BasicAddToCart listingId={product.listingId} />
            )}
          </div>
        </article>
      </main>
    </CustomerShell>
  )
}
