'use client';

import Link from 'next/link';
import { ArrowIcon, HeartIcon } from './Icon';
import { useLanguage } from './LanguageProvider';

const catsEn=['Shirts','Boots','Balls','Boxing Gloves','Tennis','UFC'];
const catsRu=['Футболки','Бутсы','Мячи','Боксерские перчатки','Теннис','UFC'];

export default function Site() {
  const {language}=useLanguage(); const ru=language==='ru';
  const lots=[
    [ru?'Криштиану Роналду':'Cristiano Ronaldo',ru?'Реал Мадрид — футболка с автографом':'Real Madrid — Signed Jersey','€ 4,250','ronaldo-signed-portugal-jersey','white','7'],
    [ru?'Эрик Кантона':'Eric Cantona',ru?'Манчестер Юнайтед — футболка с автографом':'Manchester United — Signed Jersey','€ 3,180','zidane-signed-france-jersey','red','7'],
    [ru?'Килиан Мбаппе':'Kylian Mbappé',ru?'Игровые бутсы с автографом':'Match Worn Boots — Signed','€ 6,700','messi-signed-argentina-jersey','gold',''],
    [ru?'Неймар-младший':'Neymar Jr.',ru?'Барселона — футболка с автографом':'FC Barcelona — Signed Jersey','€ 2,950','pele-signed-brazil-jersey','barca','11']
  ];
  const cats=ru?catsRu:catsEn;
  return <main className="premiumHome">
    <section className="premiumHero" aria-label={ru?'Главный баннер коллекции':'Main collection banner'}>
      <div className="heroImageLinks" aria-label={ru?'Навигация баннера':'Hero navigation'}>
        <Link className="heroHotspot heroHotspotShop" href="/shop" aria-label={ru?'Открыть коллекцию':'Open collection'} />
        <Link className="heroHotspot heroHotspotCollection" href="/shop" aria-label={ru?'Открыть коллекцию':'Open collection'} />
      </div>
    </section>
    <section className="categoryStrip">{cats.map((name,i)=><Link href="/shop" key={name}><b>{['👕','👟','⚽','▣','▤','⌁'][i]}</b><span>{name}</span></Link>)}</section>
    <section className="lightSection" id="about"><div className="premiumSectionHead"><div><p className="goldEyebrow">{ru?"КОЛЛЕКЦИЯ":"COLLECTION"}</p><h2>{ru?"ФУТБОЛЬНАЯ ИСТОРИЯ":"FOOTBALL HISTORY"}</h2></div><Link href="/shop">{ru?"Смотреть коллекцию":"View collection"} <ArrowIcon/></Link></div><p className="heroLead">{ru?"Подписанные футболки, бутсы, мячи и коллекционные предметы.":"Signed jerseys, boots, balls and collectible football memorabilia."}</p></section>
    <section className="shopCollection"><div className="collectionIntro"><p className="goldEyebrow">{ru?'МАГАЗИН КОЛЛЕКЦИИ':'SHOP THE COLLECTION'}</p><h2>{ru?<>ЛУЧШАЯ МЕМОРAБИЛИЯ<br/>В ОДНОМ МЕСТЕ</>:<>THE BEST MEMORABILIA<br/>IN ONE PLACE</>}</h2><p>{ru?'Эксклюзивная коллекция футболок, бутс, мячей и других предметов с автографами. Владейте частью футбольной истории.':'Browse our exclusive collection of signed jerseys, boots, shirts and more. Own a piece of football history.'}</p><Link className="darkBtn" href="/shop">{ru?'СМОТРЕТЬ ВСЕ ТОВАРЫ':'SHOP ALL PRODUCTS'} <ArrowIcon/></Link></div><div className="collectionTiles">{[['Shirts','shirt'],['Boots','boots'],['Tennis','tennis'],['UFC','ufc']].map(([name,kind],i)=><Link className="collectionTile" href="/shop" key={name}><div className={'tileVisual '+kind}></div><strong>{ru?['Футболки','Бутсы','Теннис','UFC'][i]:name}</strong><span>{ru?'Смотреть →':'Shop now →'}</span></Link>)}</div></section>
    <section className="serviceBar"><div><b>♧</b><span><strong>{ru?'Гарантия подлинности':'Authenticity Guaranteed'}</strong>{ru?'Сертификаты и видео-подтверждение':'Certificates & video proof'}</span></div><div><b>▱</b><span><strong>{ru?'Доставка по всему миру':'Worldwide Shipping'}</strong>{ru?'Безопасная доставка':'Safe & insured delivery'}</span></div><div><b>◇</b><span><strong>{ru?'Безопасная оплата':'Secure Payments'}</strong>{ru?'Защищённое соединение SSL':'SSL encrypted'}</span></div><div><b>♧</b><span><strong>{ru?'Поддержка':'Support & Help'}</strong>{ru?'Мы всегда готовы помочь':'We\'re here for you'}</span></div></section>
  </main>;
}
