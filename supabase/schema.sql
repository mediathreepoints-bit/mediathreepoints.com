-- Threepoints Media virtual-tour schema for Supabase.
-- Run in the Supabase SQL Editor. Do not expose the service_role key in the website.

create extension if not exists pgcrypto;

create table if not exists public.tour_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_tour_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select exists (
    select 1 from public.tour_admins where user_id = auth.uid()
  );
$$;
revoke all on function public.is_tour_admin() from public;
grant execute on function public.is_tour_admin() to anon, authenticated;

create table if not exists public.tours (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title_fr text not null,
  title_ar text not null default '',
  category_fr text not null default '',
  category_ar text not null default '',
  description_fr text not null default '',
  description_ar text not null default '',
  cover_path text,
  plan_path text,
  google_maps_url text,
  google_maps_lat numeric(9,6),
  google_maps_lng numeric(9,6),
  street_view_pano_id text,
  street_view_status text not null default 'not-checked' check (street_view_status in ('not-checked', 'available', 'unavailable')),
  street_view_verified_at timestamptz,
  gallery_paths text[] not null default '{}',
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tours
  add column if not exists google_maps_url text,
  add column if not exists google_maps_lat numeric(9,6),
  add column if not exists google_maps_lng numeric(9,6),
  add column if not exists street_view_pano_id text,
  add column if not exists street_view_status text not null default 'not-checked',
  add column if not exists street_view_verified_at timestamptz;

alter table public.tours
  drop constraint if exists tours_google_maps_coordinates_check,
  drop constraint if exists tours_street_view_status_check;
alter table public.tours
  add constraint tours_google_maps_coordinates_check check (
    (google_maps_lat is null and google_maps_lng is null)
    or (
      google_maps_lat is not null and google_maps_lng is not null
      and google_maps_lat between -90 and 90
      and google_maps_lng between -180 and 180
    )
  ),
  add constraint tours_street_view_status_check check (
    street_view_status = 'not-checked'
    or (
      street_view_status = 'available'
      and nullif(btrim(street_view_pano_id), '') is not null
      and street_view_verified_at is not null
      and google_maps_lat is not null and google_maps_lng is not null
    )
    or (
      street_view_status = 'unavailable'
      and street_view_verified_at is not null
      and google_maps_lat is not null and google_maps_lng is not null
      and street_view_pano_id is null
    )
  );

create table if not exists public.tour_scenes (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  name_fr text not null,
  name_ar text not null default '',
  panorama_path text not null,
  panorama_confirmed boolean not null default false,
  thumbnail_path text,
  sort_order integer not null default 0,
  plan_x numeric(5,2) check (plan_x is null or plan_x between 0 and 100),
  plan_y numeric(5,2) check (plan_y is null or plan_y between 0 and 100),
  created_at timestamptz not null default now()
);
alter table public.tour_scenes
  add column if not exists panorama_confirmed boolean not null default false;
create index if not exists tour_scenes_tour_order_idx
  on public.tour_scenes(tour_id, sort_order);

create or replace function public.is_valid_google_maps_url(map_url text)
returns boolean
language sql
immutable
set search_path = pg_catalog, pg_temp
as $$
  select coalesce(
    map_url ~* '^https://(www\.google\.com|maps\.google\.com)/maps/'
    or map_url ~* '^https://maps\.app\.goo\.gl/[^/?#]+',
    false
  );
$$;

create or replace function public.validate_tour_publication()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.is_published
    and not public.is_valid_google_maps_url(new.google_maps_url)
    and not (
      new.street_view_status = 'available'
      and nullif(btrim(new.street_view_pano_id), '') is not null
      and new.street_view_verified_at is not null
    )
    and not exists (
      select 1 from public.tour_scenes s
      where s.tour_id = new.id
        and s.panorama_path is not null
        and s.panorama_confirmed
    ) then
    raise exception 'A published project needs a confirmed 2:1 panorama, a verified Street View panorama, or a valid official Google Maps URL.'
      using errcode = '23514';
  end if;
  if new.is_published and exists (
    select 1 from public.tour_scenes s
    where s.tour_id = new.id
      and (s.panorama_path is null or not s.panorama_confirmed)
  ) then
    raise exception 'Every scene in a published tour must have an admin-confirmed panorama.'
      using errcode = '23514';
  end if;
  return new;
end;
$$;
drop trigger if exists tours_validate_publication on public.tours;
create trigger tours_validate_publication
  before insert or update on public.tours
  for each row execute function public.validate_tour_publication();

create or replace function public.protect_published_scene_source()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if exists (
    select 1 from public.tours t
    where t.id = old.tour_id and t.is_published
  ) then
    if tg_op = 'DELETE' then
      raise exception 'Unpublish the tour before deleting its panorama scene.'
        using errcode = '23514';
    end if;
    if new.tour_id <> old.tour_id or new.panorama_path is null or not new.panorama_confirmed then
      raise exception 'Unpublish the tour before changing its panorama source.'
        using errcode = '23514';
    end if;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
drop trigger if exists scenes_protect_published_source on public.tour_scenes;
create trigger scenes_protect_published_source
  before update or delete on public.tour_scenes
  for each row execute function public.protect_published_scene_source();

create table if not exists public.tour_hotspots (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references public.tour_scenes(id) on delete cascade,
  kind text not null default 'info' check (kind in ('info', 'scene')),
  pitch numeric(6,2) not null check (pitch between -90 and 90),
  yaw numeric(6,2) not null check (yaw between -180 and 180),
  title_fr text not null,
  title_ar text not null default '',
  text_fr text not null default '',
  text_ar text not null default '',
  target_scene_id uuid references public.tour_scenes(id) on delete set null,
  image_path text,
  video_path text,
  link_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint scene_hotspot_requires_target check (kind <> 'scene' or target_scene_id is not null)
);
create index if not exists tour_hotspots_scene_order_idx
  on public.tour_hotspots(scene_id, sort_order);

create or replace function public.touch_tour_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists tours_touch_updated_at on public.tours;
create trigger tours_touch_updated_at before update on public.tours
for each row execute function public.touch_tour_updated_at();

alter table public.tour_admins enable row level security;
alter table public.tours enable row level security;
alter table public.tour_scenes enable row level security;
alter table public.tour_hotspots enable row level security;

drop policy if exists "tour admins manage own membership" on public.tour_admins;
create policy "tour admins manage own membership" on public.tour_admins
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "public read published tours" on public.tours;
create policy "public read published tours" on public.tours
  for select to anon, authenticated using (is_published or public.is_tour_admin());
drop policy if exists "admins insert tours" on public.tours;
create policy "admins insert tours" on public.tours
  for insert to authenticated with check (public.is_tour_admin());
drop policy if exists "admins update tours" on public.tours;
create policy "admins update tours" on public.tours
  for update to authenticated using (public.is_tour_admin()) with check (public.is_tour_admin());
drop policy if exists "admins delete tours" on public.tours;
create policy "admins delete tours" on public.tours
  for delete to authenticated using (public.is_tour_admin());

drop policy if exists "public read published tour scenes" on public.tour_scenes;
create policy "public read published tour scenes" on public.tour_scenes
  for select to anon, authenticated using (
    exists (select 1 from public.tours t where t.id = tour_id and (t.is_published or public.is_tour_admin()))
  );
drop policy if exists "admins manage tour scenes" on public.tour_scenes;
create policy "admins manage tour scenes" on public.tour_scenes
  for all to authenticated using (public.is_tour_admin()) with check (public.is_tour_admin());

drop policy if exists "public read published tour hotspots" on public.tour_hotspots;
create policy "public read published tour hotspots" on public.tour_hotspots
  for select to anon, authenticated using (
    exists (
      select 1 from public.tour_scenes s join public.tours t on t.id = s.tour_id
      where s.id = scene_id and (t.is_published or public.is_tour_admin())
    )
  );
drop policy if exists "admins manage tour hotspots" on public.tour_hotspots;
create policy "admins manage tour hotspots" on public.tour_hotspots
  for all to authenticated using (public.is_tour_admin()) with check (public.is_tour_admin());

grant select on public.tours, public.tour_scenes, public.tour_hotspots to anon, authenticated;
grant insert, update, delete on public.tours, public.tour_scenes, public.tour_hotspots to authenticated;
grant select on public.tour_admins to authenticated;

-- Store only tour media in this private bucket. Public pages receive short-lived
-- signed URLs for assets belonging to published tours; unpublished media stays private.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tour-assets', 'tour-assets', false, 104857600,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.is_published_tour_asset(object_path text)
returns boolean
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select exists (
    select 1 from public.tours t
    where t.is_published and (
      t.cover_path = object_path or t.plan_path = object_path
      or object_path = any(t.gallery_paths)
      or exists (
        select 1 from public.tour_scenes s
        where s.tour_id = t.id and (s.panorama_path = object_path or s.thumbnail_path = object_path)
      )
      or exists (
        select 1 from public.tour_hotspots h
        join public.tour_scenes s on s.id = h.scene_id
        where s.tour_id = t.id and (h.image_path = object_path or h.video_path = object_path)
      )
    )
  );
$$;
revoke all on function public.is_published_tour_asset(text) from public;
grant execute on function public.is_published_tour_asset(text) to anon, authenticated;

drop policy if exists "public read published tour media" on storage.objects;
create policy "public read published tour media" on storage.objects
  for select to anon, authenticated using (
    bucket_id = 'tour-assets' and public.is_published_tour_asset(name)
  );
drop policy if exists "tour admins upload media" on storage.objects;
create policy "tour admins upload media" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'tour-assets' and public.is_tour_admin()
  );
