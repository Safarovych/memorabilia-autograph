'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Analytics={
  periodDays:number;total:number;today:number;unique:number;
  topPages:{path:string;views:number}[];
  recent:{id:string;visitorId:string;path:string;referrer:string|null;createdAt:string;visitor:{name:string|null;email:string}|null}[];
};

export default function AdminAnalytics(){
  const [data,setData]=useState<Analytics|null>(null);
  const [error,setError]=useState('');

  async function load(){
    const res=await fetch('/api/admin/analytics',{cache:'no-store'});
    const json=await res.json();
    if(res.ok) setData(json); else setError(json.error||'Не удалось загрузить аналитику');
  }
  useEffect(()=>{load()},[]);

  return <main className="section adminCrud">
    <div className="adminHeader">
      <div><p className="eyebrow">ADMIN / ANALYTICS</p><h1>Посещения сайта</h1><p>Анонимная статистика посещений за последние 30 дней и последние визиты.</p></div>
      <div className="adminHeaderActions"><button className="adminSecondary" onClick={load}>ОБНОВИТЬ</button><Link className="btn" href="/admin">← Админ-панель</Link></div>
    </div>
    {error&&<p className="adminError">{error}</p>}
    {data&&<>
      <div className="adminStatsGrid">
        <div className="adminStatCard"><strong>{data.today}</strong><span>Посещений сегодня</span></div>
        <div className="adminStatCard"><strong>{data.total}</strong><span>Посещений за 30 дней</span></div>
        <div className="adminStatCard"><strong>{data.unique}</strong><span>Уникальных посетителей</span></div>
      </div>
      <div className="adminAnalyticsGrid">
        <section><h2>Популярные страницы</h2><div className="adminTable">{data.topPages.map(p=><div className="adminRow" key={p.path}><div><strong>{p.path}</strong><small>просмотры за 30 дней</small></div><b>{p.views}</b></div>)}{!data.topPages.length&&<p className="adminEmpty">Пока нет данных.</p>}</div></section>
        <section><h2>Последние посещения</h2><div className="adminTable">{data.recent.map(v=><div className="adminRow" key={v.id}><div><strong>{v.path}</strong><small>{new Date(v.createdAt).toLocaleString('de-DE')} · {v.visitor?.email||'гость'}</small></div><span>{v.referrer||'Прямой вход'}</span></div>)}{!data.recent.length&&<p className="adminEmpty">Пока нет данных.</p>}</div></section>
      </div>
    </>}
  </main>
}
