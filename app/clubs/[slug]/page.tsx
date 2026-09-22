import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '../../../components/PageShell';
import { prisma } from '../../../lib/prisma';

export const dynamic='force-dynamic';
const siteUrl='https://memorabilia-autograph.com';
const slugify=(s:string)=>s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params; const products=await prisma.product.findMany({where:{active:true,club:{not:null}},select:{club:true}}); const club=products.map(p=>p.club).find(p=>p&&slugify(p)===slug)||slug.replace(/-/g,' ');
 return {title:`${club} Memorabilia`,description:`Explore ${club} football shirts and sports memorabilia at Memorabilia Autograph.`,alternates:{canonical:`${siteUrl}/clubs/${slug}`}};
}
export default async function ClubPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const all=await prisma.product.findMany({where:{active:true,club:{not:null}},orderBy:{createdAt:'desc'}}); const club=all.map(p=>p.club).find(p=>p&&slugify(p)===slug); if(!club) return <PageShell><main className="section"><h1>Club not found</h1></main></PageShell>; const products=all.filter(p=>p.club===club);
 return <PageShell><main className="section"><nav aria-label="Breadcrumb"><Link href="/">Home</Link> / <span>{club}</span></nav><p className="eyebrow">CLUB MEMORABILIA</p><h1>{club} Memorabilia</h1><p className="lead">Explore football shirts and collector pieces connected with {club}.</p><div className="productGrid">{products.map(p=><article className="productCard" key={p.id}><Link href={'/product/'+p.slug} className="productVisual">{p.imageUrl&&<img src={p.imageUrl} alt={p.name} className="productCardImage"/>}</Link><div className="productInfo"><h3>{p.name}</h3><strong>{p.priceCents>0?'€'+(p.priceCents/100).toFixed(2):'CONTACT'}</strong></div></article>)}</div></main></PageShell>;
}
