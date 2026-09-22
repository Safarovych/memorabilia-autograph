'use client';

import {useState} from 'react';
import {useCart} from './CartProvider';

export default function AddToCartButton({product}:{product:{id:string;name:string;slug:string;priceCents:number;currency:string;imageUrl?:string|null}}){
  const {add}=useCart();
  const [added,setAdded]=useState(false);
  return <button className="btn" type="button" onClick={()=>{add(product);setAdded(true);setTimeout(()=>setAdded(false),1600)}}>
    {added?'ADDED TO BAG':'ADD TO BAG'}
  </button>;
}