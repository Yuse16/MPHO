-- Phase 5: authoritative server-side pricing, availability, and quotes.
-- A quote is not an order, reservation, payment, partner assignment, or delivery promise.

CREATE TYPE public.quote_status AS ENUM ('valid', 'requires_review', 'expired', 'invalidated');
CREATE TYPE public.quote_availability_status AS ENUM ('eligible', 'requires_review', 'unavailable');

CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  public_reference text NOT NULL UNIQUE DEFAULT ('Q-' || upper(substr(replace(extensions.uuid_generate_v4()::text, '-', ''), 1, 20))),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  status public.quote_status NOT NULL,
  availability_status public.quote_availability_status NOT NULL,
  currency text NOT NULL CHECK (currency = 'MXN'),
  subtotal_amount_minor bigint NOT NULL CHECK (subtotal_amount_minor >= 0 AND subtotal_amount_minor <= 9007199254740991),
  delivery_amount_minor bigint CHECK (delivery_amount_minor >= 0 AND delivery_amount_minor <= 9007199254740991),
  service_amount_minor bigint CHECK (service_amount_minor >= 0 AND service_amount_minor <= 9007199254740991),
  discount_amount_minor bigint NOT NULL DEFAULT 0 CHECK (discount_amount_minor = 0),
  total_known_amount_minor bigint NOT NULL CHECK (total_known_amount_minor >= 0 AND total_known_amount_minor <= 9007199254740991),
  total_is_final boolean NOT NULL DEFAULT false,
  pending_components jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(pending_components) = 'array'),
  zone_id uuid REFERENCES public.zones(id) ON DELETE RESTRICT,
  requested_delivery_at timestamptz,
  expires_at timestamptz,
  pricing_version text NOT NULL,
  idempotency_key text NOT NULL CHECK (char_length(idempotency_key) BETWEEN 8 AND 200),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  invalidated_at timestamptz,
  invalidation_reason text,
  UNIQUE (customer_id, idempotency_key),
  CHECK (total_known_amount_minor = subtotal_amount_minor + coalesce(delivery_amount_minor, 0) + coalesce(service_amount_minor, 0) - discount_amount_minor),
  CHECK (NOT total_is_final OR (delivery_amount_minor IS NOT NULL AND service_amount_minor IS NOT NULL AND availability_status = 'eligible'))
);

CREATE TABLE public.quote_items (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE RESTRICT,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  variant_id uuid REFERENCES public.listing_variants(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_base_amount_minor bigint NOT NULL CHECK (unit_base_amount_minor >= 0 AND unit_base_amount_minor <= 9007199254740991),
  unit_adjustments_amount_minor bigint NOT NULL,
  unit_final_amount_minor bigint NOT NULL CHECK (unit_final_amount_minor >= 0 AND unit_final_amount_minor <= 9007199254740991),
  line_total_amount_minor bigint NOT NULL CHECK (line_total_amount_minor >= 0 AND line_total_amount_minor <= 9007199254740991),
  currency text NOT NULL CHECK (currency = 'MXN'),
  product_snapshot jsonb NOT NULL CHECK (jsonb_typeof(product_snapshot) = 'object'),
  variant_snapshot jsonb CHECK (variant_snapshot IS NULL OR jsonb_typeof(variant_snapshot) = 'object'),
  options_snapshot jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(options_snapshot) = 'array'),
  availability_status public.quote_availability_status NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (unit_final_amount_minor = unit_base_amount_minor + unit_adjustments_amount_minor),
  CHECK (line_total_amount_minor = unit_final_amount_minor * quantity)
);

CREATE INDEX quotes_customer_created_idx ON public.quotes (customer_id, created_at DESC);
CREATE INDEX quotes_status_idx ON public.quotes (status);
CREATE INDEX quote_items_quote_idx ON public.quote_items (quote_id);
CREATE TRIGGER quotes_set_updated_at BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.quotes, public.quote_items FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.quotes, public.quote_items TO authenticated;

CREATE POLICY quotes_select_own ON public.quotes FOR SELECT TO authenticated
USING (customer_id IN (
  SELECT customer.id FROM public.customers AS customer
  JOIN public.profiles AS profile ON profile.id = customer.profile_id
  WHERE profile.auth_user_id = public.auth_uid()
));

