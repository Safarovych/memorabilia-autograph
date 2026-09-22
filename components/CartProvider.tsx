'use client';

import {createContext,useContext,useEffect,useMemo,useState} from 'react';

type CartItem={id:string;name:string;slug:string;priceCents:number;currency:string;imageUrl?:string|null;quantity:number};
type CartContextValue={items:CartItem[];count:number;totalCents:number;add:(item:Omit<CartItem,'quantity'>)=>void;remove:(id:string)=>void;clear:()=>void};

const CartContext=createContext<CartContextValue|null>(null);
const KEY='ma-cart';

export function CartProvider({children}:{children:React.ReactNode}){
  const [items,setItems]=useState<CartItem[]>([]);
  useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw)setItems(JSON.parse(raw))}catch{}},[]);
  useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(items))}catch{}},[items]);
  const value=useMemo(()=>({items,count:items.reduce((n,i)=>n+i.quantity,0),totalCents:items.reduce((n,i)=>n+i.priceCents*i.quantity,0),
    add:(item:Omit<CartItem,'quantity'>)=>setItems(v=>{const found=v.find(x=>x.id===item.id);return found?v.map(x=>x.id===item.id?{...x,quantity:x.quantity+1}:x):[...v,{...item,quantity:1}]}),
    remove:(id:string)=>setItems(v=>v.filter(x=>x.id!==id)),clear:()=>setItems([])
  }),[items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart(){const value=useContext(CartContext);if(!value)throw new Error('useCart must be used inside CartProvider');return value}