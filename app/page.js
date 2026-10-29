import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db, friendlyDbError } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { todayInToronto, formatDay, shiftDay } from '@/lib/day';
import Nav from './Nav';
import WordForm from './WordForm';
import WordList from './WordList';
import LogoutButton from './LogoutButton';

// Always render fresh: the page depends on who's logged in and today's date.
export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const today = todayInToronto();
  const { data: posts, error } = await db()
    .from('posts')
    .select('id, word, user_id, users(name)')
    .eq('day', today)
    .order('created_at', { ascending: true });

  const myPost = posts?.find((p) => p.user_id === user.id);

  return (
    <main className="narrow">
      <h1 className="title">Word of the Day</h1>
      <Nav current="/" />
      <p className="muted center">{formatDay(today)}</p>

      <WordForm myWord={myPost?.word ?? null} />

      <section className="feed">
        <h2 className="label">
          Today’s words {posts?.length ? <span className="muted">· {posts.length}</span> : null}
        </h2>
        {error && <p className="error">{friendlyDbError(error)}</p>}
        <WordList posts={posts ?? []} userId={user.id} emptyText="No words yet today. Be the first!" />
        <p className="day-nav">
          <Link href={`/day/${shiftDay(today, -1)}`}>← Yesterday</Link>
        </p>
      </section>

      <footer className="footer">
        <span className="muted small">Logged in as {user.name}</span>
        <LogoutButton />
      </footer>
    </main>
  );
}
