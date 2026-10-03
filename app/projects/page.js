import Link from 'next/link';
import {Nav,WhatsApp,Footer} from '../components';
import {publicQuery,publicImage} from '../../lib/supabase';
export const dynamic='force-dynamic';

async function getProjects(){return publicQuery('projects','select=*&published=eq.true&order=sort_order.asc,created_at.desc').catch(()=>[])}
export default async function Projects(){
  const projects=await getProjects();
  return <><Nav/><main className="page">
    <section className="pageHero"><div className="eyebrow">PORTFOLIO</div><h1>PROJECTS</h1><p>A selection of interior spaces developed through concept, visualization and detail.</p></section>
    {projects.length ? <div className="projectGrid">{projects.map(p=><Link className="projectCard" key={p.slug} href={`/projects/${p.slug}`}>
      <div className="projectImage"><img src={publicImage('projects',p.cover_image)} alt={p.title} loading="lazy"/></div>
      <div className="projectMeta"><div><h2>{p.title}</h2><p>{p.location||''}{p.year?` · ${p.year}`:''}</p></div><span>VIEW PROJECT →</span></div>
    </Link>)}</div> : <div className="emptyState pageEmpty">Projects coming soon.</div>}
  </main><WhatsApp/><Footer/></>;
}
