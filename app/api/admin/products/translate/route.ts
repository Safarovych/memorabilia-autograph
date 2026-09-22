import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../../lib/auth';

import { translateProductText } from '../../../../../lib/translateProduct';

export async function POST(request:Request){
  const user=await getCurrentUser();
  if(user?.role!=='ADMIN')return NextResponse.json({error:'Unauthorized'},{status:401});
  try{
    const body=await request.json();
    const name=String(body.name||'').trim();
    const description=String(body.description||'').trim();
    if(!name&&!description)return NextResponse.json({error:'Nothing to translate'},{status:400});

    const translation=await translateProductText(name,description);
    return NextResponse.json(translation);
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Translation failed'},{status:500})}
}
