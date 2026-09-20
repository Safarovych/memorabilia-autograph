'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Language='en'|'ru';
const LanguageContext=createContext<{language:Language;setLanguage:(l:Language)=>void}>({language:'en',setLanguage:()=>{}});

export function LanguageProvider({children}:{children:React.ReactNode}){
  const [language,setLanguage]=useState<Language>('en');
  useEffect(()=>{const saved=localStorage.getItem('ma-language');if(saved==='ru'||saved==='en')setLanguage(saved)},[]);
  const change=(l:Language)=>{setLanguage(l);localStorage.setItem('ma-language',l)};
  return <LanguageContext.Provider value={{language,setLanguage:change}}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){return useContext(LanguageContext)}
