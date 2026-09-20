import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getCurrentUser } from '../../../../lib/auth';

export async function GET(){
  const admin=await getCurrentUser();
  if(admin?.role!=='ADMIN') return NextResponse.json({error:'Unauthorized'},{status:401});

  const now=new Date();
  const since=new Date(now);
  since.setDate(since.getDate()-30);
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());

  const [total, todayCount, uniqueRows, topPages, recent]=await Promise.all([
    prisma.visit.count({where:{createdAt:{gte:since}}}),
    prisma.visit.count({where:{createdAt:{gte:today}}}),
    prisma.visit.findMany({where:{createdAt:{gte:since}},select:{visitorId:true},distinct:['visitorId']}),
    prisma.visit.groupBy({by:['path'],where:{createdAt:{gte:since}},_count:{path:true},orderBy:{_count:{path:'desc'}},take:10}),
    prisma.visit.findMany({
      where:{createdAt:{gte:since}},
      orderBy:{createdAt:'desc'},
      take:50,
      select:{id:true,visitorId:true,path:true,referrer:true,createdAt:true,visitor:{select:{name:true,email:true}}}
    })
  ]);

  return NextResponse.json({
    periodDays:30,
    total,
    today:todayCount,
    unique:uniqueRows.length,
    topPages:topPages.map(x=>({path:x.path,views:x._count.path})),
    recent
  });
}
