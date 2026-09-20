import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { prisma } from '../../../../lib/prisma';
import { makePasswordHash, setSession } from '../../../../lib/auth';

async function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(':');
  if (!salt || !expected) return false;
  const actual = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, Buffer.from(salt, 'hex'), 64, (err, dk) => err ? reject(err) : resolve(dk));
  });
  const expectedBuffer = Buffer.from(expected, 'hex');
  return actual.length === expectedBuffer.length && crypto.timingSafeEqual(actual, expectedBuffer);
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });

    let user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase().trim() } });

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!user && adminEmail && adminPassword && String(email).toLowerCase().trim() === adminEmail) {
      const passwordHash = await makePasswordHash(adminPassword);
      user = await prisma.user.create({
        data: { email: adminEmail, name: 'Administrator', passwordHash, role: 'ADMIN' },
      });
    }

    if (!user?.passwordHash || !(await verifyPassword(String(password), user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    await setSession(user.id);
    return NextResponse.json({ ok: true, role: user.role, redirect: user.role === 'ADMIN' ? '/admin' : '/' });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
