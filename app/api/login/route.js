import { NextResponse } from 'next/server';
import { db, friendlyDbError } from '@/lib/db';
import { makeSessionCookie } from '@/lib/session';
import { passcodeMatches } from '@/lib/passcode';

// POST /api/login  { name, passcode, itsMe }
export async function POST(request) {
  try {
    return await login(request);
  } catch (error) {
    // Setup problems (missing or wrong settings) end up here with a readable message.
    return NextResponse.json({ error: friendlyDbError(error) }, { status: 500 });
  }
}

async function login(request) {
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
  if (findError) return NextResponse.json({ error: friendlyDbError(findError) }, { status: 500 });

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
      return NextResponse.json({ error: friendlyDbError(error) }, { status: 500 });
    }
    user = data;
  }

  const response = NextResponse.json({ user });
  response.cookies.set(makeSessionCookie(user.id));
  return response;
}
