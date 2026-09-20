import Link from 'next/link';
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from './Icon';

export default function Header() {
  return <header className="premiumHeader">
    <Link className="premiumLogo" href="/">
      <span className="premiumLogoMark">MA</span>
      <span><strong>MEMORABILIA AUTOGRAPH</strong><small>AUTHENTIC SPORTS MEMORABILIA</small></span>
    </Link>
    <nav>
      {[['Home','/'],['Shop','/shop'],['Auctions','/auctions'],['About','/#about'],['Authenticity','/shop?category=Signed'],['Charity','/about'],['Contact','/#contact']].map(([label,href])=><Link key={label} href={href}>{label}</Link>)}
    </nav>
    <div className="premiumActions">
      <Link href="/shop" aria-label="Search"><SearchIcon/></Link>
      <Link href="/login" aria-label="Account"><UserIcon/></Link>
      <Link href="/shop" aria-label="Wishlist"><HeartIcon/></Link>
      <Link href="/cart" aria-label="Cart" className="cartAction"><BagIcon/><b>0</b></Link>
      <span className="language">🇬🇧 EN⌄</span>
    </div>
  </header>;
}
