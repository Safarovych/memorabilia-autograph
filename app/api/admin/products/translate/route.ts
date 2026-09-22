import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';

export async function POST(request:Request){
  const user=await getCurrentUser();
  if(user?.role!=='ADMIN')return NextResponse.json({error:'Unauthorized'},{status:401});
  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey)return NextResponse.json({error:'OPENAI_API_KEY is not configured in Vercel.'},{status:503});
  try{
    const body=await request.json();const name=String(body.name||'').trim();const description=String(body.description||'').trim();
    if(!name&&!description)return NextResponse.json({error:'Nothing to translate'},{status:400});
    const model=process.env.OPENAI_TRANSLATION_MODEL||'gpt-5-mini';
    const prompt='Translate this sports memorabilia product content from English to natural premium Russian. Preserve names, clubs, seasons, codes and technical facts. Do not invent facts. Return JSON with exactly nameRu and descriptionRu.\n'+JSON.stringify({name,description});
    const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+apiKey},body:JSON.stringify({model,input:prompt,text:{format:{type:'json_object'}}})});
    if(!response.ok)return NextResponse.json({error:'Translation service returned an error.'},{status:502});
    const data=await response.json();const raw=typeof data.output_text==='string'?data.output_text:'';
    let parsed:any;try{parsed=JSON.parse(raw)}catch{return NextResponse.json({error:'Translation service returned invalid JSON.'},{status:502})}
    return NextResponse.json({nameRu:String(parsed.nameRu||'').trim(),descriptionRu:String(parsed.descriptionRu||'').trim()});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Translation failed'},{status:500})}
}
