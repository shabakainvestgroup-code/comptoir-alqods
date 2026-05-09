alter table promotions add column if not exists discount_percent numeric default 0;
alter table promotions add column if not exists promo_price numeric;

create table if not exists promotion_products (
  id uuid primary key default gen_random_uuid(),
  promotion_id uuid not null references promotions(id) on delete cascade,
  product_id text not null,
  created_at timestamptz not null default now(),
  unique (promotion_id, product_id)
);

create index if not exists promotion_products_promotion_idx on promotion_products(promotion_id);
create index if not exists promotion_products_product_idx on promotion_products(product_id);
