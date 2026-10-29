import 'server-only';
import { createClient } from '@supabase/supabase-js';

// One shared database client for server code. It uses the secret key,
// so this file must never be imported by code that runs in the browser
// ('server-only' above makes the build fail if that happens).
let client;

export function db() {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check your .env.local file.');
    }
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}
