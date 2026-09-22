import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getCurrentUser } from '../../../../lib/auth';

async function requireAdmin(){
  const user=await getCurrentUser();
  return user?.role==='ADMIN'?user:null;
}

export async function GET(){
  const user=await requireAdmin();
  if(!user) return NextResponse.json({error:'Unauthorized'},{status:401});
  const products=await prisma.product.findMany({orderBy:{createdAt:'desc'}});
  return NextResponse.json(products);
}

export async function POST(request:Request){
  const user=await requireAdmin();
  if(!user) return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const body=await request.json();
    const name=String(body.name||'').trim();
    const slug=String(body.slug||'').trim();
    const description=String(body.description||'').trim();
    const category=String(body.category||'').trim();
    const priceCents=Number(body.priceCents);
    if(!name||!slug||!description||!category||!Number.isInteger(priceCents)||priceCents<0){
      return NextResponse.json({error:'Name, slug, description, category and valid price are required'},{status:400});
    }
    const product=await prisma.product.create({
      data:{
        name,slug,description,category,
        subcategory:body.subcategory?String(body.subcategory):null,
        type:body.type==='SIGNED'||body.type==='COLLECTOR'?body.type:'STANDARD',
        club:body.club?String(body.club):null,
        player:body.player?String(body.player):null,
        season:body.season?String(body.season):null,
        priceCents,
        currency:String(body.currency||'EUR'),
        stock:Number.isInteger(Number(body.stock))?Number(body.stock):0,
        sizes:Array.isArray(body.sizes)?body.sizes.map(String):[],
        imageUrl:body.imageUrl?String(body.imageUrl):null,
        imageUrls:Array.isArray(body.imageUrls)?body.imageUrls.map(String):[],
        certificateId:body.certificateId?String(body.certificateId):null,
        provenance:body.provenance?String(body.provenance):null,
        signingProof:body.signingProof?String(body.signingProof):null,
        active:body.active!==false
      }
    });
    return NextResponse.json(product,{status:201});
  }catch(error:any){
    if(error?.code==='P2002') return NextResponse.json({error:'Slug or certificate ID already exists'},{status:409});
    return NextResponse.json({error:'Could not create product'},{status:500});
  }
}


export async function PATCH(request:Request){
  const user=await requireAdmin();
  if(!user) return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const body=await request.json();
    const id=String(body.id||'').trim();
    const name=String(body.name||'').trim();
    const slug=String(body.slug||'').trim();
    const description=String(body.description||'').trim();
    const category=String(body.category||'').trim();
    const priceCents=Number(body.priceCents);
    if(!id||!name||!slug||!description||!category||!Number.isInteger(priceCents)||priceCents<0){
      return NextResponse.json({error:'Valid product data is required'},{status:400});
    }
    const product=await prisma.product.update({
      where:{id},
      data:{
        name,slug,description,category,
        subcategory:body.subcategory?String(body.subcategory):null,
        type:body.type==='SIGNED'||body.type==='COLLECTOR'?(body.type):'STANDARD',
        club:body.club?String(body.club):null,
        player:body.player?String(body.player):null,
        season:body.season?String(body.season):null,
        priceCents,
        currency:String(body.currency||'EUR'),
        stock:Number.isInteger(Number(body.stock))?Number(body.stock):0,
        sizes:Array.isArray(body.sizes)?body.sizes.map(String):[],
        imageUrl:body.imageUrl?String(body.imageUrl):null,
        imageUrls:Array.isArray(body.imageUrls)?body.imageUrls.map(String):[],
        certificateId:body.certificateId?String(body.certificateId):null,
        provenance:body.provenance?String(body.provenance):null,
        signingProof:body.signingProof?String(body.signingProof):null,
        active:body.active!==false
      }
    });
    return NextResponse.json(product);
  }catch(error:any){
    if(error?.code==='P2002') return NextResponse.json({error:'Slug or certificate ID already exists'},{status:409});
    if(error?.code==='P2025') return NextResponse.json({error:'Product not found'},{status:404});
    return NextResponse.json({error:'Could not update product'},{status:500});
  }
}

export async function DELETE(request:Request){
  const user=await requireAdmin();
  if(!user) return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const body=await request.json();
    const id=String(body.id||'').trim();
    if(!id) return NextResponse.json({error:'Product ID is required'},{status:400});
    await prisma.product.delete({where:{id}});
    return NextResponse.json({ok:true});
  }catch(error:any){
    if(error?.code==='P2025') return NextResponse.json({error:'Product not found'},{status:404});
    if(error?.code==='P2003') return NextResponse.json({error:'Product is linked to an order and cannot be deleted. Hide it instead.'},{status:409});
    return NextResponse.json({error:'Could not delete product'},{status:500});
  }
}
