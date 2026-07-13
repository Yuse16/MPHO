import type { LucideIcon } from 'lucide-react'
import { Heart, Flower2, Briefcase, Users, Gift, Cake, GraduationCap, Baby } from 'lucide-react'

export type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  tag?: string
  alt: string
}

export type Recipient = {
  id: string
  label: string
  icon: LucideIcon
  accent: 'lime' | 'cyan' | 'blue' | 'gold' | 'mphora'
}

export type CityStatus = 'active' | 'planned'

export type City = {
  id: string
  name: string
  status: CityStatus
}

export const CITIES: City[] = [
  { id: 'saltillo', name: 'Saltillo', status: 'active' },
  { id: 'ramos-arizpe', name: 'Ramos Arizpe', status: 'planned' },
]

export const ACTIVE_CITIES = CITIES.filter((c) => c.status === 'active')

export const RECIPIENTS: Recipient[] = [
  { id: 'pareja', label: 'Pareja', icon: Heart, accent: 'mphora' },
  { id: 'mama', label: 'Mamá', icon: Flower2, accent: 'cyan' },
  { id: 'papa', label: 'Papá', icon: Briefcase, accent: 'blue' },
  { id: 'amistad', label: 'Amistad', icon: Users, accent: 'gold' },
  { id: 'cumpleanos', label: 'Cumpleaños', icon: Cake, accent: 'lime' },
  { id: 'graduacion', label: 'Graduación', icon: GraduationCap, accent: 'cyan' },
  { id: 'bebe', label: 'Bebé', icon: Baby, accent: 'gold' },
  { id: 'gracias', label: 'Gracias', icon: Gift, accent: 'lime' },
]

export const MPHORA_PRODUCTS: Product[] = [
  {
    id: 'rosas-premium',
    name: 'Rosas Premium',
    description: 'Caja con 24 rosas',
    price: 1290,
    image: '/images/product-roses.png',
    tag: 'Entrega hoy',
    alt: 'Caja negra elegante con 24 rosas rojas premium',
  },
  {
    id: 'momento-para-ella',
    name: 'Momento para ella',
    description: 'Set de bienestar premium',
    price: 1590,
    image: '/images/product-wellness.png',
    tag: 'Entrega hoy',
    alt: 'Set de bienestar con perfume, vela y productos premium en caja negra',
  },
  {
    id: 'seleccion-trufas',
    name: 'Selección de Trufas',
    description: 'Edición gourmet',
    price: 890,
    image: '/images/product-truffles.png',
    tag: 'Entrega hoy',
    alt: 'Caja de trufas de chocolate gourmet edición especial',
  },
  {
    id: 'ritual-rosas-trufas',
    name: 'Ritual de Rosas',
    description: 'Rosas y trufas gourmet',
    price: 1690,
    image: '/images/product-roses.png',
    tag: 'Entrega hoy',
    alt: 'Combinación de rosas rojas y trufas de chocolate premium',
  },
  {
    id: 'detalle-gourmet',
    name: 'Detalle Gourmet',
    description: 'Chocolates de autor',
    price: 990,
    image: '/images/product-truffles.png',
    tag: 'Entrega hoy',
    alt: 'Selección de chocolates de autor en caja elegante',
  },
]

export function formatPrice(value: number) {
  return new Intl.NumberFormat('es-MX').format(value)
}
