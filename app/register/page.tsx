'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PageShell from '../../components/PageShell';
import LanguageText from '../../components/LanguageText';

export default function Register(){
  const router=useRouter();
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);

  async function submit(e:React.FormEvent){
    e.preventDefault();
    setLoading(true);
    setError('');

    try{
      const res=await fetch('/api/auth/register',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name,email,password})
      });
      const data=await res.json();
      if(!res.ok){
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }
      router.push(data.redirect || '/login');
    }catch{
      setError('Registration failed');
      setLoading(false);
    }
  }

  return <PageShell><main className="section" style={{maxWidth:620,margin:'0 auto'}}>
    <p className="eyebrow"><LanguageText en="ACCOUNT" ru="АККАУНТ"/></p>
    <h1 style={{font:'normal 52px Georgia,serif'}}><LanguageText en="CREATE ACCOUNT" ru="СОЗДАТЬ АККАУНТ"/></h1>
    <form onSubmit={submit} style={{display:'grid',gap:14,marginTop:30}}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" autoComplete="name" required style={{padding:14}}/>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" autoComplete="email" required style={{padding:14}}/>
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (8+ characters)" type="password" autoComplete="new-password" minLength={8} required style={{padding:14}}/>
      {error&&<p className="adminError">{error}</p>}
      <button className="btn" type="submit" disabled={loading}><LanguageText en={loading?'CREATING...':'CREATE ACCOUNT'} ru={loading?'СОЗДАНИЕ...':'СОЗДАТЬ АККАУНТ'}/></button>
    </form>
    <p style={{color:'#777',marginTop:20}}><LanguageText en="Already registered? " ru="Уже зарегистрированы? "/><Link href="/login"><LanguageText en="Sign in" ru="Войти"/></Link></p>
  </main></PageShell>
}
