'use client';

import Link from 'next/link';
import { ArrowIcon, HeartIcon } from './Icon';
import { useLanguage } from './LanguageProvider';

const catsEn=['Shirts','Boots','Balls','Boxing Gloves','Tennis','UFC','Formula 1','Basketball'];
const catsRu=['Футболки','Бутсы','Мячи','Боксерские перчатки','Теннис','UFC','Formula 1','Баскетбол'];

export default function Site() {
  const {language}=useLanguage(); const ru=language==='ru';
  const lots=[
    [ru?'Криштиану Роналду':'Cristiano Ronaldo',ru?'Реал Мадрид — футболка с автографом':'Real Madrid — Signed Jersey','€ 4,250','ronaldo-signed-portugal-jersey','white','7'],
    [ru?'Эрик Кантона':'Eric Cantona',ru?'Манчестер Юнайтед — футболка с автографом':'Manchester United — Signed Jersey','€ 3,180','zidane-signed-france-jersey','red','7'],
    [ru?'Килиан Мбаппе':'Kylian Mbappé',ru?'Игровые бутсы с автографом':'Match Worn Boots — Signed','€ 6,700','messi-signed-argentina-jersey','gold',''],
    [ru?'Неймар-младший':'Neymar Jr.',ru?'Барселона — футболка с автографом':'FC Barcelona — Signed Jersey','€ 2,950','pele-signed-brazil-jersey','barca','11']
  ];
  const cats=ru?catsRu:catsEn;
  const catIds=['shirts','boots','balls','boxing-gloves','tennis','ufc','formula-1','basketball'];
  return <main className="premiumHome">
    <section className="premiumHero" aria-label={ru?'Главный баннер коллекции':'Main collection banner'}>
      <div className="heroImageLinks" aria-label={ru?'Навигация баннера':'Hero navigation'}>
        <Link className="heroHotspot heroHotspotShop" href="/shop" aria-label={ru?'Открыть коллекцию':'Open collection'} />
        <Link className="heroHotspot heroHotspotCollection" href="/shop" aria-label={ru?'Открыть коллекцию':'Open collection'} />
      </div>
    </section>
    <section className="categoryStrip">{cats.map((name,i)=>(<Link href={`/shop#${catIds[i]}`} key={name} className="categoryPhotoCard"><span className={`categoryPhoto categoryPhoto-${i}`}></span><b>{name}</b></Link>))}</section>
    <section className="lightSection aboutSection" id="about"><div className="premiumSectionHead"><div><p className="goldEyebrow">{ru?"О НАС":"ABOUT US"}</p><h2>{ru?"МЫ СОХРАНЯЕМ СПОРТИВНУЮ ИСТОРИЮ":"WE PRESERVE SPORTS HISTORY"}</h2></div></div><div className="aboutCopy"><p className="aboutLead">{ru?"Мы создаём место для тех, кто по-настоящему ценит спортивную историю.":"We create a place for people who truly value sports history."}</p><p>{ru?"Для нас каждый предмет — это не просто товар. За каждой футболкой, бутсами, мячом или другим предметом стоит история, имя и момент, который хочется сохранить.":"For us, every piece is more than a product. Behind every jersey, pair of boots, ball or collectible is a story, a name and a moment worth preserving."}</p><p>{ru?"Мы строим свою работу на простом принципе — честность и подтверждённая подлинность. Мы стремимся предоставить подтверждение происхождения и подлинности каждого предмета, чтобы вы понимали, что именно приобретаете и чем пополняете свою коллекцию.":"Our work is built on a simple principle — honesty and verified authenticity. We strive to provide evidence of provenance and authenticity for every piece, so you know exactly what you are acquiring and adding to your collection."}</p><p>{ru?"Мы работаем прежде всего для вас.":"We work first and foremost for you."}</p><p>{ru?"Мы понимаем, что покупка спортивной меморабилии — это не обычная покупка. Для коллекционера это часть истории, эмоций и личной ценности. Поэтому мы бережно относимся к каждому предмету и с особым вниманием — к каждой продаже и каждому клиенту.":"We understand that buying sports memorabilia is not an ordinary purchase. For a collector, it is part of history, emotion and personal value. That is why we treat every piece with care and every sale and customer with special attention."}</p><p>{ru?"Для нас важно не просто продать предмет, а сделать так, чтобы вы доверяли нам сегодня и хотели вернуться к нам снова.":"For us, it is not simply about making a sale, but about earning your trust today and giving you a reason to return."}</p><p className="aboutClosing"><strong>{ru?"Ваша коллекция — наша ответственность.":"Your collection — our responsibility."}</strong></p><p className="aboutTagline">{ru?"MEMORABILIA AUTOGRAPH — сохраняем спортивную историю для вас.":"MEMORABILIA AUTOGRAPH — preserving sports history for you."}</p></div></section>
    <section className="shopCollection"><div className="collectionIntro"><p className="goldEyebrow">{ru?'МАГАЗИН КОЛЛЕКЦИИ':'SHOP THE COLLECTION'}</p><h2>{ru?<>ЛУЧШАЯ МЕМОРAБИЛИЯ<br/>В ОДНОМ МЕСТЕ</>:<>THE BEST MEMORABILIA<br/>IN ONE PLACE</>}</h2><p>{ru?'Эксклюзивная коллекция футболок, бутс, мячей и других предметов с автографами. Владейте частью футбольной истории.':'Browse our exclusive collection of signed jerseys, boots, shirts and more. Own a piece of football history.'}</p><Link className="darkBtn" href="/shop">{ru?'СМОТРЕТЬ ВСЕ ТОВАРЫ':'SHOP ALL PRODUCTS'} <ArrowIcon/></Link></div><div className="collectionTiles">{[['Shirts','shirt'],['Boots','boots'],['Tennis','tennis'],['UFC','ufc']].map(([name,kind],i)=><Link className="collectionTile" href="/shop" key={name}><div className={'tileVisual '+kind}></div><strong>{ru?['Футболки','Бутсы','Теннис','UFC'][i]:name}</strong><span>{ru?'Смотреть →':'Shop now →'}</span></Link>)}</div></section>
    <section className="serviceBar"><div><b>♧</b><span><strong>{ru?'Гарантия подлинности':'Authenticity Guaranteed'}</strong>{ru?'Сертификаты и видео-подтверждение':'Certificates & video proof'}</span></div><div><b>▱</b><span><strong>{ru?'Доставка по всему миру':'Worldwide Shipping'}</strong>{ru?'Безопасная доставка':'Safe & insured delivery'}</span></div><div><b>◇</b><span><strong>{ru?'Безопасная оплата':'Secure Payments'}</strong>{ru?'Защищённое соединение SSL':'SSL encrypted'}</span></div><div><b>♧</b><span><strong>{ru?'Поддержка':'Support & Help'}</strong>{ru?'Мы всегда готовы помочь':'We\'re here for you'}</span></div></section>
  </main>;
}
