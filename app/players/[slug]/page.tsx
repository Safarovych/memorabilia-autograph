import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '../../../components/PageShell';
import { prisma } from '../../../lib/prisma';

export const dynamic='force-dynamic';
const siteUrl='https://memorabilia-autograph.com';
const slugify=(s:string)=>s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params; const products=await prisma.product.findMany({where:{active:true,player:{not:null}},select:{player:true}});
 const player=products.map(p=>p.player).find(p=>p&&slugify(p)===slug)||slug.replace(/-/g,' ');
 return {title:`${player} Memorabilia`,description:`Explore ${player} signed shirts, boots and sports memorabilia at Memorabilia Autograph.`,alternates:{canonical:`${siteUrl}/players/${slug}`}};
}
export default async function PlayerPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const all=await prisma.product.findMany({where:{active:true,player:{not:null}},orderBy:{createdAt:'desc'}}); const player=all.map(p=>p.player).find(p=>p&&slugify(p)===slug); if(!player) return <PageShell><main className="section"><h1>Player not found</h1></main></PageShell>; const products=all.filter(p=>p.player===player);
 return <PageShell><main className="section"><nav aria-label="Breadcrumb"><Link href="/">Home</Link> / <span>{player}</span></nav><p className="eyebrow">PLAYER MEMORABILIA</p><h1>{player} Memorabilia</h1><p className="lead">Discover signed and collectible memorabilia connected with {player}.</p><div className="productGrid">{products.map(p=><article className="productCard" key={p.id}><Link href={'/product/'+p.slug} className="productVisual">{p.imageUrl&&<img src={p.imageUrl} alt={p.name} className="productCardImage"/>}<span className="badge">VIEW</span></Link><div className="productInfo"><h3>{p.name}</h3><strong>{p.priceCents>0?'€'+(p.priceCents/100).toFixed(2):'CONTACT'}</strong></div></article>)}</div></main></PageShell>;
}
