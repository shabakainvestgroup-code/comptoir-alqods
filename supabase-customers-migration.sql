create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  cni text,
  address text,
  city text,
  district text,
  customer_type text,
  phone_verified boolean not null default false,
  email_verified boolean not null default false,
  last_order_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists customers_phone_unique_idx on customers(phone);
create index if not exists customers_cni_idx on customers(cni);
create index if not exists customers_email_idx on customers(email);
