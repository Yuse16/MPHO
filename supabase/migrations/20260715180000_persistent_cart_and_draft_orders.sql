-- Phase 6: persistent Customer cart and atomic draft-order creation.
-- This migration intentionally creates no payment, reservation, assignment,
-- partner, fulfillment, delivery, refund, ledger, earning, or payout state.

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TYPE public.cart_status AS ENUM ('active', 'converted', 'abandoned');
CREATE TYPE public.order_state AS ENUM ('draft');

CREATE TABLE public.carts (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  status public.cart_status NOT NULL DEFAULT 'active',
  version integer NOT NULL DEFAULT 0 CHECK (version >= 0),
  requested_delivery_at timestamptz,
  converted_order_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  converted_at timestamptz,
  abandoned_at timestamptz,
  CHECK ((status = 'converted') = (converted_order_id IS NOT NULL)),
  CHECK (status <> 'converted' OR converted_at IS NOT NULL)
);

CREATE UNIQUE INDEX carts_one_active_per_customer_idx
  ON public.carts (customer_id) WHERE status = 'active';
CREATE INDEX carts_customer_created_idx ON public.carts (customer_id, created_at DESC);
CREATE TRIGGER carts_set_updated_at BEFORE UPDATE ON public.carts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  cart_id uuid NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
  variant_id uuid REFERENCES public.listing_variants(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX cart_items_cart_idx ON public.cart_items (cart_id, created_at, id);
CREATE TRIGGER cart_items_set_updated_at BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.cart_item_options (
  cart_item_id uuid NOT NULL REFERENCES public.cart_items(id) ON DELETE CASCADE,
  option_id uuid NOT NULL REFERENCES public.listing_options(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (cart_item_id, option_id)
);

CREATE TABLE public.cart_item_personalizations (
  cart_item_id uuid PRIMARY KEY REFERENCES public.cart_items(id) ON DELETE CASCADE,
  recipient_name text CHECK (recipient_name IS NULL OR char_length(recipient_name) BETWEEN 1 AND 120),
  message_text text CHECK (message_text IS NULL OR char_length(message_text) BETWEEN 1 AND 500),
  instructions text CHECK (instructions IS NULL OR char_length(instructions) BETWEEN 1 AND 1000),
  spelling_confirmed boolean NOT NULL DEFAULT false,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (recipient_name IS NOT NULL OR message_text IS NOT NULL OR instructions IS NOT NULL),
  CHECK ((approved_at IS NOT NULL) = spelling_confirmed)
);
CREATE TRIGGER cart_item_personalizations_set_updated_at
  BEFORE UPDATE ON public.cart_item_personalizations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.cart_recipients (
  cart_id uuid PRIMARY KEY REFERENCES public.carts(id) ON DELETE CASCADE,
  source_recipient_id uuid REFERENCES public.recipients(id) ON DELETE SET NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  relationship text CHECK (relationship IS NULL OR char_length(relationship) <= 80),
  phone text CHECK (phone IS NULL OR char_length(phone) BETWEEN 7 AND 32),
  surprise_mode public.recipient_surprise_mode NOT NULL DEFAULT 'none',
  delivery_note text CHECK (delivery_note IS NULL OR char_length(delivery_note) <= 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER cart_recipients_set_updated_at BEFORE UPDATE ON public.cart_recipients
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.cart_delivery_addresses (
  cart_id uuid PRIMARY KEY REFERENCES public.carts(id) ON DELETE CASCADE,
  source_address_id uuid REFERENCES public.addresses(id) ON DELETE SET NULL,
  label text CHECK (label IS NULL OR char_length(label) <= 80),
  street text NOT NULL CHECK (char_length(street) BETWEEN 1 AND 160),
  exterior_number text NOT NULL CHECK (char_length(exterior_number) BETWEEN 1 AND 30),
  interior_number text CHECK (interior_number IS NULL OR char_length(interior_number) <= 30),
  neighborhood text CHECK (neighborhood IS NULL OR char_length(neighborhood) <= 120),
  postal_code text CHECK (postal_code IS NULL OR char_length(postal_code) <= 12),
  city_id uuid NOT NULL REFERENCES public.cities(id) ON DELETE RESTRICT,
  zone_id uuid NOT NULL REFERENCES public.zones(id) ON DELETE RESTRICT,
  state text CHECK (state IS NULL OR char_length(state) <= 100),
  country_code text NOT NULL DEFAULT 'MX' CHECK (country_code = 'MX'),
  references_text text CHECK (references_text IS NULL OR char_length(references_text) <= 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER cart_delivery_addresses_set_updated_at
  BEFORE UPDATE ON public.cart_delivery_addresses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  public_reference text NOT NULL UNIQUE DEFAULT ('MPHO-' || upper(substr(replace(extensions.uuid_generate_v4()::text, '-', ''), 1, 16))),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  source_cart_id uuid NOT NULL UNIQUE REFERENCES public.carts(id) ON DELETE RESTRICT,
  source_cart_version integer NOT NULL CHECK (source_cart_version >= 0),
  quote_id uuid NOT NULL UNIQUE REFERENCES public.quotes(id) ON DELETE RESTRICT,
  current_state public.order_state NOT NULL DEFAULT 'draft' CHECK (current_state = 'draft'),
  recipient_snapshot jsonb NOT NULL CHECK (jsonb_typeof(recipient_snapshot) = 'object'),
  delivery_address_snapshot jsonb NOT NULL CHECK (jsonb_typeof(delivery_address_snapshot) = 'object'),
  requested_delivery_at timestamptz NOT NULL,
  currency text NOT NULL CHECK (currency = 'MXN'),
  subtotal_amount_minor bigint NOT NULL CHECK (subtotal_amount_minor BETWEEN 0 AND 9007199254740991),
  delivery_amount_minor bigint,
  service_amount_minor bigint,
  discount_amount_minor bigint NOT NULL DEFAULT 0 CHECK (discount_amount_minor = 0),
  total_known_amount_minor bigint NOT NULL CHECK (total_known_amount_minor BETWEEN 0 AND 9007199254740991),
  total_is_final boolean NOT NULL DEFAULT false,
  availability_status public.quote_availability_status NOT NULL,
  pending_components jsonb NOT NULL CHECK (jsonb_typeof(pending_components) = 'array'),
  idempotency_key text NOT NULL CHECK (char_length(idempotency_key) BETWEEN 8 AND 200),
  request_hash text NOT NULL CHECK (char_length(request_hash) = 64),
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (customer_id, idempotency_key),
  CHECK (requested_delivery_at > created_at),
  CHECK (delivery_amount_minor IS NULL OR delivery_amount_minor >= 0),
  CHECK (service_amount_minor IS NULL OR service_amount_minor >= 0),
  CHECK (total_known_amount_minor = subtotal_amount_minor + coalesce(delivery_amount_minor, 0) + coalesce(service_amount_minor, 0) - discount_amount_minor),
  CHECK (NOT total_is_final OR (delivery_amount_minor IS NOT NULL AND service_amount_minor IS NOT NULL AND availability_status = 'eligible'))
);
CREATE INDEX orders_customer_created_idx ON public.orders (customer_id, created_at DESC);
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.carts ADD CONSTRAINT carts_converted_order_fk
  FOREIGN KEY (converted_order_id) REFERENCES public.orders(id) ON DELETE RESTRICT;

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  variant_id uuid REFERENCES public.listing_variants(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  product_snapshot jsonb NOT NULL CHECK (jsonb_typeof(product_snapshot) = 'object'),
  variant_snapshot jsonb CHECK (variant_snapshot IS NULL OR jsonb_typeof(variant_snapshot) = 'object'),
  options_snapshot jsonb NOT NULL CHECK (jsonb_typeof(options_snapshot) = 'array'),
  personalization_snapshot jsonb CHECK (personalization_snapshot IS NULL OR jsonb_typeof(personalization_snapshot) = 'object'),
  unit_price_amount_minor bigint NOT NULL CHECK (unit_price_amount_minor BETWEEN 0 AND 9007199254740991),
  total_price_amount_minor bigint NOT NULL CHECK (total_price_amount_minor BETWEEN 0 AND 9007199254740991),
  currency text NOT NULL CHECK (currency = 'MXN'),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (total_price_amount_minor = unit_price_amount_minor * quantity)
);
CREATE INDEX order_items_order_idx ON public.order_items (order_id, created_at, id);

CREATE TABLE public.order_state_history (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  from_state public.order_state,
  to_state public.order_state NOT NULL CHECK (to_state = 'draft'),
  actor_type text NOT NULL CHECK (actor_type = 'customer'),
  actor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  reason_code text NOT NULL CHECK (reason_code = 'draft_created'),
  idempotency_key text NOT NULL,
  request_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (order_id, to_state),
  CHECK (from_state IS NULL)
);
CREATE INDEX order_state_history_order_idx ON public.order_state_history (order_id, created_at);

ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_item_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_item_personalizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_delivery_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_state_history ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.carts, public.cart_items, public.cart_item_options,
  public.cart_item_personalizations, public.cart_recipients,
  public.cart_delivery_addresses, public.orders, public.order_items,
  public.order_state_history FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.carts, public.cart_items, public.cart_item_options,
  public.cart_item_personalizations, public.cart_recipients,
  public.cart_delivery_addresses, public.orders, public.order_items,
  public.order_state_history TO authenticated;

CREATE POLICY carts_select_own ON public.carts FOR SELECT TO authenticated USING (
  customer_id IN (SELECT c.id FROM public.customers c JOIN public.profiles p ON p.id = c.profile_id WHERE p.auth_user_id = public.auth_uid() AND p.status = 'active')
);
CREATE POLICY cart_items_select_own ON public.cart_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.carts c JOIN public.customers customer ON customer.id = c.customer_id JOIN public.profiles p ON p.id = customer.profile_id WHERE c.id = cart_items.cart_id AND p.auth_user_id = public.auth_uid() AND p.status = 'active')
);
CREATE POLICY cart_item_options_select_own ON public.cart_item_options FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.cart_items i JOIN public.carts c ON c.id = i.cart_id JOIN public.customers customer ON customer.id = c.customer_id JOIN public.profiles p ON p.id = customer.profile_id WHERE i.id = cart_item_options.cart_item_id AND p.auth_user_id = public.auth_uid() AND p.status = 'active')
);
CREATE POLICY cart_item_personalizations_select_own ON public.cart_item_personalizations FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.cart_items i JOIN public.carts c ON c.id = i.cart_id JOIN public.customers customer ON customer.id = c.customer_id JOIN public.profiles p ON p.id = customer.profile_id WHERE i.id = cart_item_personalizations.cart_item_id AND p.auth_user_id = public.auth_uid() AND p.status = 'active')
);
CREATE POLICY cart_recipients_select_own ON public.cart_recipients FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.carts c JOIN public.customers customer ON customer.id = c.customer_id JOIN public.profiles p ON p.id = customer.profile_id WHERE c.id = cart_recipients.cart_id AND p.auth_user_id = public.auth_uid() AND p.status = 'active')
);
CREATE POLICY cart_delivery_addresses_select_own ON public.cart_delivery_addresses FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.carts c JOIN public.customers customer ON customer.id = c.customer_id JOIN public.profiles p ON p.id = customer.profile_id WHERE c.id = cart_delivery_addresses.cart_id AND p.auth_user_id = public.auth_uid() AND p.status = 'active')
);
CREATE POLICY orders_select_own ON public.orders FOR SELECT TO authenticated USING (
  customer_id IN (SELECT c.id FROM public.customers c JOIN public.profiles p ON p.id = c.profile_id WHERE p.auth_user_id = public.auth_uid() AND p.status = 'active')
);
CREATE POLICY order_items_select_own ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders o JOIN public.customers c ON c.id = o.customer_id JOIN public.profiles p ON p.id = c.profile_id WHERE o.id = order_items.order_id AND p.auth_user_id = public.auth_uid() AND p.status = 'active')
);
CREATE POLICY order_state_history_select_own ON public.order_state_history FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders o JOIN public.customers c ON c.id = o.customer_id JOIN public.profiles p ON p.id = c.profile_id WHERE o.id = order_state_history.order_id AND p.auth_user_id = public.auth_uid() AND p.status = 'active')
);

