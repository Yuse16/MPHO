'use client'

import { useState } from 'react'
import { ArrowUp, MessageCircleMore, Sparkles } from 'lucide-react'
import { HadiaSphere } from './hadia-sphere'
import { cn } from '@/lib/utils'

const RECIPIENTS = ['Pareja', 'Mamá', 'Papá', 'Amistad', 'Otra persona']

export function HadiaStarter() {
  const [recipient, setRecipient] = useState<string | null>(null)

  return (
    <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]" aria-label="Inicio del asistente HADIA">
      <div className="glass rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <HadiaSphere className="size-16 shrink-0" float />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan">HADIA</p>
            <h2 className="mt-1 text-2xl font-bold">Busquemos el regalo correcto</h2>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-foreground">¿Para quién es el regalo?</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Selecciona a la persona destinataria">
            {RECIPIENTS.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={recipient === item}
                onClick={() => setRecipient(recipient === item ? null : item)}
                className={cn(
                  'min-h-11 rounded-full border px-4 text-sm font-medium transition-colors',
                  recipient === item
                    ? 'border-cyan bg-cyan/10 text-cyan'
                    : 'border-border-soft bg-white/[0.03] text-muted-foreground hover:border-border-cyan hover:text-foreground',
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <label htmlFor="hadia-message" className="mt-7 block text-sm font-semibold text-foreground">
          Cuéntame qué quieres lograr
        </label>
        <div className="mt-3 flex items-end gap-2 rounded-2xl border border-border-cyan bg-black/20 p-2">
          <textarea
            id="hadia-message"
            rows={3}
            disabled
            aria-describedby="hadia-availability"
            placeholder="Describe la ocasión, el presupuesto y cuándo lo necesitas"
            className="min-h-24 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-faint disabled:cursor-not-allowed disabled:opacity-70"
          />
          <button
            type="button"
            disabled
            aria-label="Enviar mensaje a HADIA"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-cyan disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowUp className="size-5" />
          </button>
        </div>
        <p id="hadia-availability" className="mt-3 text-xs leading-5 text-muted-foreground">
          La conversación todavía no está conectada. HADIA sólo recomendará productos reales cuando el catálogo y la disponibilidad puedan validarse.
        </p>
      </div>

      <div className="glass flex min-h-80 flex-col items-center justify-center rounded-[2rem] border-border-cyan px-6 py-12 text-center">
        <span className="flex size-16 items-center justify-center rounded-full border border-border-cyan bg-cyan/10 text-cyan glow-cyan">
          <MessageCircleMore className="size-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 flex items-center gap-2 text-xl font-bold sm:text-2xl">
          Aún no hay una conversación
          <Sparkles className="size-5 text-cyan" aria-hidden="true" />
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          Aquí aparecerán preguntas enfocadas y recomendaciones verificadas cuando la asistencia de HADIA esté habilitada.
        </p>
      </div>
    </section>
  )
}
