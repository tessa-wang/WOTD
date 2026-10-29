import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { db, friendlyDbError } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { todayInToronto, formatDay, shiftDay, isValidDay } from '@/lib/day';
import Nav from '../../Nav';
import WordList from '../../WordList';

export const dynamic = 'force-dynamic';

// One past day's words, e.g. /day/2026-10-27. Past words are read-only.
export default async function DayPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { day } = await params;
  if (!isValidDay(day)) notFound();
  const today = todayInToronto();
  if (day >= today) redirect('/');

  const { data: posts, error } = await db()
    .from('posts')
    .select('id, word, user_id, users(name)')
    .eq('day', day)
    .order('created_at', { ascending: true });

  const next = shiftDay(day, 1);

  return (
    <main className="narrow">
      <h1 className="title">Word of the Day</h1>
      <Nav current="/history" />
      <p className="muted center">{formatDay(day)}</p>

      <section className="feed">
        <h2 className="label">
          Words {posts?.length ? <span className="muted">· {posts.length}</span> : null}
        </h2>
        {error && <p className="error">{friendlyDbError(error)}</p>}
        <WordList posts={posts ?? []} userId={user.id} emptyText="Nobody posted a word this day." />
        <p className="day-nav">
          <Link href={`/day/${shiftDay(day, -1)}`}>← Previous day</Link>
          <Link href={next >= today ? '/' : `/day/${next}`}>{next >= today ? 'Today →' : 'Next day →'}</Link>
        </p>
      </section>
    </main>
  );
}
