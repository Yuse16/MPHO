'use client'

import { useState } from 'react'
import type { AvailabilityStatus, Money } from '@mpho/quote-engine'
import type { QuoteConfiguration } from '@/lib/quotes'
import { formatPrice } from '@/lib/catalog'
import { useCart } from '@/lib/cart-context'

type QuotePreview = {
  availabilityStatus: AvailabilityStatus
  subtotal: Money
  pendingComponents: string[]
}

export function QuoteCalculator({
  listingId,
  configuration,
}: {
  listingId: string
  configuration: QuoteConfiguration
}) {
  const { addItem, loading: cartLoading, error: cartError } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [variantId, setVariantId] = useState('')
  const [optionIds, setOptionIds] = useState<string[]>([])
  const [zoneId, setZoneId] = useState('')
  const [quote, setQuote] = useState<QuotePreview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [added, setAdded] = useState(false)

  function selectionChanged() {
    setQuote(null)
    setError(null)
    setAdded(false)
  }

  function validateSelection(): boolean {
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 20) {
      setError('La cantidad debe ser un número entero entre 1 y 20.')
      return false
    }
    const missingRequiredOption = configuration.options.some(
      (option) => option.required && !optionIds.includes(option.id),
    )
    if (missingRequiredOption) {
      setError('Selecciona todas las opciones requeridas para continuar.')
      return false
    }
    setError(null)
    return true
  }

  async function calculate() {
    if (!validateSelection()) return
    setLoading(true)
    setQuote(null)
    try {
      const response = await fetch('/api/quotes/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              listingId,
              variantId: variantId || null,
              optionIds,
              quantity,
            },
          ],
          zoneId: zoneId || null,
          requestedDeliveryAt: null,
        }),
      })
      const body: unknown = await response.json()
      const preview = parseQuotePreview(body)
      if (!response.ok || !preview) {
        throw new Error('No fue posible calcular la cotización.')
      }
      setQuote(preview)
    } catch {
      setError('No fue posible calcular la cotización. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  async function addSelection() {
    if (!validateSelection()) return
    const success = await addItem({
      listingId,
      variantId: variantId || null,
      optionIds,
      quantity,
      personalization: message.trim()
        ? {
            recipientName: null,
            message,
            instructions: null,
            spellingConfirmed: true,
          }
        : null,
    })
    setAdded(success)
  }

  return (
    <section className="mt-8 border-t border-border-soft pt-7" aria-labelledby="quote-title">
      <h2 id="quote-title" className="text-lg font-bold">
        Calcula una cotización
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        No es una compra, reserva ni promesa de entrega.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          Cantidad
          <input
            aria-label="Cantidad"
            className="mt-2 min-h-12 w-full rounded-xl border border-border-soft bg-black/20 p-3"
            type="number"
            min={1}
            max={20}
            step={1}
            value={quantity}
            onChange={(event) => {
              setQuantity(Number(event.target.value))
              selectionChanged()
            }}
          />
        </label>

        {configuration.variants.length > 0 && (
          <label className="text-sm">
            Variante
            <select
              aria-label="Variante"
              className="mt-2 min-h-12 w-full rounded-xl border border-border-soft bg-[color:var(--color-background-2)] p-3"
              value={variantId}
              onChange={(event) => {
                setVariantId(event.target.value)
                selectionChanged()
              }}
            >
              <option value="">Sin variante</option>
              {configuration.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="text-sm sm:col-span-2">
          Zona
          <select
            aria-label="Zona"
            className="mt-2 min-h-12 w-full rounded-xl border border-border-soft bg-[color:var(--color-background-2)] p-3"
            value={zoneId}
            onChange={(event) => {
              setZoneId(event.target.value)
              selectionChanged()
            }}
          >
            <option value="">Selecciona una zona</option>
            {configuration.zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}, {zone.city}
              </option>
            ))}
          </select>
        </label>
      </div>

      {configuration.options.length > 0 && (
        <fieldset className="mt-4">
          <legend className="text-sm">Opciones</legend>
          <div className="mt-2 grid gap-2">
            {configuration.options.map((option) => (
              <label key={option.id} className="flex min-h-11 items-center gap-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={optionIds.includes(option.id)}
                  onChange={(event) => {
                    setOptionIds((current) =>
                      event.target.checked
                        ? [...current, option.id]
                        : current.filter((id) => id !== option.id),
                    )
                    selectionChanged()
                  }}
                />
                {option.label}
                {option.required ? ' (requerida)' : ''}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <label className="mt-4 block text-sm">
        Dedicatoria opcional
        <textarea
          aria-label="Dedicatoria"
          maxLength={500}
          className="mt-2 w-full rounded-xl border border-border-soft bg-black/20 p-3"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value)
            setAdded(false)
          }}
        />
      </label>

      <button
        type="button"
        onClick={() => void calculate()}
        disabled={loading}
        aria-busy={loading}
        className="mt-5 min-h-12 w-full rounded-full bg-lime px-6 py-3 font-bold text-primary-foreground disabled:opacity-60"
      >
        {loading ? 'Calculando…' : 'Calcular cotización'}
      </button>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm">
          {error}
        </p>
      )}

      {quote && (
        <div className="mt-4 rounded-2xl border border-border-lime bg-lime/5 p-4" aria-live="polite">
          <p className="text-sm text-muted-foreground">Subtotal conocido</p>
          <p className="mt-1 text-2xl font-extrabold">{formatPrice(quote.subtotal)}</p>
          <p className="mt-2 text-sm">
            Disponibilidad:{' '}
            {availabilityLabel(quote.availabilityStatus)}
          </p>
          {quote.pendingComponents.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              Pendiente:{' '}
              {quote.pendingComponents
                .map(pendingComponentLabel)
                .join(', ')}
              .
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            El total no es final y todavía no se ha creado una orden.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => void addSelection()}
        disabled={cartLoading || quote?.availabilityStatus === 'unavailable'}
        aria-busy={cartLoading}
        className="mt-3 min-h-12 w-full rounded-full border border-border-lime px-6 py-3 font-bold text-lime disabled:opacity-50"
      >
        {quote?.availabilityStatus === 'unavailable'
          ? 'Selección no disponible'
          : added
            ? 'Agregado al carrito'
            : 'Agregar selección al carrito'}
      </button>
      {cartError && (
        <p role="alert" className="mt-2 text-xs text-red-300">
          {cartError}
        </p>
      )}
    </section>
  )
}

function availabilityLabel(status: AvailabilityStatus): string {
  if (status === 'eligible') return 'validada para esta cotización'
  if (status === 'unavailable') return 'no disponible para esta selección'
  return 'requiere validación'
}

function pendingComponentLabel(component: string): string {
  if (component === 'delivery') return 'costo de entrega'
  if (component === 'operational_availability') return 'validación operativa'
  if (component === 'zone') return 'zona'
  return 'validación adicional'
}

function parseQuotePreview(value: unknown): QuotePreview | null {
  if (!isRecord(value) || !isRecord(value.quote)) return null
  const { availabilityStatus, subtotal, pendingComponents } = value.quote
  if (
    (availabilityStatus !== 'eligible' &&
      availabilityStatus !== 'requires_review' &&
      availabilityStatus !== 'unavailable') ||
    !isMoney(subtotal) ||
    !Array.isArray(pendingComponents) ||
    pendingComponents.some((component) => typeof component !== 'string')
  ) {
    return null
  }
  return { availabilityStatus, subtotal, pendingComponents }
}

function isMoney(value: unknown): value is Money {
  return (
    isRecord(value) &&
    typeof value.amountMinor === 'number' &&
    Number.isSafeInteger(value.amountMinor) &&
    value.amountMinor >= 0 &&
    value.currency === 'MXN'
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}
