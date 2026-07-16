-- Phase 7: operational review and final quote before payment.
-- No payment, assignment, reservation, partner workflow, fulfillment or logistics is created here.

CREATE TYPE public.order_review_status AS ENUM ('pending', 'in_progress', 'changes_required', 'approved', 'rejected');
CREATE TYPE public.availability_check_dimension AS ENUM ('catalog', 'fulfillment_source', 'city', 'zone', 'schedule', 'capacity', 'personalization', 'delivery');
CREATE TYPE public.availability_check_status AS ENUM ('pending', 'validated', 'rejected', 'requires_intervention');
CREATE TYPE public.quote_component_type AS ENUM ('delivery', 'service');
CREATE TYPE public.quote_component_status AS ENUM ('proposed', 'approved', 'invalidated');

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_current_state_check;
ALTER TABLE public.order_state_history DROP CONSTRAINT IF EXISTS order_state_history_to_state_check;
ALTER TABLE public.order_state_history DROP CONSTRAINT IF EXISTS order_state_history_actor_type_check;
ALTER TABLE public.order_state_history DROP CONSTRAINT IF EXISTS order_state_history_reason_code_check;
ALTER TABLE public.order_state_history DROP CONSTRAINT IF EXISTS order_state_history_from_state_check;
ALTER TABLE public.order_state_history DROP CONSTRAINT IF EXISTS order_state_history_order_id_to_state_key;

ALTER TYPE public.order_state RENAME TO order_state_phase6;
CREATE TYPE public.order_state AS ENUM ('draft', 'quote_pending', 'quoted');
ALTER TABLE public.orders ALTER COLUMN current_state DROP DEFAULT;
ALTER TABLE public.orders ALTER COLUMN current_state TYPE public.order_state USING current_state::text::public.order_state;
ALTER TABLE public.orders ALTER COLUMN current_state SET DEFAULT 'draft';
ALTER TABLE public.order_state_history ALTER COLUMN from_state TYPE public.order_state USING from_state::text::public.order_state;
ALTER TABLE public.order_state_history ALTER COLUMN to_state TYPE public.order_state USING to_state::text::public.order_state;
DROP TYPE public.order_state_phase6;

ALTER TABLE public.order_state_history
  ADD CONSTRAINT order_state_history_actor_type_check CHECK (actor_type IN ('customer', 'mpho_operator', 'mpho_admin', 'service_account')),
  ADD CONSTRAINT order_state_history_transition_check CHECK (
    (from_state IS NULL AND to_state = 'draft') OR
    (from_state = 'draft' AND to_state = 'quote_pending') OR
    (from_state = 'quote_pending' AND to_state IN ('draft', 'quoted')) OR
    (from_state = 'quoted' AND to_state = 'quote_pending')
  );
CREATE UNIQUE INDEX order_state_history_idempotency_idx
  ON public.order_state_history (actor_id, idempotency_key);

CREATE TABLE public.order_reviews (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  order_id uuid NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE RESTRICT,
  status public.order_review_status NOT NULL DEFAULT 'pending',
  owner_profile_id uuid REFERENCES public.profiles(id) ON DELETE RESTRICT,
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  public_reason_code text CHECK (public_reason_code IS NULL OR public_reason_code IN (
    'mixed_fulfillment_sources', 'invalid_product_selection', 'address_change_required',
    'date_change_required', 'zone_unavailable', 'personalization_change_required',
    'customer_action_required'
  )),
  public_explanation text CHECK (public_explanation IS NULL OR char_length(public_explanation) <= 500),
  internal_reason text CHECK (internal_reason IS NULL OR char_length(internal_reason) <= 1000),
  next_action text CHECK (next_action IS NULL OR char_length(next_action) <= 500),
  evidence_expires_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX order_reviews_queue_idx ON public.order_reviews (status, updated_at);
CREATE TRIGGER order_reviews_set_updated_at BEFORE UPDATE ON public.order_reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.order_availability_checks (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  review_id uuid NOT NULL REFERENCES public.order_reviews(id) ON DELETE RESTRICT,
  dimension public.availability_check_dimension NOT NULL,
  status public.availability_check_status NOT NULL DEFAULT 'pending',
  source_type text,
  source_reference text CHECK (source_reference IS NULL OR char_length(source_reference) <= 300),
  reason_code text CHECK (reason_code IS NULL OR char_length(reason_code) <= 100),
  checked_by uuid REFERENCES public.profiles(id) ON DELETE RESTRICT,
  checked_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (review_id, dimension),
  CHECK (status <> 'validated' OR (source_type IS NOT NULL AND checked_by IS NOT NULL AND checked_at IS NOT NULL AND expires_at IS NOT NULL)),
  CHECK (source_type IS NULL OR source_type IN ('catalog_database', 'listing_relationship', 'geography_database', 'schedule_database', 'capacity_database', 'manual_confirmation', 'approved_delivery'))
);
CREATE INDEX order_availability_checks_review_idx ON public.order_availability_checks (review_id, dimension);
CREATE TRIGGER order_availability_checks_set_updated_at BEFORE UPDATE ON public.order_availability_checks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.quote_components (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  review_id uuid NOT NULL REFERENCES public.order_reviews(id) ON DELETE RESTRICT,
  quote_id uuid REFERENCES public.quotes(id) ON DELETE RESTRICT,
  component_type public.quote_component_type NOT NULL,
  status public.quote_component_status NOT NULL,
  amount_minor bigint NOT NULL CHECK (amount_minor BETWEEN 0 AND 9007199254740991),
  currency text NOT NULL CHECK (currency = 'MXN'),
  source_type text NOT NULL CHECK (source_type IN ('manual_verified', 'zone_rate', 'pilot_no_service_fee')),
  source_reference text NOT NULL CHECK (char_length(source_reference) BETWEEN 1 AND 300),
  reason text NOT NULL CHECK (char_length(reason) BETWEEN 1 AND 1000),
  proposed_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  approved_by uuid REFERENCES public.profiles(id) ON DELETE RESTRICT,
  proposed_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  expires_at timestamptz NOT NULL,
  pricing_version text NOT NULL CHECK (char_length(pricing_version) BETWEEN 1 AND 100),
  invalidated_at timestamptz,
  invalidation_reason text CHECK (invalidation_reason IS NULL OR char_length(invalidation_reason) <= 300),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status <> 'approved' OR (approved_by IS NOT NULL AND approved_at IS NOT NULL)),
  CHECK (component_type <> 'service' OR (amount_minor = 0 AND source_type = 'pilot_no_service_fee')),
  CHECK (component_type <> 'delivery' OR source_type IN ('manual_verified', 'zone_rate'))
);
CREATE UNIQUE INDEX quote_components_one_pending_delivery_idx
  ON public.quote_components (order_id) WHERE component_type = 'delivery' AND status = 'proposed';
