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
