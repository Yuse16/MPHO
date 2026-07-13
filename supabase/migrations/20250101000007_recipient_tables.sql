-- =============================================================================
-- Migration 007: Recipient table
-- =============================================================================
-- Saved recipients for customer gift deliveries.
-- =============================================================================

create table public.recipients (
  id              uuid primary key default extensions.uuid_generate_v4(),
  customer_id     uuid not null references public.customers(id) on delete cascade,
  name            text not null,
  relationship    text,
  phone           text,
  surprise_mode   recipient_surprise_mode not null default 'none',
  notes           text,
  consent_basis   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  archived_at     timestamptz
);

comment on table  public.recipients is 'Saved gift recipients belonging to a customer.';
comment on column public.recipients.surprise_mode is 'How much recipient info is hidden from the recipient.';
comment on column public.recipients.consent_basis is 'Justification for storing and using recipient data.';

create trigger recipients_set_updated_at
  before update on public.recipients
  for each row execute function public.handle_updated_at();

create index idx_recipients_customer_id on public.recipients (customer_id);