drop policy if exists "tour admins update media" on storage.objects;
create policy "tour admins update media" on storage.objects
  for update to authenticated using (
    bucket_id = 'tour-assets' and public.is_tour_admin()
  ) with check (bucket_id = 'tour-assets' and public.is_tour_admin());
drop policy if exists "tour admins delete media" on storage.objects;
create policy "tour admins delete media" on storage.objects
  for delete to authenticated using (
    bucket_id = 'tour-assets' and public.is_tour_admin()
  );

-- Hide the former sample tours from public pages without deleting admin data.
update public.tours
set is_published = false
where slug in ('villa-de-luxe', 'hotel-resort', 'restaurant-panoramique', 'musee-patrimoine')
  and is_published;

-- Kénitra destination templates with map coordinates; panorama coverage starts unverified.
insert into public.tours (
  slug, title_fr, title_ar, category_fr, category_ar,
  description_fr, description_ar, sort_order, google_maps_url,
  google_maps_lat, google_maps_lng
)
values
  ('kasbah-de-mehdia', 'Kasbah de Mehdia', 'قصبة المهدية', 'Patrimoine & histoire', 'التراث والتاريخ', 'Fiche de découverte de la Kasbah de Mehdia à Kénitra. Street View reste à vérifier.', 'بطاقة لاكتشاف قصبة المهدية بالقنيطرة. يجب التحقق من توفر Street View.', 1, 'https://www.google.com/maps/search/?api=1&query=34.264170%2C-6.657500', 34.264170, -6.657500),
  ('plage-de-mehdia', 'Plage de Mehdia', 'شاطئ المهدية', 'Littoral & loisirs', 'الساحل والأنشطة', 'Fiche de découverte de la plage de Mehdia près de Kénitra. Street View reste à vérifier.', 'بطاقة لاكتشاف شاطئ المهدية قرب القنيطرة. يجب التحقق من توفر Street View.', 2, 'https://www.google.com/maps/search/?api=1&query=34.254710%2C-6.680060', 34.254710, -6.680060),
  ('lac-sidi-boughaba', 'Lac Sidi Boughaba', 'بحيرة سيدي بوغابة', 'Nature & biodiversité', 'الطبيعة والتنوع البيولوجي', 'Fiche de découverte du lac Sidi Boughaba. Street View reste à vérifier.', 'بطاقة لاكتشاف بحيرة سيدي بوغابة. يجب التحقق من توفر Street View.', 3, 'https://www.google.com/maps/search/?api=1&query=34.240900%2C-6.673900', 34.240900, -6.673900),
  ('corniche-du-sebou', 'Corniche du Sebou', 'كورنيش سبو', 'Promenade urbaine', 'نزهة حضرية', 'Fiche de découverte des berges du Sebou à Kénitra. Street View reste à vérifier.', 'بطاقة لاكتشاف ضفاف سبو بالقنيطرة. يجب التحقق من توفر Street View.', 4, 'https://www.google.com/maps/search/?api=1&query=34.267605%2C-6.590722', 34.267605, -6.590722)
on conflict (slug) do update set
  google_maps_url = coalesce(public.tours.google_maps_url, excluded.google_maps_url),
  google_maps_lat = coalesce(public.tours.google_maps_lat, excluded.google_maps_lat),
  google_maps_lng = coalesce(public.tours.google_maps_lng, excluded.google_maps_lng);

drop policy if exists "tour admins read all media" on storage.objects;
create policy "tour admins read all media" on storage.objects
  for select to authenticated using (
    bucket_id = 'tour-assets' and public.is_tour_admin()
  );
