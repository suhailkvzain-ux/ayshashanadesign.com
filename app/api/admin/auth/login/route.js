import { NextResponse } from 'next/server';
import { sbServer, cookieOptions } from '../../../../../lib/admin-server';

export async function POST(req){
  try{
    const {email,password}=await req.json();
    if(!email||!password) return NextResponse.json({error:'Email and password are required.'},{status:400});
    const session=await sbServer('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});
    const user=session?.user;
    if(!session?.access_token||!user?.id) throw new Error('Invalid login.');
    const admins=await sbServer(`/rest/v1/admin_users?select=user_id&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,{token:session.access_token});
    if(!admins?.length) return NextResponse.json({error:'This account is not authorized as an administrator.'},{status:403});
    const res=NextResponse.json({user:{id:user.id,email:user.email}});
    res.cookies.set('aysha_admin_access',session.access_token,cookieOptions(session.expires_in||3600));
    if(session.refresh_token) res.cookies.set('aysha_admin_refresh',session.refresh_token,cookieOptions(60*60*24*30));
    return res;
  }catch(e){return NextResponse.json({error:e.message||'Unable to sign in.'},{status:401});}
}
