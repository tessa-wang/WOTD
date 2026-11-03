'use client';

import { useEffect, useState } from 'react';

const DISMISSED_KEY = 'wotd-install-tip-dismissed';

// Only iPhone/iPad Safari needs instructions — it has no install button of its own.
function shouldShowTip() {
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  // Other iOS browsers and in-app browsers (Instagram, etc.) identify themselves; Safari doesn't.
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA|DuckDuckGo|FBAN|FBAV|Instagram|Line\//.test(ua);
  const installed = navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
  let dismissed = false;
  try {
    dismissed = localStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    // Storage blocked: just show the tip.
  }
  return isIOS && isSafari && !installed && !dismissed;
}

// Safari's Share icon: a square with an arrow pointing up out of it.
function ShareIcon() {
  return (
    <svg className="share-icon" viewBox="0 0 24 24" aria-label="Share" role="img">
      <path d="M12 3v12M8 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function InstallTip() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!shouldShowTip()) return;
    // Give the page a moment to appear before sliding the tip in.
    const timer = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      // Storage blocked: it'll just show again next visit.
    }
  }

  return (
    <aside className="install-tip" role="dialog" aria-label="Add Word of the Day to your home screen">
      <button className="install-close" onClick={dismiss} aria-label="Dismiss">
        ×
      </button>
      <p className="install-title">Add it to your home screen</p>
      <ol className="install-steps">
        <li>
          Tap <ShareIcon /> <strong>Share</strong> in Safari’s toolbar (or <strong>•••</strong> then <strong>Share</strong>)
        </li>
        <li>
          Choose <strong>Add to Home Screen</strong>
        </li>
        <li>
          Tap <strong>Add</strong>
        </li>
      </ol>
    </aside>
  );
}
