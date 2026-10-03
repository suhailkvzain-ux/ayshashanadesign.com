import {Nav,WhatsApp,Footer} from '../components';
import {getPublicSettings,settingValue} from '../../lib/supabase';
export const dynamic='force-dynamic';

export default async function Contact(){
  const settings=await getPublicSettings();
  const whatsapp=settingValue(settings,'whatsapp','whatsapp_number','phone');
  const email=settingValue(settings,'email','email_address');
  const instagram=settingValue(settings,'instagram','instagram_url');
  const message=settingValue(settings,'whatsapp_message') || 'Hi Aysha, I found your website and would like to discuss an interior design project.';
  const waHref=whatsapp?`https://wa.me/${String(whatsapp).replace(/\D/g,'')}?text=${encodeURIComponent(message)}`:'';
  return <><Nav/><main className="page contactPage">
    <section className="pageHero"><div className="eyebrow">CONTACT</div><h1>LET’S TALK ABOUT YOUR SPACE</h1><p>Have an apartment, villa or commercial space you’d like to work on? Get in touch and share a few details about your project.</p></section>
    <section className="contactGrid">
      {whatsapp&&<a href={waHref} target="_blank" rel="noreferrer"><span>WHATSAPP</span><strong>Start a conversation →</strong></a>}
      {email&&<a href={`mailto:${email}`}><span>EMAIL</span><strong>{email}</strong></a>}
      {instagram&&<a href={instagram} target="_blank" rel="noreferrer"><span>INSTAGRAM</span><strong>View profile →</strong></a>}
    </section>
  </main><WhatsApp/><Footer/></>;
}
