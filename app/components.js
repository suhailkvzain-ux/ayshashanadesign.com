import Link from 'next/link';
import { getPublicSettings, settingValue } from '../lib/supabase';
import MobileMenu from './MobileMenu';

export async function Nav(){
  const settings = await getPublicSettings();
  const whatsapp = settingValue(settings,'whatsapp','whatsapp_number','phone');
  const href = whatsapp ? `https://wa.me/${String(whatsapp).replace(/\D/g,'')}` : '#contact';
  return <header className="siteHeader">
    <nav className="nav" aria-label="Main navigation">
      <Link href="/" className="brand">AYSHA SHANA DESIGN</Link>
      <div className="desktopLinks">
        <Link href="/">HOME</Link>
        <Link href="/projects">PROJECTS</Link>
        <Link href="/renders">3D RENDERS</Link>
        <Link href="/drawings">DRAWINGS</Link>
        <Link href="/about">ABOUT</Link>
        <Link href="/contact">CONTACT</Link>
        {whatsapp && <a className="navCta" href={href} target="_blank" rel="noreferrer">WHATSAPP</a>}
      </div>
      <MobileMenu whatsappHref={whatsapp ? href : ''}/>
    </nav>
  </header>;
}

export async function WhatsApp({label='WHATSAPP ME'}){
  const settings = await getPublicSettings();
  const number = settingValue(settings,'whatsapp','whatsapp_number','phone');
  if (!number) return null;
  const clean = String(number).replace(/\D/g,'');
  const message = encodeURIComponent(settingValue(settings,'whatsapp_message') || 'Hi Aysha, I found your website and would like to discuss an interior design project.');
  return <a className="whatsapp" href={`https://wa.me/${clean}?text=${message}`} target="_blank" rel="noreferrer" aria-label="Contact Aysha on WhatsApp">
    <span className="waDot" aria-hidden="true"></span><span>{label}</span>
  </a>;
}

export async function Footer(){
  const settings = await getPublicSettings();
  const whatsapp = settingValue(settings,'whatsapp','whatsapp_number','phone');
  const email = settingValue(settings,'email','email_address');
  const instagram = settingValue(settings,'instagram','instagram_url');
  const waHref = whatsapp ? `https://wa.me/${String(whatsapp).replace(/\D/g,'')}` : '#contact';
  return <footer className="footer">
    <div>
      <strong>AYSHA SHANA DESIGN</strong>
      <span>Freelance Interior Designer in Dubai</span>
    </div>
    <div className="footerLinks">
      <Link href="/projects">Projects</Link><Link href="/renders">3D Renders</Link><Link href="/drawings">Drawings</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link>
    </div>
    <div className="footerSocial">
      {instagram && <a href={instagram} target="_blank" rel="noreferrer">Instagram</a>}
      {whatsapp && <a href={waHref} target="_blank" rel="noreferrer">WhatsApp</a>}
      {email && <a href={`mailto:${email}`}>Email</a>}
    </div>
    <small>© Aysha Shana Design</small>
  </footer>;
}
