create table if not exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  category text not null,
  subcategory text not null,
  brand text,
  reference text,
  description text not null,
  features jsonb default '[]'::jsonb,
  price numeric not null,
  price_label text not null,
  old_price numeric,
  image text not null,
  gallery jsonb default '[]'::jsonb,
  badge text,
  stock integer not null default 0,
  is_available boolean not null default true,
  delivery_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key,
  order_number text unique not null,
  customer jsonb not null,
  items jsonb not null,
  subtotal numeric not null,
  delivery_fee numeric not null,
  total numeric not null,
  payment_method text not null,
  payment_status text not null,
  order_status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create index if not exists orders_order_status_idx on orders(order_status);
create index if not exists orders_created_at_idx on orders(created_at desc);
create index if not exists products_category_idx on products(category);
create index if not exists products_stock_idx on products(stock);
create unique index if not exists customers_phone_unique_idx on customers(phone);
create index if not exists customers_cni_idx on customers(cni);
create index if not exists customers_email_idx on customers(email);
