'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Product={
  id:string;name:string;slug:string;description:string;category:string;subcategory?:string|null;priceCents:number;
  currency:string;stock:number;active:boolean;type:string;player?:string|null;club?:string|null;
  season?:string|null;imageUrl?:string|null;imageUrls?:string[];certificateId?:string|null;
  provenance?:string|null;signingProof?:string|null;
};

const emptyForm={
  id:'',name:'',slug:'',description:'',category:'Shirts',subcategory:'Legends',type:'SIGNED',price:'',stock:'1',
  player:'',club:'',season:'',imageUrl:'',imageUrls:'',certificateId:'',provenance:'',
  signingProof:'',active:'true'
};

const categoryLabels:Record<string,string>={
  Shirts:'Футболки',Boots:'Бутсы',Balls:'Мячи','Boxing Gloves':'Боксерские перчатки',Tennis:'Теннис',UFC:'UFC'
};

export default function AdminProducts(){
  const [products,setProducts]=useState<Product[]>([]);
  const [form,setForm]=useState(emptyForm);
  const [error,setError]=useState('');
  const [saving,setSaving]=useState(false);
  const [editing,setEditing]=useState(false);
  const formRef=useRef<HTMLFormElement>(null);

  async function load(){
    const res=await fetch('/api/admin/products',{cache:'no-store'});
    const data=await res.json();
    if(res.ok) setProducts(data);
    else setError(data.error||'Нет доступа к админ-панели');
  }
  useEffect(()=>{load()},[]);

  function set<K extends keyof typeof form>(key:K,value:string){setForm(v=>({...v,[key]:value}))}

  function editProduct(p:Product){
    setEditing(true);
    setError('');
    setForm({
      id:p.id,name:p.name,slug:p.slug,description:p.description,category:p.category,subcategory:p.subcategory||'',type:p.type,
      price:String(p.priceCents/100),stock:String(p.stock),player:p.player||'',club:p.club||'',
      season:p.season||'',imageUrl:p.imageUrl||'',imageUrls:(p.imageUrls||[]).join('\n'),
      certificateId:p.certificateId||'',provenance:p.provenance||'',signingProof:p.signingProof||'',
      active:String(p.active)
    });
    setTimeout(()=>formRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),50);
  }

  function reset(){
    setEditing(false);setError('');setForm(emptyForm);
  }

  async function handlePhoto(file:File|null){
    if(!file) return;
    if(!file.type.startsWith('image/')){setError('Выберите файл изображения');return}
    if(file.size>10*1024*1024){setError('Фото должно быть меньше 10 MB');return}

    try{
      const dataUrl=await new Promise<string>((resolve,reject)=>{
        const reader=new FileReader();
        reader.onload=()=>resolve(String(reader.result));
        reader.onerror=()=>reject(new Error('Не удалось прочитать фото'));
        reader.readAsDataURL(file);
      });

      const img=new Image();
      await new Promise<void>((resolve,reject)=>{
        img.onload=()=>resolve();
        img.onerror=()=>reject(new Error('Не удалось открыть фото'));
        img.src=dataUrl;
      });

      const max=1400;
      const scale=Math.min(1,max/Math.max(img.width,img.height));
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(img.width*scale));
      canvas.height=Math.max(1,Math.round(img.height*scale));
      const ctx=canvas.getContext('2d');
      if(!ctx) throw new Error('Не удалось подготовить фото');
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      const compressed=canvas.toDataURL('image/jpeg',0.82);
      set('imageUrl',compressed);
      setError('');
    }catch(e){
      setError(e instanceof Error?e.message:'Не удалось загрузить фото');
    }
  }

  async function submit(e:React.FormEvent){
    e.preventDefault();setSaving(true);setError('');
    const method=editing?'PATCH':'POST';
    const res=await fetch('/api/admin/products',{
      method,headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        ...form,
        subcategory:form.category==='Shirts'?(form.subcategory||'Legends'):null,
        priceCents:Math.round(Number(form.price)*100),
        stock:Math.max(0,Number(form.stock)||0),
        active:form.active==='true',
        sizes:[],
        imageUrls:form.imageUrls.split('\n').map(x=>x.trim()).filter(Boolean)
      })
    });
    const data=await res.json();
    if(!res.ok){setError(data.error||'Ошибка сохранения');setSaving(false);return}
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
        id:p.id,name:p.name,slug:p.slug,description:p.description,category:p.category,subcategory:p.subcategory||null,type:p.type,
        priceCents:p.priceCents,stock:p.stock,player:p.player,club:p.club,season:p.season,
        imageUrl:p.imageUrl,imageUrls:p.imageUrls||[],certificateId:p.certificateId,provenance:p.provenance,
        signingProof:p.signingProof,active:!p.active,sizes:[]
      })
    });
    const data=await res.json();
    if(!res.ok){setError(data.error||'Не удалось изменить статус');return}
    setProducts(v=>v.map(x=>x.id===data.id?data:x));
  }

  return <main className="section adminCrud">
    <div className="adminHeader">
      <div><p className="eyebrow">ADMIN / PRODUCTS</p><h1>Товары</h1><p>Полный список товаров. Редактируй карточки, меняй фото, скрывай или удаляй товары.</p></div>
      <Link className="btn" href="/admin">← Админ-панель</Link>
    </div>

    {error&&<p className="adminError">{error}</p>}

    <div className="adminCrudGrid">
      <form className={'adminForm '+(editing?'adminFormEditing':'')} ref={formRef} onSubmit={submit}>
        <h2>{editing?'Редактировать товар':'Новый товар'}</h2>
        {editing&&<div className="adminEditingNotice">Сейчас редактируется: <strong>{form.name}</strong></div>}
        <input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Название" required/>
        <input value={form.slug} onChange={e=>set('slug',e.target.value)} placeholder="Slug" required/>
        <textarea value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Описание" required/>
        <div className="adminTwo"><input value={form.player} onChange={e=>set('player',e.target.value)} placeholder="Игрок"/><input value={form.club} onChange={e=>set('club',e.target.value)} placeholder="Клуб"/></div>
        <div className="adminTwo"><select value={form.subcategory||''} onChange={e=>set('subcategory',e.target.value)} disabled={form.category!=='Shirts'}><option value="">Подраздел футболки</option><option value="Legends">Легенды</option><option value="Clubs">Клубы</option><option value="National Teams">Сборные</option></select><input value={form.season} onChange={e=>set('season',e.target.value)} placeholder="Сезон"/><select value={form.category} onChange={e=>set('category',e.target.value)} required><option value="Shirts">Футболки</option><option value="Boots">Бутсы</option><option value="Balls">Мячи</option><option value="Boxing Gloves">Боксерские перчатки</option><option value="Tennis">Теннис</option><option value="UFC">UFC</option></select></div>
        <div className="adminTwo"><select value={form.type} onChange={e=>set('type',e.target.value)}><option value="SIGNED">SIGNED</option><option value="STANDARD">STANDARD</option><option value="COLLECTOR">COLLECTOR</option></select><input value={form.price} onChange={e=>set('price',e.target.value)} placeholder="Цена EUR" type="number" min="0" step="0.01" required/></div>
        <div className="adminTwo"><input value={form.stock} onChange={e=>set('stock',e.target.value)} placeholder="Количество" type="number" min="0"/><select value={form.active} onChange={e=>set('active',e.target.value)}><option value="true">Виден на сайте</option><option value="false">Скрыт</option></select></div>

        <div className="adminPhotoBox">
          <div className="adminPhotoPreview">{form.imageUrl?<img src={form.imageUrl} alt="Предпросмотр товара"/>:<span>НЕТ ФОТО</span>}</div>
          <div>
            <strong>Фотография товара</strong>
            <input type="file" accept="image/*" onChange={e=>handlePhoto(e.target.files?.[0]||null)}/>
            <input value={form.imageUrl} onChange={e=>set('imageUrl',e.target.value)} placeholder="Или вставь URL фотографии"/>
            <small>Фото автоматически уменьшается до 1400 px и сохраняется в карточке товара.</small>
          </div>
        </div>

        <textarea value={form.imageUrls} onChange={e=>set('imageUrls',e.target.value)} placeholder="Дополнительные фото: по одному URL в строке"/>
        <input value={form.certificateId} onChange={e=>set('certificateId',e.target.value)} placeholder="ID сертификата"/>
        <textarea value={form.provenance} onChange={e=>set('provenance',e.target.value)} placeholder="Provenance / история предмета"/>
        <textarea value={form.signingProof} onChange={e=>set('signingProof',e.target.value)} placeholder="Подтверждение подписи / ссылка"/>

        <div className="adminFormButtons">
          <button className="btn" disabled={saving}>{saving?(editing?'СОХРАНЕНИЕ...':'ДОБАВЛЕНИЕ...'):(editing?'СОХРАНИТЬ ИЗМЕНЕНИЯ':'ДОБАВИТЬ ТОВАР')}</button>
          {editing&&<button className="adminSecondary" type="button" onClick={reset}>ОТМЕНА</button>}
        </div>
      </form>

      <div>
        <div className="adminListHeader"><h2>Все товары ({products.length})</h2><button className="adminSecondary" type="button" onClick={load}>ОБНОВИТЬ</button></div>
        <div className="adminTable">
          {products.map(p=><div className="adminRow adminProductRow" key={p.id}>
            <div className="adminProductMain">
              <div className="adminProductThumb">{p.imageUrl?<img src={p.imageUrl} alt="" />:<span>{categoryLabels[p.category]||p.category.slice(0,2).toUpperCase()}</span>}</div>
              <div><strong>{p.name}</strong><small>{categoryLabels[p.category]||p.category} · {p.type} · {p.active?'На сайте':'Скрыт'} · Остаток: {p.stock}</small></div>
            </div>
            <div className="adminRowActions">
              <b>{(p.priceCents/100).toLocaleString('de-DE',{minimumFractionDigits:2})} {p.currency}</b>
              <button className="adminSecondary" type="button" onClick={()=>editProduct(p)}>РЕДАКТИРОВАТЬ</button>
              <button className={p.active?'adminSecondary':'adminSecondary adminGold'} type="button" onClick={()=>toggle(p)}>{p.active?'СКРЫТЬ':'ПОКАЗАТЬ'}</button>
              <button className="adminDanger" type="button" onClick={()=>remove(p.id)}>УДАЛИТЬ</button>
            </div>
          </div>)}
          {!products.length&&<p className="adminEmpty">Товаров в базе пока нет.</p>}
        </div>
      </div>
    </div>
  </main>
}
