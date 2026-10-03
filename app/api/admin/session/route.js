import { NextResponse } from 'next/server';
import { getAdminContext } from '../../../../lib/admin-server';
export async function GET(){const a=await getAdminContext();return NextResponse.json(a?{authenticated:true,user:{id:a.user.id,email:a.user.email}}:{authenticated:false},{status:a?200:401});}
