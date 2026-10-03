import {Nav,WhatsApp,Footer} from '../components';
import {publicQuery,publicImage} from '../../lib/supabase';
import LightboxGallery from '../LightboxGallery';
export const dynamic='force-dynamic';

async function get(){
  const [standalone,projectRenders]=await Promise.all([
    publicQuery('renders','select=*&published=eq.true&order=sort_order.asc,created_at.desc').catch(()=>[]),
    publicQuery('project_images','select=id,storage_path,image_url,alt_text,sort_order,category&order=sort_order.asc,created_at.desc').catch(()=>[])
  ]);
  return [...(standalone||[]).map(x=>({id:`r-${x.id}`,src:publicImage('renders',x.storage_path||x.image_url),alt:x.alt_text||x.title,title:x.title})),
    ...(projectRenders||[]).filter(x=>x.category==='renders').map(x=>({id:`p-${x.id}`,src:publicImage('projects',x.storage_path||x.image_url),alt:x.alt_text||'3D interior visualization'}))];
}
export default async function Renders(){
  const items=await get();
  return <><Nav/><main className="page">
    <section className="pageHero"><div className="eyebrow">VISUALIZATION</div><h1>3D RENDERS</h1><p>Visualizing spaces before they become reality.</p></section>
    {items.length?<LightboxGallery items={items}/>:<div className="emptyState pageEmpty">Renders coming soon.</div>}
  </main><WhatsApp/><Footer/></>;
}
