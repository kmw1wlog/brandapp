create extension if not exists pgcrypto;

create table if not exists public.branch_dataset_registry (
  dataset_id text primary key,
  dataset_name text not null,
  domain text not null,
  source_path text not null,
  description text not null default '',
  json_version text not null default 'v1',
  tags text[] not null default '{}',
  row_count integer not null default 0,
  byte_size integer not null default 0,
  checksum text not null default '',
  latest_source_timestamp timestamptz,
  synced_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.branch_dataset_snapshots (
  id uuid primary key default gen_random_uuid(),
  dataset_id text not null references public.branch_dataset_registry(dataset_id) on delete cascade,
  version_tag text not null,
  payload jsonb not null,
  row_count integer not null default 0,
  byte_size integer not null default 0,
  checksum text not null,
  source_timestamp timestamptz,
  synced_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique (dataset_id, version_tag)
);

create table if not exists public.branch_sync_runs (
  id uuid primary key default gen_random_uuid(),
  run_type text not null,
  status text not null,
  summary jsonb not null default '{}'::jsonb,
  error_message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  category text,
  region text,
  budget bigint,
  notes text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.groupbuy_interests (
  id uuid primary key default gen_random_uuid(),
  product_name text,
  supplier_name text,
  quantity text,
  contact text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.branch_feedback_entries (
  id uuid primary key default gen_random_uuid(),
  stage text,
  blocker text,
  feature text,
  consultation boolean not null default false,
  contact text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.branch_user_inputs (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  category text,
  region text,
  budget bigint,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id)
);

create table if not exists public.branch_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  session_key text not null unique,
  pathname text,
  context_summary text,
  startup_input jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.branch_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_key text not null references public.branch_chat_sessions(session_key) on delete cascade,
  role text not null,
  content text not null,
  model text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists branch_dataset_snapshots_dataset_id_idx on public.branch_dataset_snapshots (dataset_id, synced_at desc);
create index if not exists branch_chat_messages_session_key_idx on public.branch_chat_messages (session_key, created_at);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists groupbuy_interests_created_at_idx on public.groupbuy_interests (created_at desc);

create or replace function public.branch_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists branch_dataset_registry_touch_updated_at on public.branch_dataset_registry;
create trigger branch_dataset_registry_touch_updated_at
before update on public.branch_dataset_registry
for each row execute function public.branch_touch_updated_at();

drop trigger if exists branch_user_inputs_touch_updated_at on public.branch_user_inputs;
create trigger branch_user_inputs_touch_updated_at
before update on public.branch_user_inputs
for each row execute function public.branch_touch_updated_at();

drop trigger if exists branch_chat_sessions_touch_updated_at on public.branch_chat_sessions;
create trigger branch_chat_sessions_touch_updated_at
before update on public.branch_chat_sessions
for each row execute function public.branch_touch_updated_at();

create or replace view public.branch_latest_dataset_snapshots as
select distinct on (dataset_id)
  dataset_id,
  version_tag,
  payload,
  row_count,
  byte_size,
  checksum,
  source_timestamp,
  synced_at,
  metadata
from public.branch_dataset_snapshots
order by dataset_id, synced_at desc;
