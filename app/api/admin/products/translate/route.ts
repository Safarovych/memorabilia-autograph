import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../../lib/auth';

const known:Record<string,string>={
  'Eric Cantona Signed Manchester United Shirt':'Футболка Manchester United с автографом Эрика Кантона',
  'Real Madrid Home Jersey':'Домашняя футболка Реал Мадрид',
  'FC Barcelona Home Jersey':'Домашняя футболка Барселоны',
  'Liverpool Home Jersey':'Домашняя футболка Ливерпуля',
  'Germany Home Jersey':'Футболка сборной Германии',
  'Bayern Retro Jersey':'Ретро-футболка Баварии',
  'Elite Black Training Top':'Чёрный тренировочный топ',
  'Lionel Messi Signed Argentina Jersey':'Футболка сборной Аргентины с автографом Лионеля Месси'
};

async function fallbackTranslate(text:string){
  if(!text.trim()) return '';
  if(known[text.trim()]) return known[text.trim()];
  const url='https://api.mymemory.translated.net/get?q='+encodeURIComponent(text)+'&langpair=en|ru';
  const response=await fetch(url,{headers:{accept:'application/json'},cache:'no-store'});
  if(!response.ok) throw new Error('Translation service is unavailable');
  const data=await response.json();
  const translated=String(data?.responseData?.translatedText||'').trim();
  if(!translated) throw new Error('Translation service returned no text');
  return translated;
}

export async function POST(request:Request){
  const user=await getCurrentUser();
  if(user?.role!=='ADMIN')return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const body=await request.json();
    const name=String(body.name||'').trim();
    const description=String(body.description||'').trim();
    if(!name&&!description)return NextResponse.json({error:'Nothing to translate'},{status:400});

    const apiKey=process.env.OPENAI_API_KEY;
    if(!apiKey){
      const [nameRu,descriptionRu]=await Promise.all([fallbackTranslate(name),fallbackTranslate(description)]);
      return NextResponse.json({nameRu,descriptionRu});
    }

    const model=process.env.OPENAI_TRANSLATION_MODEL||'gpt-5-mini';
    const prompt='Translate this sports memorabilia product content from English to natural premium Russian. Preserve names, clubs, seasons, codes and technical facts. Do not invent facts. Return JSON with exactly nameRu and descriptionRu.\\n'+JSON.stringify({name,description});
    const response=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'Content-Type':'application/json',Authorization:'Bearer '+apiKey},
      body:JSON.stringify({model,input:prompt,text:{format:{type:'json_object'}}})
    });
    if(!response.ok)return NextResponse.json({error:'Translation service returned an error.'},{status:502});
    const data=await response.json();
    const raw=typeof data.output_text==='string'?data.output_text:'';
    let parsed:any;
    try{parsed=JSON.parse(raw)}catch{return NextResponse.json({error:'Translation service returned invalid JSON.'},{status:502})}
    return NextResponse.json({nameRu:String(parsed.nameRu||'').trim(),descriptionRu:String(parsed.descriptionRu||'').trim()});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Translation failed'},{status:500})}
}
