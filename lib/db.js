import 'server-only';
import { createClient } from '@supabase/supabase-js';

// One shared database client for server code. It uses the secret key,
// so this file must never be imported by code that runs in the browser
// ('server-only' above makes the build fail if that happens).
let client;

// Turns whatever was pasted into SUPABASE_URL into "https://xxxx.supabase.co",
// or explains what's wrong with it.
function databaseUrl() {
  const raw = (process.env.SUPABASE_URL ?? '').trim();
  if (!raw) throw new Error('SUPABASE_URL is missing. Add it in Vercel → Settings → Environment Variables.');
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`SUPABASE_URL isn’t a web address (it starts with “${raw.slice(0, 12)}…”). It should look like https://xxxx.supabase.co`);
  }
  const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (!isLocal && !url.hostname.endsWith('.supabase.co')) {
    throw new Error(
      `SUPABASE_URL is set to ${url.origin}${url.pathname} — that’s not your database. ` +
        'It should look like https://xxxx.supabase.co (xxxx is the code after /project/ in your Supabase dashboard address).',
    );
  }
  return url.origin; // drops any extra "/rest/v1" or trailing slash
}

export function db() {
  if (!client) {
    const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();
    if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing. Add it in Vercel → Settings → Environment Variables.');
    if (key.startsWith('sb_publishable_')) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is the publishable key. Use the secret key (starts with sb_secret_).');
    }
    client = createClient(databaseUrl(), key, { auth: { persistSession: false } });
  }
  return client;
}

// Database errors can contain a whole web page if something is misconfigured;
// turn those into a short readable message.
export function friendlyDbError(error) {
  const message = String(error?.message ?? error ?? 'Unknown database error');
  if (message.trimStart().startsWith('<')) {
    return 'The database address answered with a web page instead of data. Check SUPABASE_URL in Vercel.';
  }
  if (/invalid api key|jwt|unauthorized/i.test(message)) {
    return 'The database rejected the key. Check SUPABASE_SERVICE_ROLE_KEY in Vercel (use the secret key).';
  }
  if (/relation .* does not exist|could not find the table/i.test(message)) {
    return 'The database tables don’t exist yet. Run supabase/schema.sql in the Supabase SQL Editor.';
  }
  return message.slice(0, 300);
}
