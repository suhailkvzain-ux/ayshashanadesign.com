-- AYSHA SHANA DESIGN — production CMS migration
-- Run this in the existing Supabase project's SQL Editor.
-- Never put a service-role key in the website.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  location text,
  year integer,
  description text,
  cover_image text,
  published boolean not null default false,
  status text not null default 'draft',
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects add column if not exists location text;
alter table public.projects add column if not exists year integer;
alter table public.projects add column if not exists description text;
alter table public.projects add column if not exists cover_image text;
alter table public.projects add column if not exists published boolean not null default false;
alter table public.projects add column if not exists status text not null default 'draft';
alter table public.projects add column if not exists featured boolean not null default false;
alter table public.projects add column if not exists sort_order integer not null default 0;
alter table public.projects add column if not exists created_at timestamptz not null default now();
alter table public.projects add column if not exists updated_at timestamptz not null default now();

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  category text not null check (category in ('plans','renders','finished_site')),
  image_type text,
  image_url text,
  storage_path text,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.project_images add column if not exists category text;
alter table public.project_images add column if not exists image_type text;
alter table public.project_images add column if not exists image_url text;
alter table public.project_images add column if not exists storage_path text;
alter table public.project_images add column if not exists alt_text text;
alter table public.project_images add column if not exists sort_order integer not null default 0;
alter table public.project_images add column if not exists created_at timestamptz not null default now();
-- If the previous schema used image_type, copy its values once into category.
update public.project_images set category = case image_type when 'plan' then 'plans' when 'render' then 'renders' when 'finished' then 'finished_site' else image_type end where category is null and image_type is not null;
update public.project_images set storage_path = image_url where storage_path is null and image_url is not null;

