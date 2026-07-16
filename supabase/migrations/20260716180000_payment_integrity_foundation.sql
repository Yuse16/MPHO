-- Phase 8: payment integrity through provider-confirmed `paid` only.
-- Explicitly excludes assignment, reservation, fulfillment, refunds, ledger and payouts.

CREATE TYPE public.payment_attempt_status AS ENUM ('creating','checkout_ready','pending','approved','rejected','cancelled','expired','error','requires_review');
CREATE TYPE public.payment_event_processing_status AS ENUM ('received','processing','processed','retry_pending','rejected','requires_review');

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_current_state_check;
ALTER TABLE public.order_state_history DROP CONSTRAINT IF EXISTS order_state_history_transition_check;
ALTER TYPE public.order_state RENAME TO order_state_phase7;
CREATE TYPE public.order_state AS ENUM ('draft','quote_pending','quoted','pending_payment','paid');
ALTER TABLE public.orders ALTER COLUMN current_state DROP DEFAULT;
ALTER TABLE public.orders ALTER COLUMN current_state TYPE public.order_state USING current_state::text::public.order_state;
ALTER TABLE public.orders ALTER COLUMN current_state SET DEFAULT 'draft';
ALTER TABLE public.order_state_history ALTER COLUMN from_state TYPE public.order_state USING from_state::text::public.order_state;
ALTER TABLE public.order_state_history ALTER COLUMN to_state TYPE public.order_state USING to_state::text::public.order_state;
DROP TYPE public.order_state_phase7;
ALTER TABLE public.order_state_history ADD CONSTRAINT order_state_history_transition_check CHECK (
  (from_state IS NULL AND to_state='draft') OR
  (from_state='draft' AND to_state='quote_pending') OR
  (from_state='quote_pending' AND to_state IN ('draft','quoted')) OR
  (from_state='quoted' AND to_state IN ('quote_pending','pending_payment')) OR
  (from_state='pending_payment' AND to_state IN ('quoted','paid'))
);

CREATE TABLE public.payment_attempts (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE RESTRICT,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  provider text NOT NULL CHECK (provider='mercado_pago'),
  environment text NOT NULL CHECK (environment IN ('test','production')),
  status public.payment_attempt_status NOT NULL DEFAULT 'creating',
  provider_status text CHECK (provider_status IS NULL OR char_length(provider_status)<=80),
  provider_status_detail text CHECK (provider_status_detail IS NULL OR char_length(provider_status_detail)<=160),
  amount_minor bigint NOT NULL CHECK (amount_minor>0 AND amount_minor<=9007199254740991),
  currency text NOT NULL CHECK (currency='MXN'),
  external_reference text NOT NULL CHECK (char_length(external_reference) BETWEEN 32 AND 100),
  provider_preference_id text CHECK (provider_preference_id IS NULL OR char_length(provider_preference_id)<=200),
  provider_payment_id text CHECK (provider_payment_id IS NULL OR char_length(provider_payment_id)<=200),
  checkout_url text CHECK (checkout_url IS NULL OR char_length(checkout_url)<=2000),
  idempotency_key text NOT NULL CHECK (char_length(idempotency_key) BETWEEN 8 AND 200),
  request_hash text NOT NULL CHECK (char_length(request_hash)=64),
  expires_at timestamptz NOT NULL,
  initiated_at timestamptz NOT NULL DEFAULT now(),
  last_provider_check_at timestamptz,
  approved_at timestamptz,
  rejected_at timestamptz,
  cancelled_at timestamptz,
  expired_at timestamptz,
  review_reason text CHECK (review_reason IS NULL OR char_length(review_reason)<=160),
  version integer NOT NULL DEFAULT 1 CHECK (version>=1),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider,environment,external_reference),
  UNIQUE(customer_id,idempotency_key),
  CHECK (expires_at>initiated_at),
  CHECK (status<>'approved' OR approved_at IS NOT NULL)
);
CREATE UNIQUE INDEX payment_attempts_preference_idx ON public.payment_attempts(provider,environment,provider_preference_id) WHERE provider_preference_id IS NOT NULL;
CREATE UNIQUE INDEX payment_attempts_payment_idx ON public.payment_attempts(provider,environment,provider_payment_id) WHERE provider_payment_id IS NOT NULL;
CREATE UNIQUE INDEX payment_attempts_one_active_idx ON public.payment_attempts(order_id) WHERE status IN ('creating','checkout_ready','pending');
CREATE UNIQUE INDEX payment_attempts_one_approved_idx ON public.payment_attempts(order_id) WHERE status='approved';
CREATE INDEX payment_attempts_central_queue_idx ON public.payment_attempts(status,updated_at);
CREATE TRIGGER payment_attempts_set_updated_at BEFORE UPDATE ON public.payment_attempts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.orders ADD COLUMN active_payment_attempt_id uuid REFERENCES public.payment_attempts(id) ON DELETE RESTRICT;
ALTER TABLE public.orders ADD COLUMN paid_at timestamptz;
ALTER TABLE public.orders ADD CONSTRAINT orders_paid_integrity_check CHECK ((current_state='paid')=(paid_at IS NOT NULL AND active_payment_attempt_id IS NOT NULL));
ALTER TABLE public.orders ADD CONSTRAINT orders_id_customer_unique UNIQUE(id,customer_id);
ALTER TABLE public.payment_attempts ADD CONSTRAINT payment_attempt_order_consistency_fk FOREIGN KEY(order_id,customer_id) REFERENCES public.orders(id,customer_id) ON DELETE RESTRICT;

