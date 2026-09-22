import { notFound } from 'next/navigation';
import PageShell from '../../../components/PageShell';
import LanguageText from '../../../components/LanguageText';
import AddToCartButton from '../../../components/AddToCartButton';
import ProductGallery from '../../../components/ProductGallery';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

const legacyRuNames:Record<string,string>={
  'Real Madrid Home Jersey':'Домашняя футболка Реал Мадрид',
  'FC Barcelona Home Jersey':'Домашняя футболка Барселоны',
  'Liverpool Home Jersey':'Домашняя футболка Ливерпуля',
  'Germany Home Jersey':'Футболка сборной Германии',
  'Bayern Retro Jersey':'Ретро-футболка Баварии',
  'Elite Black Training Top':'Чёрный тренировочный топ',
  'Lionel Messi Signed Argentina Jersey':'Футболка сборной Аргентины с автографом Лионеля Месси',
  'Eric Cantona Signed Manchester United Shirt':'Футболка Manchester United с автографом Эрика Кантона'
};

const legacyRuDescriptions:Record<string,string>={
  'Premium replica jersey inspired by the current Real Madrid home collection.':'Премиальная реплика, вдохновлённая актуальной домашней коллекцией Реал Мадрид.',
  'Modern blaugrana home jersey with a classic football silhouette.':'Современная домашняя футболка в стиле blaugrana с классическим футбольным силуэтом.',
  'Premium Liverpool-inspired home jersey for collectors and fans.':'Премиальная футболка в стиле Ливерпуля для коллекционеров и болельщиков.',
  'Germany national-team inspired jersey for the modern collector.':'Футболка в стиле сборной Германии для современного коллекционера.',
  'A retro-inspired Bayern collector piece with classic styling.':'Коллекционный ретро-предмет Баварии в классическом стиле.',
  'Minimal premium training top with a modern athletic cut.':'Минималистичный премиальный тренировочный топ современного спортивного кроя.',
  'Example listing for a signed Argentina jersey with certificate and provenance record.':'Пример футболки сборной Аргентины с автографом, сертификатом и информацией о происхождении.',
  'Manchester United shirt signed by Eric Cantona. A unique collectible for football fans and memorabilia collectors. Certificate of authenticity included':'Футболка Manchester United с автографом Эрика Кантона. Уникальный коллекционный предмет для футбольных болельщиков и коллекционеров спортивной меморабилии. Сертификат подлинности входит в комплект.'
};

const categoryRu:Record<string,string>={
  Shirts:'Футболки',
  Boots:'Бутсы',
  Balls:'Мячи',
  'Boxing Gloves':'Боксерские перчатки',
  Tennis:'Теннис',
  UFC:'UFC'
};

function toneFor(category:string,name:string){
  if(/Barcelona/i.test(name)) return 'barca';
  if(/Liverpool|Bayern|Manchester United/i.test(name)) return 'red';
  if(/Training/i.test(name)) return 'black';
  return 'white';
}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const p=await prisma.product.findUnique({where:{slug}});
  if(!p || !p.active) notFound();

  const tone=toneFor(p.category,p.name);
  const price=p.priceCents/100;
  const ruName=p.nameRu||legacyRuNames[p.name]||p.name;
  const ruDescription=p.descriptionRu||legacyRuDescriptions[p.description]||(p.name==='Eric Cantona Signed Manchester United Shirt'?'Футболка Manchester United с автографом Эрика Кантона. Уникальный коллекционный предмет для футбольных болельщиков и коллекционеров спортивной меморабилии. Сертификат подлинности входит в комплект.':p.description);

  return <PageShell><main className="section">
    <div className="productDetailGrid">
      <div className={'productVisual '+tone}>
        {p.imageUrl?<ProductGallery images={[p.imageUrl,...(p.imageUrls||[])]} alt={p.name} badge={p.type==='SIGNED'?<span className="badge"><LanguageText en="SIGNED" ru="С АВТОГРАФОМ"/></span>:null}/>:<><span className="shirtMark">{p.club?.slice(0,3).toUpperCase()||'MA'}</span><span className="shirtNumber">{p.type==='SIGNED'?'10':'11'}</span>{p.type==='SIGNED'?<span className="badge"><LanguageText en="SIGNED" ru="С АВТОГРАФОМ"/></span>:null}</>}
      </div>
      <div>
        <p className="eyebrow"><LanguageText en="PRODUCT" ru="ТОВАР"/></p>
        <h1 style={{font:'normal 52px Georgia,serif'}}><LanguageText en={p.name} ru={ruName}/></h1>
        <p className="lead"><LanguageText en={p.description} ru={ruDescription}/></p>
        <h2>€{price.toFixed(2)}</h2>
        <p style={{color:'#777'}}><LanguageText en="Category: " ru="Категория: "/><LanguageText en={p.category} ru={categoryRu[p.category]||p.category}/></p>
        {p.player&&<p style={{color:'#777'}}><LanguageText en="Player: " ru="Игрок: "/>{p.player}</p>}
        {p.club&&<p style={{color:'#777'}}><LanguageText en="Club / Team: " ru="Клуб / Сборная: "/>{p.club}</p>}
        {p.season&&<p style={{color:'#777'}}><LanguageText en="Season: " ru="Сезон: "/>{p.season}</p>}
        <p style={{color:'#777'}}><LanguageText en="Sizes: " ru="Размеры: "/>{p.sizes?.join(' / ')||<LanguageText en="One size" ru="Единый размер"/>}</p>
        {p.certificateId&&<p style={{color:'#777'}}><LanguageText en="Certificate ID: " ru="ID сертификата: "/>{p.certificateId}</p>}
        <AddToCartButton product={{id:p.id,name:p.name,nameRu:ruName,slug:p.slug,priceCents:p.priceCents,currency:p.currency,imageUrl:p.imageUrl}}/>
      </div>
    </div>
  </main></PageShell>
}
