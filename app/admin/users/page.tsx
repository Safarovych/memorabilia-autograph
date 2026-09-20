'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type User={
  id:string;name:string|null;email:string;role:string;createdAt:string;lastSeenAt:string|null;
  _count:{visits:number}
};

export default function AdminUsers(){
  const [users,setUsers]=useState<User[]>([]);
  const [error,setError]=useState('');

  async function load(){
    const res=await fetch('/api/admin/users',{cache:'no-store'});
    const data=await res.json();
    if(res.ok) setUsers(data); else setError(data.error||'Нет доступа');
  }
  useEffect(()=>{load()},[]);

  return <main className="section adminCrud">
    <div className="adminHeader">
      <div><p className="eyebrow">ADMIN / USERS</p><h1>Пользователи</h1><p>Список зарегистрированных аккаунтов и последняя активность.</p></div>
      <div className="adminHeaderActions"><button className="adminSecondary" onClick={load}>ОБНОВИТЬ</button><Link className="btn" href="/admin">← Админ-панель</Link></div>
    </div>
    {error&&<p className="adminError">{error}</p>}
    <div className="adminUserStats"><strong>{users.length}</strong><span>зарегистрированных аккаунтов</span></div>
    <div className="adminTable adminUsersTable">
      <div className="adminUserHead"><span>ИМЯ</span><span>EMAIL</span><span>РОЛЬ</span><span>РЕГИСТРАЦИЯ</span><span>ПОСЛЕДНИЙ ВИЗИТ</span><span>ВИЗИТЫ</span></div>
      {users.map(u=><div className="adminUserRow" key={u.id}>
        <strong>{u.name||'—'}</strong>
        <span>{u.email}</span>
        <span>{u.role}</span>
        <span>{new Date(u.createdAt).toLocaleString('de-DE')}</span>
        <span>{u.lastSeenAt?new Date(u.lastSeenAt).toLocaleString('de-DE'):'—'}</span>
        <b>{u._count.visits}</b>
      </div>)}
      {!users.length&&<p className="adminEmpty">Пользователей пока нет.</p>}
    </div>
  </main>
}
