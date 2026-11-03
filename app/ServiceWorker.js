'use client';

import { useEffect } from 'react';

// Registers public/sw.js, which caches the app's files and shows an offline page
// when there's no internet. Skipped during `npm run dev` so it can't serve stale code.
export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => {
      // Not supported here (e.g. private browsing) — the site still works normally.
    });
  }, []);
  return null;
}
