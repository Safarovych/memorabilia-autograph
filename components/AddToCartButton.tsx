'use client';

import {useState} from 'react';
import {useCart} from './CartProvider';
import {useLanguage} from './LanguageProvider';

export default function AddToCartButton({product}:{product:{id:string;name:string;nameRu?:string;slug:string;priceCents:number;currency:string;imageUrl?:string|null}}){
  const {add}=useCart();
  const {language}=useLanguage();
  const [added,setAdded]=useState(false);
  return <button className="btn" type="button" onClick={()=>{add(product);setAdded(true);setTimeout(()=>setAdded(false),1600)}}>
    {added?(language==='ru'?'ДОБАВЛЕНО В КОРЗИНУ':'ADDED TO BAG'):(language==='ru'?'ДОБАВИТЬ В КОРЗИНУ':'ADD TO BAG')}
  </button>;
}
