import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db, friendlyDbError } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { todayInToronto, formatShortDay } from '@/lib/day';
import Nav from '../Nav';

export const dynamic = 'force-dynamic';

// Your own words, newest first.
export default async function MyWordsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { data: posts, error } = await db()
    .from('posts')
    .select('id, day, word')
    .eq('user_id', user.id)
    .order('day', { ascending: false });

  const today = todayInToronto();

  return (
    <main className="narrow">
      <h1 className="title">Word of the Day</h1>
      <Nav current="/me" />
      <p className="muted center">
        {posts?.length ? `${posts.length} ${posts.length === 1 ? 'word' : 'words'} so far, ${user.name}` : user.name}
      </p>

      <section className="feed">
        {error && <p className="error">{friendlyDbError(error)}</p>}
        {!error && !posts?.length && (
          <p className="muted">
            You haven’t posted yet. <Link href="/">Post today’s word</Link>
          </p>
        )}
        {posts?.length > 0 && (
          <ul className="word-list">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={post.day === today ? '/' : `/day/${post.day}`} className="row-link">
                  <span className="word">{post.word}</span>
                  <span className="who">{post.day === today ? 'today' : formatShortDay(post.day, today)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
