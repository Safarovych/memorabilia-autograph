import Link from 'next/link';
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from './Icon';

export default function Header() {
  return (
    <>
      <div className="topline">
        <div>EN · EUR</div>
        <div>Worldwide shipping • Collector support</div>
      </div>
      <header className="header">
        <Link className="logoWrap" href="/">
          <div className="logoMark">MA</div>
          <div className="logoText">MEMORABILIA AUTOGRAPH<span>FOOTBALL • SIGNED • COLLECTIBLE</span></div>
        </Link>
        <nav>
          {[['SHOP', '/shop'], ['AUCTIONS', '/auctions'], ['SIGNED', '/shop?category=Signed'], ['CLUBS', '/shop'], ['PLAYERS', '/shop'], ['LEGENDS', '/auctions'], ['ABOUT', '/#about']].map(([label, href]) => (
            <Link key={label} href={href}>{label}</Link>
          ))}
        </nav>
        <div className="actions">
          <Link href="/shop" aria-label="Search"><SearchIcon /></Link>
          <Link href="/login" aria-label="Account"><UserIcon /></Link>
          <Link href="/shop" aria-label="Wishlist"><HeartIcon /></Link>
          <Link href="/cart" aria-label="Cart"><BagIcon /></Link>
        </div>
      </header>
    </>
  );
}
