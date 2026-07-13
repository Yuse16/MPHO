export const APP_CONFIG = {
  name: 'MPHO',
  tagline: 'El regalo correcto, sin perder horas buscándolo',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
  supportEmail: 'soporte@mpho.mx',
} as const

export const CITY_CONFIG = {
  defaultCityId: 'saltillo',
} as const

export const ORDER_CONFIG = {
  maxItemsPerOrder: 10,
  cancellationWindowMinutes: 30,
} as const