CREATE UNIQUE INDEX quote_components_quote_type_idx
  ON public.quote_components (quote_id, component_type) WHERE quote_id IS NOT NULL;
CREATE INDEX quote_components_order_idx ON public.quote_components (order_id, created_at DESC);

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  order_id uuid REFERENCES public.orders(id) ON DELETE RESTRICT,
  actor_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  actor_role public.user_role NOT NULL,
  action text NOT NULL CHECK (char_length(action) BETWEEN 1 AND 100),
  reason_code text CHECK (reason_code IS NULL OR char_length(reason_code) <= 100),
  request_id uuid NOT NULL,
  idempotency_key text NOT NULL CHECK (char_length(idempotency_key) BETWEEN 8 AND 200),
  request_hash text NOT NULL CHECK (char_length(request_hash) = 64),
  expected_version integer,
  resulting_version integer,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  result jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(result) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (actor_profile_id, idempotency_key)
);
CREATE INDEX audit_logs_order_idx ON public.audit_logs (order_id, created_at DESC);

ALTER TABLE public.order_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_availability_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.order_reviews, public.order_availability_checks, public.quote_components, public.audit_logs
  FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.phase7_profile_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT p.id FROM public.profiles p
  WHERE p.auth_user_id = public.auth_uid() AND p.status = 'active';
$function$;

CREATE OR REPLACE FUNCTION public.phase7_has_role(p_role public.user_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur JOIN public.profiles p ON p.id = ur.profile_id
    WHERE p.auth_user_id = public.auth_uid() AND p.status = 'active'
      AND ur.role = p_role AND ur.status = 'active' AND ur.revoked_at IS NULL
  );
$function$;

CREATE OR REPLACE FUNCTION public.phase7_staff_role()
RETURNS public.user_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT CASE
    WHEN public.phase7_has_role('mpho_admin') THEN 'mpho_admin'::public.user_role
    WHEN public.phase7_has_role('mpho_operator') THEN 'mpho_operator'::public.user_role
    ELSE NULL::public.user_role
  END;
$function$;

CREATE OR REPLACE FUNCTION public.phase7_hash(p_value jsonb)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = '' AS $function$
  SELECT encode(extensions.digest(convert_to(p_value::text, 'UTF8'), 'sha256'), 'hex');
$function$;

CREATE OR REPLACE FUNCTION public.phase7_replay(
  p_actor uuid, p_action text, p_key text, p_hash text
) RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE prior public.audit_logs%ROWTYPE;
BEGIN
  SELECT * INTO prior FROM public.audit_logs
  WHERE actor_profile_id = p_actor AND idempotency_key = p_key;
  IF NOT FOUND THEN RETURN NULL; END IF;
  IF prior.action <> p_action OR prior.request_hash <> p_hash THEN
    RETURN jsonb_build_object('ok', false, 'error', jsonb_build_object('code', 'IDEMPOTENCY_CONFLICT', 'message', 'The idempotency key was already used for different data.'));
  END IF;
  RETURN prior.result || jsonb_build_object('replayed', true);
END;
$function$;

CREATE OR REPLACE FUNCTION public.phase7_audit(
  p_order uuid, p_actor uuid, p_role public.user_role, p_action text, p_reason text,
  p_request uuid, p_key text, p_hash text, p_expected integer, p_resulting integer,
  p_metadata jsonb, p_result jsonb
) RETURNS void LANGUAGE sql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
  INSERT INTO public.audit_logs(order_id, actor_profile_id, actor_role, action, reason_code,
    request_id, idempotency_key, request_hash, expected_version, resulting_version, metadata, result)
  VALUES (p_order, p_actor, p_role, p_action, p_reason, p_request, p_key, p_hash,
    p_expected, p_resulting, coalesce(p_metadata, '{}'::jsonb), coalesce(p_result, '{}'::jsonb));
$function$;

CREATE OR REPLACE FUNCTION public.phase7_mask(p_value text, p_visible integer DEFAULT 2)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = '' AS $function$
  SELECT CASE WHEN p_value IS NULL THEN NULL
    WHEN char_length(p_value) <= p_visible THEN repeat('*', char_length(p_value))
    ELSE left(p_value, p_visible) || repeat('*', greatest(char_length(p_value) - p_visible, 3)) END;
$function$;

