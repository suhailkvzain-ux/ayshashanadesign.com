'use client';
import {useEffect,useState} from 'react';

export default function LightboxGallery({items,className='imageOnlyGrid'}){
  const [index,setIndex]=useState(-1);
  const close=()=>setIndex(-1);
  useEffect(()=>{
    if(index<0)return;
    const onKey=e=>{
      if(e.key==='Escape')close();
      if(e.key==='ArrowRight')setIndex(i=>(i+1)%items.length);
      if(e.key==='ArrowLeft')setIndex(i=>(i-1+items.length)%items.length);
    };
    document.addEventListener('keydown',onKey);
    document.body.style.overflow='hidden';
    return()=>{document.removeEventListener('keydown',onKey);document.body.style.overflow='';};
  },[index,items.length]);
  return <>
    <div className={className}>
      {items.map((item,i)=><button className="galleryItem" key={item.id||i} onClick={()=>setIndex(i)} aria-label={`Open ${item.alt||item.title||'image'}`}>
        <img src={item.src} alt={item.alt||item.title||'Interior design image'} loading="lazy"/>
      </button>)}
    </div>
    {index>=0 && items[index] && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={close}>
      <button className="lightboxClose" onClick={close} aria-label="Close">×</button>
      <button className="lightboxPrev" onClick={e=>{e.stopPropagation();setIndex(i=>(i-1+items.length)%items.length)}} aria-label="Previous">←</button>
      <img src={items[index].src} alt={items[index].alt||items[index].title||'Interior design image'} onClick={e=>e.stopPropagation()}/>
      <button className="lightboxNext" onClick={e=>{e.stopPropagation();setIndex(i=>(i+1)%items.length)}} aria-label="Next">→</button>
    </div>}
  </>;
}
