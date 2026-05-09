create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  description text,
  image text,
  cta_label text default 'Voir l''offre',
  cta_href text default '/promotions',
  placement text not null default 'popup',
  category_slug text,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  priority integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists promotions_active_idx on promotions(is_active);
create index if not exists promotions_placement_idx on promotions(placement);
create index if not exists promotions_dates_idx on promotions(starts_at, ends_at);
create index if not exists promotions_priority_idx on promotions(priority desc);
