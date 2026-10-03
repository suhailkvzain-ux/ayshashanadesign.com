export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function supabaseFetch(path, { method='GET', body, token, headers={} } = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase environment variables are missing.');
  const h = { apikey: SUPABASE_KEY, ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  if (body && !(body instanceof FormData)) h['Content-Type'] = 'application/json';
  const res = await fetch(`${SUPABASE_URL}${path}`, { method, headers:h, body:body instanceof FormData ? body : body ? JSON.stringify(body) : undefined, cache:'no-store' });
  const text=await res.text(); let data=null; try{data=text?JSON.parse(text):null}catch{data=text;}
  if(!res.ok) throw new Error(data?.message||data?.msg||data?.error_description||text||`Supabase error ${res.status}`);
  return data;
}
export async function publicQuery(table, query='select=*'){return supabaseFetch(`/rest/v1/${table}?${query}`);}
export function publicImage(bucket,path){if(!path)return '';return path.startsWith('http')?path:`${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;}

export async function getPublicSettings(){
  for(const table of ['site_settings','settings']){
    try{const rows=await publicQuery(table,'select=*');if(!Array.isArray(rows)||!rows.length)continue;const result={...rows[0]};for(const row of rows){const key=row.key??row.name??row.setting_key;const value=row.value??row.setting_value??row.content;if(key&&value!==undefined)result[key]=value;}return result;}catch{}
  }
  return {};
}
export async function getHomepageContent(){
  for(const table of ['homepage','homepage_content']){
    try{const rows=await publicQuery(table,'select=*');if(!Array.isArray(rows)||!rows.length)continue;const result={...rows[0]};for(const row of rows){const key=row.key??row.name??row.section;const value=row.value??row.content??row.text;if(key&&value!==undefined)result[key]=value;}return result;}catch{}
  }
  return {};
}
export function settingValue(settings,...keys){for(const key of keys){const value=settings?.[key];if(value!==undefined&&value!==null&&String(value).trim())return value;}return '';}
