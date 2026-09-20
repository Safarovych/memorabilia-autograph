import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getCurrentUser } from '../../../lib/auth';

export async function POST(request:Request){
  try{
    const body=await request.json();
    const visitorId=String(body.visitorId||'').trim();
    const path=String(body.path||'').trim();

    if(!visitorId || !path || path.length>500){
      return NextResponse.json({ok:false},{status:400});
    }

    const currentUser=await getCurrentUser();
    await prisma.visit.create({
      data:{
        visitorId:visitorId.slice(0,120),
        path:path.slice(0,500),
        referrer:body.referrer?String(body.referrer).slice(0,500):null,
        userId:currentUser?.id||null
      }
    });

    if(currentUser){
      await prisma.user.update({where:{id:currentUser.id},data:{lastSeenAt:new Date()}});
    }

    return NextResponse.json({ok:true});
  }catch(error){
    console.error('[analytics/visit] failed',error);
    return NextResponse.json({ok:false},{status:500});
  }
}
