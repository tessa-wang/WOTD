// Everything about "what day is it" lives here. Days reset at midnight Toronto time.
export const TIME_ZONE = 'America/Toronto';

// Today's date in Toronto as "YYYY-MM-DD".
export function todayInToronto(now = new Date()) {
  // The en-CA locale formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

// "2026-10-28" → "Wednesday, October 28"
export function formatDay(day) {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

// Is this a real "YYYY-MM-DD" date?
export function isValidDay(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day ?? '')) return false;
  const [y, m, d] = day.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

// "2026-10-28" moved by n days, e.g. shiftDay("2026-11-01", -1) → "2026-10-31"
export function shiftDay(day, n) {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

// "2026-10-28" → "Oct 28" (adds the year if it's not this year)
export function formatShortDay(day, today = todayInToronto()) {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    ...(day.slice(0, 4) !== today.slice(0, 4) && { year: 'numeric' }),
  });
}