CREATE OR REPLACE FUNCTION public.phase6_customer_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT c.id FROM public.customers c JOIN public.profiles p ON p.id = c.profile_id
  WHERE p.auth_user_id = public.auth_uid() AND p.status = 'active';
$function$;

CREATE OR REPLACE FUNCTION public.phase6_profile_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT p.id FROM public.profiles p WHERE p.auth_user_id = public.auth_uid() AND p.status = 'active';
$function$;

CREATE OR REPLACE FUNCTION public.phase6_cart_json(p_cart_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT jsonb_build_object(
    'id', c.id, 'status', c.status, 'version', c.version,
    'requestedDeliveryAt', c.requested_delivery_at, 'convertedOrderId', c.converted_order_id,
    'items', coalesce((SELECT jsonb_agg(jsonb_build_object(
      'id', i.id, 'listingId', i.listing_id, 'name', listing.customer_title, 'slug', product.slug, 'variantId', i.variant_id, 'quantity', i.quantity,
      'options', coalesce((SELECT jsonb_agg(jsonb_build_object('id', o.option_id) ORDER BY o.option_id) FROM public.cart_item_options o WHERE o.cart_item_id = i.id), '[]'::jsonb),
      'personalization', (SELECT jsonb_build_object('recipientName', p.recipient_name, 'message', p.message_text, 'instructions', p.instructions, 'spellingConfirmed', p.spelling_confirmed, 'approvedAt', p.approved_at) FROM public.cart_item_personalizations p WHERE p.cart_item_id = i.id)
    ) ORDER BY i.created_at, i.id) FROM public.cart_items i JOIN public.listings listing ON listing.id=i.listing_id JOIN public.products product ON product.id=listing.product_id WHERE i.cart_id = c.id), '[]'::jsonb),
    'recipient', (SELECT jsonb_build_object('sourceRecipientId', r.source_recipient_id, 'name', r.name, 'relationship', r.relationship, 'phone', r.phone, 'surpriseMode', r.surprise_mode, 'deliveryNote', r.delivery_note) FROM public.cart_recipients r WHERE r.cart_id = c.id),
    'address', (SELECT jsonb_build_object('sourceAddressId', a.source_address_id, 'label', a.label, 'street', a.street, 'exteriorNumber', a.exterior_number, 'interiorNumber', a.interior_number, 'neighborhood', a.neighborhood, 'postalCode', a.postal_code, 'cityId', a.city_id, 'zoneId', a.zone_id, 'state', a.state, 'countryCode', a.country_code, 'references', a.references_text) FROM public.cart_delivery_addresses a WHERE a.cart_id = c.id)
  ) FROM public.carts c WHERE c.id = p_cart_id;
$function$;

CREATE OR REPLACE FUNCTION public.get_customer_cart()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE customer_uuid uuid; cart_uuid uuid;
BEGIN
  customer_uuid := public.phase6_customer_id();
  IF customer_uuid IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'UNAUTHORIZED', 'message', 'An active Customer session is required.')); END IF;
  SELECT id INTO cart_uuid FROM public.carts WHERE customer_id = customer_uuid AND status = 'active';
  RETURN jsonb_build_object('ok', true, 'cart', CASE WHEN cart_uuid IS NULL THEN NULL ELSE public.phase6_cart_json(cart_uuid) END);
