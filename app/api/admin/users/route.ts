import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getCurrentUser } from '../../../../lib/auth';

export async function GET(){
  const admin=await getCurrentUser();
  if(admin?.role!=='ADMIN') return NextResponse.json({error:'Unauthorized'},{status:401});

  const users=await prisma.user.findMany({
    orderBy:{createdAt:'desc'},
    select:{
      id:true,name:true,email:true,role:true,createdAt:true,lastSeenAt:true,
      _count:{select:{visits:true}}
    }
  });

  return NextResponse.json(users);
}
