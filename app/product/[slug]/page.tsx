import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageShell from '../../../components/PageShell';
import LanguageText from '../../../components/LanguageText';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

const desc:Record<string,string>={
  'Premium replica jersey inspired by the current Real Madrid home collection.':'Премиальная реплика, вдохновлённая актуальной домашней коллекцией Реал Мадрид.',
  'Modern blaugrana home jersey with a classic football silhouette.':'Современная футболка в стиле blaugrana с классическим футбольным силуэтом.',
  'Premium Liverpool-inspired home jersey for collectors and fans.':'Премиальная футболка в стиле Ливерпуля для коллекционеров и болельщиков.',
  'Germany national-team inspired jersey for the modern collector.':'Футболка в стиле сборной Германии для современного коллекционера.',
  'A retro-inspired Bayern collector piece with classic styling.':'Коллекционный ретро-предмет Баварии в классическом стиле.',
  'Minimal premium training top with a modern athletic cut.':'Минималистичный премиальный тренировочный топ современного спортивного кроя.',
  'Example listing for a signed Argentina jersey with certificate and provenance record.':'Пример футболки Аргентины с автографом, сертификатом и историей происхождения.'
};

const names:Record<string,string>={
  'Real Madrid Home Jersey':'Домашняя футболка Реал Мадрид',
  'FC Barcelona Home Jersey':'Домашняя футболка Барселоны',
  'Liverpool Home Jersey':'Домашняя футболка Ливерпуля',
  'Germany Home Jersey':'Домашняя футболка Германии',
  'Bayern Retro Jersey':'Ретро-футболка Баварии',
  'Elite Black Training Top':'Чёрный тренировочный топ',
  'Lionel Messi Signed Argentina Jersey':'Футболка Аргентины с автографом Лионеля Месси'
};

function toneFor(category:string,name:string){
  if(/Barcelona/i.test(name)) return 'barca';
  if(/Liverpool|Bayern/i.test(name)) return 'red';
  if(/Training/i.test(name)) return 'black';
  return 'white';
}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const p=await prisma.product.findUnique({where:{slug}});
  if(!p || !p.active) notFound();

  const tone=toneFor(p.category,p.name);
  const price=p.priceCents/100;

  return <PageShell><main className="section">
    <div className="productDetailGrid">
      <div className={'productVisual '+tone}>
        {p.imageUrl?<img src={p.imageUrl} alt={p.name} className="productDetailImage"/>:<><span className="shirtMark">{p.club?.slice(0,3).toUpperCase()||'MA'}</span><span className="shirtNumber">{p.type==='SIGNED'?'10':'11'}</span></>}
        {p.type==='SIGNED'?<span className="badge">SIGNED</span>:null}
      </div>
      <div>
        <p className="eyebrow"><LanguageText en="PRODUCT" ru="ТОВАР"/></p>
        <h1 style={{font:'normal 52px Georgia,serif'}}><LanguageText en={p.name} ru={names[p.name]||p.name}/></h1>
        <p className="lead"><LanguageText en={p.description} ru={desc[p.description]||p.description}/></p>
        <h2>€{price.toFixed(2)}</h2>
        <p style={{color:'#777'}}><LanguageText en="Category: " ru="Категория: "/>{p.category}</p>
        {p.player&&<p style={{color:'#777'}}><LanguageText en="Player: " ru="Игрок: "/>{p.player}</p>}
        {p.club&&<p style={{color:'#777'}}><LanguageText en="Club / Team: " ru="Клуб / Сборная: "/>{p.club}</p>}
        {p.season&&<p style={{color:'#777'}}><LanguageText en="Season: " ru="Сезон: "/>{p.season}</p>}
        <p style={{color:'#777'}}><LanguageText en="Sizes: " ru="Размеры: "/>{p.sizes?.join(' / ')||<LanguageText en="One size" ru="Единый размер"/>}</p>
        {p.certificateId&&<p style={{color:'#777'}}><LanguageText en="Certificate ID: " ru="ID сертификата: "/>{p.certificateId}</p>}
        <Link className="btn" href="/cart"><LanguageText en="ADD TO BAG" ru="ДОБАВИТЬ В КОРЗИНУ"/></Link>
      </div>
    </div>
  </main></PageShell>
}