END;
$function$;

CREATE OR REPLACE FUNCTION public.mutate_customer_cart(p_operation text, p_payload jsonb, p_expected_version integer)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE
  customer_uuid uuid; cart_record public.carts%ROWTYPE; item_record public.cart_items%ROWTYPE;
  item_uuid uuid; listing_uuid uuid; variant_uuid uuid; option_uuid uuid; option_ids uuid[] := ARRAY[]::uuid[];
  source_uuid uuid; city_uuid uuid; zone_uuid uuid; quantity_value integer; personalization jsonb;
  recipient_name text; message_value text; instructions_value text; requested_at timestamptz;
BEGIN
  customer_uuid := public.phase6_customer_id();
  IF customer_uuid IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'UNAUTHORIZED', 'message', 'An active Customer session is required.')); END IF;
  IF p_payload IS NULL OR jsonb_typeof(p_payload) <> 'object' OR p_expected_version IS NULL OR p_expected_version < 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'INVALID_REQUEST', 'message', 'A valid payload and expectedVersion are required.'));
  END IF;
  SELECT * INTO cart_record FROM public.carts WHERE customer_id = customer_uuid AND status = 'active' FOR UPDATE;
  IF NOT FOUND THEN
    IF p_expected_version <> 0 OR p_operation NOT IN ('add_item','put_recipient','put_address','put_delivery') THEN
      RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'CART_NOT_FOUND', 'message', 'The active cart was not found.'));
    END IF;
    BEGIN
      INSERT INTO public.carts(customer_id) VALUES (customer_uuid) RETURNING * INTO cart_record;
    EXCEPTION WHEN unique_violation THEN
      SELECT * INTO cart_record FROM public.carts WHERE customer_id = customer_uuid AND status = 'active' FOR UPDATE;
    END;
  END IF;
  IF cart_record.version <> p_expected_version THEN
    RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'VERSION_CONFLICT', 'message', 'The cart changed in another session.', 'currentVersion', cart_record.version));
  END IF;

  IF p_operation IN ('add_item','update_item') THEN
    BEGIN
      listing_uuid := (p_payload->>'listingId')::uuid;
      variant_uuid := nullif(p_payload->>'variantId','')::uuid;
      quantity_value := (p_payload->>'quantity')::integer;
      option_ids := ARRAY(SELECT value::uuid FROM jsonb_array_elements_text(coalesce(p_payload->'optionIds','[]'::jsonb)));
    EXCEPTION WHEN others THEN
      RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'INVALID_REQUEST', 'message', 'The item selection is invalid.'));
    END;
    IF quantity_value NOT BETWEEN 1 AND 20 THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'INVALID_QUANTITY', 'message', 'Quantity must be between 1 and 20.')); END IF;
    IF cardinality(option_ids) <> cardinality(ARRAY(SELECT DISTINCT unnest(option_ids))) THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'OPTION_INVALID', 'message', 'Duplicate options are invalid.')); END IF;
    IF NOT EXISTS (SELECT 1 FROM public.listings l JOIN public.products product ON product.id = l.product_id WHERE l.id = listing_uuid AND l.status = 'published' AND l.published_at IS NOT NULL AND product.status = 'active') THEN
      RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'LISTING_NOT_PUBLIC', 'message', 'The listing is not available.'));
    END IF;
    IF variant_uuid IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.listing_variants v WHERE v.id = variant_uuid AND v.listing_id = listing_uuid AND v.status = 'active') THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'VARIANT_INVALID', 'message', 'The selected variant is invalid.')); END IF;
    IF EXISTS (SELECT 1 FROM unnest(option_ids) selected(id) LEFT JOIN public.listing_options o ON o.id = selected.id AND o.listing_id = listing_uuid AND o.status = 'active' WHERE o.id IS NULL) THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'OPTION_INVALID', 'message', 'A selected option is invalid.')); END IF;
    personalization := p_payload->'personalization';
    IF personalization IS NOT NULL AND personalization <> 'null'::jsonb THEN
      IF jsonb_typeof(personalization) <> 'object' THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'PERSONALIZATION_INVALID', 'message', 'Personalization must be structured text.')); END IF;
      recipient_name := nullif(btrim(personalization->>'recipientName'),''); message_value := nullif(btrim(personalization->>'message'),''); instructions_value := nullif(btrim(personalization->>'instructions'),'');
      IF recipient_name IS NULL AND message_value IS NULL AND instructions_value IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'PERSONALIZATION_INVALID', 'message', 'Personalization is empty.')); END IF;
      IF char_length(coalesce(recipient_name,'')) > 120 OR char_length(coalesce(message_value,'')) > 500 OR char_length(coalesce(instructions_value,'')) > 1000 THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'PERSONALIZATION_TOO_LONG', 'message', 'Personalization exceeds the allowed length.')); END IF;
      IF concat_ws(' ',recipient_name,message_value,instructions_value) ~* '</?[a-z][^>]*>' THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'PERSONALIZATION_INVALID', 'message', 'HTML is not accepted.')); END IF;
    END IF;
    IF p_operation = 'add_item' THEN
      IF (SELECT count(*) FROM public.cart_items WHERE cart_id = cart_record.id) >= 20 THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'CART_LIMIT', 'message', 'A cart supports at most 20 items.')); END IF;
      INSERT INTO public.cart_items(cart_id,listing_id,variant_id,quantity) VALUES(cart_record.id,listing_uuid,variant_uuid,quantity_value) RETURNING id INTO item_uuid;
    ELSE
      BEGIN item_uuid := (p_payload->>'itemId')::uuid; EXCEPTION WHEN others THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code','INVALID_REQUEST','message','The item id is invalid.')); END;
      UPDATE public.cart_items SET listing_id=listing_uuid,variant_id=variant_uuid,quantity=quantity_value WHERE id=item_uuid AND cart_id=cart_record.id RETURNING * INTO item_record;
      IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code','ITEM_NOT_FOUND','message','The cart item was not found.')); END IF;
      DELETE FROM public.cart_item_options WHERE cart_item_id=item_uuid;
      DELETE FROM public.cart_item_personalizations WHERE cart_item_id=item_uuid;
    END IF;
    FOREACH option_uuid IN ARRAY option_ids LOOP INSERT INTO public.cart_item_options(cart_item_id,option_id) VALUES(item_uuid,option_uuid); END LOOP;
    IF personalization IS NOT NULL AND personalization <> 'null'::jsonb THEN
      INSERT INTO public.cart_item_personalizations(cart_item_id,recipient_name,message_text,instructions,spelling_confirmed,approved_at)
      VALUES(item_uuid,recipient_name,message_value,instructions_value,coalesce((personalization->>'spellingConfirmed')::boolean,false),CASE WHEN coalesce((personalization->>'spellingConfirmed')::boolean,false) THEN now() ELSE NULL END);
    END IF;
  ELSIF p_operation = 'delete_item' THEN
    BEGIN item_uuid := (p_payload->>'itemId')::uuid; EXCEPTION WHEN others THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code','INVALID_REQUEST','message','The item id is invalid.')); END;
    DELETE FROM public.cart_items WHERE id=item_uuid AND cart_id=cart_record.id;
    IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code','ITEM_NOT_FOUND','message','The cart item was not found.')); END IF;
  ELSIF p_operation = 'put_recipient' THEN
    BEGIN source_uuid := nullif(p_payload->>'sourceRecipientId','')::uuid; EXCEPTION WHEN others THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','RECIPIENT_INVALID','message','The saved recipient is invalid.')); END;
    IF source_uuid IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.recipients WHERE id=source_uuid AND customer_id=customer_uuid AND archived_at IS NULL) THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','RECIPIENT_INVALID','message','The saved recipient was not found.')); END IF;
    recipient_name := nullif(btrim(p_payload->>'name'),'');
    IF recipient_name IS NULL OR char_length(recipient_name)>120 OR char_length(coalesce(p_payload->>'relationship',''))>80 OR char_length(coalesce(p_payload->>'phone',''))>32 OR char_length(coalesce(p_payload->>'deliveryNote',''))>500 THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','RECIPIENT_INVALID','message','Recipient data is invalid.')); END IF;
    INSERT INTO public.cart_recipients(cart_id,source_recipient_id,name,relationship,phone,surprise_mode,delivery_note) VALUES(cart_record.id,source_uuid,recipient_name,nullif(btrim(p_payload->>'relationship'),''),nullif(btrim(p_payload->>'phone'),''),coalesce(nullif(p_payload->>'surpriseMode',''),'none')::public.recipient_surprise_mode,nullif(btrim(p_payload->>'deliveryNote'),''))
    ON CONFLICT(cart_id) DO UPDATE SET source_recipient_id=excluded.source_recipient_id,name=excluded.name,relationship=excluded.relationship,phone=excluded.phone,surprise_mode=excluded.surprise_mode,delivery_note=excluded.delivery_note;
  ELSIF p_operation = 'put_address' THEN
    BEGIN source_uuid:=nullif(p_payload->>'sourceAddressId','')::uuid; city_uuid:=(p_payload->>'cityId')::uuid; zone_uuid:=(p_payload->>'zoneId')::uuid; EXCEPTION WHEN others THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','ADDRESS_INVALID','message','The address is invalid.')); END;
    IF source_uuid IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.addresses WHERE id=source_uuid AND owner_type='customer' AND owner_id=customer_uuid AND archived_at IS NULL) THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','ADDRESS_INVALID','message','The saved address was not found.')); END IF;
    IF NOT EXISTS(SELECT 1 FROM public.zones z JOIN public.cities c ON c.id=z.city_id WHERE z.id=zone_uuid AND z.city_id=city_uuid AND z.status='active' AND c.status='active') THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','ZONE_UNAVAILABLE','message','The selected city or zone is unavailable.')); END IF;
    IF nullif(btrim(p_payload->>'street'),'') IS NULL OR nullif(btrim(p_payload->>'exteriorNumber'),'') IS NULL OR char_length(p_payload->>'street')>160 OR char_length(p_payload->>'exteriorNumber')>30 OR char_length(coalesce(p_payload->>'references',''))>500 THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','ADDRESS_INVALID','message','The address is incomplete or too long.')); END IF;
    INSERT INTO public.cart_delivery_addresses(cart_id,source_address_id,label,street,exterior_number,interior_number,neighborhood,postal_code,city_id,zone_id,state,country_code,references_text)
    VALUES(cart_record.id,source_uuid,nullif(btrim(p_payload->>'label'),''),btrim(p_payload->>'street'),btrim(p_payload->>'exteriorNumber'),nullif(btrim(p_payload->>'interiorNumber'),''),nullif(btrim(p_payload->>'neighborhood'),''),nullif(btrim(p_payload->>'postalCode'),''),city_uuid,zone_uuid,nullif(btrim(p_payload->>'state'),''),'MX',nullif(btrim(p_payload->>'references'),''))
    ON CONFLICT(cart_id) DO UPDATE SET source_address_id=excluded.source_address_id,label=excluded.label,street=excluded.street,exterior_number=excluded.exterior_number,interior_number=excluded.interior_number,neighborhood=excluded.neighborhood,postal_code=excluded.postal_code,city_id=excluded.city_id,zone_id=excluded.zone_id,state=excluded.state,country_code=excluded.country_code,references_text=excluded.references_text;
  ELSIF p_operation = 'put_delivery' THEN
    BEGIN requested_at := (p_payload->>'requestedDeliveryAt')::timestamptz; EXCEPTION WHEN others THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','DELIVERY_DATE_INVALID','message','The requested delivery date is invalid.')); END;
    IF requested_at <= now() THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','DELIVERY_DATE_INVALID','message','The requested delivery date must be in the future.')); END IF;
    UPDATE public.carts SET requested_delivery_at=requested_at WHERE id=cart_record.id;
  ELSE
    RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_REQUEST','message','The cart operation is not supported.'));
  END IF;
  UPDATE public.carts SET version=version+1 WHERE id=cart_record.id RETURNING * INTO cart_record;
  RETURN jsonb_build_object('ok',true,'cart',public.phase6_cart_json(cart_record.id));
