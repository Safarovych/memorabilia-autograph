import { notFound } from 'next/navigation';
import PageShell from '../../../components/PageShell';
import LanguageText from '../../../components/LanguageText';
import AddToCartButton from '../../../components/AddToCartButton';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

function toneFor(category:string,name:string){if(/Barcelona/i.test(name))return'barca';if(/Liverpool|Bayern/i.test(name))return'red';if(/Training/i.test(name))return'black';return'white'}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=await prisma.product.findUnique({where:{slug}});if(!p||!p.active)notFound();const tone=toneFor(p.category,p.name);const price=p.priceCents/100;
return <PageShell><main className="section"><div className="productDetailGrid"><div className={'productVisual '+tone}>{p.imageUrl?<img src={p.imageUrl} alt={p.name} className="productDetailImage"/>:<><span className="shirtMark">{p.club?.slice(0,3).toUpperCase()||'MA'}</span><span className="shirtNumber">{p.type==='SIGNED'?'10':'11'}</span></>}{p.type==='SIGNED'?<span className="badge">SIGNED</span>:null}</div><div><p className="eyebrow"><LanguageText en="PRODUCT" ru="ТОВАР"/></p><h1 style={{font:'normal 52px Georgia,serif'}}><LanguageText en={p.name} ru={p.nameRu||p.name}/></h1><p className="lead"><LanguageText en={p.description} ru={p.descriptionRu||p.description}/></p><h2>€{price.toFixed(2)}</h2><p style={{color:'#777'}}><LanguageText en="Category: " ru="Категория: "/>{p.category}</p>{p.player&&<p style={{color:'#777'}}><LanguageText en="Player: " ru="Игрок: "/>{p.player}</p>}{p.club&&<p style={{color:'#777'}}><LanguageText en="Club / Team: " ru="Клуб / Сборная: "/>{p.club}</p>}{p.season&&<p style={{color:'#777'}}><LanguageText en="Season: " ru="Сезон: "/>{p.season}</p>}<p style={{color:'#777'}}><LanguageText en="Sizes: " ru="Размеры: "/>{p.sizes?.join(' / ')||<LanguageText en="One size" ru="Единый размер"/>}</p>{p.certificateId&&<p style={{color:'#777'}}><LanguageText en="Certificate ID: " ru="ID сертификата: "/>{p.certificateId}</p>}<AddToCartButton product={{id:p.id,name:p.name,slug:p.slug,priceCents:p.priceCents,currency:p.currency,imageUrl:p.imageUrl}}/></div></div></main></PageShell>}
