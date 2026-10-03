import { NextResponse } from 'next/server';
import { getAdminContext, sbServer } from '../../../../lib/admin-server';
export async function GET(){
  const a=await getAdminContext(); if(!a)return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const [projects,renders,drawings]=await Promise.all([
      sbServer('/rest/v1/projects?select=id,title,location,status,published,updated_at,created_at&order=updated_at.desc.nullslast&limit=100',{token:a.token}),
      sbServer('/rest/v1/renders?select=id',{token:a.token}),
      sbServer('/rest/v1/drawings?select=id',{token:a.token})
    ]);
    const p=projects||[];
    return NextResponse.json({counts:{projects:p.length,published:p.filter(x=>x.published===true||x.status==='published').length,drafts:p.filter(x=>x.published===false||x.status==='draft').length,renders:(renders||[]).length,drawings:(drawings||[]).length},recent:p.slice(0,8)});
  }catch(e){return NextResponse.json({error:e.message},{status:500});}
}
