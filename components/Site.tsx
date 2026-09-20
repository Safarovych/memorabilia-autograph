import Link from 'next/link';
import { ArrowIcon, HeartIcon } from './Icon';

const categories = [
  ['Jerseys','👕'],['Boots','👟'],['Shirts','👕'],['Shorts','▱'],
  ['Balls','⚽'],['Framed Memorabilia','▣'],['Trading Cards','▤'],['Accessories','⌁']
];

export default function Site() {
  const lots = [
    ['Cristiano Ronaldo','Real Madrid — Signed Jersey','€ 4,250','ronaldo-signed-portugal-jersey','white','7'],
    ['Eric Cantona','Manchester United — Signed Jersey','€ 3,180','zidane-signed-france-jersey','red','7'],
    ['Kylian Mbappé','Match Worn Boots — Signed','€ 6,700','messi-signed-argentina-jersey','gold',''],
    ['Neymar Jr.','FC Barcelona — Signed Jersey','€ 2,950','pele-signed-brazil-jersey','barca','11']
  ];
  return <main className="premiumHome">
    <section className="premiumHero">
      <div className="premiumHeroCopy">
        <p className="goldEyebrow">PREMIUM SPORTS MEMORABILIA</p>
        <h1>LEGENDS.<br/>AUTOGRAPHS.<br/><span>REAL STORIES.</span></h1>
        <p className="heroLead">Original signed jerseys, boots, shirts and unique memorabilia from the biggest names in football.</p>
        <div className="heroButtons">
          <Link className="goldBtn" href="/shop">EXPLORE COLLECTION <ArrowIcon/></Link>
          <Link className="lightBtn" href="/auctions">VIEW AUCTIONS <ArrowIcon/></Link>
        </div>
        <div className="heroTrust">
          <div><b>✓</b><span><strong>100% Authentic</strong>Verified by experts</span></div>
          <div><b>▱</b><span><strong>Worldwide Shipping</strong>Safe & insured delivery</span></div>
          <div><b>♡</b><span><strong>Support a Better Future</strong>Part of proceeds to charity</span></div>
        </div>
      </div>
      <div className="premiumHeroVisual">
        <div className="heroFrame">
          <div className="heroJerseyReal"><small>MESSI</small><strong>10</strong><em>unicef</em><i>✦</i></div>
          <div className="framePlaque">LIONEL MESSI <small>FC BARCELONA • 2019/20</small></div>
        </div>
        <div className="heroSideCard">
          <p>LIONEL MESSI</p><strong>SIGNED JERSEY</strong><span>FC Barcelona • 2019/20</span>
          <blockquote>“More than a game.<br/>A piece of history.”</blockquote>
          <Link className="darkBtn" href="/auction/messi-signed-argentina-jersey">VIEW AUCTION <ArrowIcon/></Link>
        </div>
        <div className="heroPager">← &nbsp; 01 &nbsp; 02 &nbsp; 03 &nbsp; →</div>
      </div>
    </section>
    <section className="categoryStrip">{categories.map(([name,icon]) => <Link href="/shop" key={name}><b>{icon}</b><span>{name}</span></Link>)}</section>
    <section className="lightSection">
      <div className="premiumSectionHead"><div><p className="goldEyebrow">LIVE AUCTIONS</p><h2>BID ON ICONS</h2></div><Link href="/auctions">View all auctions <ArrowIcon/></Link></div>
      <div className="premiumAuctionGrid">{lots.map(([player,meta,bid,slug,tone,num],i) => <article className="premiumAuctionCard" key={player}>
        <Link href={'/auction/'+slug} className={'premiumCardVisual '+tone}>{i===0 && <span className="hotTag">HOT</span>}<span className="wish"><HeartIcon/></span><div className="cardKit"><span>{player.split(' ')[0].toUpperCase()}</span><b>{num || '10'}</b></div></Link>
        <div className="premiumCardInfo"><h3>{player}</h3><p>{meta}</p><small>Current bid</small><div className="bidLine"><strong>{bid}</strong><span>◷ {i+2}d {14-i}h {32+i*9}m</span></div><Link href={'/auction/'+slug} className="placeBid">PLACE BID <ArrowIcon/></Link></div>
      </article>)}</div>
    </section>
    <section className="shopCollection">
      <div className="collectionIntro"><p className="goldEyebrow">SHOP THE COLLECTION</p><h2>THE BEST MEMORABILIA<br/>IN ONE PLACE</h2><p>Browse our exclusive collection of signed jerseys, boots, shirts and more. Own a piece of football history.</p><Link className="darkBtn" href="/shop">SHOP ALL PRODUCTS <ArrowIcon/></Link></div>
      <div className="collectionTiles">{[['Jerseys','zidane'],['Boots','boots'],['Balls','ball'],['Framed Memorabilia','frame']].map(([name,kind])=><Link className="collectionTile" href="/shop" key={name}><div className={'tileVisual '+kind}></div><strong>{name}</strong><span>Shop now →</span></Link>)}</div>
    </section>
    <section className="serviceBar">
      <div><b>♧</b><span><strong>Authenticity Guaranteed</strong>Certificates & video proof</span></div><div><b>▱</b><span><strong>Worldwide Shipping</strong>Safe & insured delivery</span></div><div><b>◇</b><span><strong>Secure Payments</strong>SSL encrypted</span></div><div><b>♧</b><span><strong>Support & Help</strong>We're here for you</span></div>
    </section>
  </main>;
}