EXCEPTION WHEN invalid_text_representation OR check_violation THEN
  RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_REQUEST','message','The request contains invalid values.'));
END;
$function$;

CREATE OR REPLACE FUNCTION public.phase6_order_json(p_order_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT jsonb_build_object('id',o.id,'reference',o.public_reference,'state',o.current_state,'quoteId',o.quote_id,
    'requestedDeliveryAt',o.requested_delivery_at,'recipient',o.recipient_snapshot,'address',o.delivery_address_snapshot,
    'currency',o.currency,'subtotal',jsonb_build_object('amountMinor',o.subtotal_amount_minor,'currency',o.currency),
    'delivery',CASE WHEN o.delivery_amount_minor IS NULL THEN NULL ELSE jsonb_build_object('amountMinor',o.delivery_amount_minor,'currency',o.currency) END,
    'service',CASE WHEN o.service_amount_minor IS NULL THEN NULL ELSE jsonb_build_object('amountMinor',o.service_amount_minor,'currency',o.currency) END,
    'totalKnown',jsonb_build_object('amountMinor',o.total_known_amount_minor,'currency',o.currency),'totalIsFinal',o.total_is_final,
    'availabilityStatus',o.availability_status,'pendingComponents',o.pending_components,
    'items',coalesce((SELECT jsonb_agg(jsonb_build_object('id',i.id,'listingId',i.listing_id,'productId',i.product_id,'quantity',i.quantity,'product',i.product_snapshot,'variant',i.variant_snapshot,'options',i.options_snapshot,'personalization',i.personalization_snapshot,'unitPrice',jsonb_build_object('amountMinor',i.unit_price_amount_minor,'currency',i.currency),'lineTotal',jsonb_build_object('amountMinor',i.total_price_amount_minor,'currency',i.currency)) ORDER BY i.created_at,i.id) FROM public.order_items i WHERE i.order_id=o.id),'[]'::jsonb),
    'createdAt',o.created_at) FROM public.orders o WHERE o.id=p_order_id;
$function$;

CREATE OR REPLACE FUNCTION public.get_customer_order(p_order_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT public.phase6_order_json(o.id) FROM public.orders o WHERE o.id=p_order_id AND o.customer_id=public.phase6_customer_id();
$function$;

CREATE OR REPLACE FUNCTION public.create_customer_draft_order(p_cart_id uuid,p_expected_version integer,p_idempotency_key text,p_request_id uuid)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE customer_uuid uuid; profile_uuid uuid; cart_record public.carts%ROWTYPE; existing_order public.orders%ROWTYPE;
  canonical jsonb; request_hash_value text; quote_request jsonb; calculated jsonb; quote_json jsonb; quote_uuid uuid; order_uuid uuid := extensions.uuid_generate_v4(); item jsonb; personalization_json jsonb; item_index integer := 0;
BEGIN
  customer_uuid:=public.phase6_customer_id(); profile_uuid:=public.phase6_profile_id();
  IF customer_uuid IS NULL OR profile_uuid IS NULL THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','UNAUTHORIZED','message','An active Customer session is required.')); END IF;
  IF p_expected_version IS NULL OR p_expected_version<0 OR p_idempotency_key IS NULL OR char_length(p_idempotency_key) NOT BETWEEN 8 AND 200 OR p_request_id IS NULL THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_REQUEST','message','Cart version, idempotency key, and request id are required.')); END IF;
  SELECT * INTO cart_record FROM public.carts WHERE id=p_cart_id AND customer_id=customer_uuid FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','CART_NOT_FOUND','message','The cart was not found.')); END IF;
  canonical:=jsonb_build_object('cartId',cart_record.id,'expectedVersion',p_expected_version,'requestedDeliveryAt',cart_record.requested_delivery_at,
    'items',coalesce((SELECT jsonb_agg(jsonb_build_object('id',i.id,'listingId',i.listing_id,'variantId',i.variant_id,'quantity',i.quantity,'optionIds',coalesce((SELECT jsonb_agg(o.option_id ORDER BY o.option_id) FROM public.cart_item_options o WHERE o.cart_item_id=i.id),'[]'::jsonb),'personalization',(SELECT to_jsonb(p)-'cart_item_id'-'created_at'-'updated_at' FROM public.cart_item_personalizations p WHERE p.cart_item_id=i.id)) ORDER BY i.id) FROM public.cart_items i WHERE i.cart_id=cart_record.id),'[]'::jsonb),
    'recipient',(SELECT to_jsonb(r)-'cart_id'-'created_at'-'updated_at' FROM public.cart_recipients r WHERE r.cart_id=cart_record.id),
    'address',(SELECT to_jsonb(a)-'cart_id'-'created_at'-'updated_at' FROM public.cart_delivery_addresses a WHERE a.cart_id=cart_record.id));
  request_hash_value:=encode(extensions.digest(convert_to(canonical::text,'UTF8'),'sha256'),'hex');
  SELECT * INTO existing_order FROM public.orders WHERE customer_id=customer_uuid AND idempotency_key=p_idempotency_key;
  IF FOUND THEN
    IF existing_order.request_hash<>request_hash_value THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','IDEMPOTENCY_CONFLICT','message','The idempotency key was already used for different data.')); END IF;
    RETURN jsonb_build_object('ok',true,'order',public.phase6_order_json(existing_order.id),'replayed',true);
  END IF;
  IF cart_record.status<>'active' THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','CART_NOT_ACTIVE','message','The cart is not active.')); END IF;
  IF cart_record.version<>p_expected_version THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','VERSION_CONFLICT','message','The cart changed in another session.','currentVersion',cart_record.version)); END IF;
  IF NOT EXISTS(SELECT 1 FROM public.cart_items WHERE cart_id=cart_record.id) THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','CART_EMPTY','message','The cart is empty.')); END IF;
  IF NOT EXISTS(SELECT 1 FROM public.cart_recipients WHERE cart_id=cart_record.id) THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','RECIPIENT_REQUIRED','message','Recipient data is required.')); END IF;
  IF NOT EXISTS(SELECT 1 FROM public.cart_delivery_addresses WHERE cart_id=cart_record.id) THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','ADDRESS_REQUIRED','message','A delivery address is required.')); END IF;
  IF cart_record.requested_delivery_at IS NULL OR cart_record.requested_delivery_at<=now() THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','DELIVERY_DATE_INVALID','message','A future requested delivery date is required.')); END IF;
  IF EXISTS(SELECT 1 FROM public.cart_item_personalizations p JOIN public.cart_items i ON i.id=p.cart_item_id WHERE i.cart_id=cart_record.id AND NOT p.spelling_confirmed) THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','PERSONALIZATION_UNCONFIRMED','message','Personalization text must be confirmed.')); END IF;
  quote_request:=jsonb_build_object('items',(SELECT jsonb_agg(jsonb_build_object('listingId',i.listing_id,'variantId',i.variant_id,'optionIds',coalesce((SELECT jsonb_agg(o.option_id ORDER BY o.option_id) FROM public.cart_item_options o WHERE o.cart_item_id=i.id),'[]'::jsonb),'quantity',i.quantity) ORDER BY i.id) FROM public.cart_items i WHERE i.cart_id=cart_record.id),'zoneId',(SELECT a.zone_id FROM public.cart_delivery_addresses a WHERE a.cart_id=cart_record.id),'requestedDeliveryAt',cart_record.requested_delivery_at);
  calculated:=public.calculate_public_quote(quote_request);
  IF calculated->>'ok'<>'true' THEN RETURN calculated; END IF;
  quote_json:=calculated->'quote';
  IF quote_json->>'availabilityStatus'='unavailable' THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','UNAVAILABLE','message','The cart is currently unavailable.')); END IF;
  INSERT INTO public.quotes(customer_id,status,availability_status,currency,subtotal_amount_minor,delivery_amount_minor,service_amount_minor,discount_amount_minor,total_known_amount_minor,total_is_final,pending_components,zone_id,requested_delivery_at,expires_at,pricing_version,idempotency_key)
  VALUES(customer_uuid,(quote_json->>'status')::public.quote_status,(quote_json->>'availabilityStatus')::public.quote_availability_status,'MXN',(quote_json#>>'{subtotal,amountMinor}')::bigint,NULL,NULL,0,(quote_json#>>'{totalKnown,amountMinor}')::bigint,false,quote_json->'pendingComponents',nullif(quote_json->>'zoneId','')::uuid,cart_record.requested_delivery_at,NULL,quote_json->>'pricingVersion','draft-order:'||order_uuid::text) RETURNING id INTO quote_uuid;
  FOR item IN SELECT value FROM jsonb_array_elements(quote_json->'items') LOOP
    INSERT INTO public.quote_items(quote_id,listing_id,product_id,variant_id,quantity,unit_base_amount_minor,unit_adjustments_amount_minor,unit_final_amount_minor,line_total_amount_minor,currency,product_snapshot,variant_snapshot,options_snapshot,availability_status)
    VALUES(quote_uuid,(item->>'listingId')::uuid,(item->>'productId')::uuid,nullif(item#>>'{variant,id}','')::uuid,(item->>'quantity')::integer,(item->>'unitBaseAmountMinor')::bigint,(item->>'unitAdjustmentsAmountMinor')::bigint,(item#>>'{unitPrice,amountMinor}')::bigint,(item#>>'{lineTotal,amountMinor}')::bigint,'MXN',jsonb_build_object('name',item->>'name','slug',item->>'slug','pricingVersion',quote_json->>'pricingVersion'),CASE WHEN item->'variant'='null'::jsonb THEN NULL ELSE item->'variant' END,item->'options',(quote_json->>'availabilityStatus')::public.quote_availability_status);
  END LOOP;
  INSERT INTO public.orders(id,customer_id,source_cart_id,source_cart_version,quote_id,recipient_snapshot,delivery_address_snapshot,requested_delivery_at,currency,subtotal_amount_minor,delivery_amount_minor,service_amount_minor,discount_amount_minor,total_known_amount_minor,total_is_final,availability_status,pending_components,idempotency_key,request_hash)
  SELECT order_uuid,customer_uuid,cart_record.id,p_expected_version,quote_uuid,to_jsonb(r)-'cart_id'-'created_at'-'updated_at',to_jsonb(a)-'cart_id'-'created_at'-'updated_at',cart_record.requested_delivery_at,'MXN',(quote_json#>>'{subtotal,amountMinor}')::bigint,NULL,NULL,0,(quote_json#>>'{totalKnown,amountMinor}')::bigint,false,(quote_json->>'availabilityStatus')::public.quote_availability_status,quote_json->'pendingComponents',p_idempotency_key,request_hash_value FROM public.cart_recipients r CROSS JOIN public.cart_delivery_addresses a WHERE r.cart_id=cart_record.id AND a.cart_id=cart_record.id;
  FOR item IN SELECT value FROM jsonb_array_elements(quote_json->'items') LOOP
    SELECT jsonb_build_object('recipientName',p.recipient_name,'message',p.message_text,'instructions',p.instructions,'spellingConfirmed',p.spelling_confirmed,'approvedAt',p.approved_at) INTO personalization_json FROM public.cart_item_personalizations p WHERE p.cart_item_id=(SELECT ci.id FROM public.cart_items ci WHERE ci.cart_id=cart_record.id ORDER BY ci.id OFFSET item_index LIMIT 1);
    INSERT INTO public.order_items(order_id,listing_id,product_id,variant_id,quantity,product_snapshot,variant_snapshot,options_snapshot,personalization_snapshot,unit_price_amount_minor,total_price_amount_minor,currency)
    VALUES(order_uuid,(item->>'listingId')::uuid,(item->>'productId')::uuid,nullif(item#>>'{variant,id}','')::uuid,(item->>'quantity')::integer,jsonb_build_object('name',item->>'name','slug',item->>'slug','pricingVersion',quote_json->>'pricingVersion'),CASE WHEN item->'variant'='null'::jsonb THEN NULL ELSE item->'variant' END,item->'options',personalization_json,(item#>>'{unitPrice,amountMinor}')::bigint,(item#>>'{lineTotal,amountMinor}')::bigint,'MXN');
    item_index := item_index + 1;
  END LOOP;
  INSERT INTO public.order_state_history(order_id,from_state,to_state,actor_type,actor_id,reason_code,idempotency_key,request_id) VALUES(order_uuid,NULL,'draft','customer',profile_uuid,'draft_created',p_idempotency_key,p_request_id);
  UPDATE public.carts SET status='converted',converted_order_id=order_uuid,converted_at=now(),version=version+1 WHERE id=cart_record.id;
  RETURN jsonb_build_object('ok',true,'order',public.phase6_order_json(order_uuid),'replayed',false);
EXCEPTION WHEN unique_violation THEN
  SELECT * INTO existing_order FROM public.orders WHERE customer_id=customer_uuid AND idempotency_key=p_idempotency_key;
  IF existing_order.id IS NOT NULL AND existing_order.request_hash=request_hash_value THEN RETURN jsonb_build_object('ok',true,'order',public.phase6_order_json(existing_order.id),'replayed',true); END IF;
  RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','IDEMPOTENCY_CONFLICT','message','The idempotency key conflicts with another request.'));
END;
$function$;

REVOKE ALL ON FUNCTION public.phase6_customer_id(), public.phase6_profile_id(), public.phase6_cart_json(uuid), public.phase6_order_json(uuid), public.get_customer_cart(), public.mutate_customer_cart(text,jsonb,integer), public.get_customer_order(uuid), public.create_customer_draft_order(uuid,integer,text,uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_customer_cart(), public.mutate_customer_cart(text,jsonb,integer), public.get_customer_order(uuid), public.create_customer_draft_order(uuid,integer,text,uuid) TO authenticated;

COMMENT ON TABLE public.carts IS 'Customer-owned mutable selection; never authoritative for price, availability, partner, or inventory.';
COMMENT ON TABLE public.orders IS 'Phase 6 draft-only order snapshot. No payment, reservation, partner, assignment, or delivery state.';
COMMENT ON FUNCTION public.create_customer_draft_order(uuid,integer,text,uuid) IS 'Atomically locks an active cart, revalidates server pricing, creates a fresh quote and draft order, and converts the cart.';
