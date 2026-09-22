import Link from 'next/link';
import PageShell from '../../components/PageShell';
import LanguageText from '../../components/LanguageText';
import { prisma } from '../../lib/prisma';

export const dynamic = 'force-dynamic';

const names:Record<string,string>={
  'Real Madrid Home Jersey':'Домашняя футболка Реал Мадрид',
  'FC Barcelona Home Jersey':'Домашняя футболка Барселоны',
  'Liverpool Home Jersey':'Домашняя футболка Ливерпуля',
  'Germany Home Jersey':'Футболка Германии',
  'Bayern Retro Jersey':'Ретро-футболка Баварии',
  'Elite Black Training Top':'Чёрный тренировочный топ',
  'Lionel Messi Signed Argentina Jersey':'Футболка Аргентины с автографом Лионеля Месси'
};

const categories=[
  {id:'shirts',key:'Shirts',en:'FOOTBALL SHIRTS',ru:'ФУТБОЛЬНЫЕ ФУТБОЛКИ'},
  {id:'boots',key:'Boots',en:'BOOTS',ru:'БУТСЫ'},
  {id:'balls',key:'Balls',en:'BALLS',ru:'МЯЧИ'},
  {id:'boxing-gloves',key:'Boxing Gloves',en:'BOXING GLOVES',ru:'БОКСЕРСКИЕ ПЕРЧАТКИ'},
  {id:'tennis',key:'Tennis',en:'TENNIS',ru:'ТЕННИС'},
  {id:'ufc',key:'UFC',en:'UFC',ru:'UFC'}
] as const;

function toneFor(category:string,name:string){
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
  return <article className="productCard">
    <Link href={'/product/'+p.slug} className={'productVisual '+tone}>
      {p.imageUrl?<img src={p.imageUrl} alt={p.name} className="productCardImage"/>:<><span className="shirtMark">{markFor(p)}</span><span className="shirtNumber">{p.type==='SIGNED'?'10':'11'}</span></>}
      {p.type==='SIGNED'?<span className="badge">SIGNED</span>:null}
    </Link>
    <div className="productInfo">
      <div><h3><LanguageText en={p.name} ru={names[p.name]||p.name}/></h3><p>{metaFor(p)}</p></div>
      <strong>{p.priceCents>0?'€'+(p.priceCents/100).toFixed(2):'CONTACT'}</strong>
    </div>
  </article>;
}

export default async function Shop({searchParams}:{searchParams?:Promise<{category?:string}>}){
  const params=searchParams?await searchParams:{};
  const signedOnly=params.category?.toLowerCase()==='signed';
  const products=await prisma.product.findMany({
    where:{active:true,...(signedOnly?{type:'SIGNED'}:{})},
    orderBy:{createdAt:'desc'}
  });

  return <PageShell>
    <main className="section shopPage">
      <div className="sectionHead"><div>
        <p className="eyebrow"><LanguageText en="SHOP / COLLECTION" ru="МАГАЗИН / КОЛЛЕКЦИЯ"/></p>
        <h2><LanguageText en={signedOnly?'SIGNED MEMORABILIA':'SPORTS MEMORABILIA'} ru={signedOnly?'МЕМОРAБИЛИЯ С АВТОГРАФАМИ':'СПОРТИВНАЯ МЕМОРAБИЛИЯ'}/></h2>
        <p><LanguageText en="Choose a category to browse authenticated sports memorabilia." ru="Выберите подраздел, чтобы посмотреть спортивную меморабилию с подтверждённой подлинностью."/></p>
      </div></div>

      {!signedOnly&&<nav className="shopCategoryNav" aria-label="Shop categories">
        {categories.map(c=><a key={c.id} href={'#'+c.id}><LanguageText en={c.en} ru={c.ru}/></a>)}
      </nav>}

      {signedOnly ? (
        <section className="shopCategorySection" id="signed">
          <div className="shopCategoryHead"><div><p className="eyebrow"><LanguageText en="AUTHENTICITY" ru="ПОДЛИННОСТЬ"/></p><h2><LanguageText en="SIGNED MEMORABILIA" ru="МЕМОРAБИЛИЯ С АВТОГРАФАМИ"/></h2></div><span className="shopCategoryCount">{products.length}</span></div>
          {products.length>0?<div className="productGrid">{products.map(p=><ProductCard key={p.id} p={p}/>)}</div>:<div className="shopEmpty"><h3><LanguageText en="COMING SOON" ru="СКОРО В КОЛЛЕКЦИИ"/></h3><p><LanguageText en="No signed pieces are currently published." ru="Сейчас нет опубликованных предметов с автографами."/></p></div>}
        </section>
      ) : categories.map(c=>{
        if(c.key==='Shirts'){
          const subcategories=[
            {id:'shirts-legends',key:'Legends',en:'LEGENDS',ru:'ЛЕГЕНДЫ'},
            {id:'shirts-clubs',key:'Clubs',en:'CLUBS',ru:'КЛУБЫ'},
            {id:'shirts-national-teams',key:'National Teams',en:'NATIONAL TEAMS',ru:'СБОРНЫЕ'}
          ];
          return <section className="shopCategorySection" id={c.id} key={c.id}>
            <div className="shopCategoryHead"><div><p className="eyebrow"><LanguageText en="CATEGORY" ru="КАТЕГОРИЯ"/></p><h2><LanguageText en={c.en} ru={c.ru}/></h2></div><span className="shopCategoryCount">{products.filter(p=>p.category===c.key).length}</span></div>
            <nav className="shopSubcategoryNav" aria-label="Shirt subcategories">{subcategories.map(s=><a key={s.id} href={'#'+s.id}><LanguageText en={s.en} ru={s.ru}/></a>)}</nav>
            {subcategories.map(s=>{
              const items=products.filter(p=>p.category===c.key&&p.subcategory===s.key);
              return <div className="shopSubcategory" id={s.id} key={s.id}>
                <div className="shopSubcategoryHead"><h3><LanguageText en={s.en} ru={s.ru}/></h3><span>{items.length}</span></div>
                {items.length>0?<div className="productGrid">{items.map(p=><ProductCard key={p.id} p={p}/>)}</div>:<div className="shopEmpty"><h3><LanguageText en="COMING SOON" ru="СКОРО В КОЛЛЕКЦИИ"/></h3><p><LanguageText en="New pieces for this shirt collection will be added here." ru="Новые предметы этой коллекции футболок появятся здесь."/></p></div>}
              </div>;
            })}
          </section>;
        }
        const items=products.filter(p=>p.category===c.key);
        return <section className="shopCategorySection" id={c.id} key={c.id}>
          <div className="shopCategoryHead"><div><p className="eyebrow"><LanguageText en="CATEGORY" ru="ПОДРАЗДЕЛ"/></p><h2><LanguageText en={c.en} ru={c.ru}/></h2></div><span className="shopCategoryCount">{items.length}</span></div>
          {items.length>0?<div className="productGrid">{items.map(p=><ProductCard key={p.id} p={p}/>)}</div>:<div className="shopEmpty"><h3><LanguageText en="COMING SOON" ru="СКОРО В КОЛЛЕКЦИИ"/></h3><p><LanguageText en="This category is prepared for new memorabilia and will be updated with available pieces." ru="Этот подраздел уже подготовлен и будет пополняться новыми предметами коллекции."/></p></div>}
        </section>;
      })}
    </main>
  </PageShell>
}