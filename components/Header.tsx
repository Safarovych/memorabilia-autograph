'use client';

import Link from 'next/link';
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from './Icon';
import { useLanguage } from './LanguageProvider';

export default function Header() {
  const {language,setLanguage}=useLanguage();
  const ru=language==='ru';
  const nav=ru
    ? [['Главная','/'],['Магазин','/shop'],['Аукционы','/auctions'],['О нас','/#about'],['Подлинность','/shop?category=Signed'],['Благотворительность','/#charity'],['Контакты','/#contact']]
    : [['Home','/'],['Shop','/shop'],['Auctions','/auctions'],['About','/#about'],['Authenticity','/shop?category=Signed'],['Charity','/#charity'],['Contact','/#contact']];
  return <header className="premiumHeader">
    <Link className="premiumLogo" href="/"><span className="premiumLogoMark">MA</span><span><strong>MEMORABILIA AUTOGRAPH</strong><small>{ru?'АУТЕНТИЧНЫЕ ФУТБОЛЬНЫЕ РЕЛИКВИИ':'AUTHENTIC SPORTS MEMORABILIA'}</small></span></Link>
    <nav>{nav.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</nav>
    <div className="premiumActions">
      <Link href="/shop" aria-label={ru?'Поиск':'Search'}><SearchIcon/></Link>
      <Link href="/login" aria-label={ru?'Аккаунт':'Account'}><UserIcon/></Link>
      <Link href="/shop" aria-label={ru?'Избранное':'Wishlist'}><HeartIcon/></Link>
      <Link href="/cart" aria-label={ru?'Корзина':'Cart'} className="cartAction"><BagIcon/><b>0</b></Link>
      <div className="languageSwitch"><button className={language==='ru'?'active':''} onClick={()=>setLanguage('ru')}>RU</button><span>/</span><button className={language==='en'?'active':''} onClick={()=>setLanguage('en')}>EN</button></div>
    </div>
  </header>;
}
