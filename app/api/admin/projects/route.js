import { NextResponse } from 'next/server';
import { getAdminContext, sbServer, uploadToStorage, deleteStorage, publicStorageUrl } from '../../../../lib/admin-server';

const extOf=f=>{const m=f?.name?.match(/\.([^.]+)$/);return (m?.[1]||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');};
const slugify=s=>String(s||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

export async function GET(req){
  const a=await getAdminContext();if(!a)return NextResponse.json({error:'Unauthorized'},{status:401});
  try{const url=new URL(req.url);const status=url.searchParams.get('status');const q=url.searchParams.get('q');let query='select=*&order=updated_at.desc.nullslast,created_at.desc';if(status==='published')query+='&published=eq.true';if(status==='draft')query+='&published=eq.false';if(q)query+=`&title=ilike.*${encodeURIComponent(q)}*`;const rows=await sbServer(`/rest/v1/projects?${query}`,{token:a.token});return NextResponse.json((rows||[]).map(x=>({...x,cover_image_url:publicStorageUrl('projects',x.cover_image)})));}catch(e){return NextResponse.json({error:e.message},{status:500});}
}

export async function POST(req){
  const a=await getAdminContext();if(!a)return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const fd=await req.formData();const data=JSON.parse(fd.get('data')||'{}');
    if(!data.title) return NextResponse.json({error:'Project name is required.'},{status:400});
    const slug=slugify(data.slug||data.title);
    const cover=fd.get('cover');let coverPath=null;
    if(cover instanceof File && cover.size){coverPath=await uploadToStorage(cover,'projects',`${crypto.randomUUID()}/cover.${extOf(cover)}`,a.token);}
    const row={title:data.title,slug,location:data.location||null,year:data.year?Number(data.year):null,description:data.description||null,cover_image:coverPath,published:Boolean(data.published),status:Boolean(data.published)?'published':'draft',featured:Boolean(data.featured),sort_order:Number(data.sort_order)||0};
    const p=await sbServer('/rest/v1/projects',{method:'POST',token:a.token,headers:{Prefer:'return=representation'},body:row});
    const project=p?.[0];
    if(!project)throw new Error('Project was not created.');
    const groups=[['plans','plans'],['renders','renders'],['finished_site','finished_site']];
    for(const [field,category] of groups){const files=fd.getAll(field).filter(x=>x instanceof File&&x.size);for(let i=0;i<files.length;i++){const file=files[i];const path=await uploadToStorage(file,'projects',`${project.id}/${category}/${crypto.randomUUID()}.${extOf(file)}`,a.token);await sbServer('/rest/v1/project_images',{method:'POST',token:a.token,body:{project_id:project.id,category,image_type:category==='plans'?'plan':category==='renders'?'render':'finished',image_url:path,storage_path:path,sort_order:i,alt_text:project.title}});}}
    return NextResponse.json({...project,cover_image_url:publicStorageUrl('projects',project.cover_image)},{status:201});
  }catch(e){return NextResponse.json({error:e.message},{status:500});}
}
