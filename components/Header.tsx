'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BagIcon, HeartIcon, SearchIcon, UserIcon } from './Icon';
import { useLanguage } from './LanguageProvider';
import { useCart } from './CartProvider';

const categories = [
  ['Shirts','shirts'],['Boots','boots'],['Balls','balls'],['Boxing Gloves','boxing-gloves'],
  ['Tennis','tennis'],['UFC','ufc'],['Formula 1','formula-1'],['Basketball','basketball']
];

export default function Header() {
  const {language,setLanguage}=useLanguage();
  const {count}=useCart();
  const pathname=usePathname();
  const [hash,setHash]=useState('');
  const [menuOpen,setMenuOpen]=useState(false);
  const [categoriesOpen,setCategoriesOpen]=useState(false);
  const ru=language==='ru';

  useEffect(()=>{
    const updateHash=()=>setHash(window.location.hash);
    updateHash();
    window.addEventListener('hashchange',updateHash);
    return ()=>window.removeEventListener('hashchange',updateHash);
  },[]);

  const nav=ru
    ? [['Главная','/'],['Магазин','/shop'],['О нас','/#about'],['Подлинность','/shop?category=Signed'],['Контакты','/#contact']]
    : [['Home','/'],['Shop','/shop'],['About','/#about'],['Authenticity','/shop?category=Signed'],['Contact','/#contact']];

  const isActive=(href:string)=>{
    if(href.includes('#')) return pathname==='/' && hash===href.substring(href.indexOf('#'));
    return pathname===href;
  };

  return <header className={'premiumHeader '+(pathname==='/'?'premiumHeaderHero ':'')+(menuOpen?'menuOpen':'')}>
    <Link className="premiumLogo" href="/" aria-label="Memorabilia Autograph">
      <img className="premiumLogoImage" src="/logo-memorabilia.png" alt="Memorabilia Autograph" />
    </Link>
    <button className="mobileMenuButton" type="button" aria-label={menuOpen?(ru?'Закрыть меню':'Close menu'):(ru?'Открыть меню':'Open menu')} aria-expanded={menuOpen} onClick={()=>setMenuOpen(v=>!v)}>
      <span></span><span></span><span></span>
    </button>
    <nav onClick={()=>setMenuOpen(false)}>
      {nav.slice(0,2).map(([label,href])=><Link key={label} href={href} className={isActive(href)?'active':''}>{label}</Link>)}
      <div className="navDropdown">
        <button type="button" className={pathname.startsWith('/category/')?'active':''} onClick={()=>setCategoriesOpen(v=>!v)}>
          {ru?'Категории':'Categories'} <span className="navChevron">⌄</span>
        </button>
        {categoriesOpen && <div className="navDropdownMenu">
          {categories.map(([label,slug])=><Link key={slug} href={`/category/${slug}`} onClick={()=>setCategoriesOpen(false)}>{ru?({shirts:'Футболки',boots:'Бутсы',balls:'Мячи','boxing-gloves':'Боксерские перчатки',tennis:'Теннис',ufc:'UFC','formula-1':'Formula 1',basketball:'Баскетбол'} as Record<string,string>)[slug]||label:label}</Link>)}
        </div>}
      </div>
      {nav.slice(2).map(([label,href])=><Link key={label} href={href} className={isActive(href)?'active':''}>{label}</Link>)}
    </nav>
    <div className="premiumActions">
      <Link href="/shop" aria-label={ru?'Поиск':'Search'}><SearchIcon/></Link>
      <Link href="/login" aria-label={ru?'Аккаунт':'Account'}><UserIcon/></Link>
      <Link href="/shop" aria-label={ru?'Избранное':'Wishlist'}><HeartIcon/></Link>
      <Link href="/cart" aria-label={ru?'Корзина':'Cart'} className="cartAction"><BagIcon/><b>{count}</b></Link>
      <div className="languageSwitch"><button className={language==='ru'?'active':''} onClick={()=>setLanguage('ru')}>RU</button><span>/</span><button className={language==='en'?'active':''} onClick={()=>setLanguage('en')}>EN</button></div>
    </div>
  </header>;
}
