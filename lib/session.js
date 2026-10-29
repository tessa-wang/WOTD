import 'server-only';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { db } from './db';

// Login works with a signed cookie: "<userId>.<signature>".
// The signature proves our server created it, so nobody can fake being someone else
// by editing the cookie.
export const COOKIE_NAME = 'wotd_session';
const ONE_YEAR = 60 * 60 * 24 * 365;

function sign(value) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('Missing SESSION_SECRET. Check your .env.local file.');
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

export function makeSessionCookie(userId) {
  return {
    name: COOKIE_NAME,
    value: `${userId}.${sign(userId)}`,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_YEAR,
  };
}

function readUserId(cookieValue) {
  if (!cookieValue) return null;
  const [userId, signature] = cookieValue.split('.');
  if (!userId || !signature) return null;
  const expected = sign(userId);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return userId;
}

// Returns { id, name } for whoever is logged in on this device, or null.
export async function getCurrentUser() {
  const store = await cookies();
  const userId = readUserId(store.get(COOKIE_NAME)?.value);
  if (!userId) return null;
  const { data } = await db().from('users').select('id, name').eq('id', userId).maybeSingle();
  return data ?? null;
}
