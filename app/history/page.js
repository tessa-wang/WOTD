import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db, friendlyDbError } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { todayInToronto, formatDay } from '@/lib/day';
import Nav from '../Nav';

export const dynamic = 'force-dynamic';

// Every past day, newest first, with everyone's words. Tap a day to open it.
export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { data: posts, error } = await db()
    .from('posts')
    .select('id, day, word, user_id')
    .lt('day', todayInToronto())
    .order('day', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(2000);

  // Group the posts by day: [{ day, posts: [...] }, ...]
  const days = [];
  for (const post of posts ?? []) {
    if (days.at(-1)?.day !== post.day) days.push({ day: post.day, posts: [] });
    days.at(-1).posts.push(post);
  }

  return (
    <main className="narrow">
      <h1 className="title">Word of the Day</h1>
      <Nav current="/history" />

      {error && <p className="error">{friendlyDbError(error)}</p>}
      {!error && days.length === 0 && <p className="muted center spaced">No past days yet — check back tomorrow.</p>}

      <ul className="history">
        {days.map(({ day, posts }) => (
          <li key={day}>
            <Link href={`/day/${day}`} className="history-day">
              <span className="history-date">{formatDay(day)}</span>
              <span className="chips">
                {posts.map((p) => (
                  <span key={p.id} className={p.user_id === user.id ? 'chip mine' : 'chip'}>
                    {p.word}
                  </span>
                ))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
