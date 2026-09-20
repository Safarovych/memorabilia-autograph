'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import PageShell from '../../components/PageShell';
import LanguageText from '../../components/LanguageText';

export default function Login(){
  const params=useSearchParams();
  const router=useRouter();
  const admin=params.get('admin')==='1';
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  async function submit(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setError('');
    const res=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    const data=await res.json();
    if(res.ok) router.push(data.redirect || '/');
    else setError(data.error || 'Login failed');
    setLoading(false);
  }

  return <PageShell><main className="section adminLogin" style={{maxWidth:620,margin:'0 auto'}}>
    <p className="eyebrow"><LanguageText en={admin?'ADMINISTRATION':'ACCOUNT'} ru={admin?'АДМИНИСТРИРОВАНИЕ':'АККАУНТ'}/></p>
    <h1 style={{font:'normal 52px Georgia,serif'}}><LanguageText en={admin?'ADMIN SIGN IN':'SIGN IN'} ru={admin?'ВХОД АДМИНИСТРАТОРА':'ВОЙТИ'}/></h1>
    <form onSubmit={submit} style={{display:'grid',gap:14,marginTop:30}}>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" autoComplete="username" required style={{padding:14}}/>
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" autoComplete="current-password" required style={{padding:14}}/>
      {error && <p className="adminError">{error}</p>}
      <button className="btn" disabled={loading}>{loading?'...':<LanguageText en="SIGN IN" ru="ВОЙТИ"/>}</button>
    </form>
    {!admin && <p style={{color:'#777',marginTop:20}}><LanguageText en="New here? " ru="Впервые здесь? "/><Link href="/register"><LanguageText en="Create an account" ru="Создать аккаунт"/></Link></p>}
  </main></PageShell>
}
