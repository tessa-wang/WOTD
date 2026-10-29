import { redirect } from 'next/navigation';
import { db, friendlyDbError } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { todayInToronto, formatDay } from '@/lib/day';
import WordForm from './WordForm';
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
      <p className="muted center">{formatDay(today)}</p>

      <WordForm key={myPost?.word ?? ''} myWord={myPost?.word ?? null} />

      <section className="feed">
        <h2 className="label">
          Today’s words {posts?.length ? <span className="muted">· {posts.length}</span> : null}
        </h2>
        {error && <p className="error">{friendlyDbError(error)}</p>}
        {posts?.length === 0 && <p className="muted">No words yet today. Be the first!</p>}
        <ul className="word-list">
          {posts?.map((post) => (
            <li key={post.id} className={post.user_id === user.id ? 'mine' : undefined}>
              <span className="word">{post.word}</span>
              <span className="who">{post.user_id === user.id ? 'you' : post.users?.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="footer">
        <span className="muted small">Logged in as {user.name}</span>
        <LogoutButton />
      </footer>
    </main>
  );
}
