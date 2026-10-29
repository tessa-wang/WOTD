// Rules for what counts as "a word". Used by both the form (instant feedback)
// and the server (the real check), so they always agree.
export const MAX_WORD_LENGTH = 30;

// Letters from any language, numbers, apostrophes and hyphens: "can't", "self-care", "yeet", "café".
const WORD_PATTERN = /^[\p{L}\p{N}'-]+$/u;

// Trim, lowercase, and turn curly apostrophes (phones love these) into straight ones.
export function normalizeWord(input) {
  return String(input ?? '')
    .trim()
    .toLowerCase()
    .replace(/[‘’`]/g, "'");
}

// Returns an error message, or null if the word is fine.
export function checkWord(word) {
  if (!word) return 'Type a word first.';
  if (/\s/.test(word)) return 'Just one word — no spaces.';
  if (word.length > MAX_WORD_LENGTH) return `Keep it under ${MAX_WORD_LENGTH} letters.`;
  if (!WORD_PATTERN.test(word)) return 'Letters, numbers, apostrophes and hyphens only.';
  if (!/[\p{L}\p{N}]/u.test(word)) return 'A word needs at least one letter.';
  return null;
}
