import { createServerClient } from '@supabase/ssr';
import type { CatalogListing, CatalogCategory, Listing, Product, Category, Zone, Tag, MediaAsset } from '@mpho/database';

function getSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
      },
    }
  );
}

type ListingRow = Listing & {
  product: (Product & { category: Category | null }) | null;
  listing_zones: { zone: Zone }[];
};

export async function getCatalogListings(options?: {
  categorySlug?: string;
  limit?: number;
  offset?: number;
}): Promise<CatalogListing[]> {
  const supabase = getSupabase();
  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;

  let query = supabase
    .from('listings')
    .select(`
      *,
      product:products(*, category:categories(*)),
      listing_zones(zone:zones(*))
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (options?.categorySlug) {
    query = query.eq('product.category.slug', options.categorySlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching catalog listings:', error);
    return [];
  }

  return ((data ?? []) as ListingRow[]).map(mapRow);
}

export async function getCatalogListingBySlug(
  slug: string
): Promise<CatalogListing | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      product:products(*, category:categories(*)),
      listing_zones(zone:zones(*))
    `)
    .eq('status', 'published')
    .eq('product.slug', slug)
    .single();

  if (error) {
    console.error('Error fetching listing:', error);
    return null;
  }

  return mapRow(data as ListingRow);
}

export async function getCatalogCategories(): Promise<CatalogCategory[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('status', 'active')
    .eq('type', 'product')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return (data ?? []).map((cat) => ({
    category: cat as Category,
    listing_count: 0,
  }));
}

export async function getFeaturedListings(
  limitCount = 6
): Promise<CatalogListing[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      product:products(*, category:categories(*)),
      listing_zones(zone:zones(*))
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limitCount);

  if (error) {
    console.error('Error fetching featured listings:', error);
    return [];
  }

  return ((data ?? []) as ListingRow[]).map(mapRow);
}

function mapRow(row: ListingRow): CatalogListing {
  return {
    listing: row as Listing,
    product: (row.product ?? { id: '', name: '', slug: '', description: null, product_type: 'product', category_id: null, status: 'active', created_at: '', updated_at: '' }) as Product & { category: Category | null },
    tags: [],
    primary_media: null,
    listing_zones: (row.listing_zones ?? []).map((lz) => ({ zone: lz.zone })),
    min_price: row.base_price_amount_minor,
    max_price: row.base_price_amount_minor,
  };
}

export function formatPrice(amountMinor: number, currency = 'MXN'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100);
}