CREATE TABLE public.payment_provider_events (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  provider text NOT NULL CHECK (provider='mercado_pago'),
  environment text NOT NULL CHECK (environment IN ('test','production')),
  provider_event_id text NOT NULL CHECK (char_length(provider_event_id) BETWEEN 1 AND 200),
  event_type text CHECK (event_type IS NULL OR char_length(event_type)<=100),
  action text CHECK (action IS NULL OR char_length(action)<=100),
  provider_resource_id text CHECK (provider_resource_id IS NULL OR char_length(provider_resource_id)<=200),
  signature_valid boolean NOT NULL,
  live_mode boolean,
  request_id text NOT NULL CHECK (char_length(request_id) BETWEEN 1 AND 200),
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  processing_status public.payment_event_processing_status NOT NULL DEFAULT 'received',
  processing_attempts integer NOT NULL DEFAULT 0 CHECK (processing_attempts>=0),
  error_code text CHECK (error_code IS NULL OR char_length(error_code)<=100),
  payload_hash text NOT NULL CHECK (char_length(payload_hash)=64),
  sanitized_payload jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(sanitized_payload)='object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider,environment,provider_event_id)
);
CREATE INDEX payment_provider_events_queue_idx ON public.payment_provider_events(processing_status,received_at);
CREATE TRIGGER payment_provider_events_set_updated_at BEFORE UPDATE ON public.payment_provider_events FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_provider_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.payment_attempts,public.payment_provider_events FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.phase8_customer_from_auth_user(p_auth_user_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $function$
  SELECT c.id FROM public.customers c JOIN public.profiles p ON p.id=c.profile_id
  WHERE p.auth_user_id=p_auth_user_id AND p.status='active';
$function$;

CREATE OR REPLACE FUNCTION public.phase8_attempt_public_json(p_attempt_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $function$
  SELECT jsonb_build_object('id',a.id,'status',a.status,'amount',jsonb_build_object('amountMinor',a.amount_minor,'currency',a.currency),
    'checkoutUrl',CASE WHEN a.status IN ('checkout_ready','pending') AND a.expires_at>now() THEN a.checkout_url ELSE NULL END,
    'expiresAt',a.expires_at,'approvedAt',a.approved_at,'canRequery',a.last_provider_check_at IS NULL OR a.last_provider_check_at<=now()-interval '30 seconds')
  FROM public.payment_attempts a WHERE a.id=p_attempt_id;
$function$;

CREATE OR REPLACE FUNCTION public.phase8_customer_order_json(p_order_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $function$
  SELECT public.phase7_customer_order_json(o.id) || jsonb_build_object('payment',CASE WHEN o.active_payment_attempt_id IS NULL THEN NULL ELSE public.phase8_attempt_public_json(o.active_payment_attempt_id) END,'paidAt',o.paid_at,
    'canStartPayment',o.current_state='quoted' AND o.active_payment_attempt_id IS NULL AND q.status='valid' AND q.expires_at>=now()+interval '600 seconds')
  FROM public.orders o JOIN public.quotes q ON q.id=o.quote_id WHERE o.id=p_order_id;
$function$;

CREATE OR REPLACE FUNCTION public.get_customer_order(p_order_id uuid)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path='' AS $function$
DECLARE customer_uuid uuid;
BEGIN
  customer_uuid:=public.phase6_customer_id();
  IF NOT EXISTS(SELECT 1 FROM public.orders o WHERE o.id=p_order_id AND o.customer_id=customer_uuid) THEN RETURN NULL; END IF;
  PERFORM public.phase7_expire_order_quote(p_order_id);
  RETURN public.phase8_customer_order_json(p_order_id);
END;
$function$;

CREATE OR REPLACE FUNCTION public.begin_payment_checkout(p_auth_user_id uuid,p_order_id uuid,p_expected_version integer,p_idempotency_key text,p_request_id uuid,p_environment text,p_minimum_seconds integer)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path='' AS $function$
DECLARE customer_uuid uuid; actor uuid; o public.orders%ROWTYPE; q public.quotes%ROWTYPE; a public.payment_attempts%ROWTYPE; canonical jsonb; hash text;
BEGIN
  customer_uuid:=public.phase8_customer_from_auth_user(p_auth_user_id);
  actor:=(SELECT c.profile_id FROM public.customers c WHERE c.id=customer_uuid);
  IF customer_uuid IS NULL THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','UNAUTHORIZED','message','An active Customer session is required.')); END IF;
  IF p_expected_version IS NULL OR p_idempotency_key IS NULL OR char_length(p_idempotency_key) NOT BETWEEN 8 AND 200 OR p_request_id IS NULL OR p_environment NOT IN ('test','production') OR p_minimum_seconds<600 THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_REQUEST','message','A valid checkout envelope is required.')); END IF;
  canonical:=jsonb_build_object('orderId',p_order_id,'expectedVersion',p_expected_version); hash:=public.phase7_hash(canonical);
  SELECT * INTO a FROM public.payment_attempts WHERE customer_id=customer_uuid AND idempotency_key=p_idempotency_key;
  IF FOUND THEN
    IF a.request_hash<>hash THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','IDEMPOTENCY_CONFLICT','message','The idempotency key was already used for different data.')); END IF;
    RETURN jsonb_build_object('ok',true,'replayed',true,'attemptId',a.id,'orderId',a.order_id,'externalReference',a.external_reference,'amountMinor',a.amount_minor,'currency',a.currency,'expiresAt',a.expires_at,'state',a.status);
  END IF;
  SELECT * INTO o FROM public.orders WHERE id=p_order_id AND customer_id=customer_uuid FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','ORDER_NOT_FOUND','message','The order was not found.')); END IF;
  IF o.version<>p_expected_version THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','VERSION_CONFLICT','message','The order changed in another session.','currentVersion',o.version)); END IF;
  IF o.current_state='paid' THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','ALREADY_PAID','message','The order is already paid.')); END IF;
  IF o.current_state<>'quoted' THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','INVALID_TRANSITION','message','Only a final quoted order can be paid.')); END IF;
  IF EXISTS(SELECT 1 FROM public.payment_attempts x WHERE x.order_id=o.id AND x.status='requires_review') OR o.active_payment_attempt_id IS NOT NULL THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','PAYMENT_ATTEMPT_EXISTS','message','A payment attempt already requires attention.')); END IF;
  SELECT * INTO q FROM public.quotes WHERE id=o.quote_id FOR UPDATE;
  IF NOT FOUND OR q.customer_id<>customer_uuid OR q.status<>'valid' OR NOT q.total_is_final OR q.availability_status<>'eligible' OR q.currency<>'MXN' OR q.total_known_amount_minor<=0 OR q.delivery_amount_minor IS NULL OR q.service_amount_minor IS NULL OR q.expires_at<now()+make_interval(secs=>p_minimum_seconds) OR NOT o.total_is_final OR o.availability_status<>'eligible' OR o.currency<>'MXN' OR o.total_known_amount_minor<>q.total_known_amount_minor THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','QUOTE_NOT_PAYABLE','message','The final quote is not eligible or has insufficient validity.')); END IF;
  INSERT INTO public.payment_attempts(order_id,quote_id,customer_id,provider,environment,amount_minor,currency,external_reference,idempotency_key,request_hash,expires_at)
  VALUES(o.id,q.id,customer_uuid,'mercado_pago',p_environment,q.total_known_amount_minor,'MXN',encode(extensions.gen_random_bytes(32),'hex'),p_idempotency_key,hash,q.expires_at) RETURNING * INTO a;
  UPDATE public.orders SET active_payment_attempt_id=a.id WHERE id=o.id;
  RETURN jsonb_build_object('ok',true,'attemptId',a.id,'orderId',o.id,'externalReference',a.external_reference,'amountMinor',a.amount_minor,'currency',a.currency,'expiresAt',a.expires_at,'state',a.status);
END;
$function$;

CREATE OR REPLACE FUNCTION public.complete_payment_checkout(p_attempt_id uuid,p_preference_id text,p_checkout_url text,p_provider_expires_at timestamptz,p_request_id uuid)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path='' AS $function$
DECLARE a public.payment_attempts%ROWTYPE; o public.orders%ROWTYPE; q public.quotes%ROWTYPE; actor uuid; result jsonb;
BEGIN
  SELECT * INTO a FROM public.payment_attempts WHERE id=p_attempt_id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','ATTEMPT_NOT_FOUND','message','The payment attempt was not found.')); END IF;
  SELECT * INTO o FROM public.orders WHERE id=a.order_id FOR UPDATE; SELECT * INTO q FROM public.quotes WHERE id=a.quote_id FOR UPDATE;
  actor:=(SELECT c.profile_id FROM public.customers c WHERE c.id=a.customer_id);
  IF a.status IN ('checkout_ready','pending') THEN RETURN jsonb_build_object('ok',true,'replayed',true,'order',public.phase8_customer_order_json(o.id)); END IF;
  IF a.status<>'creating' OR o.current_state<>'quoted' OR o.active_payment_attempt_id<>a.id OR q.status<>'valid' OR q.expires_at<=now() OR p_provider_expires_at>q.expires_at OR p_checkout_url !~ '^https://(www\.|sandbox\.)?mercadopago\.com(\.mx)?/' THEN
    UPDATE public.payment_attempts SET status='requires_review',review_reason='checkout_completion_race',checkout_url=NULL,version=version+1 WHERE id=a.id;
    RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','PAYMENT_REQUIRES_REVIEW','message','The payment attempt requires verification.'));
  END IF;
  UPDATE public.payment_attempts SET provider_preference_id=p_preference_id,checkout_url=p_checkout_url,expires_at=p_provider_expires_at,status='checkout_ready',version=version+1 WHERE id=a.id;
  UPDATE public.orders SET current_state='pending_payment',version=version+1 WHERE id=o.id RETURNING * INTO o;
  INSERT INTO public.order_state_history(order_id,from_state,to_state,actor_type,actor_id,reason_code,idempotency_key,request_id) VALUES(o.id,'quoted','pending_payment','customer',actor,'checkout_created','payment-checkout:'||a.id::text,p_request_id);
  result:=jsonb_build_object('ok',true,'order',public.phase8_customer_order_json(o.id));
  PERFORM public.phase7_audit(o.id,actor,'customer','payment_session_created','checkout_created',p_request_id,'payment-checkout:'||a.id::text,a.request_hash,o.version-1,o.version,jsonb_build_object('attemptId',a.id),result);
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.fail_payment_checkout(p_attempt_id uuid,p_error_code text,p_requires_review boolean)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path='' AS $function$
DECLARE a public.payment_attempts%ROWTYPE; o public.orders%ROWTYPE;
BEGIN
  SELECT * INTO a FROM public.payment_attempts WHERE id=p_attempt_id FOR UPDATE; IF NOT FOUND THEN RETURN jsonb_build_object('ok',false); END IF;
  SELECT * INTO o FROM public.orders WHERE id=a.order_id FOR UPDATE;
  UPDATE public.payment_attempts SET status=CASE WHEN p_requires_review THEN 'requires_review'::public.payment_attempt_status ELSE 'error'::public.payment_attempt_status END,review_reason=left(p_error_code,160),checkout_url=NULL,version=version+1 WHERE id=a.id AND status='creating';
  IF NOT p_requires_review AND o.current_state='quoted' THEN UPDATE public.orders SET active_payment_attempt_id=NULL WHERE id=o.id; END IF;
  RETURN jsonb_build_object('ok',true);
END;
$function$;

CREATE OR REPLACE FUNCTION public.register_payment_provider_event(p_environment text,p_event_id text,p_event_type text,p_action text,p_resource_id text,p_signature_valid boolean,p_live_mode boolean,p_request_id text,p_payload_hash text,p_sanitized jsonb)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path='' AS $function$
DECLARE e public.payment_provider_events%ROWTYPE;
BEGIN
  INSERT INTO public.payment_provider_events(provider,environment,provider_event_id,event_type,action,provider_resource_id,signature_valid,live_mode,request_id,payload_hash,sanitized_payload,processing_status,error_code)
  VALUES('mercado_pago',p_environment,p_event_id,left(p_event_type,100),left(p_action,100),left(p_resource_id,200),p_signature_valid,p_live_mode,left(p_request_id,200),p_payload_hash,coalesce(p_sanitized,'{}'::jsonb),CASE WHEN p_signature_valid THEN 'received'::public.payment_event_processing_status ELSE 'rejected'::public.payment_event_processing_status END,CASE WHEN p_signature_valid THEN NULL ELSE 'INVALID_SIGNATURE' END)
  ON CONFLICT(provider,environment,provider_event_id) DO NOTHING;
  SELECT * INTO e FROM public.payment_provider_events WHERE provider='mercado_pago' AND environment=p_environment AND provider_event_id=p_event_id;
  RETURN jsonb_build_object('ok',true,'eventId',e.id,'duplicate',e.processing_status IN ('processed','processing','requires_review'),'processingStatus',e.processing_status);
END;
$function$;

CREATE OR REPLACE FUNCTION public.process_provider_payment(p_event_id uuid,p_payment jsonb,p_expected_environment text,p_expected_application_id text)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path='' AS $function$
DECLARE e public.payment_provider_events%ROWTYPE; a public.payment_attempts%ROWTYPE; o public.orders%ROWTYPE; actor uuid; normalized text; mismatch text; provider_id text; approved_time timestamptz; from_state public.order_state;
BEGIN
  SELECT * INTO e FROM public.payment_provider_events WHERE id=p_event_id FOR UPDATE;
  IF NOT FOUND OR NOT e.signature_valid THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','EVENT_REJECTED')); END IF;
  IF e.processing_status='processed' THEN RETURN jsonb_build_object('ok',true,'replayed',true); END IF;
  UPDATE public.payment_provider_events SET processing_status='processing',processing_attempts=processing_attempts+1 WHERE id=e.id;
  provider_id:=p_payment->>'id';
  SELECT * INTO a FROM public.payment_attempts WHERE provider='mercado_pago' AND environment=p_expected_environment AND external_reference=p_payment->>'externalReference' FOR UPDATE;
  IF NOT FOUND THEN UPDATE public.payment_provider_events SET processing_status='requires_review',processed_at=now(),error_code='UNKNOWN_PAYMENT' WHERE id=e.id; RETURN jsonb_build_object('ok',false,'requiresReview',true); END IF;
  SELECT * INTO o FROM public.orders WHERE id=a.order_id FOR UPDATE; actor:=(SELECT c.profile_id FROM public.customers c WHERE c.id=a.customer_id);
  normalized:=p_payment->>'normalizedStatus'; approved_time:=nullif(p_payment->>'approvedAt','')::timestamptz;
  mismatch:=CASE
    WHEN nullif(p_payment->>'id','') IS NULL THEN 'payment_id_missing'
    WHEN nullif(p_payment->>'amountMinor','') IS NULL OR (p_payment->>'amountMinor')::bigint IS DISTINCT FROM a.amount_minor THEN 'amount_mismatch'
    WHEN p_payment->>'currency' IS DISTINCT FROM 'MXN' THEN 'currency_mismatch'
    WHEN p_payment->>'externalReference' IS DISTINCT FROM a.external_reference THEN 'reference_mismatch'
    WHEN nullif(p_payment->>'preferenceId','') IS NOT NULL AND p_payment->>'preferenceId' IS DISTINCT FROM a.provider_preference_id THEN 'preference_mismatch'
    WHEN nullif(p_payment->>'liveMode','') IS NULL OR (p_payment->>'liveMode')::boolean IS DISTINCT FROM (a.environment='production') THEN 'environment_mismatch'
    WHEN nullif(p_payment->>'applicationId','') IS NOT NULL AND p_payment->>'applicationId'<>p_expected_application_id THEN 'application_mismatch'
    WHEN coalesce((p_payment->>'refunded')::boolean,false) THEN 'refunded_or_cancelled'
    WHEN normalized='approved' AND (nullif(p_payment->>'createdAt','') IS NULL OR (p_payment->>'createdAt')::timestamptz>a.expires_at OR approved_time IS NULL OR approved_time>a.expires_at) THEN 'late_approval'
    WHEN normalized='approved' AND EXISTS(SELECT 1 FROM public.payment_attempts x WHERE x.order_id=a.order_id AND x.status='approved' AND x.id<>a.id) THEN 'duplicate_approved_payment'
    WHEN normalized='approved' AND o.current_state NOT IN ('pending_payment','paid') THEN 'state_race'
    ELSE NULL END;
  IF mismatch IS NOT NULL THEN
    UPDATE public.payment_attempts SET status='requires_review',provider_payment_id=coalesce(provider_payment_id,provider_id),provider_status=p_payment->>'status',provider_status_detail=p_payment->>'statusDetail',review_reason=mismatch,last_provider_check_at=now(),version=version+1 WHERE id=a.id;
    UPDATE public.payment_provider_events SET processing_status='requires_review',processed_at=now(),error_code=upper(mismatch) WHERE id=e.id;
    RETURN jsonb_build_object('ok',true,'requiresReview',true);
  END IF;
  IF normalized='approved' THEN
    IF a.status='approved' AND o.current_state='paid' THEN UPDATE public.payment_provider_events SET processing_status='processed',processed_at=now() WHERE id=e.id; RETURN jsonb_build_object('ok',true,'replayed',true); END IF;
    from_state:=o.current_state;
    UPDATE public.payment_attempts SET status='approved',provider_payment_id=provider_id,provider_status=p_payment->>'status',provider_status_detail=p_payment->>'statusDetail',approved_at=approved_time,last_provider_check_at=now(),checkout_url=NULL,version=version+1 WHERE id=a.id;
    UPDATE public.orders SET current_state='paid',paid_at=approved_time,active_payment_attempt_id=a.id,version=version+1 WHERE id=o.id RETURNING * INTO o;
    INSERT INTO public.order_state_history(order_id,from_state,to_state,actor_type,actor_id,reason_code,idempotency_key,request_id) VALUES(o.id,from_state,'paid','service_account',actor,'provider_payment_approved','payment-approved:'||provider_id,extensions.uuid_generate_v4()) ON CONFLICT(actor_id,idempotency_key) DO NOTHING;
    PERFORM public.phase7_audit(o.id,actor,'service_account','payment_approved','provider_payment_approved',extensions.uuid_generate_v4(),'payment-approved:'||provider_id,public.phase7_hash(jsonb_build_object('paymentIdHash',encode(extensions.digest(provider_id,'sha256'),'hex'))),o.version-1,o.version,jsonb_build_object('attemptId',a.id),jsonb_build_object('ok',true));
  ELSIF normalized='pending' THEN
    UPDATE public.payment_attempts SET status='pending',provider_payment_id=coalesce(provider_payment_id,provider_id),provider_status=p_payment->>'status',provider_status_detail=p_payment->>'statusDetail',last_provider_check_at=now(),version=version+1 WHERE id=a.id;
  ELSE
    UPDATE public.payment_attempts SET status=normalized::public.payment_attempt_status,provider_payment_id=coalesce(provider_payment_id,provider_id),provider_status=p_payment->>'status',provider_status_detail=p_payment->>'statusDetail',last_provider_check_at=now(),checkout_url=NULL,rejected_at=CASE WHEN normalized='rejected' THEN now() ELSE rejected_at END,cancelled_at=CASE WHEN normalized='cancelled' THEN now() ELSE cancelled_at END,expired_at=CASE WHEN normalized='expired' THEN now() ELSE expired_at END,version=version+1 WHERE id=a.id;
    IF o.current_state='pending_payment' THEN
      UPDATE public.orders SET current_state='quoted',active_payment_attempt_id=NULL,version=version+1 WHERE id=o.id RETURNING * INTO o;
      INSERT INTO public.order_state_history(order_id,from_state,to_state,actor_type,actor_id,reason_code,idempotency_key,request_id) VALUES(o.id,'pending_payment','quoted','service_account',actor,'payment_not_completed','payment-terminal:'||a.id::text,extensions.uuid_generate_v4()) ON CONFLICT(actor_id,idempotency_key) DO NOTHING;
      IF a.expires_at<=now() THEN PERFORM public.phase7_expire_order_quote(o.id); END IF;
    END IF;
  END IF;
  UPDATE public.payment_provider_events SET processing_status='processed',processed_at=now(),error_code=NULL WHERE id=e.id;
  RETURN jsonb_build_object('ok',true,'status',normalized);
EXCEPTION WHEN OTHERS THEN
  UPDATE public.payment_provider_events SET processing_status='retry_pending',error_code='PROCESSING_ERROR' WHERE id=p_event_id;
  RETURN jsonb_build_object('ok',false,'retry',true);
END;
$function$;

CREATE OR REPLACE FUNCTION public.payment_requery_target(p_auth_user_id uuid,p_attempt_id uuid,p_force boolean DEFAULT false)
RETURNS jsonb LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path='' AS $function$
DECLARE a public.payment_attempts%ROWTYPE; customer_uuid uuid; staff boolean;
BEGIN
  customer_uuid:=public.phase8_customer_from_auth_user(p_auth_user_id);
  staff:=EXISTS(SELECT 1 FROM public.profiles p JOIN public.user_roles r ON r.profile_id=p.id WHERE p.auth_user_id=p_auth_user_id AND p.status='active' AND r.status='active' AND r.revoked_at IS NULL AND r.role IN ('mpho_operator','mpho_admin'));
  SELECT * INTO a FROM public.payment_attempts WHERE id=p_attempt_id FOR UPDATE;
  IF NOT FOUND OR (NOT staff AND a.customer_id<>customer_uuid) THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','FORBIDDEN')); END IF;
  IF a.last_provider_check_at > now() - (CASE WHEN staff AND p_force THEN interval '5 seconds' ELSE interval '30 seconds' END) THEN RETURN jsonb_build_object('ok',false,'error',jsonb_build_object('code','COOLDOWN')); END IF;
  UPDATE public.payment_attempts SET last_provider_check_at=now() WHERE id=a.id;
  RETURN jsonb_build_object('ok',true,'attemptId',a.id,'providerPaymentId',a.provider_payment_id,'externalReference',a.external_reference,'environment',a.environment);
END;
$function$;

CREATE OR REPLACE FUNCTION public.list_central_payments()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $function$
  SELECT CASE WHEN public.phase7_staff_role() IS NULL THEN jsonb_build_object('ok',false,'error',jsonb_build_object('code','FORBIDDEN')) ELSE jsonb_build_object('ok',true,'payments',coalesce((SELECT jsonb_agg(jsonb_build_object('id',a.id,'reference',o.public_reference,'orderState',o.current_state,'status',a.status,'amountMinor',a.amount_minor,'currency',a.currency,'environment',a.environment,'createdAt',a.created_at,'updatedAt',a.updated_at,'alert',a.review_reason,'webhookPending',EXISTS(SELECT 1 FROM public.payment_provider_events e WHERE e.provider_resource_id=a.provider_payment_id AND e.processing_status IN ('received','processing','retry_pending'))) ORDER BY a.updated_at DESC) FROM public.payment_attempts a JOIN public.orders o ON o.id=a.order_id),'[]'::jsonb)) END;
$function$;

CREATE OR REPLACE FUNCTION public.get_central_payment(p_attempt_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $function$
  SELECT CASE WHEN public.phase7_staff_role() IS NULL THEN jsonb_build_object('ok',false,'error',jsonb_build_object('code','FORBIDDEN')) ELSE jsonb_build_object('ok',true,'payment',jsonb_build_object('id',a.id,'reference',o.public_reference,'orderState',o.current_state,'status',a.status,'providerStatus',a.provider_status,'amountMinor',a.amount_minor,'currency',a.currency,'environment',a.environment,'createdAt',a.created_at,'updatedAt',a.updated_at,'expiresAt',a.expires_at,'approvedAt',a.approved_at,'reviewReason',a.review_reason,'version',a.version,'events',coalesce((SELECT jsonb_agg(jsonb_build_object('type',e.event_type,'action',e.action,'status',e.processing_status,'receivedAt',e.received_at,'processedAt',e.processed_at,'errorCode',e.error_code,'payload',e.sanitized_payload) ORDER BY e.received_at DESC) FROM public.payment_provider_events e WHERE e.provider_resource_id=a.provider_payment_id),'[]'::jsonb),'history',coalesce((SELECT jsonb_agg(jsonb_build_object('from',h.from_state,'to',h.to_state,'reason',h.reason_code,'createdAt',h.created_at) ORDER BY h.created_at) FROM public.order_state_history h WHERE h.order_id=o.id),'[]'::jsonb))) END FROM public.payment_attempts a JOIN public.orders o ON o.id=a.order_id WHERE a.id=p_attempt_id;
$function$;

REVOKE ALL ON FUNCTION public.phase8_customer_from_auth_user(uuid),public.phase8_attempt_public_json(uuid),public.phase8_customer_order_json(uuid),public.begin_payment_checkout(uuid,uuid,integer,text,uuid,text,integer),public.complete_payment_checkout(uuid,text,text,timestamptz,uuid),public.fail_payment_checkout(uuid,text,boolean),public.register_payment_provider_event(text,text,text,text,text,boolean,boolean,text,text,jsonb),public.process_provider_payment(uuid,jsonb,text,text),public.payment_requery_target(uuid,uuid,boolean),public.list_central_payments(),public.get_central_payment(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.begin_payment_checkout(uuid,uuid,integer,text,uuid,text,integer),public.complete_payment_checkout(uuid,text,text,timestamptz,uuid),public.fail_payment_checkout(uuid,text,boolean),public.register_payment_provider_event(text,text,text,text,text,boolean,boolean,text,text,jsonb),public.process_provider_payment(uuid,jsonb,text,text),public.payment_requery_target(uuid,uuid,boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.list_central_payments(),public.get_central_payment(uuid) TO authenticated;

COMMENT ON TABLE public.payment_attempts IS 'Private, auditable provider checkout attempts. Retained throughout the pilot; no direct browser access.';
COMMENT ON TABLE public.payment_provider_events IS 'Sanitized webhook inbox. Initial documented retention is 90 days; automated deletion is intentionally deferred.';
