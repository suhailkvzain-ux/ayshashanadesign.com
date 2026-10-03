import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_KEY } from './supabase';

export async function sbServer(path, { method='GET', body, token, headers={} } = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase environment variables are missing.');
  const h = { apikey: SUPABASE_KEY, ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  if (body !== undefined && !(body instanceof FormData)) h['Content-Type'] = 'application/json';
  const res = await fetch(`${SUPABASE_URL}${path}`, { method, headers:h, body:body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined, cache:'no-store' });
  const text = await res.text();
  let data = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(data?.message || data?.msg || data?.error_description || data?.hint || text || `Supabase error ${res.status}`);
  return data;
}

export async function getAdminContext() {
  const jar = await cookies();
  const access = jar.get('aysha_admin_access')?.value;
  if (!access) return null;
  try {
    const user = await sbServer('/auth/v1/user', { token: access });
    if (!user?.id) return null;
    const rows = await sbServer(`/rest/v1/admin_users?select=user_id&user_id=eq.${encodeURIComponent(user.id)}&limit=1`, { token: access });
    if (!rows?.length) return null;
    return { token:access, user };
  } catch { return null; }
}

export function cookieOptions(maxAge=60*60*8) {
  return { httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'lax', path:'/', maxAge };
}

export function publicStorageUrl(bucket, path) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export async function uploadToStorage(file, bucket, path, token) {
  if (!(file instanceof File) || !file.size) throw new Error('No image file was supplied.');
  if (!String(file.type||'').startsWith('image/')) throw new Error('Only image files are allowed.');
  if (file.size > 15 * 1024 * 1024) throw new Error('Image is too large. Please use an image under 15 MB.');
  const buffer = Buffer.from(await file.arrayBuffer());
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method:'POST', headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${token}`, 'x-upsert':'false', 'Content-Type':file.type || 'application/octet-stream' }, body:buffer, cache:'no-store'
  });
  if (!res.ok) throw new Error(await res.text());
  return path;
}

export async function deleteStorage(bucket, paths, token) {
  const list=(Array.isArray(paths)?paths:[paths]).filter(Boolean);
  for(const path of list){
    const res=await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`,{method:'DELETE',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${token}`},cache:'no-store'});
    if(!res.ok){const text=await res.text();throw new Error(text||`Storage delete failed for ${path}`);}
  }
}
