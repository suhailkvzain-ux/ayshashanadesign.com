import Link from 'next/link';
import {Nav,WhatsApp,Footer} from './components';
import {publicQuery,publicImage,getPublicSettings,getHomepageContent,settingValue} from '../lib/supabase';
import LightboxGallery from './LightboxGallery';

export const dynamic='force-dynamic';

async function getData(){
  const [projects,renders,drawings,settings,home]=await Promise.all([
    publicQuery('projects','select=*&published=eq.true&featured=eq.true&order=sort_order.asc,created_at.desc').catch(()=>[]),
    publicQuery('renders','select=*&published=eq.true&order=sort_order.asc,created_at.desc').catch(()=>[]),
    publicQuery('drawings','select=*&published=eq.true&order=sort_order.asc,created_at.desc').catch(()=>[]),
    getPublicSettings(),
    getHomepageContent()
  ]);
  return {
    projects:projects||[],
    renders:(renders||[]).map(x=>({id:`r-${x.id}`,src:publicImage('renders',x.storage_path||x.image_url),alt:x.alt_text||x.title||'3D interior visualization',title:x.title})),
    drawings:(drawings||[]).map(x=>({id:x.id,src:publicImage('drawings',x.storage_path||x.image_url),alt:x.alt_text||x.title||'Technical interior drawing',title:x.title})),
    settings,home
  };
}

export default async function Home(){
  const {projects,renders,drawings,settings,home}=await getData();
  const heroImage=settingValue(home,'hero_image','heroImage');
  const heroTitle=settingValue(home,'brand_name','hero_title','heroTitle') || 'AYSHA SHANA DESIGN';
  const heroSubtitle=settingValue(home,'subtitle','hero_subtitle') || 'Freelance Interior Designer in Dubai';
  const heroText=settingValue(home,'description','hero_text','heroText') || 'Thoughtful interiors designed around the way you live, work and use your space.';
  const primaryText=settingValue(home,'primary_button_text') || 'VIEW PROJECTS';
  const primaryUrl=settingValue(home,'primary_button_url') || '/projects';
  const secondaryText=settingValue(home,'secondary_button_text') || 'WHATSAPP ME';
  const secondaryUrl=settingValue(home,'secondary_button_url');
  const aboutText=settingValue(home,'about_text','aboutText');
  const selected=projects.slice(0,6);
  const heroSrc=heroImage ? (heroImage.startsWith('http')?heroImage:publicImage('homepage',heroImage)) : '';
  const whatsapp=settingValue(settings,'whatsapp','whatsapp_number','phone');
  const waMessage=settingValue(settings,'whatsapp_message') || 'Hi Aysha, I found your website and would like to discuss an interior design project.';
  const waHref=whatsapp?`https://wa.me/${String(whatsapp).replace(/\D/g,'')}?text=${encodeURIComponent(waMessage)}`:'';
  return <><Nav/><main>
    <section className="hero">
      <div className="heroCopy">
        <div className="eyebrow">AYSHA SHANA DESIGN · DUBAI, UAE</div>
        <div className="heroSubtitle">{heroSubtitle}</div><h1>{heroTitle}</h1>
        <p>{heroText}</p>
        <div className="buttons"><Link className="btn dark" href={primaryUrl}>{primaryText}</Link><a className="btn" href={secondaryUrl||waHref||"#contact"} target={(secondaryUrl||waHref)?.startsWith('http')?"_blank":undefined} rel={(secondaryUrl||waHref)?.startsWith('http')?"noreferrer":undefined}>{secondaryText}</a></div>
      </div>
      {heroSrc && <div className="heroVisual"><img src={heroSrc} alt="Interior design by Aysha Shana Design" fetchPriority="high"/></div>}
    </section>

    <section className="intro section">
      <div className="eyebrow">THE APPROACH</div>
      <h2>DESIGNING SPACES WITH PURPOSE</h2>
      <p>{aboutText || 'Every space has its own character. The approach is to understand the people who use it, then develop interiors that balance functionality, atmosphere and personal style.'}</p>
    </section>

    {selected.length>0 && <section className="section">
      <div className="sectionhead"><div><div className="eyebrow">PORTFOLIO</div><h2>SELECTED PROJECTS</h2><p className="sectionIntro">Selected interior design work across residential and commercial spaces.</p></div><Link className="muted" href="/projects">VIEW ALL →</Link></div>
      <div className="grid">{selected.map(p=><Link className="card" key={p.slug} href={`/projects/${p.slug}`}>
        <img className="cardimg" src={publicImage('projects',p.cover_image)} alt={p.title} loading="lazy"/>
        <div className="cardtitle">{p.title}</div><div className="cardsmall">{p.location||''}{p.year?` · ${p.year}`:''}</div>
      </Link>)}</div>
    </section>}

    <section className="section servicesSection">
      <div className="sectionhead"><div><div className="eyebrow">SERVICES</div><h2>WHAT I CAN HELP WITH</h2></div></div>
      <div className="serviceList">
        {[
          ['INTERIOR DESIGN','Interior design concepts and development for residential and selected commercial spaces.'],
          ['SPACE PLANNING','Layouts developed around functionality, movement and everyday use.'],
          ['3D VISUALIZATION','Detailed visualizations that help clients understand the proposed space before execution.'],
          ['TECHNICAL DRAWINGS','Clear design and technical drawings for communicating the design.'],
          ['MATERIAL & FINISH SELECTION','Guidance on materials, finishes, colours and design elements.'],
          ['DESIGN / SITE COORDINATION','Design-related coordination where applicable.']
        ].map(([title,text])=><div className="service" key={title}><h3>{title}</h3><p>{text}</p></div>)}
      </div>
    </section>

    {renders.length>0 && <section className="section">
      <div className="sectionhead"><div><div className="eyebrow">VISUALIZATION</div><h2>3D VISUALIZATIONS</h2></div><Link className="muted" href="/renders">VIEW ALL RENDERS →</Link></div>
      <LightboxGallery items={renders.slice(0,4)} className="homeGallery"/>
    </section>}

    {drawings.length>0 && <section className="section technicalPreview">
      <div className="sectionhead"><div><div className="eyebrow">TECHNICAL WORK</div><h2>FROM CONCEPT TO DETAIL</h2></div><Link className="muted" href="/drawings">VIEW DRAWINGS →</Link></div>
      <LightboxGallery items={drawings.slice(0,4)} className="homeGallery drawingsPreview"/>
    </section>}

    <section className="about" id="about">
      <div><div className="eyebrow">ABOUT AYSHA</div><h2>WORK DIRECTLY WITH THE DESIGNER</h2></div>
      <div><p>From the first conversation through the design process, each project receives a personal and focused approach.</p><p>{settingValue(home,'about_detail','aboutDetail') || 'Interior design, space planning, visualization, materials, technical drawings and client collaboration are brought together with a practical design approach.'}</p><Link className="textLink" href="/about">READ ABOUT AYSHA →</Link></div>
    </section>

    <section className="cta" id="contact">
      <div className="eyebrow">START A CONVERSATION</div>
      <h2>HAVE A SPACE<br/>IN MIND?</h2>
      <p>Tell me a little about your project and let’s discuss how we can shape the space.</p>
      <div className="buttons"><a className="btn dark" href={waHref||"#contact"} target={waHref?"_blank":undefined} rel={waHref?"noreferrer":undefined}>WHATSAPP ME</a><Link className="btn" href="/contact">SEND AN EMAIL</Link></div>
    </section>
  </main><WhatsApp/><Footer/></>;
}
