import Link from 'next/link';
import {Nav,WhatsApp,Footer} from '../components';
import {getPublicSettings,getHomepageContent,settingValue,publicImage} from '../../lib/supabase';
export const dynamic='force-dynamic';

export default async function About(){
  const [settings,home]=await Promise.all([getPublicSettings(),getHomepageContent()]);
  const image=settingValue(home,'about_image','aboutImage')||settingValue(settings,'about_image','aboutImage');
  return <><Nav/><main className="page">
    <section className="aboutPageHero"><div><div className="eyebrow">ABOUT AYSHA</div><h1>INTERIOR DESIGN IS ABOUT HOW A SPACE IS LIVED.</h1></div>{image&&<img src={image.startsWith('http')?image:publicImage('projects',image)} alt="Aysha Shana Design" fetchPriority="high"/>}</section>
    <section className="aboutContent">
      <div><div className="eyebrow">DESIGN APPROACH</div><h2>WORK DIRECTLY WITH THE DESIGNER</h2></div>
      <div><p>From the first conversation through the design process, each project receives a personal and focused approach.</p><p>{settingValue(home,'about_text','aboutText')||'The work brings together interior design, space planning, visualization, materials, technical drawings and practical client collaboration.'}</p></div>
    </section>
    <section className="aboutContent mutedSection">
      <div><div className="eyebrow">FOCUS</div><h2>THOUGHTFUL. PRACTICAL. PERSONAL.</h2></div>
      <div><p>Interior design</p><p>Space planning</p><p>3D visualization</p><p>Materials & finishes</p><p>Technical drawings</p><p>Client collaboration</p></div>
    </section>
    <section className="cta"><div className="eyebrow">START A CONVERSATION</div><h2>HAVE A SPACE<br/>IN MIND?</h2><Link className="btn dark" href="/contact">GET IN TOUCH →</Link></section>
  </main><WhatsApp/><Footer/></>;
}
