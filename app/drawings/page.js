import Link from 'next/link';
import {Nav,WhatsApp,Footer} from '../components';
import {publicQuery,publicImage} from '../../lib/supabase';
import LightboxGallery from '../LightboxGallery';
export const dynamic='force-dynamic';

async function get(){
  const items=await publicQuery('drawings','select=*&published=eq.true&order=sort_order.asc,created_at.desc').catch(()=>[]);
  return (items||[]).map(x=>({id:x.id,src:publicImage('drawings',x.storage_path||x.image_url),title:x.title,alt:x.alt_text||x.title||'Interior design technical drawing'}));
}

export default async function Drawings(){
  const items=await get();
  return <><Nav/><main className="page drawingsPage">
    <section className="pageHero drawingsHero">
      <div className="eyebrow">TECHNICAL DESIGN · DUBAI</div>
      <h1>INTERIOR DESIGN DRAWINGS & CAD</h1>
      <p>Clear, accurate technical drawings developed to communicate an interior design from concept through execution — including plans, elevations, sections, joinery and working details.</p>
    </section>

    <section className="drawingServices">
      {[
        ['01','FLOOR PLANS','Furniture layouts, dimensions and space-planning drawings.'],
        ['02','ELEVATIONS & SECTIONS','Interior elevations and sections that communicate design intent clearly.'],
        ['03','JOINERY & SHOP DRAWINGS','Detailed drawings for custom furniture, cabinetry and built-in elements.'],
        ['04','WORKING DRAWINGS','Organised drawing sets prepared for coordination and site execution.']
      ].map(([n,t,d])=><div className="drawingService" key={n}><span>{n}</span><h2>{t}</h2><p>{d}</p></div>)}
    </section>

    {items.length ? <section className="drawingGallerySection">
      <div className="sectionhead"><div><div className="eyebrow">SELECTED TECHNICAL WORK</div><h2>DRAWING DETAILS</h2></div></div>
      <LightboxGallery items={items}/>
    </section> : <section className="drawingEmpty"><div className="eyebrow">TECHNICAL PORTFOLIO</div><h2>DRAWING SAMPLES WILL APPEAR HERE</h2><p>Published technical drawings from the CMS will be displayed in this gallery.</p></section>}

    <section className="cta drawingsCta">
      <div className="eyebrow">NEED TECHNICAL DRAWINGS?</div>
      <h2>LET’S DISCUSS<br/>YOUR PROJECT.</h2>
      <p>Work directly with Aysha Shana Design for interior design drawings, CAD documentation and technical detailing in Dubai.</p>
      <Link className="btn dark" href="/contact">GET IN TOUCH →</Link>
    </section>
  </main><WhatsApp label="WHATSAPP FOR DRAWINGS"/><Footer/></>;
}
