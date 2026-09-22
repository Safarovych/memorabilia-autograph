import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '../../../components/PageShell';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';
const siteUrl='https://memorabilia-autograph.com';

const categoryMap:Record<string,string>={
  shirts:'Shirts',boots:'Boots',balls:'Balls','boxing-gloves':'Boxing Gloves',tennis:'Tennis',ufc:'UFC','formula-1':'Formula 1',basketball:'Basketball'
};
const titleMap:Record<string,string>={
  shirts:'Signed Football Shirts & Jerseys',
  boots:'Signed Football Boots',
  balls:'Signed Footballs',
  'boxing-gloves':'Signed Boxing Gloves',
  tennis:'Tennis Memorabilia',
  ufc:'UFC Memorabilia',
  'formula-1':'Formula 1 Memorabilia',
  basketball:'Basketball Memorabilia'
};

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params; const name=titleMap[slug]||'Sports Memorabilia';
  return {title:name,description:`Discover ${name.toLowerCase()} and authentic collector pieces at Memorabilia Autograph.`,alternates:{canonical:`${siteUrl}/category/${slug}`}};
}

export default async function CategoryPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const category=categoryMap[slug]; if(!category) return <PageShell><main className="section"><h1>Category not found</h1></main></PageShell>;
 const products=await prisma.product.findMany({where:{active:true,category},orderBy:{createdAt:'desc'},select:{id:true,slug:true,name:true,priceCents:true,imageUrl:true,player:true,club:true,type:true}});
 return <PageShell><main className="section"><nav aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span>{titleMap[slug]||category}</span></nav><p className="eyebrow">CATEGORY</p><h1>{titleMap[slug]||category}</h1><p className="lead">Explore authentic {category.toLowerCase()} memorabilia, signed pieces and collector items.</p><div className="productGrid">{products.map(p=><article className="productCard" key={p.id}><Link href={'/product/'+p.slug} className="productVisual">{p.imageUrl&&<img src={p.imageUrl} alt={p.name} className="productCardImage"/>}{p.type==='SIGNED'&&<span className="badge">SIGNED</span>}</Link><div className="productInfo"><div><h3>{p.name}</h3><p>{[p.player,p.club].filter(Boolean).join(' • ')||category}</p></div><strong>{p.priceCents>0?'€'+(p.priceCents/100).toFixed(2):'CONTACT'}</strong></div></article>)}</div>{products.length===0&&<p>No items are currently published in this category.</p>}</main></PageShell>;
}
