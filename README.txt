AYSHA SHANA DESIGN — Next.js portfolio + Supabase CMS

Public website:
- Premium editorial interior design portfolio
- CMS-driven projects, renders, drawings, homepage and contact details
- Draft content never appears on public pages
- No public admin link

Private CMS:
- /admin/login
- /admin
- /admin/projects
- /admin/projects/new
- /admin/projects/[id]/edit
- /admin/renders
- /admin/renders/new
- /admin/renders/[id]/edit
- /admin/drawings
- /admin/drawings/new
- /admin/drawings/[id]/edit
- /admin/homepage
- /admin/settings/contact
- /admin/settings

Security:
- Supabase Auth
- httpOnly admin session cookies
- server-side admin authorization on every API mutation/read
- Supabase RLS migration included at supabase/admin-cms.sql
- no service-role key in frontend

Database setup:
1. Run supabase/admin-cms.sql in the existing Supabase project.
2. Create the one admin user in Supabase Auth.
3. Insert its UUID into public.admin_users.

Fonts:
- Gilroy Light
- Gilroy Medium
- Gilroy ExtraBold
