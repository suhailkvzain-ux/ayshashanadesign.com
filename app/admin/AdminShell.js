'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';

export default function AdminShell({children}){
  const [user,setUser]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
  const router=useRouter();const pathname=usePathname();
  useEffect(()=>{if(pathname==='/admin/login'){setLoading(false);return;}fetch('/api/admin/session',{cache:'no-store'}).then(async r=>{const d=await r.json();if(!r.ok){router.replace('/admin/login');return;}setUser(d.user);}).catch(()=>setError('Unable to verify your admin session.')).finally(()=>setLoading(false));},[router,pathname]);
  async function logout(){await fetch('/api/admin/auth/logout',{method:'POST'});router.replace('/admin/login');}
  if(pathname==='/admin/login')return children;
  if(loading)return <div className="adminLoading">Checking secure admin session…</div>;
  if(error)return <div className="adminLoading">{error}</div>;
  if(!user)return null;
  const links=[['Dashboard','/admin'],['Projects','/admin/projects'],['3D Renders','/admin/renders'],['Drawings','/admin/drawings'],['Homepage Hero','/admin/homepage'],['Contact Details','/admin/settings/contact'],['Website Settings','/admin/settings']];
  return <div className="adminApp"><aside className="adminSidebar"><div><div className="adminBrand">AYSHA SHANA DESIGN</div><div className="adminLabel">PRIVATE CMS</div></div><nav>{links.map(([label,href])=><Link key={href} className={pathname===href?'active':''} href={href}>{label}</Link>)}</nav><div className="adminSideBottom"><div className="adminEmail">{user.email}</div><button onClick={logout}>LOGOUT</button></div></aside><main className="adminMain">{children}</main></div>;
}
