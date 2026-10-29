'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { normalizeWord, checkWord, MAX_WORD_LENGTH } from '@/lib/words';

// Shows your word for today, or a box to post one. You get one try — no changes after.
export default function WordForm({ myWord }) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const word = normalizeWord(value);
    const problem = checkWord(word);
    if (problem) return setError(problem);

    setBusy(true);
    setError('');
    const res = await fetch('/api/word', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error || 'Something went wrong. Try again.');
    router.refresh();
  }

  if (myWord) {
    return (
      <div className="my-word">
        <p className="label">Your word today</p>
        <p className="big-word">{myWord}</p>
        <p className="muted small">🔒 Locked in for today.</p>
      </div>
    );
  }

  return (
    <form className="my-word" onSubmit={submit}>
      <label className="label" htmlFor="word">
        Describe your day in one word
      </label>
      <div className="word-row">
        <input
          id="word"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError('');
          }}
          maxLength={MAX_WORD_LENGTH + 5}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
        />
        <button className="btn inline" disabled={busy}>
          {busy ? '…' : 'Post'}
        </button>
      </div>
      <p className="muted small">You get one try — no changes after you post.</p>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
