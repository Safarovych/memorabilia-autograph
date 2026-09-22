'use client';

import { useState } from 'react';

export default function ProductGallery({images,alt,badge}:{images:string[];alt:string;badge?:React.ReactNode}){
  const unique=Array.from(new Set(images.filter(Boolean))).slice(0,3);
  const [active,setActive]=useState(0);
  if(!unique.length)return null;
  return <div className="productGallery">
    <div className="productGalleryMain"><img src={unique[active]} alt={alt}/>{badge}</div>
    {unique.length>1&&<div className="productGalleryThumbs">{unique.map((src,i)=><button type="button" key={src} className={i===active?'active':''} onClick={()=>setActive(i)} aria-label={'Фото '+(i+1)}><img src={src} alt=""/></button>)}</div>}
  </div>;
}
