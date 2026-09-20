'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  async function submit(e:React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const res=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    const data=await res.json();
    if(res.ok && data.role==='ADMIN') router.push('/admin');
    else setError(data.error || 'Доступ запрещён');
    setLoading(false);
  }

  return <main className="section adminLogin"><div className="adminLoginBox">
    <p className="eyebrow">MEMORABILIA AUTOGRAPH</p>
    <h1>Вход администратора</h1>
    <form onSubmit={submit}>
      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="username" required /></label>
      <label>Пароль<input value={password} onChange={e=>setPassword(e.target.value)} type="password" autoComplete="current-password" required /></label>
      {error && <p className="adminError">{error}</p>}
      <button className="btn" disabled={loading}>{loading?'ВХОД...':'ВОЙТИ В АДМИН-ПАНЕЛЬ'}</button>
    </form>
  </div></main>
}