CREATE POLICY quote_items_select_own ON public.quote_items FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.quotes AS quote
  JOIN public.customers AS customer ON customer.id = quote.customer_id
  JOIN public.profiles AS profile ON profile.id = customer.profile_id
  WHERE quote.id = quote_items.quote_id AND profile.auth_user_id = public.auth_uid()
));

CREATE OR REPLACE FUNCTION public.calculate_public_quote(p_request jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  item_request jsonb;
  listing_record record;
  variant_record record;
  option_record record;
  zone_record record;
  item_options jsonb;
  option_ids uuid[];
  item_variant jsonb;
  result_items jsonb := '[]'::jsonb;
  pending jsonb := '["delivery","operational_availability"]'::jsonb;
  quantity_value bigint;
  base_amount bigint;
  adjustments bigint;
  unit_amount bigint;
  line_amount bigint;
  subtotal bigint := 0;
  zone_uuid uuid;
  requested_at timestamptz;
  item_count integer;
  option_count integer;
BEGIN
  IF p_request IS NULL OR jsonb_typeof(p_request) <> 'object' OR jsonb_typeof(p_request->'items') <> 'array' THEN
    RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'INVALID_REQUEST', 'message', 'A non-empty items array is required.'));
  END IF;
  item_count := jsonb_array_length(p_request->'items');
  IF item_count < 1 OR item_count > 20 THEN
    RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'INVALID_REQUEST', 'message', 'Between 1 and 20 items are required.'));
  END IF;

  BEGIN
    IF nullif(p_request->>'zoneId', '') IS NOT NULL THEN zone_uuid := (p_request->>'zoneId')::uuid; END IF;
    IF nullif(p_request->>'requestedDeliveryAt', '') IS NOT NULL THEN requested_at := (p_request->>'requestedDeliveryAt')::timestamptz; END IF;
  EXCEPTION WHEN others THEN
    RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'INVALID_REQUEST', 'message', 'Zone or requested delivery date is invalid.'));
  END;
  IF requested_at IS NOT NULL AND requested_at <= now() THEN
    RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'INVALID_REQUEST', 'message', 'Requested delivery date must be in the future.'));
  END IF;
  IF zone_uuid IS NULL THEN pending := pending || '"zone"'::jsonb; END IF;

  FOR item_request IN SELECT value FROM jsonb_array_elements(p_request->'items') LOOP
    BEGIN
      quantity_value := (item_request->>'quantity')::bigint;
      IF quantity_value <= 0 OR quantity_value > 2147483647 OR (item_request->>'quantity') !~ '^[0-9]+$' THEN RAISE numeric_value_out_of_range; END IF;
      SELECT listing.*, product.name AS product_name, product.slug AS product_slug, product.status AS product_status
      INTO listing_record FROM public.listings AS listing
      JOIN public.products AS product ON product.id = listing.product_id
      WHERE listing.id = (item_request->>'listingId')::uuid;
    EXCEPTION WHEN invalid_text_representation OR numeric_value_out_of_range THEN
      RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'INVALID_QUANTITY', 'message', 'Quantity must be a positive integer.'));
    END;
    IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'LISTING_NOT_FOUND', 'message', 'The listing was not found.')); END IF;
    IF listing_record.status <> 'published' OR listing_record.published_at IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'LISTING_NOT_PUBLIC', 'message', 'The listing is not public.')); END IF;
    IF listing_record.product_status <> 'active' THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'PRODUCT_INACTIVE', 'message', 'The product is inactive.')); END IF;
    IF listing_record.currency <> 'MXN' THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'CURRENCY_MISMATCH', 'message', 'Only MXN is supported.')); END IF;
    IF listing_record.base_price_amount_minor IS NULL OR listing_record.base_price_amount_minor < 0 THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'CONFIGURATION_ERROR', 'message', 'The listing price is unavailable.')); END IF;

    base_amount := listing_record.base_price_amount_minor;
    adjustments := 0;
    item_variant := NULL;
    IF nullif(item_request->>'variantId', '') IS NOT NULL THEN
      BEGIN
        SELECT * INTO variant_record FROM public.listing_variants
        WHERE id = (item_request->>'variantId')::uuid AND listing_id = listing_record.id;
      EXCEPTION WHEN invalid_text_representation THEN
        RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'VARIANT_INVALID', 'message', 'The selected variant is invalid.'));
      END;
      IF NOT FOUND OR variant_record.status <> 'active' THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'VARIANT_INVALID', 'message', 'The selected variant is invalid.')); END IF;
      IF variant_record.currency <> 'MXN' THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'CURRENCY_MISMATCH', 'message', 'Variant currency does not match.')); END IF;
      adjustments := adjustments + variant_record.price_adjustment_amount_minor;
      item_variant := jsonb_build_object('id', variant_record.id, 'name', variant_record.name);
    END IF;

    item_options := '[]'::jsonb;
    option_ids := ARRAY(SELECT value::uuid FROM jsonb_array_elements_text(coalesce(item_request->'optionIds', '[]'::jsonb)));
    IF cardinality(option_ids) <> cardinality(ARRAY(SELECT DISTINCT unnest(option_ids))) THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'OPTION_INVALID', 'message', 'Duplicate options are invalid.')); END IF;
    option_count := 0;
    FOR option_record IN SELECT * FROM public.listing_options WHERE id = ANY(option_ids) LOOP
      option_count := option_count + 1;
      IF option_record.listing_id <> listing_record.id OR option_record.status <> 'active' THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'OPTION_INVALID', 'message', 'A selected option is invalid.')); END IF;
      IF option_record.currency <> 'MXN' THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'CURRENCY_MISMATCH', 'message', 'Option currency does not match.')); END IF;
      adjustments := adjustments + option_record.price_adjustment_amount_minor;
      item_options := item_options || jsonb_build_array(jsonb_build_object('id', option_record.id, 'label', option_record.label, 'adjustment', jsonb_build_object('amountMinor', option_record.price_adjustment_amount_minor, 'currency', 'MXN')));
    END LOOP;
    IF option_count <> cardinality(option_ids) THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'OPTION_INVALID', 'message', 'A selected option is invalid.')); END IF;

    IF zone_uuid IS NOT NULL THEN
      SELECT zone.*, city.status AS city_status INTO zone_record FROM public.zones AS zone JOIN public.cities AS city ON city.id = zone.city_id WHERE zone.id = zone_uuid;
      IF NOT FOUND OR zone_record.status <> 'active' OR zone_record.city_status <> 'active' OR NOT EXISTS (SELECT 1 FROM public.listing_zones WHERE listing_id = listing_record.id AND zone_id = zone_uuid AND status = 'active') THEN
        RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'ZONE_UNAVAILABLE', 'message', 'The listing is unavailable in the selected zone.'));
      END IF;
    END IF;

    unit_amount := base_amount + adjustments;
    IF unit_amount < 0 OR unit_amount > 9007199254740991 OR quantity_value > 9007199254740991 / greatest(unit_amount, 1) THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'PRICE_OVERFLOW', 'message', 'The calculated price exceeds the supported range.')); END IF;
    line_amount := unit_amount * quantity_value;
    IF subtotal > 9007199254740991 - line_amount THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'PRICE_OVERFLOW', 'message', 'The subtotal exceeds the supported range.')); END IF;
    subtotal := subtotal + line_amount;
    result_items := result_items || jsonb_build_array(jsonb_build_object(
      'listingId', listing_record.id, 'productId', listing_record.product_id, 'slug', listing_record.product_slug,
      'name', listing_record.customer_title, 'quantity', quantity_value,
      'unitPrice', jsonb_build_object('amountMinor', unit_amount, 'currency', 'MXN'),
      'lineTotal', jsonb_build_object('amountMinor', line_amount, 'currency', 'MXN'),
      'unitBaseAmountMinor', base_amount, 'unitAdjustmentsAmountMinor', adjustments,
      'variant', item_variant, 'options', item_options
    ));
  END LOOP;

  RETURN jsonb_build_object('ok', true, 'quote', jsonb_build_object(
    'status', 'requires_review', 'availabilityStatus', 'requires_review', 'currency', 'MXN', 'items', result_items,
    'subtotal', jsonb_build_object('amountMinor', subtotal, 'currency', 'MXN'), 'delivery', NULL,
    'service', NULL, 'discount', jsonb_build_object('amountMinor', 0, 'currency', 'MXN'),
    'totalKnown', jsonb_build_object('amountMinor', subtotal, 'currency', 'MXN'), 'totalIsFinal', false,
    'pendingComponents', pending, 'expiresAt', NULL, 'zoneId', zone_uuid,
    'requestedDeliveryAt', requested_at, 'pricingVersion', 'phase-5-v1'
  ));
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_customer_quote(p_quote_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT CASE WHEN quote.id IS NULL THEN NULL ELSE jsonb_build_object(
    'id', quote.id, 'reference', quote.public_reference, 'status', quote.status,
    'availabilityStatus', quote.availability_status, 'currency', quote.currency,
    'items', coalesce((SELECT jsonb_agg(jsonb_build_object(
      'listingId', item.listing_id, 'productId', item.product_id, 'slug', item.product_snapshot->>'slug',
      'name', item.product_snapshot->>'name', 'quantity', item.quantity,
      'unitPrice', jsonb_build_object('amountMinor', item.unit_final_amount_minor, 'currency', item.currency),
      'lineTotal', jsonb_build_object('amountMinor', item.line_total_amount_minor, 'currency', item.currency),
      'variant', item.variant_snapshot, 'options', item.options_snapshot
    ) ORDER BY item.created_at, item.id) FROM public.quote_items AS item WHERE item.quote_id = quote.id), '[]'::jsonb),
    'subtotal', jsonb_build_object('amountMinor', quote.subtotal_amount_minor, 'currency', quote.currency),
    'delivery', CASE WHEN quote.delivery_amount_minor IS NULL THEN NULL ELSE jsonb_build_object('amountMinor', quote.delivery_amount_minor, 'currency', quote.currency) END,
    'service', CASE WHEN quote.service_amount_minor IS NULL THEN NULL ELSE jsonb_build_object('amountMinor', quote.service_amount_minor, 'currency', quote.currency) END,
    'discount', jsonb_build_object('amountMinor', quote.discount_amount_minor, 'currency', quote.currency),
    'totalKnown', jsonb_build_object('amountMinor', quote.total_known_amount_minor, 'currency', quote.currency),
    'totalIsFinal', quote.total_is_final, 'pendingComponents', quote.pending_components, 'expiresAt', quote.expires_at
  ) END
  FROM public.quotes AS quote
  JOIN public.customers AS customer ON customer.id = quote.customer_id
  JOIN public.profiles AS profile ON profile.id = customer.profile_id
  WHERE quote.id = p_quote_id AND profile.auth_user_id = public.auth_uid();
$function$;

CREATE OR REPLACE FUNCTION public.create_customer_quote(p_request jsonb, p_idempotency_key text)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE customer_uuid uuid; calculated jsonb; quote_json jsonb; quote_uuid uuid; item jsonb;
BEGIN
  IF public.auth_uid() IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'UNAUTHORIZED', 'message', 'Authentication is required.')); END IF;
  IF p_idempotency_key IS NULL OR char_length(p_idempotency_key) NOT BETWEEN 8 AND 200 THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'INVALID_REQUEST', 'message', 'A valid idempotency key is required.')); END IF;
  SELECT customer.id INTO customer_uuid FROM public.customers AS customer JOIN public.profiles AS profile ON profile.id = customer.profile_id WHERE profile.auth_user_id = public.auth_uid() AND profile.status = 'active';
  IF customer_uuid IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'FORBIDDEN', 'message', 'An active customer profile is required.')); END IF;
  SELECT id INTO quote_uuid FROM public.quotes WHERE customer_id = customer_uuid AND idempotency_key = p_idempotency_key;
  IF quote_uuid IS NOT NULL THEN RETURN jsonb_build_object('ok', true, 'quote', public.get_customer_quote(quote_uuid)); END IF;
  calculated := public.calculate_public_quote(p_request);
  IF calculated->>'ok' <> 'true' THEN RETURN calculated; END IF;
  quote_json := calculated->'quote';
  INSERT INTO public.quotes (customer_id, status, availability_status, currency, subtotal_amount_minor, delivery_amount_minor, service_amount_minor, discount_amount_minor, total_known_amount_minor, total_is_final, pending_components, zone_id, requested_delivery_at, expires_at, pricing_version, idempotency_key)
  VALUES (customer_uuid, (quote_json->>'status')::public.quote_status, (quote_json->>'availabilityStatus')::public.quote_availability_status, 'MXN', (quote_json#>>'{subtotal,amountMinor}')::bigint, NULL, NULL, 0, (quote_json#>>'{totalKnown,amountMinor}')::bigint, false, quote_json->'pendingComponents', nullif(quote_json->>'zoneId','')::uuid, nullif(quote_json->>'requestedDeliveryAt','')::timestamptz, NULL, quote_json->>'pricingVersion', p_idempotency_key)
  RETURNING id INTO quote_uuid;
  FOR item IN SELECT value FROM jsonb_array_elements(quote_json->'items') LOOP
    INSERT INTO public.quote_items (quote_id, listing_id, product_id, variant_id, quantity, unit_base_amount_minor, unit_adjustments_amount_minor, unit_final_amount_minor, line_total_amount_minor, currency, product_snapshot, variant_snapshot, options_snapshot, availability_status)
    VALUES (quote_uuid, (item->>'listingId')::uuid, (item->>'productId')::uuid, nullif(item#>>'{variant,id}','')::uuid, (item->>'quantity')::integer, (item->>'unitBaseAmountMinor')::bigint, (item->>'unitAdjustmentsAmountMinor')::bigint, (item#>>'{unitPrice,amountMinor}')::bigint, (item#>>'{lineTotal,amountMinor}')::bigint, 'MXN', jsonb_build_object('name', item->>'name', 'slug', item->>'slug', 'pricingVersion', quote_json->>'pricingVersion', 'availabilityStatus', quote_json->>'availabilityStatus'), CASE WHEN item->'variant' = 'null'::jsonb THEN NULL ELSE item->'variant' END, item->'options', (quote_json->>'availabilityStatus')::public.quote_availability_status);
  END LOOP;
  RETURN jsonb_build_object('ok', true, 'quote', public.get_customer_quote(quote_uuid));
EXCEPTION WHEN unique_violation THEN
  SELECT id INTO quote_uuid FROM public.quotes WHERE customer_id = customer_uuid AND idempotency_key = p_idempotency_key;
  RETURN jsonb_build_object('ok', true, 'quote', public.get_customer_quote(quote_uuid));
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_public_quote_configuration(p_listing_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT CASE WHEN listing.id IS NULL THEN NULL ELSE jsonb_build_object(
    'variants', coalesce((SELECT jsonb_agg(jsonb_build_object('id', variant.id, 'name', variant.name) ORDER BY variant.name)
      FROM public.listing_variants AS variant WHERE variant.listing_id = listing.id AND variant.status = 'active'), '[]'::jsonb),
    'options', coalesce((SELECT jsonb_agg(jsonb_build_object('id', option.id, 'label', option.label, 'required', option.is_required) ORDER BY option.label)
      FROM public.listing_options AS option WHERE option.listing_id = listing.id AND option.status = 'active'), '[]'::jsonb),
    'zones', coalesce((SELECT jsonb_agg(jsonb_build_object('id', zone.id, 'name', zone.name, 'city', city.name) ORDER BY city.name, zone.name)
      FROM public.listing_zones AS listing_zone JOIN public.zones AS zone ON zone.id = listing_zone.zone_id
      JOIN public.cities AS city ON city.id = zone.city_id
      WHERE listing_zone.listing_id = listing.id AND listing_zone.status = 'active' AND zone.status = 'active' AND city.status = 'active'), '[]'::jsonb)
  ) END
  FROM public.listings AS listing JOIN public.products AS product ON product.id = listing.product_id
  WHERE listing.id = p_listing_id AND listing.status = 'published' AND listing.published_at IS NOT NULL AND product.status = 'active';
$function$;

REVOKE ALL ON FUNCTION public.calculate_public_quote(jsonb), public.create_customer_quote(jsonb, text), public.get_customer_quote(uuid), public.get_public_quote_configuration(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.calculate_public_quote(jsonb), public.get_public_quote_configuration(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_customer_quote(jsonb, text), public.get_customer_quote(uuid) TO authenticated;

COMMENT ON TABLE public.quotes IS 'Authoritative price snapshot; not an order, reservation, payment, assignment, or delivery promise.';
COMMENT ON FUNCTION public.calculate_public_quote(jsonb) IS 'Recalculates public quote values from database catalog data and never returns partner identity.';
