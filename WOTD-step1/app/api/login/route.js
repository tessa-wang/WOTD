import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { makeSessionCookie } from '@/lib/session';

function passcodeMatches(input) {
  const expected = process.env.GROUP_PASSCODE;
  if (!expected) throw new Error('Missing GROUP_PASSCODE. Check your .env.local file.');
  // Compare hashes so the check takes the same time whatever was typed.
  const a = crypto.createHash('sha256').update(String(input ?? '')).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

// POST /api/login  { name, passcode, itsMe }
export async function POST(request) {
  const { name: rawName, passcode, itsMe } = await request.json().catch(() => ({}));

  if (!passcodeMatches(passcode)) {
    return NextResponse.json({ error: 'That passcode isn’t right.' }, { status: 401 });
  }

  const name = String(rawName ?? '').trim().replace(/\s+/g, ' ');
  if (name.length < 1 || name.length > 20) {
    return NextResponse.json({ error: 'Pick a name between 1 and 20 characters.' }, { status: 400 });
  }
  const nameKey = name.toLowerCase();

  const { data: existing, error: findError } = await db()
    .from('users')
    .select('id, name')
    .eq('name_key', nameKey)
    .maybeSingle();
  if (findError) return NextResponse.json({ error: findError.message }, { status: 500 });

  let user = existing;
  if (existing && !itsMe) {
    // Name already in use: ask whether this is the same person on a new device.
    return NextResponse.json({ taken: true, name: existing.name }, { status: 409 });
  }
  if (!existing) {
    const { data, error } = await db().from('users').insert({ name, name_key: nameKey }).select('id, name').single();
    if (error) {
      // Someone grabbed the same name a split second earlier.
      if (error.code === '23505') return NextResponse.json({ taken: true, name }, { status: 409 });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    user = data;
  }

  const response = NextResponse.json({ user });
  response.cookies.set(makeSessionCookie(user.id));
  return response;
}
