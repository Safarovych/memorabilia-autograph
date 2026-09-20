import Link from 'next/link';
import PageShell from '../../components/PageShell';
import LanguageText from '../../components/LanguageText';
import { prisma } from '../../lib/prisma';

export const dynamic = 'force-dynamic';

const names:Record<string,string>={
  'Real Madrid Home Jersey':'Домашняя футболка Реал Мадрид',
  'FC Barcelona Home Jersey':'Домашняя футболка Барселоны',
  'Liverpool Home Jersey':'Домашняя футболка Ливерпуля',
  'Germany Home Jersey':'Домашняя футболка Германии',
  'Bayern Retro Jersey':'Ретро-футболка Баварии',
  'Elite Black Training Top':'Чёрный тренировочный топ',
  'Legends Collector Scarf':'Коллекционный шарф Legends',
  'Lionel Messi Signed Argentina Jersey':'Футболка Аргентины с автографом Лионеля Месси'
};

const categories=[
  {id:'shirts',key:'Shirts',en:'FOOTBALL SHIRTS',ru:'ФУТБОЛЬНЫЕ ФУТБОЛКИ'},
  {id:'boots',key:'Boots',en:'BOOTS',ru:'БУТСЫ'},
  {id:'shorts',key:'Shorts',en:'SHORTS',ru:'ШОРТЫ'},
  {id:'balls',key:'Balls',en:'BALLS',ru:'МЯЧИ'},
  {id:'scarves',key:'Scarves',en:'SCARVES',ru:'ШАРФЫ'},
  {id:'armbands',key:'Armbands',en:'ARMBANDS',ru:'ПОВЯЗКИ'}
] as const;

function toneFor(category:string,name:string){
  if(category==='Scarves') return 'gold';
  if(/Barcelona/i.test(name)) return 'barca';
  if(/Liverpool|Bayern/i.test(name)) return 'red';
  if(/Training/i.test(name)) return 'black';
  return 'white';
}

function metaFor(p:any){
  const bits=[p.season,p.player?'SIGNED':null].filter(Boolean);
  return bits.length?bits.join(' • '):'COLLECTOR EDITION';
}

function markFor(p:any){
  if(p.club) return p.club.split(/\s+/).map((x:string)=>x[0]).join('').slice(0,3).toUpperCase();
  return 'MA';
}

function ProductCard({p}:{p:any}){
  const tone=toneFor(p.category,p.name);
  const image=p.imageUrl;
  return <article className="productCard">
    <Link href={'/product/'+p.slug} className={'productVisual '+tone}>
      {image?<img src={image} alt={p.name} className="productCardImage"/>:<><span className="shirtMark">{markFor(p)}</span><span className="shirtNumber">{p.type==='SIGNED'?'10':'11'}</span></>}
      {p.type==='SIGNED'?<span className="badge">SIGNED</span>:null}
    </Link>
    <div className="productInfo">
      <div><h3><LanguageText en={p.name} ru={names[p.name]||p.name}/></h3><p>{metaFor(p)}</p></div>
      <strong>{p.priceCents>0?'€'+(p.priceCents/100).toFixed(2):'CONTACT'}</strong>
    </div>
  </article>;
}

export default async function Shop(){
  const products=await prisma.product.findMany({where:{active:true},orderBy:{createdAt:'desc'}});
  return <PageShell>
    <main className="section shopPage">
      <div className="sectionHead"><div>
        <p className="eyebrow"><LanguageText en="SHOP / COLLECTION" ru="МАГАЗИН / КОЛЛЕКЦИЯ"/></p>
        <h2><LanguageText en="FOOTBALL COLLECTION" ru="ФУТБОЛЬНАЯ КОЛЛЕКЦИЯ"/></h2>
        <p><LanguageText en="Choose a dedicated category to browse football shirts, boots, shorts, balls, scarves and armbands." ru="Выберите отдельный подраздел: футболки, бутсы, шорты, мячи, шарфы или повязки."/></p>
      </div></div>

      <nav className="shopCategoryNav" aria-label="Shop categories">
        {categories.map(c=><a key={c.id} href={'#'+c.id}><LanguageText en={c.en} ru={c.ru}/></a>)}
      </nav>

      {categories.map(c=>{
        const items=products.filter(p=>p.category===c.key);
        return <section className="shopCategorySection" id={c.id} key={c.id}>
          <div className="shopCategoryHead"><div>
            <p className="eyebrow"><LanguageText en="CATEGORY" ru="ПОДРАЗДЕЛ"/></p>
            <h2><LanguageText en={c.en} ru={c.ru}/></h2>
          </div><span className="shopCategoryCount">{items.length}</span></div>
          {items.length>0?<div className="productGrid">{items.map(p=><ProductCard key={p.id} p={p}/>)}</div>:
            <div className="shopEmpty"><h3><LanguageText en="COMING SOON" ru="СКОРО В КОЛЛЕКЦИИ"/></h3><p><LanguageText en="This category is prepared for new memorabilia and will be updated with available pieces." ru="Этот подраздел уже подготовлен и будет пополняться новыми предметами коллекции."/></p></div>}
        </section>;
      })}
    </main>
  </PageShell>
}