create table if not exists public.renders (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  storage_path text,
  project_id uuid references public.projects(id) on delete set null,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.renders add column if not exists title text;
alter table public.renders add column if not exists image_url text;
alter table public.renders add column if not exists storage_path text;
alter table public.renders add column if not exists project_id uuid references public.projects(id) on delete set null;
alter table public.renders add column if not exists published boolean not null default false;
alter table public.renders add column if not exists sort_order integer not null default 0;
alter table public.renders add column if not exists created_at timestamptz not null default now();
alter table public.renders add column if not exists updated_at timestamptz not null default now();
update public.renders set image_url = storage_path where image_url is null and storage_path is not null;

create table if not exists public.drawings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  storage_path text,
  project_id uuid references public.projects(id) on delete set null,
  drawing_type text not null default 'Other',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.drawings add column if not exists title text;
alter table public.drawings add column if not exists image_url text;
alter table public.drawings add column if not exists storage_path text;
alter table public.drawings add column if not exists project_id uuid references public.projects(id) on delete set null;
alter table public.drawings add column if not exists drawing_type text not null default 'Other';
alter table public.drawings add column if not exists published boolean not null default false;
alter table public.drawings add column if not exists sort_order integer not null default 0;
alter table public.drawings add column if not exists created_at timestamptz not null default now();
alter table public.drawings add column if not exists updated_at timestamptz not null default now();
update public.drawings set image_url = storage_path where image_url is null and storage_path is not null;

create table if not exists public.homepage (
  id uuid primary key default gen_random_uuid(),
  brand_name text not null default 'AYSHA SHANA DESIGN',
  subtitle text not null default 'Freelance Interior Designer in Dubai',
  description text,
  hero_image text,
  primary_button_text text default 'VIEW PROJECTS',
  primary_button_url text default '/projects',
  secondary_button_text text default 'WHATSAPP ME',
  secondary_button_url text,
  about_text text,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  website_name text not null default 'AYSHA SHANA DESIGN',
  website_description text not null default 'Freelance Interior Designer in Dubai',
  seo_title text not null default 'Aysha Shana Design | Freelance Interior Designer in Dubai',
  seo_description text,
  whatsapp text,
  email text,
  instagram text,
  whatsapp_message text default 'Hi Aysha, I found your website and would like to discuss an interior design project.',
  updated_at timestamptz not null default now()
);


-- Seed exactly one editable homepage/settings row so the public site has CMS-backed defaults immediately.
insert into public.homepage (brand_name, subtitle, description, primary_button_text, primary_button_url, secondary_button_text)
select 'AYSHA SHANA DESIGN', 'Freelance Interior Designer in Dubai', 'Thoughtful interiors designed around the way you live, work and use your space.', 'VIEW PROJECTS', '/projects', 'WHATSAPP ME'
where not exists (select 1 from public.homepage);

insert into public.site_settings (website_name, website_description, seo_title, seo_description, whatsapp_message)
select 'AYSHA SHANA DESIGN', 'Freelance Interior Designer in Dubai', 'Aysha Shana Design | Freelance Interior Designer in Dubai', 'Freelance interior design, 3D visualization and technical design in Dubai.', 'Hi Aysha, I found your website and would like to discuss an interior design project.'
where not exists (select 1 from public.site_settings);

create index if not exists projects_public_listing_idx on public.projects (published, featured, sort_order, created_at desc);
create index if not exists project_images_project_category_order_idx on public.project_images (project_id, category, sort_order, created_at);
create index if not exists renders_public_listing_idx on public.renders (published, sort_order, created_at desc);
create index if not exists drawings_public_listing_idx on public.drawings (published, sort_order, created_at desc);

insert into storage.buckets (id,name,public) values
('projects','projects',true),('renders','renders',true),('drawings','drawings',true),('homepage','homepage',true)
on conflict (id) do update set public=true;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$ select exists (select 1 from public.admin_users where user_id = auth.uid()); $$;

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.renders enable row level security;
alter table public.drawings enable row level security;
alter table public.homepage enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists admin_users_self on public.admin_users;
create policy admin_users_self on public.admin_users for select to authenticated using (user_id = auth.uid());

drop policy if exists projects_public_read on public.projects;
create policy projects_public_read on public.projects for select to anon,authenticated using (published = true);
drop policy if exists projects_admin_all on public.projects;
create policy projects_admin_all on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists project_images_public_read on public.project_images;
create policy project_images_public_read on public.project_images for select to anon,authenticated using (exists(select 1 from public.projects p where p.id=project_id and p.published=true));
drop policy if exists project_images_admin_all on public.project_images;
create policy project_images_admin_all on public.project_images for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists renders_public_read on public.renders;
create policy renders_public_read on public.renders for select to anon,authenticated using (published=true);
drop policy if exists renders_admin_all on public.renders;
create policy renders_admin_all on public.renders for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists drawings_public_read on public.drawings;
create policy drawings_public_read on public.drawings for select to anon,authenticated using (published=true);
drop policy if exists drawings_admin_all on public.drawings;
create policy drawings_admin_all on public.drawings for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists homepage_public_read on public.homepage;
create policy homepage_public_read on public.homepage for select to anon,authenticated using (true);
drop policy if exists homepage_admin_all on public.homepage;
create policy homepage_admin_all on public.homepage for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read on public.site_settings for select to anon,authenticated using (true);
drop policy if exists site_settings_admin_all on public.site_settings;
create policy site_settings_admin_all on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage: public can read portfolio images; only admins can write/delete.
drop policy if exists portfolio_public_read on storage.objects;
create policy portfolio_public_read on storage.objects for select to anon,authenticated using (bucket_id in ('projects','renders','drawings','homepage'));
drop policy if exists portfolio_admin_insert on storage.objects;
create policy portfolio_admin_insert on storage.objects for insert to authenticated with check (bucket_id in ('projects','renders','drawings','homepage') and public.is_admin());
drop policy if exists portfolio_admin_update on storage.objects;
create policy portfolio_admin_update on storage.objects for update to authenticated using (bucket_id in ('projects','renders','drawings','homepage') and public.is_admin()) with check (bucket_id in ('projects','renders','drawings','homepage') and public.is_admin());
drop policy if exists portfolio_admin_delete on storage.objects;
create policy portfolio_admin_delete on storage.objects for delete to authenticated using (bucket_id in ('projects','renders','drawings','homepage') and public.is_admin());

-- Create the admin account in Supabase Auth first. Then run:
-- insert into public.admin_users(user_id) values ('AUTH-USER-UUID');
