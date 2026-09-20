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

    const normalizedEmail = String(email).toLowerCase().trim();
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword && normalizedEmail === adminEmail && String(password) === adminPassword) {
      const passwordHash = await makePasswordHash(adminPassword);
      const user = await prisma.user.upsert({
        where: { email: adminEmail },
        update: { passwordHash, role: 'ADMIN', name: 'Administrator' },
        create: { email: adminEmail, name: 'Administrator', passwordHash, role: 'ADMIN' },
      });

      await setSession(user.id);
      return NextResponse.json({ ok: true, role: 'ADMIN', redirect: '/admin' });
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user?.passwordHash || !(await verifyPassword(String(password), user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    await setSession(user.id);
    return NextResponse.json({ ok: true, role: user.role, redirect: user.role === 'ADMIN' ? '/admin' : '/' });
  } catch (error) {
    console.error('[auth/login] failed', error);
    const message = error instanceof Error ? error.message : '';
    if (message.includes('AUTH_SECRET')) {
      return NextResponse.json(
        { error: 'Authentication is not configured on the server. Please set AUTH_SECRET in Vercel.' },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
