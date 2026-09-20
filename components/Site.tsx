'use client';

import Link from 'next/link';
import { ArrowIcon, HeartIcon } from './Icon';
import { useLanguage } from './LanguageProvider';

const catsEn=['Jerseys','Boots','Shirts','Shorts','Balls','Framed Memorabilia','Trading Cards','Accessories'];
const catsRu=['Футболки','Бутсы','Рубашки','Шорты','Мячи','Меморабилия в рамах','Карточки','Аксессуары'];

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
    <section className="premiumHero">
      <div className="premiumHeroCopy">
        <p className="goldEyebrow">{ru?'ПРЕМИАЛЬНАЯ ФУТБОЛЬНАЯ МЕМОРAБИЛИЯ':'PREMIUM SPORTS MEMORABILIA'}</p>
        <h1>{ru?<>ЛЕГЕНДЫ.<br/>АВТОГРАФЫ.<br/><span>НАСТОЯЩИЕ ИСТОРИИ.</span></>:<>LEGENDS.<br/>AUTOGRAPHS.<br/><span>REAL STORIES.</span></>}</h1>
        <p className="heroLead">{ru?'Оригинальные футболки, бутсы и уникальные футбольные реликвии с автографами величайших игроков.':'Original signed jerseys, boots, shirts and unique memorabilia from the biggest names in football.'}</p>
        <div className="heroButtons"><Link className="goldBtn" href="/shop">{ru?'СМОТРЕТЬ КОЛЛЕКЦИЮ':'EXPLORE COLLECTION'} <ArrowIcon/></Link><Link className="lightBtn" href="/auctions">{ru?'СМОТРЕТЬ АУКЦИОНЫ':'VIEW AUCTIONS'} <ArrowIcon/></Link></div>
        <div className="heroTrust"><div><b>✓</b><span><strong>{ru?'100% подлинность':'100% Authentic'}</strong>{ru?'Проверено экспертами':'Verified by experts'}</span></div><div><b>▱</b><span><strong>{ru?'Доставка по всему миру':'Worldwide Shipping'}</strong>{ru?'Безопасная доставка':'Safe & insured delivery'}</span></div><div><b>♡</b><span><strong>{ru?'Поддержка добрых дел':'Support a Better Future'}</strong>{ru?'Часть средств — на благотворительность':'Part of proceeds to charity'}</span></div></div>
      </div>
      <div className="premiumHeroVisual"><div className="heroFrame"><div className="heroJerseyReal"><small>MESSI</small><strong>10</strong><em>unicef</em><i>✦</i></div><div className="framePlaque">LIONEL MESSI <small>FC BARCELONA • 2019/20</small></div></div><div className="heroSideCard"><p>LIONEL MESSI</p><strong>{ru?'ФУТБОЛКА С АВТОГРАФОМ':'SIGNED JERSEY'}</strong><span>FC Barcelona • 2019/20</span><blockquote>{ru?'«Больше, чем игра.<br/>Часть истории.»':'“More than a game.<br/>A piece of history.”'}</blockquote><Link className="darkBtn" href="/auction/messi-signed-argentina-jersey">{ru?'СМОТРЕТЬ АУКЦИОН':'VIEW AUCTION'} <ArrowIcon/></Link></div><div className="heroPager">← &nbsp; 01 &nbsp; 02 &nbsp; 03 &nbsp; →</div></div>
    </section>
    <section className="categoryStrip">{cats.map((name,i)=><Link href="/shop" key={name}><b>{['👕','👟','👕','▱','⚽','▣','▤','⌁'][i]}</b><span>{name}</span></Link>)}</section>
    <section className="lightSection" id="about"><div className="premiumSectionHead"><div><p className="goldEyebrow">{ru?'ЖИВЫЕ АУКЦИОНЫ':'LIVE AUCTIONS'}</p><h2>{ru?'СТАВКИ НА ЛЕГЕНД':'BID ON ICONS'}</h2></div><Link href="/auctions">{ru?'Все аукционы':'View all auctions'} <ArrowIcon/></Link></div>
      <div className="premiumAuctionGrid">{lots.map(([player,meta,bid,slug,tone,num],i)=><article className="premiumAuctionCard" key={player}><Link href={'/auction/'+slug} className={'premiumCardVisual '+tone}>{i===0&&<span className="hotTag">{ru?'ТОП':'HOT'}</span>}<span className="wish"><HeartIcon/></span><div className="cardKit"><span>{String(player).split(' ')[0].toUpperCase()}</span><b>{num||'10'}</b></div></Link><div className="premiumCardInfo"><h3>{player}</h3><p>{meta}</p><small>{ru?'Текущая ставка':'Current bid'}</small><div className="bidLine"><strong>{bid}</strong><span>◷ {i+2}d {14-i}h {32+i*9}m</span></div><Link href={'/auction/'+slug} className="placeBid">{ru?'СДЕЛАТЬ СТАВКУ':'PLACE BID'} <ArrowIcon/></Link></div></article>)}</div>
    </section>
    <section className="shopCollection"><div className="collectionIntro"><p className="goldEyebrow">{ru?'МАГАЗИН КОЛЛЕКЦИИ':'SHOP THE COLLECTION'}</p><h2>{ru?<>ЛУЧШАЯ МЕМОРAБИЛИЯ<br/>В ОДНОМ МЕСТЕ</>:<>THE BEST MEMORABILIA<br/>IN ONE PLACE</>}</h2><p>{ru?'Эксклюзивная коллекция футболок, бутс, мячей и других предметов с автографами. Владейте частью футбольной истории.':'Browse our exclusive collection of signed jerseys, boots, shirts and more. Own a piece of football history.'}</p><Link className="darkBtn" href="/shop">{ru?'СМОТРЕТЬ ВСЕ ТОВАРЫ':'SHOP ALL PRODUCTS'} <ArrowIcon/></Link></div><div className="collectionTiles">{[['Jerseys','zidane'],['Boots','boots'],['Balls','ball'],['Framed Memorabilia','frame']].map(([name,kind],i)=><Link className="collectionTile" href="/shop" key={name}><div className={'tileVisual '+kind}></div><strong>{ru?['Футболки','Бутсы','Мячи','Меморабилия в рамах'][i]:name}</strong><span>{ru?'Смотреть →':'Shop now →'}</span></Link>)}</div></section>
    <section className="serviceBar" id="charity"><div><b>♧</b><span><strong>{ru?'Гарантия подлинности':'Authenticity Guaranteed'}</strong>{ru?'Сертификаты и видео-подтверждение':'Certificates & video proof'}</span></div><div><b>▱</b><span><strong>{ru?'Доставка по всему миру':'Worldwide Shipping'}</strong>{ru?'Безопасная доставка':'Safe & insured delivery'}</span></div><div><b>◇</b><span><strong>{ru?'Безопасная оплата':'Secure Payments'}</strong>{ru?'Защищённое соединение SSL':'SSL encrypted'}</span></div><div><b>♧</b><span><strong>{ru?'Поддержка':'Support & Help'}</strong>{ru?'Мы всегда готовы помочь':'We\'re here for you'}</span></div></section>
  </main>;
}
