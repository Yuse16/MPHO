export const DELIVERY_TIME_ZONE = 'America/Monterrey'

const LOCAL_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/
const formatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: DELIVERY_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

type DateTimeParts = { year: number; month: number; day: number; hour: number; minute: number; second: number }

export function formatDeliveryInstantForInput(value: string): string {
  const instant = new Date(value)
  if (Number.isNaN(instant.getTime())) throw new Error('La fecha solicitada guardada no es válida.')
  const parts = partsInDeliveryZone(instant)
  return `${pad(parts.year, 4)}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`
}

export function deliveryInputToInstant(value: string): string {
  const match = LOCAL_DATE_TIME.exec(value)
  if (!match) throw new Error('La fecha solicitada no es válida.')
  const target: DateTimeParts = {
    year: Number(match[1]), month: Number(match[2]), day: Number(match[3]),
    hour: Number(match[4]), minute: Number(match[5]), second: 0,
  }
  const targetWallTime = Date.UTC(target.year, target.month - 1, target.day, target.hour, target.minute)
  const calendarCheck = new Date(targetWallTime)
  if (calendarCheck.getUTCFullYear() !== target.year || calendarCheck.getUTCMonth() + 1 !== target.month || calendarCheck.getUTCDate() !== target.day || target.hour > 23 || target.minute > 59) {
    throw new Error('La fecha solicitada no es válida.')
  }

  let instantMs = targetWallTime
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const rendered = partsInDeliveryZone(new Date(instantMs))
    const renderedWallTime = Date.UTC(rendered.year, rendered.month - 1, rendered.day, rendered.hour, rendered.minute)
    const correction = targetWallTime - renderedWallTime
    instantMs += correction
    if (correction === 0) break
  }

  const instant = new Date(instantMs)
  if (formatDeliveryInstantForInput(instant.toISOString()) !== value) {
    throw new Error('La hora solicitada no existe en la zona de entrega.')
  }
  return instant.toISOString()
}

function partsInDeliveryZone(value: Date): DateTimeParts {
  const parts = Object.fromEntries(formatter.formatToParts(value).filter(part => part.type !== 'literal').map(part => [part.type, Number(part.value)]))
  return { year: parts.year, month: parts.month, day: parts.day, hour: parts.hour, minute: parts.minute, second: parts.second }
}

function pad(value: number, length = 2) { return String(value).padStart(length, '0') }
