'use client';

import Link from 'next/link';
import PageShell from '../../components/PageShell';
import LanguageText from '../../components/LanguageText';
import {useCart} from '../../components/CartProvider';

export default function Cart(){
  const {items,count,totalCents,remove,clear}=useCart();
  return <PageShell><main className="section">
    <p className="eyebrow"><LanguageText en="SHOPPING BAG" ru="КОРЗИНА"/></p>
    <h1 style={{font:'normal 52px Georgia,serif'}}><LanguageText en="YOUR COLLECTION" ru="ВАША КОЛЛЕКЦИЯ"/></h1>
    {!items.length?<><p className="lead"><LanguageText en="Your bag is empty." ru="Ваша корзина пуста."/></p><Link className="btn" href="/shop"><LanguageText en="CONTINUE SHOPPING" ru="ПРОДОЛЖИТЬ ПОКУПКИ"/></Link></>:<>
      <div className="adminTable" style={{marginTop:30}}>{items.map(item=><div className="adminRow" key={item.id}><div><strong>{item.name}</strong><small>€{(item.priceCents/100).toFixed(2)} × {item.quantity}</small></div><button className="adminSecondary" type="button" onClick={()=>remove(item.id)}><LanguageText en="REMOVE" ru="УДАЛИТЬ"/></button></div>)}</div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:24,gap:16,flexWrap:'wrap'}}><strong>{count} <LanguageText en="items" ru="товаров"/> · €{(totalCents/100).toFixed(2)}</strong><div style={{display:'flex',gap:10}}><button className="adminSecondary" type="button" onClick={clear}><LanguageText en="CLEAR BAG" ru="ОЧИСТИТЬ"/></button><button className="btn" type="button" disabled><LanguageText en="CHECKOUT COMING SOON" ru="ОПЛАТА СКОРО БУДЕТ ДОСТУПНА"/></button></div></div>
    </>}
  </main></PageShell>
}