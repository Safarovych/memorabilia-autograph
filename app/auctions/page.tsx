import Link from 'next/link';
import PageShell from '../../components/PageShell';
import LanguageText from '../../components/LanguageText';
import { auctions } from '../../lib/catalog';

const items: Record<string,string> = {
  'Signed Argentina Jersey':'Футболка Аргентины с автографом',
  'Signed Portugal Jersey':'Футболка Португалии с автографом',
  'Signed France Jersey':'Футболка Франции с автографом',
  'Signed Brazil Jersey':'Футболка Бразилии с автографом'
};

export default function Auctions(){
  return <PageShell>
    <main className="auctionSection">
      <div className="sectionHead">
        <div>
          <p className="eyebrow"><LanguageText en="LIVE / AUCTIONS" ru="СЕЙЧАС / АУКЦИОНЫ"/></p>
          <h2><LanguageText en="SIGNED LEGENDS" ru="ЛЕГЕНДЫ С АВТОГРАФАМИ"/></h2>
          <p><LanguageText en="Rare football pieces with a story." ru="Редкие футбольные реликвии с историей."/></p>
        </div>
      </div>
      <div className="auctionGrid">
        {auctions.map(a =>
          <article className="auctionCard" key={a.slug}>
            <Link href={'/auction/'+a.slug} className={'auctionVisual '+a.tone}>
              <span className="liveBadge"><LanguageText en="LIVE" ru="В ЭФИРЕ"/></span>
              <span className="auctionName">{a.player.toUpperCase()}</span>
              <span className="auctionNumber">{a.mark}</span>
            </Link>
            <div className="auctionInfo">
              <h3>{a.player}</h3>
              <p><LanguageText en={a.item} ru={items[a.item]||a.item}/> • {a.bids} <LanguageText en="bids" ru="ставок"/></p>
              <div className="bidRow">
                <div><span><LanguageText en="CURRENT BID" ru="ТЕКУЩАЯ СТАВКА"/></span><strong>€{a.bid.toLocaleString('de-DE')}</strong></div>
                <div><span><LanguageText en="ENDS" ru="ОКОНЧАНИЕ"/></span><strong>{new Date(a.endsAt).toLocaleDateString('ru-RU')}</strong></div>
              </div>
              <Link className="bidBtn" href={'/auction/'+a.slug}><LanguageText en="VIEW LOT" ru="СМОТРЕТЬ ЛОТ"/></Link>
            </div>
          </article>
        )}
      </div>
    </main>
  </PageShell>
}