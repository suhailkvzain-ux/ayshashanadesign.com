import { NextResponse } from 'next/server';

async function isAuthorized(request, accessToken) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key || !accessToken) return false;
  try {
    const headers = { apikey: key, Authorization: `Bearer ${accessToken}` };
    const userRes = await fetch(`${base}/auth/v1/user`, { headers, cache: 'no-store' });
    if (!userRes.ok) return false;
    const user = await userRes.json();
    if (!user?.id) return false;
    const adminRes = await fetch(`${base}/rest/v1/admin_users?select=user_id&user_id=eq.${encodeURIComponent(user.id)}&limit=1`, { headers, cache: 'no-store' });
    if (!adminRes.ok) return false;
    const admins = await adminRes.json();
    return Array.isArray(admins) && admins.length > 0;
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/admin') || pathname === '/admin/login') return NextResponse.next();
  const access = request.cookies.get('aysha_admin_access')?.value;
  if (!(await isAuthorized(request, access))) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
