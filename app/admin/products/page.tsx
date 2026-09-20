'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Product={id:string;name:string;slug:string;category:string;priceCents:number;currency:string;stock:number;active:boolean;type:string};

export default function AdminProducts(){
  const [products,setProducts]=useState<Product[]>([]);
  const [error,setError]=useState('');
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState({name:'',slug:'',description:'',category:'Shirts',type:'SIGNED',price:'',stock:'1',player:'',club:'',season:'',imageUrl:'',certificateId:'',provenance:'',signingProof:''});

  async function load(){
    const res=await fetch('/api/admin/products');
    if(res.ok) setProducts(await res.json()); else setError('Нет доступа к админ-панели');
  }
  useEffect(()=>{load()},[]);

  function set<K extends keyof typeof form>(key:K,value:string){setForm(v=>({...v,[key]:value}))}

  async function submit(e:React.FormEvent){
    e.preventDefault();setSaving(true);setError('');
    const res=await fetch('/api/admin/products',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,priceCents:Math.round(Number(form.price)*100),stock:Number(form.stock),sizes:[]})});
    const data=await res.json();
    if(!res.ok){setError(data.error||'Ошибка');setSaving(false);return}
    setProducts(v=>[data,...v]);
    setForm({name:'',slug:'',description:'',category:'Shirts',type:'SIGNED',price:'',stock:'1',player:'',club:'',season:'',imageUrl:'',certificateId:'',provenance:'',signingProof:''});
    setSaving(false);
  }

  return <main className="section adminCrud">
    <div className="adminHeader"><div><p className="eyebrow">ADMIN / PRODUCTS</p><h1>Товары</h1><p>Добавляй и управляй товарами коллекции.</p></div><Link className="btn" href="/admin">← Админ-панель</Link></div>
    <div className="adminCrudGrid">
      <form className="adminForm" onSubmit={submit}>
        <h2>Новый товар</h2>
        <input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Название" required/>
        <input value={form.slug} onChange={e=>set('slug',e.target.value)} placeholder="Slug, например messi-signed-jersey" required/>
        <textarea value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Описание" required/>
        <div className="adminTwo"><input value={form.player} onChange={e=>set('player',e.target.value)} placeholder="Игрок"/><input value={form.club} onChange={e=>set('club',e.target.value)} placeholder="Клуб"/></div>
        <div className="adminTwo"><input value={form.season} onChange={e=>set('season',e.target.value)} placeholder="Сезон"/>
<select value={form.category} onChange={e=>set('category',e.target.value)} required>
  <option value="Shirts">Футболки</option><option value="Boots">Бутсы</option><option value="Shorts">Шорты</option><option value="Balls">Мячи</option><option value="Scarves">Шарфы</option><option value="Armbands">Повязки</option>
</select></div>
        <div className="adminTwo"><select value={form.type} onChange={e=>set('type',e.target.value)}><option value="SIGNED">SIGNED</option><option value="STANDARD">STANDARD</option><option value="COLLECTOR">COLLECTOR</option></select><input value={form.price} onChange={e=>set('price',e.target.value)} placeholder="Цена EUR" type="number" min="0" step="0.01" required/></div>
        <input value={form.stock} onChange={e=>set('stock',e.target.value)} placeholder="Количество" type="number" min="0"/>
        <input value={form.imageUrl} onChange={e=>set('imageUrl',e.target.value)} placeholder="URL главного изображения"/>
        <input value={form.certificateId} onChange={e=>set('certificateId',e.target.value)} placeholder="ID сертификата"/>
        <textarea value={form.provenance} onChange={e=>set('provenance',e.target.value)} placeholder="Provenance / история предмета"/>
        <textarea value={form.signingProof} onChange={e=>set('signingProof',e.target.value)} placeholder="Подтверждение подписи / ссылка"/>
        {error&&<p className="adminError">{error}</p>}
        <button className="btn" disabled={saving}>{saving?'СОХРАНЕНИЕ...':'ДОБАВИТЬ ТОВАР'}</button>
      </form>
      <div><h2>Товары в базе</h2><div className="adminTable">{products.map(p=><div className="adminRow" key={p.id}><div><strong>{p.name}</strong><small>{p.category} · {p.type} · {p.active?'Активен':'Скрыт'}</small></div><b>{(p.priceCents/100).toLocaleString('de-DE',{minimumFractionDigits:2})} {p.currency}</b></div>)}{!products.length&&<p className="adminEmpty">Товаров пока нет.</p>}</div></div>
    </div>
  </main>
}
