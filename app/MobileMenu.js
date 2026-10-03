'use client';
import {useState} from 'react';
import Link from 'next/link';

export default function MobileMenu({whatsappHref}){
  const [open,setOpen]=useState(false);
  const close=()=>setOpen(false);
  return <>
    <button className="menuButton" onClick={()=>setOpen(!open)} aria-label={open?'Close menu':'Open menu'} aria-expanded={open}>
      <span></span><span></span>
    </button>
    {open && <div className="mobileMenu">
      <Link href="/" onClick={close}>HOME</Link>
      <Link href="/projects" onClick={close}>PROJECTS</Link>
      <Link href="/renders" onClick={close}>3D RENDERS</Link>
      <Link href="/drawings" onClick={close}>DRAWINGS</Link>
      <Link href="/about" onClick={close}>ABOUT</Link>
      <Link href="/contact" onClick={close}>CONTACT</Link>
      {whatsappHref && <a href={whatsappHref} target="_blank" rel="noreferrer" onClick={close}>WHATSAPP</a>}
    </div>}
  </>;
}
