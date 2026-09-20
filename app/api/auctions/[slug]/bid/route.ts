import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../../../lib/prisma';
import { getCurrentUser } from '../../../../../lib/auth';

export async function POST(req: Request, {params}:{params:Promise<{slug:string}>}) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({error:'Authentication required.'},{status:401});

  const {slug}=await params;
  const body=await req.json().catch(()=>({}));
  const amountCents=Number(body.amountCents);
  if(!Number.isInteger(amountCents)) return NextResponse.json({error:'Invalid bid.'},{status:400});

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient)=>{
    const auction=await tx.auction.findUnique({where:{slug}});
    if(!auction) throw new Error('Auction not found');
    if(auction.status!=='LIVE'||auction.endsAt<=new Date()) throw new Error('Auction is not live');
    if(amountCents<auction.currentBidCents+auction.bidStepCents) throw new Error('Bid is too low');
    const bid=await tx.bid.create({data:{amountCents,auctionId:auction.id,bidderId:user.id}});
    const updated=await tx.auction.update({where:{id:auction.id},data:{currentBidCents:amountCents}});
    return {bid,updated};
  }).catch((e)=>({error:e instanceof Error?e.message:'Unable to place bid'}));
  if('error' in result) return NextResponse.json(result,{status:400});
  return NextResponse.json(result);
}
