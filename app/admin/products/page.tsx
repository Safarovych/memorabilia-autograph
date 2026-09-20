'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Product={
  id:string;name:string;slug:string;description:string;category:string;priceCents:number;
  currency:string;stock:number;active:boolean;type:string;player?:string|null;club?:string|null;
  season?:string|null;imageUrl?:string|null;certificateId?:string|null;provenance?:string|null;
  signingProof?:string|null;
};

const emptyForm={
  id:'',name:'',slug:'',description:'',category:'Shirts',type:'SIGNED',price:'',stock:'1',
  player:'',club:'',season:'',imageUrl:'',certificateId:'',provenance:'',signingProof:'',active:'true'
};

export default function AdminProducts(){
  const [products,setProducts]=useState<Product[]>([]);
  const [form,setForm]=useState(emptyForm);
  const [error,setError]=useState('');
  const [saving,setSaving]=useState(false);
  const [editing,setEditing]=useState(false);

  async function load(){
    const res=await fetch('/api/admin/products',{cache:'no-store'});
    if(res.ok) setProducts(await res.json());
    else setError('Нет доступа к админ-панели');
  }
  useEffect(()=>{load()},[]);

  function set<K extends keyof typeof form>(key:K,value:string){setForm(v=>({...v,[key]:value}))}

  function editProduct(p:Product){
    setEditing(true);
    setError('');
    setForm({
      id:p.id,name:p.name,slug:p.slug,description:p.description,category:p.category,type:p.type,
      price:String(p.priceCents/100),stock:String(p.stock),player:p.player||'',club:p.club||'',season:p.season||'',
      imageUrl:p.imageUrl||'',certificateId:p.certificateId||'',provenance:p.provenance||'',
      signingProof:p.signingProof||'',active:String(p.active)
    });
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function reset(){
    setEditing(false);setError('');setForm(emptyForm);
  }

  async function submit(e:React.FormEvent){
    e.preventDefault();setSaving(true);setError('');
    const method=editing?'PATCH':'POST';
    const res=await fetch('/api/admin/products',{
      method,headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        ...form,
        priceCents:Math.round(Number(form.price)*100),
        stock:Math.max(0,Number(form.stock)||0),
        active:form.active==='true',
        sizes:[]
      })
    });
    const data=await res.json();
    if(!res.ok){setError(data.error||'Ошибка');setSaving(false);return}
    if(editing) setProducts(v=>v.map(p=>p.id===data.id?data:p)); else setProducts(v=>[data,...v]);
    reset();setSaving(false);
  }

  async function remove(id:string){
    if(!confirm('Удалить этот товар?')) return;
    setError('');
    const res=await fetch('/api/admin/products',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});
    const data=await res.json();
    if(!res.ok){setError(data.error||'Не удалось удалить товар');return}
    setProducts(v=>v.filter(p=>p.id!==id));
  }

  async function toggle(p:Product){
    const res=await fetch('/api/admin/products',{
      method:'PATCH',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        id:p.id,name:p.name,slug:p.slug,description:p.description,category:p.category,type:p.type,
        priceCents:p.priceCents,stock:p.stock,player:p.player,club:p.club,season:p.season,
        imageUrl:p.imageUrl,certificateId:p.certificateId,provenance:p.provenance,signingProof:p.signingProof,
        active:!p.active,sizes:[]
      })
    });
    const data=await res.json();
    if(!res.ok){setError(data.error||'Не удалось изменить статус');return}
    setProducts(v=>v.map(x=>x.id===data.id?data:x));
  }

  return <main className="section adminCrud">
    <div className="adminHeader">
      <div><p className="eyebrow">ADMIN / PRODUCTS</p><h1>Товары</h1><p>Полный список товаров с редактированием, скрытием и удалением.</p></div>
      <Link className="btn" href="/admin">← Админ-панель</Link>
    </div>

    <div className="adminCrudGrid">
      <form className="adminForm" onSubmit={submit}>
        <h2>{editing?'Редактировать товар':'Новый товар'}</h2>
        <input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Название" required/>
        <input value={form.slug} onChange={e=>set('slug',e.target.value)} placeholder="Slug" required/>
        <textarea value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Описание" required/>
        <div className="adminTwo"><input value={form.player} onChange={e=>set('player',e.target.value)} placeholder="Игрок"/><input value={form.club} onChange={e=>set('club',e.target.value)} placeholder="Клуб"/></div>
        <div className="adminTwo"><input value={form.season} onChange={e=>set('season',e.target.value)} placeholder="Сезон"/><select value={form.category} onChange={e=>set('category',e.target.value)} required><option value="Shirts">Футболки</option><option value="Boots">Бутсы</option><option value="Shorts">Шорты</option><option value="Balls">Мячи</option><option value="Scarves">Шарфы</option><option value="Armbands">Повязки</option></select></div>
        <div className="adminTwo"><select value={form.type} onChange={e=>set('type',e.target.value)}><option value="SIGNED">SIGNED</option><option value="STANDARD">STANDARD</option><option value="COLLECTOR">COLLECTOR</option></select><input value={form.price} onChange={e=>set('price',e.target.value)} placeholder="Цена EUR" type="number" min="0" step="0.01" required/></div>
        <div className="adminTwo"><input value={form.stock} onChange={e=>set('stock',e.target.value)} placeholder="Количество" type="number" min="0"/><select value={form.active} onChange={e=>set('active',e.target.value)}><option value="true">Виден на сайте</option><option value="false">Скрыт</option></select></div>
        <input value={form.imageUrl} onChange={e=>set('imageUrl',e.target.value)} placeholder="URL главного изображения"/>
        <input value={form.certificateId} onChange={e=>set('certificateId',e.target.value)} placeholder="ID сертификата"/>
        <textarea value={form.provenance} onChange={e=>set('provenance',e.target.value)} placeholder="Provenance / история предмета"/>
        <textarea value={form.signingProof} onChange={e=>set('signingProof',e.target.value)} placeholder="Подтверждение подписи / ссылка"/>
        {error&&<p className="adminError">{error}</p>}
        <div className="adminFormButtons"><button className="btn" disabled={saving}>{saving?(editing?'СОХРАНЕНИЕ...':'ДОБАВЛЕНИЕ...'):(editing?'СОХРАНИТЬ ИЗМЕНЕНИЯ':'ДОБАВИТЬ ТОВАР')}</button>{editing&&<button className="adminSecondary" type="button" onClick={reset}>ОТМЕНА</button>}</div>
      </form>

      <div>
        <div className="adminListHeader"><h2>Все товары ({products.length})</h2><button className="adminSecondary" type="button" onClick={load}>ОБНОВИТЬ</button></div>
        <div className="adminTable">
          {products.map(p=><div className="adminRow adminProductRow" key={p.id}>
            <div className="adminProductMain"><div className="adminProductThumb">{p.imageUrl?<img src={p.imageUrl} alt="" />:<span>{p.category.slice(0,2).toUpperCase()}</span>}</div><div><strong>{p.name}</strong><small>{p.category} · {p.type} · {p.active?'На сайте':'Скрыт'} · Остаток: {p.stock}</small></div></div>
            <div className="adminRowActions"><b>{(p.priceCents/100).toLocaleString('de-DE',{minimumFractionDigits:2})} {p.currency}</b><button className="adminSecondary" type="button" onClick={()=>editProduct(p)}>РЕД.</button><button className={p.active?'adminSecondary':'adminSecondary adminGold'} type="button" onClick={()=>toggle(p)}>{p.active?'СКРЫТЬ':'ПОКАЗАТЬ'}</button><button className="adminDanger" type="button" onClick={()=>remove(p.id)}>УДАЛИТЬ</button></div>
          </div>)}
          {!products.length&&<p className="adminEmpty">Товаров в базе пока нет.</p>}
        </div>
      </div>
    </div>
  </main>
}