CREATE OR REPLACE FUNCTION public.phase7_public_reason(p_code text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = '' AS $function$
  SELECT CASE p_code
    WHEN 'mixed_fulfillment_sources' THEN 'Este pedido contiene productos que necesitan gestionarse por separado.'
    WHEN 'invalid_product_selection' THEN 'Revisa los productos seleccionados para continuar.'
    WHEN 'address_change_required' THEN 'Necesitamos que actualices la dirección solicitada.'
    WHEN 'date_change_required' THEN 'Necesitamos que elijas otra fecha solicitada.'
    WHEN 'zone_unavailable' THEN 'La entrega no está disponible en la zona seleccionada.'
    WHEN 'personalization_change_required' THEN 'Necesitamos que ajustes la personalización.'
    ELSE 'Necesitamos que revises la información del pedido para continuar.' END;
$function$;

CREATE OR REPLACE FUNCTION public.phase7_customer_order_json(p_order_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT jsonb_build_object(
    'id', o.id, 'reference', o.public_reference, 'state', o.current_state, 'version', o.version,
    'requestedDeliveryAt', o.requested_delivery_at, 'recipient', o.recipient_snapshot, 'address', o.delivery_address_snapshot,
    'currency', o.currency,
    'subtotal', jsonb_build_object('amountMinor', o.subtotal_amount_minor, 'currency', o.currency),
    'delivery', CASE WHEN o.delivery_amount_minor IS NULL THEN NULL ELSE jsonb_build_object('amountMinor', o.delivery_amount_minor, 'currency', o.currency) END,
    'service', CASE WHEN o.service_amount_minor IS NULL THEN NULL ELSE jsonb_build_object('amountMinor', o.service_amount_minor, 'currency', o.currency) END,
    'totalKnown', jsonb_build_object('amountMinor', o.total_known_amount_minor, 'currency', o.currency),
    'totalIsFinal', o.total_is_final, 'availabilityStatus', o.availability_status,
    'pendingComponents', o.pending_components, 'quoteExpiresAt', CASE WHEN o.total_is_final AND q.status='valid' THEN q.expires_at ELSE NULL END,
    'review', CASE WHEN r.id IS NULL THEN NULL ELSE jsonb_build_object(
      'status', r.status, 'publicReasonCode', r.public_reason_code,
      'publicExplanation', coalesce(r.public_explanation, public.phase7_public_reason(r.public_reason_code)),
      'nextAction', r.next_action) END,
    'previousSubtotal', CASE WHEN previous.subtotal_amount_minor IS NULL THEN NULL ELSE jsonb_build_object('amountMinor', previous.subtotal_amount_minor, 'currency', 'MXN') END,
    'difference', CASE WHEN previous.subtotal_amount_minor IS NULL OR NOT o.total_is_final THEN NULL ELSE jsonb_build_object('amountMinor', o.total_known_amount_minor - previous.subtotal_amount_minor, 'currency', 'MXN') END,
    'priceExplanation', CASE WHEN o.total_is_final THEN 'El total final incluye el subtotal recalculado, la entrega aprobada y el cargo de servicio aplicable.' ELSE NULL END,
    'items', coalesce((SELECT jsonb_agg(jsonb_build_object(
      'id', i.id, 'listingId', i.listing_id, 'productId', i.product_id, 'quantity', i.quantity,
      'product', i.product_snapshot, 'variant', i.variant_snapshot, 'options', i.options_snapshot,
      'personalization', i.personalization_snapshot,
      'unitPrice', jsonb_build_object('amountMinor', i.unit_price_amount_minor, 'currency', i.currency),
      'lineTotal', jsonb_build_object('amountMinor', i.total_price_amount_minor, 'currency', i.currency)
    ) ORDER BY i.created_at, i.id) FROM public.order_items i WHERE i.order_id = o.id), '[]'::jsonb),
    'createdAt', o.created_at
  )
  FROM public.orders o
  JOIN public.quotes q ON q.id = o.quote_id
  LEFT JOIN public.order_reviews r ON r.order_id = o.id
  LEFT JOIN public.quotes previous ON previous.id = (
    SELECT q0.id FROM public.quotes q0 WHERE q0.customer_id = o.customer_id
      AND q0.idempotency_key = 'draft-order:' || o.id::text LIMIT 1
  )
  WHERE o.id = p_order_id;
$function$;

CREATE OR REPLACE FUNCTION public.phase7_expire_order_quote(p_order_id uuid)
RETURNS void LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE o public.orders%ROWTYPE; actor uuid;
BEGIN
  SELECT * INTO o FROM public.orders WHERE id=p_order_id AND current_state='quoted' FOR UPDATE;
  IF NOT FOUND OR NOT EXISTS(SELECT 1 FROM public.quotes q WHERE q.id=o.quote_id AND q.expires_at<=now()) THEN RETURN; END IF;
  actor:=(SELECT c.profile_id FROM public.customers c WHERE c.id=o.customer_id);
  UPDATE public.quotes SET status='expired',invalidated_at=now(),invalidation_reason='quote_expired' WHERE id=o.quote_id;
  UPDATE public.quote_components SET status='invalidated',invalidated_at=now(),invalidation_reason='quote_expired' WHERE quote_id=o.quote_id;
  UPDATE public.orders SET current_state='quote_pending',delivery_amount_minor=NULL,service_amount_minor=NULL,total_known_amount_minor=subtotal_amount_minor,total_is_final=false,availability_status='requires_review',pending_components='["delivery","operational_availability"]'::jsonb,version=version+1 WHERE id=o.id;
  UPDATE public.order_reviews SET status='in_progress',completed_at=NULL,next_action='Revalidar disponibilidad, entrega y precio.',version=version+1 WHERE order_id=o.id;
  UPDATE public.order_availability_checks c SET status='pending',source_type=NULL,source_reference=NULL,checked_by=NULL,checked_at=NULL,expires_at=NULL FROM public.order_reviews r WHERE r.order_id=o.id AND c.review_id=r.id;
  INSERT INTO public.order_state_history(order_id,from_state,to_state,actor_type,actor_id,reason_code,idempotency_key,request_id)
    VALUES(o.id,'quoted','quote_pending','customer',actor,'quote_expired','quote-expired:'||o.quote_id::text,extensions.uuid_generate_v4())
    ON CONFLICT(actor_id,idempotency_key) DO NOTHING;
  INSERT INTO public.audit_logs(order_id,actor_profile_id,actor_role,action,reason_code,request_id,idempotency_key,request_hash,expected_version,resulting_version,metadata,result)
    VALUES(o.id,actor,'customer','auto_expire_quote','quote_expired',extensions.uuid_generate_v4(),'quote-expired:'||o.quote_id::text,public.phase7_hash(jsonb_build_object('quoteId',o.quote_id)),o.version,o.version+1,'{}'::jsonb,jsonb_build_object('ok',true))
    ON CONFLICT(actor_profile_id,idempotency_key) DO NOTHING;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_customer_order(p_order_id uuid)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE customer_uuid uuid;
BEGIN
  customer_uuid:=public.phase6_customer_id();
  IF NOT EXISTS(SELECT 1 FROM public.orders o WHERE o.id=p_order_id AND o.customer_id=customer_uuid) THEN RETURN NULL; END IF;
  PERFORM public.phase7_expire_order_quote(p_order_id);
  RETURN public.phase7_customer_order_json(p_order_id);
END;
$function$;

CREATE OR REPLACE FUNCTION public.phase7_single_source(p_order_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT count(DISTINCT l.partner_id) = 1
    AND bool_and(l.source_type = 'partner_local' AND l.partner_id IS NOT NULL)
  FROM public.order_items oi JOIN public.listings l ON l.id = oi.listing_id
  WHERE oi.order_id = p_order_id;
$function$;

CREATE OR REPLACE FUNCTION public.submit_customer_order_review(
  p_order_id uuid, p_expected_version integer, p_idempotency_key text, p_request_id uuid
) RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE actor uuid; customer_uuid uuid; o public.orders%ROWTYPE; r public.order_reviews%ROWTYPE;
  canonical jsonb; hash text; replay jsonb; result jsonb;
BEGIN
  actor := public.phase7_profile_id(); customer_uuid := public.phase6_customer_id();
  IF actor IS NULL OR customer_uuid IS NULL THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','UNAUTHORIZED','message','An active Customer session is required.')); END IF;
  IF p_expected_version IS NULL OR p_idempotency_key IS NULL OR char_length(p_idempotency_key) NOT BETWEEN 8 AND 200 OR p_request_id IS NULL THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_REQUEST','message','Version, idempotency key and request id are required.')); END IF;
  canonical := jsonb_build_object('orderId', p_order_id, 'expectedVersion', p_expected_version);
  hash := public.phase7_hash(canonical); replay := public.phase7_replay(actor, 'submit_review', p_idempotency_key, hash);
  IF replay IS NOT NULL THEN RETURN replay; END IF;
  SELECT * INTO o FROM public.orders WHERE id = p_order_id AND customer_id = customer_uuid FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','ORDER_NOT_FOUND','message','The order was not found.')); END IF;
  replay := public.phase7_replay(actor, 'submit_review', p_idempotency_key, hash);
  IF replay IS NOT NULL THEN RETURN replay; END IF;
  IF o.version <> p_expected_version THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','VERSION_CONFLICT','message','The order changed in another session.','currentVersion',o.version)); END IF;
  IF o.current_state <> 'draft' THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_TRANSITION','message','The order cannot enter review from its current state.')); END IF;
  IF NOT public.phase7_single_source(o.id) THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INCOMPATIBLE_CART_ITEM','message','Este producto necesita gestionarse por separado. Crea otro pedido para continuar.')); END IF;
  INSERT INTO public.order_reviews(order_id, status, next_action) VALUES(o.id, 'pending', 'Revisar disponibilidad, entrega y precio final.')
    ON CONFLICT(order_id) DO UPDATE SET status='pending', public_reason_code=NULL, public_explanation=NULL, internal_reason=NULL, next_action='Revisar disponibilidad, entrega y precio final.', version=public.order_reviews.version+1
    RETURNING * INTO r;
  INSERT INTO public.order_availability_checks(review_id, dimension)
    SELECT r.id, d FROM unnest(enum_range(NULL::public.availability_check_dimension)) d
    ON CONFLICT(review_id, dimension) DO UPDATE SET status='pending', source_type=NULL, source_reference=NULL, reason_code=NULL, checked_by=NULL, checked_at=NULL, expires_at=NULL;
  UPDATE public.orders SET current_state='quote_pending', version=version+1 WHERE id=o.id RETURNING * INTO o;
  INSERT INTO public.order_state_history(order_id,from_state,to_state,actor_type,actor_id,reason_code,idempotency_key,request_id)
    VALUES(o.id,'draft','quote_pending','customer',actor,'review_requested',p_idempotency_key,p_request_id);
  result := jsonb_build_object('ok',true,'order',public.phase7_customer_order_json(o.id));
  PERFORM public.phase7_audit(o.id,actor,'customer','submit_review','review_requested',p_request_id,p_idempotency_key,hash,p_expected_version,o.version,'{}'::jsonb,result);
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.phase7_staff_review_json(p_order_id uuid, p_include_pii boolean DEFAULT false)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT jsonb_build_object(
    'orderId', o.id, 'reference', o.public_reference, 'state', o.current_state, 'orderVersion', o.version,
    'reviewId', r.id, 'reviewStatus', r.status, 'reviewVersion', r.version,
    'ownerProfileId', r.owner_profile_id, 'publicReasonCode', r.public_reason_code,
    'publicExplanation', r.public_explanation, 'internalReason', r.internal_reason,
    'nextAction', r.next_action, 'evidenceExpiresAt', r.evidence_expires_at,
    'requestedDeliveryAt', o.requested_delivery_at,
    'recipient', jsonb_build_object('name', CASE WHEN p_include_pii THEN o.recipient_snapshot->>'name' ELSE public.phase7_mask(o.recipient_snapshot->>'name') END,
      'phone', CASE WHEN p_include_pii THEN o.recipient_snapshot->>'phone' ELSE public.phase7_mask(o.recipient_snapshot->>'phone') END),
    'address', jsonb_build_object('zoneId', o.delivery_address_snapshot->>'zone_id', 'cityId', o.delivery_address_snapshot->>'city_id',
      'street', CASE WHEN p_include_pii THEN o.delivery_address_snapshot->>'street' ELSE public.phase7_mask(o.delivery_address_snapshot->>'street') END),
    'checks', coalesce((SELECT jsonb_agg(jsonb_build_object('dimension',c.dimension,'status',c.status,'sourceType',c.source_type,'reasonCode',c.reason_code,'checkedAt',c.checked_at,'expiresAt',c.expires_at) ORDER BY c.dimension) FROM public.order_availability_checks c WHERE c.review_id=r.id),'[]'::jsonb),
    'delivery', (SELECT jsonb_build_object('id',qc.id,'status',qc.status,'amountMinor',qc.amount_minor,'currency',qc.currency,'sourceType',qc.source_type,'sourceReference',qc.source_reference,'reason',qc.reason,'expiresAt',qc.expires_at,'pricingVersion',qc.pricing_version) FROM public.quote_components qc WHERE qc.order_id=o.id AND qc.component_type='delivery' AND qc.status IN ('proposed','approved') ORDER BY qc.created_at DESC LIMIT 1)
  ) FROM public.orders o JOIN public.order_reviews r ON r.order_id=o.id WHERE o.id=p_order_id;
$function$;

CREATE OR REPLACE FUNCTION public.list_central_order_reviews()
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE expired record;
BEGIN
  IF public.phase7_staff_role() IS NULL THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','FORBIDDEN','message','Central access is required.')); END IF;
  FOR expired IN SELECT o.id FROM public.orders o JOIN public.quotes q ON q.id=o.quote_id WHERE o.current_state='quoted' AND q.expires_at<=now() LOOP
    PERFORM public.phase7_expire_order_quote(expired.id);
  END LOOP;
  RETURN jsonb_build_object('ok',true,'reviews',coalesce((SELECT jsonb_agg(public.phase7_staff_review_json(r.order_id,false) ORDER BY r.updated_at) FROM public.order_reviews r),'[]'::jsonb));
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_central_order_review(p_order_id uuid)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE payload jsonb;
BEGIN
  IF public.phase7_staff_role() IS NULL THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','FORBIDDEN','message','Central access is required.')); END IF;
  PERFORM public.phase7_expire_order_quote(p_order_id);
  payload := public.phase7_staff_review_json(p_order_id,false);
  IF payload IS NULL THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','ORDER_NOT_FOUND','message','The review was not found.')); END IF;
  RETURN jsonb_build_object('ok',true,'review',payload);
END;
$function$;

CREATE OR REPLACE FUNCTION public.central_review_command(
  p_order_id uuid, p_command text, p_payload jsonb, p_expected_version integer,
  p_idempotency_key text, p_request_id uuid
) RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE actor uuid; role public.user_role; o public.orders%ROWTYPE; r public.order_reviews%ROWTYPE;
  canonical jsonb; hash text; replay jsonb; result jsonb; dim public.availability_check_dimension;
  check_status public.availability_check_status; expiry timestamptz; amount bigint; component public.quote_components%ROWTYPE;
  reason text; public_code text; calculated jsonb; q jsonb; new_quote uuid; old_quote uuid; item jsonb;
  ttl integer := greatest(1,least(120,coalesce(nullif(current_setting('app.final_quote_ttl_minutes',true),'')::integer,30)));
BEGIN
  actor:=public.phase7_profile_id(); role:=public.phase7_staff_role();
  IF actor IS NULL OR role IS NULL THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','FORBIDDEN','message','Central access is required.')); END IF;
  IF p_payload IS NULL OR jsonb_typeof(p_payload)<>'object' OR p_expected_version IS NULL OR p_idempotency_key IS NULL OR char_length(p_idempotency_key) NOT BETWEEN 8 AND 200 OR p_request_id IS NULL THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_REQUEST','message','A valid command envelope is required.')); END IF;
  canonical:=jsonb_build_object('orderId',p_order_id,'command',p_command,'payload',p_payload,'expectedVersion',p_expected_version);
  hash:=public.phase7_hash(canonical); replay:=public.phase7_replay(actor,'central_'||p_command,p_idempotency_key,hash);
  IF replay IS NOT NULL THEN RETURN replay; END IF;
  SELECT * INTO o FROM public.orders WHERE id=p_order_id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','ORDER_NOT_FOUND','message','The review was not found.')); END IF;
  replay:=public.phase7_replay(actor,'central_'||p_command,p_idempotency_key,hash);
  IF replay IS NOT NULL THEN RETURN replay; END IF;
  SELECT * INTO r FROM public.order_reviews WHERE order_id=o.id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','ORDER_NOT_FOUND','message','The review was not found.')); END IF;
  IF o.version<>p_expected_version THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','VERSION_CONFLICT','message','The order changed in another session.','currentVersion',o.version)); END IF;

  IF p_command='claim' THEN
    UPDATE public.order_reviews SET owner_profile_id=actor,status='in_progress',started_at=coalesce(started_at,now()),version=version+1 WHERE id=r.id;
  ELSIF p_command='run_checks' THEN
    IF o.current_state<>'quote_pending' THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_TRANSITION','message','Checks require quote_pending.')); END IF;
    UPDATE public.order_availability_checks SET
      status=CASE dimension
        WHEN 'catalog' THEN CASE WHEN NOT EXISTS(SELECT 1 FROM public.order_items oi JOIN public.listings l ON l.id=oi.listing_id JOIN public.products p ON p.id=l.product_id WHERE oi.order_id=o.id AND (l.status<>'published' OR l.published_at IS NULL OR p.status<>'active')) THEN 'validated'::public.availability_check_status ELSE 'rejected'::public.availability_check_status END
        WHEN 'fulfillment_source' THEN CASE WHEN public.phase7_single_source(o.id) THEN 'validated'::public.availability_check_status ELSE 'rejected'::public.availability_check_status END
        WHEN 'city' THEN CASE WHEN EXISTS(SELECT 1 FROM public.cities ci WHERE ci.id=(o.delivery_address_snapshot->>'city_id')::uuid AND ci.status='active') THEN 'validated'::public.availability_check_status ELSE 'rejected'::public.availability_check_status END
        WHEN 'zone' THEN CASE WHEN NOT EXISTS(SELECT 1 FROM public.order_items oi WHERE oi.order_id=o.id AND NOT EXISTS(SELECT 1 FROM public.listing_zones lz WHERE lz.listing_id=oi.listing_id AND lz.zone_id=(o.delivery_address_snapshot->>'zone_id')::uuid AND lz.status='active')) THEN 'validated'::public.availability_check_status ELSE 'rejected'::public.availability_check_status END
        ELSE 'requires_intervention'::public.availability_check_status END,
      source_type=CASE WHEN dimension='catalog' THEN 'catalog_database' WHEN dimension='fulfillment_source' THEN 'listing_relationship' WHEN dimension IN ('city','zone') THEN 'geography_database' ELSE NULL END,
      checked_by=CASE WHEN dimension IN ('catalog','fulfillment_source','city','zone') THEN actor ELSE NULL END,
      checked_at=CASE WHEN dimension IN ('catalog','fulfillment_source','city','zone') THEN now() ELSE NULL END,
      expires_at=CASE WHEN dimension IN ('catalog','fulfillment_source','city','zone') THEN now()+interval '30 minutes' ELSE NULL END
    WHERE review_id=r.id;
    UPDATE public.order_reviews SET status='in_progress',owner_profile_id=coalesce(owner_profile_id,actor),version=version+1 WHERE id=r.id;
  ELSIF p_command='set_check' THEN
    BEGIN dim:=(p_payload->>'dimension')::public.availability_check_dimension; check_status:=(p_payload->>'status')::public.availability_check_status; expiry:=(p_payload->>'expiresAt')::timestamptz; EXCEPTION WHEN others THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_REQUEST','message','The check data is invalid.')); END;
    IF dim NOT IN ('schedule','capacity','personalization') OR check_status NOT IN ('validated','rejected','requires_intervention') OR expiry<=now() THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_REQUEST','message','Only manual operational checks with a future expiry are accepted.')); END IF;
    UPDATE public.order_availability_checks SET status=check_status,source_type=CASE WHEN check_status='validated' THEN 'manual_confirmation' ELSE NULL END,source_reference=nullif(p_payload->>'sourceReference',''),reason_code=nullif(p_payload->>'reasonCode',''),checked_by=CASE WHEN check_status='validated' THEN actor ELSE NULL END,checked_at=CASE WHEN check_status='validated' THEN now() ELSE NULL END,expires_at=CASE WHEN check_status='validated' THEN expiry ELSE NULL END WHERE review_id=r.id AND dimension=dim;
    UPDATE public.order_reviews SET version=version+1 WHERE id=r.id;
  ELSIF p_command='request_changes' THEN
    IF o.current_state<>'quote_pending' THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_TRANSITION','message','Changes can only be requested during review.')); END IF;
    public_code:=p_payload->>'reasonCode';
    IF public_code IS NULL OR public_code NOT IN ('mixed_fulfillment_sources','invalid_product_selection','address_change_required','date_change_required','zone_unavailable','personalization_change_required','customer_action_required') THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_REQUEST','message','A public reason is required.')); END IF;
    UPDATE public.order_reviews SET status='changes_required',public_reason_code=public_code,public_explanation=public.phase7_public_reason(public_code),internal_reason=nullif(p_payload->>'internalReason',''),next_action='El Customer debe actualizar el pedido.',version=version+1 WHERE id=r.id;
    UPDATE public.orders SET current_state='draft',total_is_final=false,availability_status='requires_review',version=version+1 WHERE id=o.id RETURNING * INTO o;
    INSERT INTO public.order_state_history(order_id,from_state,to_state,actor_type,actor_id,reason_code,idempotency_key,request_id) VALUES(o.id,'quote_pending','draft',role::text,actor,public_code,p_idempotency_key,p_request_id);
  ELSIF p_command='propose_delivery' THEN
    BEGIN amount:=(p_payload->>'amountMinor')::bigint; expiry:=(p_payload->>'expiresAt')::timestamptz; EXCEPTION WHEN others THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_REQUEST','message','The delivery proposal is invalid.')); END;
    IF role NOT IN ('mpho_operator','mpho_admin') OR amount<0 OR expiry<=now() OR p_payload->>'sourceType'<>'manual_verified' OR nullif(btrim(p_payload->>'sourceReference'),'') IS NULL OR nullif(btrim(p_payload->>'reason'),'') IS NULL OR nullif(btrim(p_payload->>'pricingVersion'),'') IS NULL THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_REQUEST','message','Amount, approved source, reason, expiry and pricing version are required.')); END IF;
    UPDATE public.quote_components SET status='invalidated',invalidated_at=now(),invalidation_reason='superseded_proposal' WHERE order_id=o.id AND component_type='delivery' AND status='proposed';
    INSERT INTO public.quote_components(order_id,review_id,component_type,status,amount_minor,currency,source_type,source_reference,reason,proposed_by,expires_at,pricing_version)
      VALUES(o.id,r.id,'delivery','proposed',amount,'MXN',p_payload->>'sourceType',btrim(p_payload->>'sourceReference'),btrim(p_payload->>'reason'),actor,expiry,btrim(p_payload->>'pricingVersion'));
  ELSIF p_command='approve_delivery' THEN
    IF role<>'mpho_admin' THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','FORBIDDEN','message','Administrator approval is required.')); END IF;
    SELECT * INTO component FROM public.quote_components WHERE id=(p_payload->>'componentId')::uuid AND order_id=o.id AND component_type='delivery' AND status='proposed' FOR UPDATE;
    IF NOT FOUND OR component.expires_at<=now() THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','DELIVERY_PROPOSAL_NOT_FOUND','message','A valid delivery proposal was not found.')); END IF;
    UPDATE public.quote_components SET status='approved',approved_by=actor,approved_at=now() WHERE id=component.id;
    UPDATE public.order_availability_checks SET status='validated',source_type='approved_delivery',source_reference=component.id::text,checked_by=actor,checked_at=now(),expires_at=component.expires_at WHERE review_id=r.id AND dimension='delivery';
    UPDATE public.order_reviews SET version=version+1 WHERE id=r.id;
  ELSIF p_command='finalize_quote' THEN
    IF role<>'mpho_admin' OR o.current_state<>'quote_pending' THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','FORBIDDEN','message','Administrator finalization during quote_pending is required.')); END IF;
    IF EXISTS(SELECT 1 FROM public.order_availability_checks c WHERE c.review_id=r.id AND (c.status<>'validated' OR c.expires_at<=now())) THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','REVIEW_INCOMPLETE','message','All required checks must be valid.')); END IF;
    SELECT * INTO component FROM public.quote_components WHERE order_id=o.id AND component_type='delivery' AND status='approved' AND quote_id IS NULL AND expires_at>now() ORDER BY approved_at DESC LIMIT 1 FOR UPDATE;
    IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','DELIVERY_REQUIRED','message','An approved delivery component is required.')); END IF;
    calculated:=public.calculate_public_quote(jsonb_build_object('items',(SELECT jsonb_agg(jsonb_build_object('listingId',oi.listing_id,'variantId',oi.variant_id,'optionIds',coalesce((SELECT jsonb_agg(x->>'id') FROM jsonb_array_elements(oi.options_snapshot) x),'[]'::jsonb),'quantity',oi.quantity) ORDER BY oi.id) FROM public.order_items oi WHERE oi.order_id=o.id),'zoneId',o.delivery_address_snapshot->>'zone_id','requestedDeliveryAt',o.requested_delivery_at));
    IF calculated->>'ok'<>'true' THEN RETURN calculated; END IF; q:=calculated->'quote'; old_quote:=o.quote_id;
    INSERT INTO public.quotes(customer_id,status,availability_status,currency,subtotal_amount_minor,delivery_amount_minor,service_amount_minor,discount_amount_minor,total_known_amount_minor,total_is_final,pending_components,zone_id,requested_delivery_at,expires_at,pricing_version,idempotency_key)
      VALUES(o.customer_id,'valid','eligible','MXN',(q#>>'{subtotal,amountMinor}')::bigint,component.amount_minor,0,0,(q#>>'{subtotal,amountMinor}')::bigint+component.amount_minor,true,'[]'::jsonb,(o.delivery_address_snapshot->>'zone_id')::uuid,o.requested_delivery_at,least(now()+make_interval(mins=>ttl),component.expires_at),component.pricing_version,'final-order:'||o.id::text||':v'||o.version::text) RETURNING id INTO new_quote;
    FOR item IN SELECT value FROM jsonb_array_elements(q->'items') LOOP
      INSERT INTO public.quote_items(quote_id,listing_id,product_id,variant_id,quantity,unit_base_amount_minor,unit_adjustments_amount_minor,unit_final_amount_minor,line_total_amount_minor,currency,product_snapshot,variant_snapshot,options_snapshot,availability_status)
      VALUES(new_quote,(item->>'listingId')::uuid,(item->>'productId')::uuid,nullif(item#>>'{variant,id}','')::uuid,(item->>'quantity')::integer,(item->>'unitBaseAmountMinor')::bigint,(item->>'unitAdjustmentsAmountMinor')::bigint,(item#>>'{unitPrice,amountMinor}')::bigint,(item#>>'{lineTotal,amountMinor}')::bigint,'MXN',jsonb_build_object('name',item->>'name','slug',item->>'slug','pricingVersion',component.pricing_version),CASE WHEN item->'variant'='null'::jsonb THEN NULL ELSE item->'variant' END,item->'options','eligible');
    END LOOP;
    UPDATE public.quotes SET status='invalidated',invalidated_at=now(),invalidation_reason='superseded_by_final_quote' WHERE id=old_quote;
    UPDATE public.quote_components SET quote_id=new_quote WHERE id=component.id;
    INSERT INTO public.quote_components(order_id,review_id,quote_id,component_type,status,amount_minor,currency,source_type,source_reference,reason,proposed_by,approved_by,approved_at,expires_at,pricing_version)
      VALUES(o.id,r.id,new_quote,'service','approved',0,'MXN','pilot_no_service_fee','phase-7-pilot','Cargo de servicio no aplicado durante el piloto.',actor,actor,now(),least(now()+make_interval(mins=>ttl),component.expires_at),component.pricing_version);
    UPDATE public.orders SET quote_id=new_quote,current_state='quoted',subtotal_amount_minor=(q#>>'{subtotal,amountMinor}')::bigint,delivery_amount_minor=component.amount_minor,service_amount_minor=0,total_known_amount_minor=(q#>>'{subtotal,amountMinor}')::bigint+component.amount_minor,total_is_final=true,availability_status='eligible',pending_components='[]'::jsonb,version=version+1 WHERE id=o.id RETURNING * INTO o;
    UPDATE public.order_reviews SET status='approved',completed_at=now(),evidence_expires_at=(SELECT expires_at FROM public.quotes WHERE id=new_quote),next_action='Cotización final lista para el Customer.',version=version+1 WHERE id=r.id;
    INSERT INTO public.order_state_history(order_id,from_state,to_state,actor_type,actor_id,reason_code,idempotency_key,request_id) VALUES(o.id,'quote_pending','quoted','mpho_admin',actor,'final_quote_created',p_idempotency_key,p_request_id);
  ELSIF p_command='invalidate_quote' THEN
    IF role<>'mpho_admin' OR o.current_state<>'quoted' OR nullif(btrim(p_payload->>'reason'),'') IS NULL THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_TRANSITION','message','A quoted order and reason are required.')); END IF;
    UPDATE public.quotes SET status='invalidated',invalidated_at=now(),invalidation_reason=btrim(p_payload->>'reason') WHERE id=o.quote_id;
    UPDATE public.quote_components SET status='invalidated',invalidated_at=now(),invalidation_reason='quote_invalidated' WHERE quote_id=o.quote_id;
    UPDATE public.orders SET current_state='quote_pending',delivery_amount_minor=NULL,service_amount_minor=NULL,total_known_amount_minor=subtotal_amount_minor,total_is_final=false,availability_status='requires_review',pending_components='["delivery","operational_availability"]'::jsonb,version=version+1 WHERE id=o.id RETURNING * INTO o;
    UPDATE public.order_reviews SET status='in_progress',completed_at=NULL,next_action='Revalidar disponibilidad, entrega y precio.',version=version+1 WHERE id=r.id;
    UPDATE public.order_availability_checks SET status='pending',source_type=NULL,source_reference=NULL,checked_by=NULL,checked_at=NULL,expires_at=NULL WHERE review_id=r.id;
    INSERT INTO public.order_state_history(order_id,from_state,to_state,actor_type,actor_id,reason_code,idempotency_key,request_id) VALUES(o.id,'quoted','quote_pending','mpho_admin',actor,'quote_invalidated',p_idempotency_key,p_request_id);
  ELSE
    RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_REQUEST','message','The command is not supported.'));
  END IF;
  IF p_command NOT IN ('request_changes','finalize_quote','invalidate_quote') THEN UPDATE public.orders SET version=version+1 WHERE id=o.id RETURNING * INTO o; END IF;
  result:=jsonb_build_object('ok',true,'review',public.phase7_staff_review_json(o.id,false));
  PERFORM public.phase7_audit(o.id,actor,role,'central_'||p_command,coalesce(public_code,p_payload->>'reasonCode'),p_request_id,p_idempotency_key,hash,p_expected_version,o.version,jsonb_build_object('command',p_command),result);
  RETURN result;
EXCEPTION WHEN unique_violation THEN
  replay:=public.phase7_replay(actor,'central_'||p_command,p_idempotency_key,hash);
  IF replay IS NOT NULL THEN RETURN replay; END IF;
  RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','CONFLICT','message','The command conflicts with a concurrent operation.'));
END;
$function$;

CREATE OR REPLACE FUNCTION public.reveal_central_order_pii(
  p_order_id uuid, p_reason text, p_idempotency_key text, p_request_id uuid
) RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE actor uuid; role public.user_role; hash text; replay jsonb; result jsonb;
BEGIN
  actor:=public.phase7_profile_id(); role:=public.phase7_staff_role();
  IF actor IS NULL OR role IS NULL OR nullif(btrim(p_reason),'') IS NULL THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','FORBIDDEN','message','Authorized role and reason are required.')); END IF;
  hash:=public.phase7_hash(jsonb_build_object('orderId',p_order_id,'reason',p_reason)); replay:=public.phase7_replay(actor,'reveal_pii',p_idempotency_key,hash);
  IF replay IS NOT NULL THEN RETURN replay; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.order_reviews r WHERE r.order_id=p_order_id) THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','ORDER_NOT_FOUND','message','The review was not found.')); END IF;
  result:=jsonb_build_object('ok',true,'review',public.phase7_staff_review_json(p_order_id,true));
  PERFORM public.phase7_audit(p_order_id,actor,role,'reveal_pii','operational_need',p_request_id,p_idempotency_key,hash,NULL,NULL,jsonb_build_object('reasonRecorded',true),jsonb_build_object('ok',true));
  RETURN result;
END;
$function$;

-- Enforce one internal fulfillment source during add/update without exposing it.
CREATE OR REPLACE FUNCTION public.phase7_cart_source_compatible(p_cart_id uuid, p_listing_id uuid, p_exclude_item_id uuid DEFAULT NULL)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT target.partner_id IS NOT NULL AND target.source_type='partner_local'
    AND NOT EXISTS (
      SELECT 1 FROM public.cart_items ci JOIN public.listings existing ON existing.id=ci.listing_id
      WHERE ci.cart_id=p_cart_id AND (p_exclude_item_id IS NULL OR ci.id<>p_exclude_item_id)
        AND (existing.source_type<>'partner_local' OR existing.partner_id IS DISTINCT FROM target.partner_id)
    )
  FROM public.listings target WHERE target.id=p_listing_id;
$function$;

-- Patch the existing cart function at its validation boundary through a trigger.
CREATE OR REPLACE FUNCTION public.enforce_cart_single_fulfillment_source()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
BEGIN
  IF NOT public.phase7_cart_source_compatible(NEW.cart_id,NEW.listing_id,CASE WHEN TG_OP='UPDATE' THEN OLD.id ELSE NULL END) THEN
    RAISE EXCEPTION USING ERRCODE='P0001', MESSAGE='INCOMPATIBLE_CART_ITEM';
  END IF;
  RETURN NEW;
END;
$function$;
CREATE TRIGGER cart_items_single_fulfillment_source
  BEFORE INSERT OR UPDATE OF listing_id ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cart_single_fulfillment_source();

-- Translate the trigger into the approved public error without exposing source identity.
CREATE OR REPLACE FUNCTION public.phase7_incompatible_cart_message()
RETURNS jsonb LANGUAGE sql IMMUTABLE SET search_path = '' AS $function$
  SELECT jsonb_build_object('ok',false,'error',jsonb_build_object('code','INCOMPATIBLE_CART_ITEM','message','Este producto necesita gestionarse por separado. Crea otro pedido para continuar.'));
$function$;

REVOKE ALL ON FUNCTION public.phase7_profile_id(), public.phase7_has_role(public.user_role), public.phase7_staff_role(),
  public.phase7_hash(jsonb), public.phase7_replay(uuid,text,text,text),
  public.phase7_audit(uuid,uuid,public.user_role,text,text,uuid,text,text,integer,integer,jsonb,jsonb),
  public.phase7_customer_order_json(uuid), public.phase7_staff_review_json(uuid,boolean),
  public.phase7_expire_order_quote(uuid),
  public.phase7_single_source(uuid), public.phase7_cart_source_compatible(uuid,uuid,uuid),
  public.enforce_cart_single_fulfillment_source(), public.phase7_incompatible_cart_message(),
  public.submit_customer_order_review(uuid,integer,text,uuid), public.list_central_order_reviews(),
  public.get_central_order_review(uuid), public.central_review_command(uuid,text,jsonb,integer,text,uuid),
  public.reveal_central_order_pii(uuid,text,text,uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.submit_customer_order_review(uuid,integer,text,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_central_order_reviews(), public.get_central_order_review(uuid),
  public.central_review_command(uuid,text,jsonb,integer,text,uuid), public.reveal_central_order_pii(uuid,text,text,uuid) TO authenticated;

COMMENT ON TABLE public.order_reviews IS 'One controlled pre-payment operational review per draft order; never an assignment or reservation.';
COMMENT ON TABLE public.order_availability_checks IS 'Expiring operational evidence; manual confirmation is not stock, assignment or reservation.';
COMMENT ON TABLE public.quote_components IS 'Approved delivery and explicit zero service components for final pre-payment quotes.';
COMMENT ON TABLE public.audit_logs IS 'Redacted privileged-action and idempotency record; metadata must contain no PII.';
