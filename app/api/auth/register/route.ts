import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { makePasswordHash } from '../../../lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const normalizedEmail = String(email || '').toLowerCase().trim();
    const normalizedName = String(name || '').trim();
    const plainPassword = String(password || '');

    if (!normalizedName || !normalizedEmail || !plainPassword) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    if (plainPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    if (!/^\\S+@\\S+\\.\\S+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await makePasswordHash(plainPassword);
    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        passwordHash,
        role: 'USER',
      },
    });

    return NextResponse.json({ ok: true, userId: user.id, redirect: '/login' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
