import Link from 'next/link';

export default function Footer(){
  return <footer className="premiumFooter">
    <div className="premiumFooterBrand"><span className="premiumLogoMark">MA</span><strong>MEMORABILIA AUTOGRAPH</strong><small>AUTHENTIC SPORTS MEMORABILIA</small></div>
    <div className="premiumFooterNav"><Link href="/">Home</Link><Link href="/shop">Shop</Link><Link href="/auctions">Auctions</Link><Link href="/#about">About</Link><Link href="/shop?category=Signed">Authenticity</Link><Link href="/about">Charity</Link><Link href="/#contact">Contact</Link></div>
    <div className="premiumFooterSocial">◎ &nbsp; f &nbsp; ▶ &nbsp; 𝕏</div>
    <div className="premiumFooterBottom"><span>© 2026 Memorabilia Autograph. All rights reserved.</span><span><Link href="#">Privacy Policy</Link> &nbsp; Terms & Conditions &nbsp; Shipping &nbsp; Imprint</span></div>
  </footer>
}
