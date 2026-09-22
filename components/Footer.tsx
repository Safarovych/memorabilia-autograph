'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function Footer(){
  const {language}=useLanguage(); const ru=language==='ru';
  return <footer className="premiumFooter">
    <div className="premiumFooterBrand"><span className="premiumLogoMark">MA</span><strong>MEMORABILIA AUTOGRAPH</strong><small>{ru?'АУТЕНТИЧНЫЕ ФУТБОЛЬНЫЕ РЕЛИКВИИ':'AUTHENTIC SPORTS MEMORABILIA'}</small></div>
    <div className="premiumFooterNav"><Link href="/">{ru?'Главная':'Home'}</Link><Link href="/shop">{ru?'Магазин':'Shop'}</Link><Link href="/#about">{ru?'О нас':'About'}</Link><Link href="/shop?category=Signed">{ru?'Подлинность':'Authenticity'}</Link><Link href="/#contact">{ru?'Контакты':'Contact'}</Link></div>
    <div className="premiumFooterSocial">◎ &nbsp; f &nbsp; ▶ &nbsp; 𝕏</div>
    <div className="premiumFooterBottom"><span>© 2026 Memorabilia Autograph. {ru?'Все права защищены.':'All rights reserved.'}</span><span><Link href="#">{ru?'Политика конфиденциальности':'Privacy Policy'}</Link> &nbsp; {ru?'Условия':'Terms & Conditions'} &nbsp; {ru?'Доставка':'Shipping'} &nbsp; {ru?'Выходные данные':'Imprint'}</span></div>
  </footer>
}