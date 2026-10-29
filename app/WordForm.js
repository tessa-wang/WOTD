'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { normalizeWord, checkWord, MAX_WORD_LENGTH } from '@/lib/words';

// Shows your word for today, or a box to post one. You can change it until midnight.
export default function WordForm({ myWord }) {
  const router = useRouter();
  const [editing, setEditing] = useState(!myWord);
  const [value, setValue] = useState(myWord ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const word = normalizeWord(value);
    const problem = checkWord(word);
    if (problem) return setError(problem);
    if (word === myWord) return setEditing(false);

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
    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <div className="my-word">
        <p className="label">Your word today</p>
        <p className="big-word">{myWord}</p>
        <button className="link" onClick={() => setEditing(true)}>
          Change it
        </button>
        <p className="muted small">You can change it until midnight.</p>
      </div>
    );
  }

  return (
    <form className="my-word" onSubmit={submit}>
      <label className="label" htmlFor="word">
        {myWord ? 'Change your word' : 'Describe your day in one word'}
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
          autoFocus={!!myWord}
        />
        <button className="btn inline" disabled={busy}>
          {busy ? '…' : myWord ? 'Save' : 'Post'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {myWord && (
        <button
          type="button"
          className="link"
          onClick={() => {
            setValue(myWord);
            setError('');
            setEditing(false);
          }}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
