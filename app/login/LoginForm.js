'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm({ needsPasscode }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [takenName, setTakenName] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(itsMe = false) {
    setBusy(true);
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, passcode, itsMe }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (data.taken) {
      setTakenName(data.name);
      return;
    }
    if (!res.ok) {
      setError(data.error || 'Something went wrong. Try again.');
      return;
    }
    router.replace('/');
    router.refresh();
  }

  if (takenName) {
    return (
      <div className="card stack">
        <p>
          <strong>{takenName}</strong> is already taken.
        </p>
        <p className="muted">Is that you on a new device?</p>
        <button className="btn" disabled={busy} onClick={() => submit(true)}>
          Yes, that’s me
        </button>
        <button className="btn ghost" onClick={() => setTakenName(null)}>
          No, pick another name
        </button>
      </div>
    );
  }

  return (
    <form
      className="card stack"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label className="field">
        <span>Your name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          autoComplete="nickname"
          required
        />
      </label>
      {needsPasscode && (
        <label className="field">
          <span>Group passcode</span>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
      )}
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={busy}>
        {busy ? 'One sec…' : 'Join'}
      </button>
    </form>
  );
}
