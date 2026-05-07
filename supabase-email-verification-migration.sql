create table if not exists verification_codes (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  channel text not null,
  destination text not null,
  code text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists verification_codes_lookup_idx on verification_codes(customer_id, channel, destination);
