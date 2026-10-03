import Link from 'next/link';
import {Nav,WhatsApp,Footer} from '../../components';
import {publicQuery,publicImage} from '../../../lib/supabase';
import LightboxGallery from '../../LightboxGallery';
export const dynamic='force-dynamic';

async function getProject(slug){
  const rows=await publicQuery('projects',`select=*&slug=eq.${encodeURIComponent(slug)}&published=eq.true&limit=1`).catch(()=>[]);
  return rows?.[0]||null;
}
async function getImages(projectId){
  if(!projectId)return [];
  return publicQuery('project_images',`select=id,storage_path,image_url,alt_text,sort_order,category&project_id=eq.${projectId}&order=sort_order.asc,created_at.asc`).catch(()=>[]);
}

export async function generateMetadata({params}){
  const {slug}=await params;
  const p=await getProject(slug);
  if(!p)return {title:'Project | Aysha Shana Design'};
  return {title:`${p.title} | Aysha Shana Design`,description:p.description||`${p.title} — interior design project by Aysha Shana Design.`};
}

export default async function ProjectPage({params}){
  const {slug}=await params;
  const project=await getProject(slug);
  if(!project)return <><Nav/><main className="page"><section className="pageHero"><div className="eyebrow">PROJECT</div><h1>PAGE NOT FOUND</h1><p>This project may be unpublished or no longer available.</p><Link className="btn dark" href="/projects">BACK TO PROJECTS</Link></section></main><WhatsApp/><Footer/></>;

  const images=await getImages(project.id);
  const grouped={plans:[],renders:[],finished_site:[]};
  images.forEach(x=>{const category=x.category;if(grouped[category])grouped[category].push({id:x.id,src:publicImage('projects',x.storage_path||x.image_url),alt:x.alt_text||project.title});});
  const cover=publicImage('projects',project.cover_image);

  const section=(number,title,items)=>{
    if(!items.length)return null;
    return <section className="projectSection">
      <div className="sectionhead"><div><div className="eyebrow">{number}</div><h2>{title}</h2></div></div>
      <LightboxGallery items={items} className="projectGallery"/>
    </section>;
  };

  return <><Nav/><main>
    <section className="projectHero">
      <div className="projectHeading"><div className="eyebrow">{project.category||'INTERIOR DESIGN'}{project.location?` · ${project.location}`:''}</div><h1>{project.title}</h1><p>{project.description||''}</p>{project.year&&<span>{project.year}</span>}</div>
      {cover&&<img src={cover} alt={project.title} fetchPriority="high"/>}
    </section>
    {section('01 · PLANS','PLANS',grouped.plans)}
    {section('02 · 3D VISUALIZATION','3D RENDERS',grouped.renders)}
    {section('03 · COMPLETED PROJECT','FINISHED SITE',grouped.finished_site)}
    <div className="projectEnd"><Link className="btn" href="/projects">← ALL PROJECTS</Link><Link className="btn dark" href="/contact">DISCUSS YOUR PROJECT →</Link></div>
  </main><WhatsApp/><Footer/></>;
}
