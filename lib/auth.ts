import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import { prisma } from './prisma';
const COOKIE='ma_session';
const SECRET=process.env.AUTH_SECRET||'development-only-secret-change-me';
function sign(payload:string){return crypto.createHmac('sha256',SECRET).update(payload).digest('base64url')}
function encode(id:string){const p=Buffer.from(JSON.stringify({id,exp:Date.now()+1000*60*60*24*30})).toString('base64url');return `${p}.${sign(p)}`}
function decode(token:string){const [p,s]=token.split('.');if(!p||!s)return null;const expected=sign(p);const a=Buffer.from(s);const b=Buffer.from(expected);if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return null;try{const d=JSON.parse(Buffer.from(p,'base64url').toString());return d.exp>Date.now()?d.id:null}catch{return null}}
export async function setSession(id:string){(await cookies()).set(COOKIE,encode(id),{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30})}
export async function clearSession(){(await cookies()).delete(COOKIE)}
export async function getCurrentUser(){const token=(await cookies()).get(COOKIE)?.value;if(!token)return null;const id=decode(token);if(!id)return null;return prisma.user.findUnique({where:{id},select:{id:true,email:true,name:true,role:true,createdAt:true}})}
export async function makePasswordHash(password:string){const salt=crypto.randomBytes(16).toString('hex');const hash=await new Promise<string>((resolve,reject)=>crypto.scrypt(password,Buffer.from(salt,'hex'),64,(err,dk)=>err?reject(err):resolve(dk.toString('hex'))));return `${salt}:${hash}`}
