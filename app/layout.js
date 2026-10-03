import './globals.css';
import {getPublicSettings,settingValue,publicImage} from '../lib/supabase';

export async function generateMetadata(){
  const settings=await getPublicSettings();
  const siteUrl=settingValue(settings,'site_url','website_url');
  const hero=settingValue(settings,'hero_image','og_image');
  const image=hero ? (hero.startsWith('http')?hero:publicImage('homepage',hero)) : undefined;
  const title=settingValue(settings,'seo_title') || 'Aysha Shana Design | Freelance Interior Designer in Dubai';
  const description=settingValue(settings,'seo_description','website_description') || 'Freelance interior design, visualization and technical design in Dubai.';
  return {
    title,
    description,
    ...(siteUrl?{metadataBase:new URL(siteUrl)}:{}),
    openGraph:{
      title,
      description,
      type:'website',
      ...(image?{images:[image]}:{})
    }
  };
}

export default async function RootLayout({children}){
  const settings=await getPublicSettings();
  const instagram=settingValue(settings,'instagram','instagram_url');
  const jsonLd={
    '@context':'https://schema.org',
    '@type':'Person',
    name:'Aysha Shana',
    jobTitle:'Freelance Interior Designer',
    url:settingValue(settings,'site_url','website_url')||undefined,
    areaServed:{'@type':'City',name:'Dubai'},
    sameAs:instagram?[instagram]:undefined
  };
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/></body></html>;
}
