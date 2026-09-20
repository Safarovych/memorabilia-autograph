'use client';

import { useLanguage } from './LanguageProvider';

export default function LanguageText({en,ru}:{en:string;ru:string}){
  const {language}=useLanguage();
  return <>{language==='ru'?ru:en}</>;
}
